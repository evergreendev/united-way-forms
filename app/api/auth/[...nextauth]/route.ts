import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {getUserByLogin} from "@/app/db";

const authOptions = {
    database: process.env.DB_NAME,
    callbacks: {
        jwt({ token, user}:any){
            if(user) token.isAdmin = user.isAdmin;
            return token;
        },
        session({ session, token }:any) {
            return {...session, user: {...session.user, id: token.sub, isAdmin: token.isAdmin}};
        }
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type:"text",placeholder:"Username"},
                password: {label: "Password", type:"password"}
            },
            type: "credentials",
            async authorize(credentials, req){
                /*Add login logic*/

                const user = await getUserByLogin(credentials?.username||"", credentials?.password||"");

                if (!user) return null;

                return { id: user[0].id, username: user[0]["user_name"], email: user[0].email, isAdmin: user[0]["is_admin"] };
            }
        })
    ]
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };