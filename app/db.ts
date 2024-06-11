'use server'
import mysql, {RowDataPacket} from 'mysql2/promise'
import {UserDTO} from "@/app/admin/users/types";
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
        if (!user.password || !user.userName) return null;

        const db = await createConnection();

        const sql = 'INSERT INTO user (user_name, password, is_admin, email) VALUES (?,?,?,?)';
        const hashedPassword = await bcryptjs.hash(user.password,10);
        const values = [user.userName, hashedPassword, user.isAdmin, user.email];

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

export async function deleteUser(userId:string) {
    try {
        const db = await createConnection();

        const sql = 'DELETE FROM user WHERE id= ?';

        const values = [userId];

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
            VALUES (?, DATE_ADD(NOW(), INTERVAL 2 MINUTE), uuid())
        `//todo change to 2 days
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