'use client'
import InputField from "@/app/components/InputField";
import {useEffect, useRef, useState} from "react";
import {useFormState, useFormStatus} from "react-dom";
import {submitUpdateUserForm} from "@/app/update-account/userActions";
import {useRouter} from "next/navigation";
import {ICompany} from "@/app/admin/users/types";

const initialState: { message: string | null, error: { message: string, fieldName: string } | null } = {
    message: null,
    error: null
}
const SubmitButton = () => {
    const {pending} = useFormStatus();

    return (
        <button className="bg-blue-900 p-8 py-2 text-white" type="submit" disabled={pending}>
            {pending ? <div
                className="size-8 border-2 border-l-blue-500 border-white animate-spin rounded-full"/> : 'Update Account'}
        </button>
    )
}


const UpdateUserForm = ({user, isAdmin, isEditingSelf, companies, callbackUrl, token}: {
    user: {
        id: string;
        user_name: string;
        is_admin: number;
        email: string;
        password: string;
        receive_form_submission_emails: boolean;
        company?: string;
    },
    isAdmin: boolean,
    isEditingSelf: boolean,
    companies: ICompany[],
    callbackUrl: string,
    token?: string
}) => {
    const [state, formAction] = useFormState(submitUpdateUserForm, initialState);
    const {pending} = useFormStatus();
    const [newPassword, setNewPassword] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (newPassword && passwordRef.current && confirmPasswordRef.current) {
            passwordRef.current.value = "";
            confirmPasswordRef.current.value = "";
        }
    }, [newPassword]);

    useEffect(() => {
        if (state.message === "Success") {
            console.log("Successfully updated");
            router.push(callbackUrl);
        }
    }, [callbackUrl, router, state]);

    if (!isEditingSelf && !isAdmin) {
        router.push("/admin");
    }

    return <form className="max-w-screen-xl mx-auto bg-blue-100 p-8 text-blue-950" action={formAction}>
        {
            pending ? <div>...</div> : ""
        }
        <div className="flex flex-wrap gap-2 mb-4">
            <input defaultValue={user.id} name="id" hidden readOnly/>
            <input defaultValue={token} name="token" hidden readOnly/>
            <input defaultValue={callbackUrl} name="callbackUrl" hidden readOnly/>
            <InputField error={state.error} name="userName" label="User Name" defaultValue={user.user_name}/>
            <InputField error={state.error} name="email" label="Email" defaultValue={user.email}/>
            {
                isAdmin && !isEditingSelf ?
                    <div className="text-blue-950 w-full bg-blue-400 p-2"><label htmlFor="is_admin">Is Admin: </label><input
                        type="checkbox" defaultChecked={user.is_admin === 1} name="is_admin" id="is_admin"/></div> : ""
            }

            {
                isAdmin && isEditingSelf ? <input className="hidden"
                    type="checkbox" defaultChecked={user.is_admin === 1} name="is_admin" id="is_admin"/> : ""
            }

            {
                isAdmin ? <div className="w-full">
                    <label htmlFor="company">Company: </label>
                    <select className="text-blue-950" name="company" id="company"
                            defaultValue={user.company}>
                        <option value="">Select Company</option>
                        {
                            companies.map(company => {
                                return <option key={company.id} value={company.id}>{company.company_name}</option>;
                            })
                        }
                    </select>
                </div> : <div className="w-full">
                    <div>Company:</div>
                    <div className="border-b-2 border-slate-300 p-2 print:p-0 shadow-sm text-slate-500 bg-slate-100">{companies.find(company => company.id === user.company)?.company_name}</div>
                </div>
            }

            <div className="w-full">
                <button onClick={(e) => {
                    e.preventDefault();
                    setNewPassword(!newPassword);
                }} className="bg-blue-200 text-blue-950 p-8 py-2">{newPassword ? "Cancel" : "Set New Password"}
                </button>
                <div className={`${newPassword ? '' : 'h-0'} transition-all overflow-hidden w-full`}>
                    <InputField error={state.error} ref={passwordRef} name="password" label="New Password" password/>
                    <InputField error={state.error} ref={confirmPasswordRef} name="confirmPassword"
                                label="Verify New Password" password/>
                </div>
            </div>
            <div className="bg-blue-200 w-full p-6">
                <label htmlFor="receive_form_submission_emails" className="font-bold mr-2">Should receive submission emails:</label>
                <input className="size-4" name="receive_form_submission_emails"
                       id="receive_form_submission_emails"
                       defaultChecked={user.receive_form_submission_emails}
                       type="checkbox"/>
            </div>
        </div>
        <SubmitButton/>
    </form>
}

export default UpdateUserForm;
