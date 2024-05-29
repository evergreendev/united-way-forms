import {createUser} from "@/app/db";


export const submitCreateUser = async (prevState:any, formData:FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userName = formData.get("username") as string;
    const isAdmin = formData.get("isAdmin") === "on";

    let error = "";

    if (!userName){
        error += "User Name is Required";
    }
    if (!password){
        error += "Password is Required";
    }

    if (error){
        return{
            message: "",
            error: error
        }
    }

    const result = await createUser({userName, email, password, isAdmin});

    if (result !== "Success"){
        console.log(result);
        return {
            error: result?.errno === 1062 ? "Username already exists" : result?.message,
            message: ""
        }
    }

    return {
        message: "User Created Successfully",
        error: ""
    }
}