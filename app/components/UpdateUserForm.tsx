'use client'
import InputField from "@/app/components/InputField";
import {useEffect, useRef, useState} from "react";
import {useFormState} from "react-dom";
import {submitUpdateUserForm} from "@/app/update-account/userActions";

const initialState: {message:string|null, error:{message:string,fieldName:string}|null} = {
    message:null,
    error:null
}
const UpdateUserForm = ({user, isAdmin, isEditingSelf,companies}: {
    user: {
        id: string;
        user_name: string;
        is_admin: number;
        email: string;
        password: string;
        company?: string;
    },
    isAdmin: boolean,
    isEditingSelf: boolean,
    companies: {
        companyName: string,
        id: string
    }[]
}) => {
    const [state, formAction] = useFormState(submitUpdateUserForm, initialState);
    const [newPassword, setNewPassword] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (newPassword && passwordRef.current && confirmPasswordRef.current){
            passwordRef.current.value = "";
            confirmPasswordRef.current.value = "";
        }
    }, [newPassword]);

    return <form className="max-w-screen-xl mx-auto bg-blue-100 p-8 text-blue-950" action={formAction}>
        <div className="flex flex-wrap gap-2 mb-4">
            <input defaultValue={user.id} name="id" hidden/>
            <InputField error={state.error} name="userName" label="User Name" defaultValue={user.user_name}/>
            <InputField error={state.error} name="email" label="Email" defaultValue={user.email}/>
            {
                isAdmin && !isEditingSelf ? <div className="text-blue-950 w-full bg-blue-400 p-2"><label>Is Admin: </label><input type="checkbox" defaultChecked={isAdmin}/></div> : ""
            }
            <div className="w-full">
                <label htmlFor="company">Company: </label>
                <select name="company" id="company" disabled={!isAdmin}>
                    <option value="">Select Company</option>
                    {
                        companies.map(company => {
                            return <option selected={company.id === user.company} key={company.id} value={company.id}>{company.companyName}</option>;
                        })
                    }
                </select>
            </div>

            <div className="w-full">
                <button onClick={(e) => {
                    e.preventDefault();
                    setNewPassword(!newPassword);
                }} className="bg-blue-200 text-blue-950 p-8 py-2">{newPassword ? "Cancel" : "Set New Password"}
                </button>
                <div className={`${newPassword ? '' : 'h-0'} transition-all overflow-hidden w-full`}>
                    <InputField error={state.error} ref={passwordRef} name="password" label="New Password" password/>
                    <InputField error={state.error} ref={confirmPasswordRef} name="confirmPassword" label="Verify New Password" password/>
                </div>
            </div>
        </div>
        <button className="bg-blue-900 p-8 py-2 text-white">Update Account</button>
    </form>
}

export default UpdateUserForm;