import mysql from 'mysql2/promise'

export async function query(query: string): Promise<any> {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT||""),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [result] = await db.execute(query,[]);

        await db.end();

        return result;

    } catch (e){
        console.error(e);
    }
}