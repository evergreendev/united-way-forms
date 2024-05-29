"use client"
import {SessionProvider} from "next-auth/react";
import LoginButton from "./LoginButton";

const Login = () => {
    return <SessionProvider>
        <LoginButton/>
    </SessionProvider>
}

export default Login;