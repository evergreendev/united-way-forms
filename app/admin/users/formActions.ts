"use server"
import {createUser, getUserByEmail} from "@/app/db";


export const submitCreateUser = async (prevState:any, formData:FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userName = formData.get("userName") as string;
    const isAdmin = formData.get("isAdmin") === "on";

    const userByEmail = await getUserByEmail(email);

    if (userByEmail.length > 0){
        return {
            error: {
                message: "Email is already in use by another account. Please choose another.",
                fieldName: "email",
            }
        }
    }

    if (!userName){
        return{
            message:"",
            error:{
                message: "Please enter username",
                fieldName: "userName",
            }
        }
    }
    if (!email){
        return{
            error:{
                message: "Please enter email address",
                fieldName: "email",
            }
        }
    }
    if (!password){
        return{
            error:{
                message: "Password is Required",
                fieldName: "password",
            }

        }
    }


    const result = await createUser({user_name: userName, email, password, is_admin: isAdmin});

    if (result !== "Success"){
        return {
            error: {
                message: result?.errno === 1062 ? "This User Name is unavailable please choose another" : result?.message,
                fieldName: "userName",
            },
            message: "",
            success: false
        }
    }

    return {
        message: "User Created Successfully",
        error: null,
        success: true
    }
}