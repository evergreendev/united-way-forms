'use client'
import InputField from "@/app/components/InputField";
import {useEffect} from "react";
import {useFormState, useFormStatus} from "react-dom";
import {useRouter} from "next/navigation";
import {IEntry} from "@/app/admin/users/types";
import {submitUpdateEntryForm} from "@/app/admin/entries/entryActions";


const SubmitButton = () => {
    const {pending} = useFormStatus();

    return (
        <button className="bg-blue-900 p-8 py-2 text-white" type="submit" disabled={pending}>
            {pending ? <div
                className="size-8 border-2 border-l-blue-500 border-white animate-spin rounded-full"/> : 'Update Entry'}
        </button>
    )
}


const UpdateEntryForm = ({entry, callbackUrl}: {
    entry: IEntry,
    callbackUrl: string,
}) => {
    const initialState: { message?: string | null, error: { message: string, fieldName: string } | null, callbackUrl:string } = {
    message: null,
    error: null,
    callbackUrl: callbackUrl
}
    const [state, formAction] = useFormState(submitUpdateEntryForm, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state.message === "Success") {
            console.log("Successfully updated");
            router.push(callbackUrl);
        }
    }, [callbackUrl, router, state]);

    return <form className="max-w-screen-xl mx-auto bg-blue-100 p-8 text-blue-950" action={formAction}>
        <div className="flex flex-wrap gap-2 mb-4">
            <input defaultValue={entry.id} name="id" hidden readOnly/>
            {
                Object.entries(entry).filter((entry) => {
                    return entry[0] !== "id"
                        && entry[0] !== "submit_date"
                        && entry[0] !== "modified_date"
                        && entry[0] !== "company_id"
                        && entry[0] !== "Constituent_ID"
                    && entry[0] !== "authorization"
                        ;
                }).map((entry) => {
                    if (entry[0] === "Dollar_A_Day") {
                        return <div key={entry[0]} className="w-full text-xl font-bold bg-blue-200">
                            <label htmlFor={entry[0]}>Dollar a Day</label>
                            <input defaultChecked={entry[1] === "yes"} type="checkbox" className="size-4 ml-2" id="dollarADay" name="Dollar_A_Day" value="yes"/>
                        </div>
                    }
                    if (entry[0] === "List_Name_In_Leadership_Directory") {
                        return <div key={entry[0]} className="w-full text-xl font-bold bg-blue-200">
                            <label>List Name in Leadership Directory</label>
                            <label htmlFor={entry[0]} className="ml-4">Yes</label>
                            <input defaultChecked={entry[1] === 1} type="radio" className="size-4 ml-2 mr-8" id={entry[0]}
                                   name={entry[0]} value="1"/>
                            <label htmlFor={"no"+entry[0]}>No</label>
                            <input defaultChecked={entry[1] !== 1} type="radio" className="size-4 ml-2"
                                   id={"no" + entry[0]} name={entry[0]} value="0"/>
                        </div>
                    }
                    if(entry[0] === "Donation_Community") {
                        return <div
                            key={entry[0]}
                            className="flex flex-wrap gap-4 border-4 border-blue-700 text-blue-850 mt-4 w-full items-center">
                            <div className="text-white bg-blue-500 p-2 text-2xl font-bold">USE MY DONATION IN THE
                                SELECTED
                                COMMUNITY:
                            </div>
                            <div className="flex items-center">
                                <input defaultChecked={entry[1] && entry[1]?.split(" - ")?.indexOf("Rapid City") !== -1} className="size-6" id="rapidCity" name="Donation_Community" value="Rapid City"
                                       type="checkbox"/>
                                <label className="w-full font-bold ml-2" htmlFor="rapidCity">Rapid City</label>
                            </div>

                            <div className="flex items-center">
                                <input defaultChecked={entry[1] && entry[1]?.split(" - ")?.indexOf("Sturgis") !== -1} className="size-6" id="sturgis" name="Donation_Community" value="Sturgis"
                                       type="checkbox"/>
                                <label className="w-full font-bold ml-2" htmlFor="sturgis">Sturgis</label>
                            </div>

                            <div className="flex items-center">
                                <input defaultChecked={entry[1] && entry[1]?.split(" - ")?.indexOf("Northern Hills") !== -1 } className="size-6" id="northernHills" name="Donation_Community"
                                       value="Northern Hills"
                                       type="checkbox"/>
                                <label className="w-full font-bold ml-2" htmlFor="northernHills">Northern Hills</label>
                            </div>

                            <div className="flex items-center">
                                <input defaultChecked={entry[1] && entry[1]?.split(" - ")?.indexOf("Southern Hills") !== -1} className="size-6" id="southernHills" name="Donation_Community"
                                       value="Southern Hills"
                                       type="checkbox"/>
                                <label className="w-full font-bold ml-2" htmlFor="southernHills">Southern Hills</label>
                            </div>

                        </div>
                    }

                    return <InputField key={entry[0]} error={state.error} name={entry[0]}
                                       label={entry[0].replaceAll("_", " ")} defaultValue={entry[1]}/>;
                })
            }
        </div>
        <SubmitButton/>
    </form>
}

export default UpdateEntryForm;
