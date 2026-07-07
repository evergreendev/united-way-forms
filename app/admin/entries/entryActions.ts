"use server"
import {updateEntry} from "@/app/db";
import {revalidatePath} from "next/cache";
import {EntryDTO} from "@/app/admin/users/types";

export const submitUpdateEntryForm = async (prevState: { message?: string | null, error: { message: string, fieldName: string } | null, callbackUrl:string } , formData: FormData) => {
    const updatedEntry: Record<string, string> = {}
    formData.forEach((value,key) => {
        if (typeof value === "string"){
            if (updatedEntry[key]){
                updatedEntry[key] += " - "+value;
            } else{
                updatedEntry[key] = value;
            }

        }
    })

    await updateEntry({
        ...updatedEntry
        ,Dollar_A_Day: updatedEntry.Dollar_A_Day || ""
    } as EntryDTO);

    revalidatePath(prevState.callbackUrl,"page");
    revalidatePath("/admin/entries","page");

    return {
        callbackUrl: prevState.callbackUrl,
        error: null,
        message: "Success"
    }
}
