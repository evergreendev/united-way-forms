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
    let companyId = formData.get("company");
    const companyName = formData.get("companyName");
    const companyInternalId = formData.get("companyInternalId");
    let company;

    if (companyId) {
        company = await getCompany(companyId as string);
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

    if (companyName && companyInternalId) {
        companyId = await createCompany({
            internal_id: companyInternalId as string,
            company_name: companyName as string
        }) as any;
    }

    const result = await createUser({
        user_name: userName || email,
        email,
        password: password || generate(),
        is_admin: isAdmin
    });
    const newUser = await getUserByEmail(email);

    await updateUserCompany({user_id:newUser[0].id, company_id:companyId as string,})

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