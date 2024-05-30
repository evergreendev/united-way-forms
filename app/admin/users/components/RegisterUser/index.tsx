"use client"
import {useFormState} from 'react-dom'
import {submitCreateUser} from "@/app/admin/users/formActions";
import {useEffect} from "react";
import {redirect} from "next/navigation";

const initialState = {
    message: "",
    error: "",
    success: false,
}

const RegisterUser = () => {
    const [state, formAction] = useFormState(submitCreateUser, initialState);

    useEffect(() => {
        if(state.success){
            setTimeout(redirect("/admin/users"), 2000);
        }
    },[state]);

    return state.message ? <h2>{state.message}</h2> : <form action={formAction} className="text-slate-950">
        <input id="username" name="username" type="text"/>
        <input id="email" name="email" type="email"/>
        <input id="password" name="password" type="password"/>
        <input id="isAdmin" name="isAdmin" type="checkbox"/>

        <p className="text-red-600">
            {state?.error}
        </p>
        <button className="bg-orange-600 text-white py-1 px-6 rounded font-bold">Submit</button>
    </form>

}

export default RegisterUser;