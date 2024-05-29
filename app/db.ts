'use server'
import mysql from 'mysql2/promise'
import {UserDTO} from "@/app/admin/users/types";
import bcryptjs from "bcryptjs";

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