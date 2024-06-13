import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByLogin, getUserCompany} from "@/app/db";

export const authOptions = {
    database: process.env.DB_NAME,
    callbacks: {
        jwt({ token, user}:any){
            if(user) {
                token.isAdmin = user.isAdmin
                token.company = user.company
            }
            return token;
        },
        session({ session, token }:any) {
            return {...session, user: {...session.user, id: token.sub, isAdmin: token.isAdmin, company: token.company}};
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
                try {
                    const user = await getUserByLogin(credentials?.username||"", credentials?.password||"");
                    const company = await getUserCompany(user[0].id);

                    if (!user) return null;

                    return { id: user[0].id,company: company[0]?.company_id, username: user[0]["user_name"], email: user[0].email, isAdmin: user[0]["is_admin"] };
                } catch (e){
                    return null;
                }
            }
        })
    ]
}