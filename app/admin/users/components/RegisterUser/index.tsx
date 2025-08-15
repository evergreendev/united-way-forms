"use client"
import {useFormState} from 'react-dom'
import {submitCreateUser} from "@/app/admin/users/formActions";
import {useEffect, useRef, useState} from "react";
import {redirect} from "next/navigation";
import InputField from "@/app/components/InputField";
import {ICompany} from "@/app/admin/users/types";

const initialState = {
    message: "",
    error: {
        message: "",
        fieldName: ""
    },
    success: false,
}

const RegisterUser = ({companies}: { companies: ICompany[] }) => {
    const [state, formAction] = useFormState(submitCreateUser, initialState);
    const [isAddingNewCompany, setIsAddingNewCompany] = useState(false);
    const companyNameRef = useRef<HTMLInputElement>(null);
    const companyInternalIdRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state.success) {
            setTimeout(redirect("/admin/users"), 2000);
        }
    }, [state]);
    useEffect(() => {
        if (!isAddingNewCompany && companyNameRef.current && companyInternalIdRef.current) {
            companyNameRef.current.value = "";
            companyInternalIdRef.current.value = "";
        }
    }, [isAddingNewCompany]);


    return state.message ? <h2>{state.message}</h2> : <form action={formAction} className="text-slate-950">
        <InputField error={state.error} name="email" label="Email"/>
        <div className="flex flex-wrap gap-2 my-4">
            <label htmlFor="company" className="w-full">Companies</label>
            <select onChange={(e) => {
                // Check if any of the selected options is "ADD NEW COMPANY"
                const selectedOptions = Array.from(e.target.selectedOptions);
                setIsAddingNewCompany(selectedOptions.some(option => option.value === "ADD NEW COMPANY"));
            }} name="company" className="text-slate-950 p-3" multiple>
                <option value="" className="font-bold bg-blue-100 border-y-2 border-y-blue-900">No Company (United Way Internal Use)</option>
                <option value="ADD NEW COMPANY" className="font-bold bg-blue-100 border-y-2">Add New Company</option>
                {
                    companies.map(company => {
                        return <option value={company.id}
                                       key={company.id}>{company.company_name} - {company.internal_id}</option>
                    })
                }
            </select>
            <div className="text-sm text-gray-600 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple companies</div>
        </div>
        {
            isAddingNewCompany
                ? <div className="bg-blue-100 p-2">
                    <h2 className="font-bold text-lg mb-3">Add New Company</h2>
                    <InputField name="companyName" label="Company Name" error={state.error} ref={companyNameRef}/>
                    <InputField name="companyInternalId" label="Constituent ID" error={state.error}
                                ref={companyInternalIdRef}/>
                </div>
                : ""
        }
        <div className="flex flex-wrap gap-2 p-2 bg-blue-200 text-blue-850 my-4">
            <label className="w-full font-bold" htmlFor="isAdmin">Grant Full Access to User (this option is for
                United Way Employees and anyone else that would need full access): </label>
            <input className="size-6" id="isAdmin" name="isAdmin" type="checkbox"/>
        </div>
        <button className="bg-orange-600 text-white py-1 px-6 rounded font-bold">Submit</button>
    </form>

}

export default RegisterUser;
