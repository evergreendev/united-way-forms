'use server'
import mysql, {RowDataPacket} from 'mysql2/promise'
import {CompanyDTO, EntryDTO, ICompany, IEntry, UserCompanyDTO, UserDTO} from "@/app/admin/users/types";
import bcryptjs from "bcryptjs";
import {headers} from "next/headers";

const createConnection = async () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || ""),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
}

function dateToMySQLDate(date:Date){
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

export async function query(query: string): Promise<any> {
    try {
        const db = await createConnection();

        const [result] = await db.execute(query,[]);

        await db.end();

        return result;

    } catch (e){
        console.error(e);
    }
}

export async function getUsers(){
    const db = await createConnection();

    const sql = 'SELECT * FROM user';

    interface IUser extends RowDataPacket{

    }

    const [result] = await db.query<IUser[]>(sql);

    return result;
}

export async function getUserByLogin(userName: string, password:string): Promise<any> {
    try {

        const db = await createConnection();

        const passwordHashQuery = 'SELECT password FROM user WHERE user_name=?';

        const [passwordHash] = await db.execute<any[]>(passwordHashQuery,[userName]);

        const passwordsMatch = await bcryptjs.compare(password, passwordHash?.[0]?.password);

        if (!passwordsMatch) return null;

        const sql = 'SELECT * FROM user WHERE user_name= ?';

        const values = [userName];

        const [result] = await db.execute(sql, values);

        await db.end();

        return result;

    } catch (e:any){

        return null
    }
}

export async function getUserByEmail(email: string): Promise<any> {
    try {
        const db = await createConnection();

        const sql = 'SELECT * FROM user WHERE email= ?';

        const values = [email];

        const [result] = await db.execute(sql, values);

        await db.end();

        return result;

    } catch (e:any){

        return null
    }
}

export async function getUserByID(id: string): Promise<any> {
    try {
        const db = await createConnection();

        const sql = 'SELECT * FROM user WHERE id = ?';

        const values = [id];
        interface IUser extends RowDataPacket{
            id: string;
            user_name: string;
            is_admin: number;
            email: string;
            password: string;
        }

        const [result] = await db.execute<IUser[]>(sql, values);

        await db.end();

        return result[0];

    } catch (e:any){

        return null
    }
}

export async function createUser(user:UserDTO) {
    try {
        if (!user.password || !user.user_name) return null;

        const db = await createConnection();

        const sql = 'INSERT INTO user (user_name, password, is_admin, email) VALUES (?,?,?,?)';
        const hashedPassword = await bcryptjs.hash(user.password,10);
        const values = [user.user_name, hashedPassword, user.is_admin, user.email];

        const [result] = await db.execute(sql, values);

        await db.end();

        return "Success";

    } catch (e:any){

        return {
            message: e.message,
            errno: e.errno,
        }
    }
}

export async function createCompany(companyDTO:CompanyDTO) {
    try {
        if (!companyDTO.company_name || !companyDTO.internal_id) return null;

        const db = await createConnection();

        const sql = 'INSERT INTO company (company_name, internal_id) VALUES (?,?)';
        const values = [companyDTO.company_name, companyDTO.internal_id];

        const [result] = await db.execute<ICompany[]>(sql, values);

        const [id] = await db.execute<any>('SELECT LAST_INSERT_ID()')

        await db.end();

        return id[0]["LAST_INSERT_ID()"];

    } catch (e:any){

        return {
            message: e.message,
            errno: e.errno,
        }
    }
}

export async function deleteCompany(id:string) {
    try {
        const db = await createConnection();

        const sql = 'DELETE FROM company WHERE id= ?';

        const values = [id];

        await db.execute(sql, values);

        await db.end();

        return "Success";

    } catch (e:any){

        return {
            message: e.message,
            errno: e.errno,
        }
    }
}

export async function getCompanies() {
    try {
        const db = await createConnection();

        const sql = 'SELECT * FROM company ORDER BY company_name';

        const [result] = await db.execute<ICompany[]>(sql);

        await db.end();

        return result;

    } catch (e:any){

        return null
    }
}

export async function getUserCompany(userId:string) {
    const db = await createConnection();

    interface ICompanyIds extends RowDataPacket{
        company_id: string;
    }

    const [companyIds] = await db.execute<ICompanyIds[]>(`SELECT company_id FROM company_user WHERE user_id = ?`, [userId]);

    await db.end();

    return companyIds;
}

export async function getCompany(id:string) {
    const db = await createConnection();

    interface ICompany extends RowDataPacket{
        id: string;
        company_name: string;
        internal_id: string;
    }

    const [companyIds] = await db.execute<ICompany[]>(`SELECT * FROM company WHERE id = ?`, [id]);

    await db.end();

    return companyIds;
}

export async function updateCompany(company:CompanyDTO) {
    const db = await createConnection();

    const [companyIds] = await db.execute<ICompany[]>(
        `UPDATE company company_id 
SET company_name = ?, internal_id = ? WHERE id=?;`,
        [company.company_name, company.internal_id, company.id]);

    await db.end();

    return companyIds;
}

export async function getUserCompanies(){
    const db = await createConnection();

    interface ICompanyIds extends RowDataPacket{
        company_id: string;
        user_id:string;
    }

    const [userCompanies] = await db.execute<ICompanyIds[]>(`
    SELECT * FROM company_user;
    `);

    await db.end();

    return userCompanies;
}

export async function updateUserCompany(userCompany:UserCompanyDTO){
    const db = await createConnection();
    if (!userCompany.user_id) return null;

    await db.execute("DELETE FROM company_user WHERE user_id = ?",[userCompany.user_id]); //delete the old company. this won't be necessary if we ever allow multiple companies on one user.

    if (!userCompany.company_id) return null;

    await db.execute("INSERT INTO company_user (company_id, user_id) values (?,?)",[userCompany.company_id, userCompany.user_id]);

    await db.end();
}


export async function deleteUser(userId:string) {
    try {
        const db = await createConnection();

        await db.execute('DELETE FROM user_token WHERE user_id = ?', [userId]);

        const sql = 'DELETE FROM user WHERE id= ?';

        const values = [userId];

        await db.execute(sql, values);

        await db.end();

        return "Success";

    } catch (e:any){

        return {
            message: e.message,
            errno: e.errno,
        }
    }
}

export async function updateUser(userDTO:UserDTO) {
    if (!userDTO.id) return {
        message: "User does not exist",
        error: "User does not exist"
    }

    const db = await createConnection();

    const valuesToUpdate = [];
    const values = [];

    for(const[key,value] of Object.entries(userDTO)) {
        if (key !== "id" && value){
            valuesToUpdate.push(`${key} = ?`);
            values.push(value);
        }
    }

    const valuesToUpdateString = valuesToUpdate.join(",");
    
    const updateUserQuery = `
        UPDATE user
        SET ${valuesToUpdateString}
        where id = ?;`

    values.push(userDTO.id);

    if (values.length === 1) return;

    await db.execute(updateUserQuery, values);
    await db.end();
}

export async function clearExpiredTokens(){
    const db = await createConnection();
    const clearExpiredTokens = `DELETE FROM user_token WHERE expiration < NOW()`
    await db.execute(clearExpiredTokens);
    await db.end();
}

export async function generateUserTokenURL(userId:string) {
    const headersList = headers();

    const domain = headersList.get('host');

    const db = await createConnection();

    await clearExpiredTokens();

    const addTokenQuery =
        `
            INSERT INTO user_token(user_id, expiration, token)
            VALUES (?, DATE_ADD(NOW(), INTERVAL 2 DAY), uuid())
        `
    const values = [userId];
    await db.execute(addTokenQuery,values);

    const getTokenQuery = `SELECT token,user_id FROM user_token WHERE expiration > NOW() AND user_id = ?`

    interface IToken extends RowDataPacket {
        token: string,
        user_id: string,
    }

    const [token] = await db.execute<IToken[]>(getTokenQuery,[userId]);
    await db.end();

    if (token.length <= 0) return null;

    return `https://${domain}/update-account/?token=${token[0].token}&user_id=${token[0].user_id}`;
}

export async function validateToken(token:string,user_id:string):Promise<boolean> {
    const db = await createConnection();

    await clearExpiredTokens();

    const query =
        `SELECT id FROM user_token 
          WHERE expiration > NOW() AND user_id = ? AND token = ?`;
    interface IToken extends RowDataPacket {
        id: string
    }
    const [result] = await db.execute<IToken[]>(query,[user_id, token]);

    await db.end();

    if(result.length <= 0) return false;

    return true;
}

export async function addEntry(entryDTO:EntryDTO) {
    try {
        if (!entryDTO.entry) return null;

        const db = await createConnection();

        const sql = 'INSERT INTO form_entry (entry,submit_date,modified_date) VALUES (?,?,?)';
        const values = [entryDTO.entry,dateToMySQLDate(new Date()), dateToMySQLDate(new Date())];

        const [result] = await db.execute<IEntry[]>(sql, values);

        const [id] = await db.execute<any>('SELECT LAST_INSERT_ID()')

        await db.end();

        return id[0]["LAST_INSERT_ID()"];

    } catch (e:any){

        return {
            message: e.message,
            errno: e.errno,
        }
    }
}

export async function updateEntry(entryDTO:EntryDTO) {
    if (!entryDTO.id) return {
        message: "Entry does not exist",
        error: "Entry does not exist"
    }
    if(entryDTO.modified_date || entryDTO.submit_date)return {
        message: "Modified Date and Submitted Date cannot be manually updated.",
        error: "Modified Date and Submitted Date cannot be manually updated."
    }

    const db = await createConnection();

    const valuesToUpdate = ['modified_date'];
    const values: any = [dateToMySQLDate(new Date())];

    for(const[key,value] of Object.entries(entryDTO)) {
        if (key !== "id" && value){
            valuesToUpdate.push(`${key} = ?`);
            values.push(value);
        }
    }

    const valuesToUpdateString = valuesToUpdate.join(",");

    const updateEntryQuery = `
        UPDATE form_entry
        SET ${valuesToUpdateString}
        where id = ?;`

    values.push(entryDTO.id);

    if (values.length === 1) return;

    await db.execute(updateEntryQuery, values);
    await db.end();
}

export async function deleteEntry(id:string){
    const db = await createConnection();
    
    await db.execute('DELETE FROM form_entry WHERE id = ?',[id]);
}