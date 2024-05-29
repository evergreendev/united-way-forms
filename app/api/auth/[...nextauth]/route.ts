import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type:"text",placeholder:"Username"},
                password: {label: "Password", type:"password"}
            },
            async authorize(credentials, req){
                /*Add login logic*/
                return { id: "1", name: 'J Smith', email: 'jsmith@example.com' }
            }
        })
    ]
})

export { handler as GET, handler as POST };