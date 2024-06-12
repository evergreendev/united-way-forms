"use client"
import {useFormState} from 'react-dom'
import {submitCreateUser} from "@/app/admin/users/formActions";
import {useEffect} from "react";
import {redirect} from "next/navigation";
import InputField from "@/app/components/InputField";

const initialState = {
    message: "",
    error: {
        message:"",
        fieldName:""
    },
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
        <InputField error={state.error} name="userName" label="User Name" />
        <InputField error={state.error} name="email" label="Email" />
        <InputField error={state.error} name="password" label="Password" password/>
        <div>
            <label htmlFor="isAdmin">Company: </label>
            <input id="isAdmin" name="isAdmin" type="checkbox"/>
        </div>
        <button className="bg-orange-600 text-white py-1 px-6 rounded font-bold">Submit</button>
    </form>

}

export default RegisterUser;