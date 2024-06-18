"use server"
import {getUserByEmail, updateUser, updateUserCompany} from "@/app/db";
import bcryptjs from "bcryptjs";
import {revalidatePath} from "next/cache";

export const submitUpdateUserForm = async (prevState: any, formData: FormData) => {
    const userName = formData.get('userName')
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const id = formData.get('id');
    const company = formData.get('company');

    const validateEmail = (email: any) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    if (typeof userName !== "string" || userName?.length <= 0){
        return {
            error: {message: 'User name cannot be blank', fieldName: 'userName'},
            message: null
        }
    }


    const userByEmail = await getUserByEmail(email as string);

    if (userByEmail.length > 0) {
        return {
            error: {
                message: "Email is already in use by another account. Please choose another.",
                fieldName: "email",
            },
            message: null
        }
    }

    if (!validateEmail(email)) {
        return {
            error: {message: 'Please enter a valid email address', fieldName: 'email'},
            message: null
        }
    }

    if(confirmPassword !== password){
        return {
            error: {
                message: "Your passwords do not match. please double check both fields and try again.",
                fieldName: "password",
            },
            message: null
        }
    }

    await updateUser({
        id: id as string,
        user_name: userName,
        email: email as string,
        password: password !== "" ? await bcryptjs.hash((password as string), 10) : undefined,
    });

    await updateUserCompany({
        user_id: id as string,
        company_id: company as string,
    });

    revalidatePath("/admin/users","page");

    return {
        error: null,
        message: "Success"
    }
}