"use server"
import {addEntry, getUserCompany, getUsers} from "@/app/db";
import {sendFormSubmissionEmail} from "@/app/services/aws-ses";

export async function submitPledgeForm(prevState:  { message: string | null, error: { message: string, fieldName: string } | null}, formData: FormData) {

    const finPercent = formData.get('Financial_Percentage');
    const eduPercent = formData.get('Education_Percentage');
    const healthPercent = formData.get('Health_Percentage');
    const mi = formData.get('MI');

    if (typeof mi === "string" && mi.length > 1){
        return {
            message: null,
            error: {
                message: "Middle Initial cannot be more than 1 character",
                fieldName: "MI"
            }
        }
    }

    if ((parseInt(finPercent as string) + parseInt(eduPercent as string) + parseInt(healthPercent as string)) > 100){
        return {
            message: null,
            error: {
                message: "Percents cannot add up to more than 100%. Please update percentages and resubmit",
                fieldName: "financialPercentage",
            }
        }
    }

    let json:any = {};


    formData.forEach((value, key) => {
        if (typeof value === "string" && key.indexOf("$")===-1) {
            if (json[key]){
                json[key] += " - "+value;
            } else{
                json[key] = value;
            }
        }
    })

    const result = await addEntry(json);
    const users = await getUsers();

    for (const user of users) {
        const userCompany = user.id ? await getUserCompany(user.id) : null;
        if (user.receive_form_submission_emails && (user.is_admin || userCompany === formData.get("company_id"))){
            await sendFormSubmissionEmail(user, json);
        }
    }


    if (result.errno){
        return {
            message: null,
            error: {
                message: "Something went wrong please double check your information and try again later. Your form has not been submitted",
                fieldName: "all",
            }
        }
    }

    return {
        message: "Thank you for your pledge form submission. It has been successfully submitted.",
        error: null,
    }
}
