"use client"
import {useFormState} from 'react-dom'
import {sendResetPasswordLink} from "@/app/services/aws-ses";
import InputField from "@/app/components/InputField";

const initialState = {
    message: "",
    error: ""
}

const UserEmailTokenForm = () => {
    const [state, formAction] = useFormState(sendResetPasswordLink, initialState);

    return state.message ? <h2>{state.message}</h2> : <form action={formAction} className="text-slate-950 bg-blue-100  mx-auto mt-4 p-6 shadow max-w-screen-sm">
        <p className="mb-6 text-slate-500">To reset your password submit your email. You will receive an email with a link to reset your password.</p>
        <InputField name="email" label="Email" error={{message:"",fieldName:""}}/>
        {
            state?.error ? <p className="text-red-600 bg-red-50 border-red-400 border p-2 m-2">
                {state.error}
            </p> : ""
        }
        <button className="bg-orange-600 text-white py-1 px-6 rounded font-bold mt-4">Submit</button>
    </form>

}

export default UserEmailTokenForm;
