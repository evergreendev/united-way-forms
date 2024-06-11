'use client'
import InputField from "@/app/components/InputField";
import {useEffect, useRef, useState} from "react";

const UpdateUserForm = ({user, isAdmin, isEditingSelf}: {
    user: {
        id: string;
        user_name: string;
        is_admin: number;
        email: string;
        password: string;
    },
    isAdmin: boolean,
    isEditingSelf: boolean,
}) => {
    //const [state, formAction] = useFormState(sendMail, initialState);
    const [newPassword, setNewPassword] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (newPassword && passwordRef.current && confirmPasswordRef.current){
            passwordRef.current.value = "";
            confirmPasswordRef.current.value = "";
        }
    }, [newPassword]);

    return <form className="max-w-screen-xl mx-auto bg-blue-100 p-8">
        <div className="flex flex-wrap gap-2 mb-4">
            <InputField name="userName" label="User Name" defaultValue={user.user_name}/>
            <InputField name="email" label="Email" defaultValue={user.email}/>
            {
                isAdmin && !isEditingSelf ? <input type="checkbox" defaultValue={isAdmin ? 1 : 0}/> : ""
            }
            <div className="w-full">
                <button onClick={(e) => {
                    e.preventDefault();
                    setNewPassword(!newPassword);
                }} className="bg-blue-200 text-blue-950 p-8 py-2">{newPassword ? "Cancel" : "Set New Password"}
                </button>
                <div className={`${newPassword ? '' : 'h-0'} transition-all overflow-hidden w-full`}>
                    <InputField ref={passwordRef} name="password" label="New Password" password/>
                    <InputField ref={confirmPasswordRef} name="confirmPassword" label="Verfiy New Password" password/>
                </div>
            </div>
        </div>
        <button className="bg-blue-900 p-8 py-2">Update Account</button>
    </form>
}

export default UpdateUserForm;