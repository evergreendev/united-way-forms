'use client'
import InputField from "@/app/components/InputField";
import {useEffect} from "react";
import {useFormState, useFormStatus} from "react-dom";
import {useRouter} from "next/navigation";
import {ICompany} from "@/app/admin/users/types";
import {submitUpdateCompanyForm} from "@/app/admin/companies/companyActions";

const initialState: { message: string | null, error: { message: string, fieldName: string } | null } = {
    message: null,
    error: null
}
const SubmitButton = () => {
    const {pending} = useFormStatus();

    return (
        <button className="bg-blue-900 p-8 py-2 text-white" type="submit" disabled={pending}>
            {pending ? <div className="size-8 border-2 border-l-blue-500 border-white animate-spin rounded-full"/> : 'Update Account'}
        </button>
    )
}


const UpdateUserForm = ({company, callbackUrl}: {
    company: ICompany,
    callbackUrl: string,
}) => {
    const [state, formAction] = useFormState(submitUpdateCompanyForm, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state.message === "Success"){
            console.log("Successfully updated");
            router.push(callbackUrl);
        }
    }, [callbackUrl, router, state]);

    return <form className="max-w-screen-xl mx-auto bg-blue-100 p-8 text-blue-950" action={formAction}>
        <div className="flex flex-wrap gap-2 mb-4">
            <input defaultValue={company.id} name="id" hidden/>
            <InputField error={state.error} name="companyName" label="Company Name" defaultValue={company.company_name}/>
            <InputField error={state.error} name="internalId" label="Constituent ID" defaultValue={company.internal_id}/>
        </div>
        <SubmitButton/>
    </form>
}

export default UpdateUserForm;