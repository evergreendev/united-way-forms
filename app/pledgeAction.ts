"use server"
import {addEntry} from "@/app/db";

export async function submitPledgeForm(prevState:  { message: string | null, error: { message: string, fieldName: string } | null}, formData: FormData) {

    const finPercent = formData.get('Financial_Percentage');
    const eduPercent = formData.get('Education_Percentage');
    const healthPercent = formData.get('Health_Percentage');

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

    console.log(formData)


    formData.forEach((value, key) => {
        if (key !== "Company_ID"){
            json[key] = value;
        }
    })

    json = JSON.stringify(json);

    await addEntry({
        entry: json,
        company_id: formData.get("Company_ID") as string,
    })

    return {
        message: "Thank you for your pledge form submission. It has been successfully submitted.",
        error: null,
    }
}