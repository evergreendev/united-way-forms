"use client"
import {useSession, signIn, signOut, getSession} from "next-auth/react";

const LoginButton = () => {
    const {data: session, status} = useSession();

    if (status === "loading"){
        return <div>Loading...</div>;
    }

    if (status === "unauthenticated"){
        return <button onClick={() => signIn()}>Log In</button>
    }

    return <button onClick={() => signOut()}>Log Out</button>
}

export default LoginButton;