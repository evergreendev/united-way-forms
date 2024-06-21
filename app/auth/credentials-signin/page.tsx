"use client";
import {getCsrfToken} from "next-auth/react"
import {useEffect, useState} from "react";
import Link from "next/link";
import InputField from "@/app/components/InputField";
import logo from "@/public/united-way-horiz.png"
import Image from "next/image";

export default function SignIn({searchParams}: { searchParams?: { error?: string } }) {
    const [csrfToken, setCsrfToken] = useState("");
    const error = searchParams?.error;
    const placeholder = {message: "", fieldName: ""}

    useEffect(() => {
        getCsrfToken().then((token) => setCsrfToken(token || ""));
    }, []);

    return (
        <div className="max-w-screen-sm mx-auto h-screen flex flex-col items-center justify-center">

            <form className="bg-blue-100 mx-auto mt-4 p-6 shadow" method="post"
                  action="/api/auth/callback/credentials"><Image src={logo} alt="" className="w-48 mx-auto mb-6"/>
                {
                    error ? <div className="bg-red-100 text-red-700 p-2 mb-6">
                            There was an error logging in. Please double check your credentials and try again, or
                            <Link className="font-bold underline" href="/update-account"> reset your password</Link>
                        </div>
                        : ""
                }
                <input name="csrfToken" type="hidden" defaultValue={csrfToken}/>
                <InputField name="username" label="Username or Email" error={placeholder}/>
                <InputField name="password" label="Password" password error={placeholder}/>
                <button className="bg-blue-900 text-white p-2 rounded" type="submit">Sign in</button>
            </form>
            <Link className="underline block my-4 text-slate-300 ml-6" href="/update-account">Lost your password?</Link>
        </div>

    )
}
