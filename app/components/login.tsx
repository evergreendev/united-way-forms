"use client"
import {useSession, signIn, signOut} from "next-auth/react";

const Login = () => {
    return <button onClick={() => signIn()}>log in</button>
}

export default Login;