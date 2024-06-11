"use client"
import {useFormState} from 'react-dom'
import {sendResetPasswordLink} from "@/app/services/aws-ses";

const initialState = {
    message: "",
    error: ""
}

const UserEmailTokenForm = () => {
    const [state, formAction] = useFormState(sendResetPasswordLink, initialState);

    return state.message ? <h2>{state.message}</h2> : <form action={formAction} className="text-slate-950">
        <input id="email" name="email" type="text"/>
        <p className="text-red-600">
            {state?.error}
        </p>
        <button className="bg-orange-600 text-white py-1 px-6 rounded font-bold">Submit</button>
    </form>

}

export default UserEmailTokenForm;