"use server"
import {addCompany, updateCompany} from "@/app/db";
import {revalidatePath} from "next/cache";

export const submitAddCompanyForm = async (prevState: any, formData: FormData) => {
    const companyName = formData.get('companyName');
    const internalId = formData.get('internalId');

    if(companyName === ""){
        return {
            error: {
                message: "Company name cannot be empty",
                fieldName: "companyName",
            },
            message: null
        }
    }
    if(internalId === ""){
        return {
            error: {
                message: "Constituent ID cannot be empty",
                fieldName: "internalId",
            },
            message: null
        }
    }

    await addCompany({
        company_name: companyName as string,
        internal_id: internalId as string,
    });

    revalidatePath("/admin/companies","page");

    return {
        error: null,
        message: "Success"
    }
}

export const submitUpdateCompanyForm = async (prevState: any, formData: FormData) => {
    const companyName = formData.get('companyName');
    const internalId = formData.get('internalId');
    const id = formData.get('id');

    if(companyName === ""){
        return {
            error: {
                message: "Company name cannot be empty",
                fieldName: "companyName",
            },
            message: null
        }
    }
    if(internalId === ""){
        return {
            error: {
                message: "Constituent ID cannot be empty",
                fieldName: "internalId",
            },
            message: null
        }
    }

    await updateCompany({
        id: id as string,
        company_name: companyName as string,
        internal_id: internalId as string,
    });

    revalidatePath("/admin/companies","page");

    return {
        error: null,
        message: "Success"
    }
}