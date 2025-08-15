"use server"
import {createCompany, createUser, getCompany, getUserByEmail, getUserByID, updateUserCompany} from "@/app/db";
import {generate} from "generate-password-browser"
import {revalidatePath} from "next/cache";
import {sendNewUserEmail} from "@/app/services/aws-ses";
import {IUser} from "@/app/admin/users/types";

export const submitCreateUser = async (prevState: any, formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userName = formData.get("userName") as string;
    const isAdmin = formData.get("isAdmin") === "on";
    
    // Get all selected companies (supports multiple selection)
    const companyValues = formData.getAll("company");
    let companyId = companyValues.length > 0 ? companyValues : null;
    
    // Check for multiple new companies (with indexed names)
    const newCompanyEntries: {name: string, internalId: string}[] = [];
    
    // Collect all new company entries from form data
    for (let i = 0; i < 20; i++) { // Reasonable upper limit
        const nameKey = `companyName_${i}`;
        const idKey = `companyInternalId_${i}`;
        
        const name = formData.get(nameKey) as string;
        const internalId = formData.get(idKey) as string;
        
        if (name && internalId) {
            newCompanyEntries.push({ name, internalId });
        }
    }
    
    // For backward compatibility - check for single company
    if (newCompanyEntries.length === 0) {
        const companyName = formData.get("companyName");
        const companyInternalId = formData.get("companyInternalId");
        
        if (companyName && companyInternalId) {
            newCompanyEntries.push({ 
                name: companyName as string, 
                internalId: companyInternalId as string 
            });
        }
    }
    
    let company;
    // If only one company is selected, get its details (for backward compatibility)
    if (companyId && !Array.isArray(companyId)) {
        company = await getCompany(companyId);
    }


    const userByEmail = await getUserByEmail(email);

    if (userByEmail.length > 0) {
        return {
            error: {
                message: "Email is already in use by another account. Please choose another.",
                fieldName: "email",
            }
        }
    }

    if (!email) {
        return {
            error: {
                message: "Please enter email address",
                fieldName: "email",
            }
        }
    }

    if (newCompanyEntries.length > 0) {
        // Create all new companies
        const newCompanyIds = [];
        
        for (const entry of newCompanyEntries) {
            // Create each new company
            const newCompanyId = await createCompany({
                internal_id: entry.internalId,
                company_name: entry.name
            }) as any;
            
            if (newCompanyId) {
                newCompanyIds.push(newCompanyId);
            }
        }
        
        // If companyId is null, use only the new company IDs
        if (!companyId) {
            companyId = newCompanyIds;
        } 
        // If companyId is already an array, add all the new company IDs
        else if (Array.isArray(companyId)) {
            // Filter out the "ADD NEW COMPANY" option if it was selected
            companyId = companyId.filter(id => id !== "ADD NEW COMPANY");
            companyId = [...companyId, ...newCompanyIds];
        }
        // If companyId is a string (should not happen with the updated UI), convert to array with new IDs
        else {
            companyId = [companyId, ...newCompanyIds];
        }
    } else if (Array.isArray(companyId)) {
        // Filter out the "ADD NEW COMPANY" option and empty string (No Company) if they were selected
        companyId = companyId.filter(id => id !== "ADD NEW COMPANY" && id !== "");
        
        // If all options were filtered out, set to null
        if (companyId.length === 0) {
            companyId = null;
        }
    }

    const result = await createUser({
        user_name: userName || email,
        email,
        password: password || generate(),
        is_admin: isAdmin
    });
    const newUser = await getUserByEmail(email);

    await updateUserCompany({user_id:newUser[0].id, company_id: companyId as unknown as number[],})

    if (result !== "Success") {
        return {
            error: {
                message: result?.errno === 1062 ? "This User Name is unavailable please choose another" : result?.message,
                fieldName: "userName",
            },
            message: "",
            success: false
        }
    }

    revalidatePath("/admin/users", "page");


    await sendNewUserEmail(newUser[0]);

    return {
        message: "User Created Successfully",
        error: null,
        success: true
    }
}
