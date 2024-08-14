"use client"
import {ICompany} from "@/app/admin/users/types";
import {useFormState, useFormStatus} from "react-dom";
import InputField from "@/app/components/InputField";
import {submitPledgeForm} from "@/app/pledgeAction";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import logo from "@/public/united-way-horiz.png"

const initialState: {
    message: string | null,
    error: { message: string, fieldName: string } | null
} = {
    message: null,
    error: null
}
const SubmitButton = () => {
    const {pending} = useFormStatus();

    return (
        <button className="print:hidden bg-blue-900 p-8 py-2 text-white ml-auto flex" type="submit" disabled={pending}>
            {pending ?
                <div className="size-8 border-2 border-l-blue-500 border-white animate-spin rounded-full"/> : 'Submit'}
        </button>
    )
}

const PledgeForm = ({company}: { company: ICompany }) => {
    const pledgeYear = new Date().getFullYear() + 1;
    const [state, formAction] = useFormState(submitPledgeForm, initialState);

    const [educationAmount, setEducationAmount] = useState(0);
    const [stabilityAmount, setStabilityAmount] = useState(0);
    const [healthAmount, setHealthAmount] = useState(0);
    const [totalAmountRemaining, setTotalAmountRemaining] = useState(100);

    const [totalFromPay, setTotalFromPay] = useState("0.00");
    const [totalFairShare, setTotalFairShare] = useState("0.00");
    const [dollarADayIsActive, setDollarADayIsActive] = useState(false);

    const perPayPeriodRef = useRef<HTMLInputElement>(null);
    const dollarADayRef = useRef<HTMLInputElement>(null);
    const numberOfPayPeriodsRef = useRef<HTMLInputElement>(null);

    const hourlyRateOfPayRef = useRef<HTMLInputElement>(null);

    const listRef = useRef<HTMLInputElement>(null);
    const listNameRef = useRef<HTMLInputElement>(null);

    const [completeTotal, setCompleteTotal] = useState("0.00");

    const [listNameIsShowing, setListNameIsShowing] = useState(false);

    function handleListNameChange(){

        if (listNameRef.current){
            listNameRef.current.value = "";
        }

        if (listRef.current){
            setListNameIsShowing(!listRef.current.checked);
        }

    }

    function handlePayPeriodChange() {
        if (perPayPeriodRef?.current?.value && numberOfPayPeriodsRef?.current?.value) {
            setTotalFromPay((parseFloat(perPayPeriodRef.current.value) * parseInt(numberOfPayPeriodsRef.current.value)).toFixed(2));
        } else setTotalFromPay("0.00")
    }

    function handleHourlyRateOfPay() {
        if (hourlyRateOfPayRef?.current?.value) {
            setTotalFairShare((parseFloat(hourlyRateOfPayRef.current.value) * 12).toFixed(2));
        } else setTotalFairShare("0.00")
    }

    function handleDollarADayChange() {
        if (dollarADayRef.current?.value) {
            setDollarADayIsActive(dollarADayRef.current.checked)
        }
    }

    useEffect(() => {
        const dollarADayTotal = dollarADayIsActive ? 365 : 0;

        setCompleteTotal((parseFloat(totalFromPay) + parseFloat(totalFairShare) + dollarADayTotal).toFixed(2));

    }, [totalFromPay, totalFairShare, dollarADayIsActive]);

    useEffect(() => {
        setTotalAmountRemaining(100 - (stabilityAmount + healthAmount + educationAmount))
    }, [stabilityAmount, healthAmount, educationAmount]);

    function handleChange(newAmount: string, prevAmount: number, updateFunction: (value: number) => void) {
        const newTotalRemaining = (totalAmountRemaining + prevAmount) - parseInt(newAmount);

        if (newTotalRemaining < 0) {
            updateFunction(Math.max((parseInt(newAmount) + newTotalRemaining), 0));
        } else {
            updateFunction(Math.max(parseInt(newAmount), 0));
        }
    }

  /*  if (state.message) {
        return <h2 className="bg-blue-200 text-blue-950 text-4xl p-6">{state.message}</h2>
    }*/


    return <>
        {
            state.message &&
            <><h2 className="bg-blue-200 text-blue-950 text-4xl p-6 print:hidden">{state.message}</h2>
                <div className="flex print:hidden">
                    <button onClick={() => {window.print()}} className="bg-slate-800 text-white px-8 py-2 mt-8  hover:bg-slate-900 flex">Print Submission</button>
                </div>

            </>

        }
        <form className={`print:block print:max-h-screen print:text-sm ${state.message ? "hidden" : ""}`} action={formAction}>
            <input type="text" hidden value={company.internal_id} name="Constituent_ID" readOnly/>
            <input type="text" hidden value={company.id} name="company_id" readOnly/>
            <div className="flex flex-wrap justify-between gap-8 print:hidden">
                <h2 className="text-3xl font-bold text-orange-400 mb-6 sm:w-5/12">United Way of The Black
                    Hills<br/> Pledge
                    form
                    for <div
                        className="text-blue-900 text-4xl">{company.company_name}</div></h2>
                <h2 className="text-4xl font-bold text-orange-400 mb-6">{pledgeYear} CAMPAIGN DONATIONS</h2>
            </div>

            <div className="flex flex-wrap gap-4 print:gap-0 items-center print:hidden">
                <Image src={logo} className="w-40" alt="United Way of the Black Hills"/>
                <div className="w-96 grow">
                    <span className="font-bold text-2xl">Mission Statement:</span>
                    <div>
                        At United Way of the Black Hills, we unite people and resources to improve lives in the Black
                        Hills
                        by
                        delivering measurable long-term solutions to community issues
                        in <span className="font-bold">education, financial stability</span> and <span
                        className="font-bold">health</span>. For more information look on the backside of this pledge
                        form.
                    </div>
                    <div className="text-sm text-slate-700 text-center my-4">
                        621 6th St Ste 100, Rapid City, SD 57701 | Phone: 605-343-5872 / Fax: 605-343-9437 | Email:
                        info@unitedwayblackhills.org | www.unitedwayblackhills.org
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap my-4">
                <div className="flex flex-wrap gap-4 print:gap-0">
                    <div className="w-full flex flex-wrap gap-4">
                        <InputField required error={state.error} name="First_Name" label="First Name"/>
                        <InputField maxLength={1} error={state.error} name="MI" label="MI"/>
                        <InputField required error={state.error} width="20rem" name="Last_Name" label="Last Name"/>
                    </div>
                    <InputField required error={state.error} width="100%" name="Home_Address" label="Home Address"/>
                    <InputField required error={state.error} name="City" label="City"/>
                    <InputField required error={state.error} name="State" label="State"/>
                    <InputField required error={state.error} name="Zip" label="Zip"/>

                    <div className="w-full">
                        <div className="flex-col flex grow max-w-96">
                            <p className="w-full">Employer/Branch/Department</p>
                            <div className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200">
                                {company.company_name}
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-wrap gap-4">
                        <InputField error={state.error} width="48%" name="Business_Phone" label="Business Phone"/>
                        <InputField error={state.error} width="48%" name="Business_Email" label="Business Email"/>
                        <InputField error={state.error} name="Cell_Phone" label="Cell Phone"/>
                        <InputField error={state.error} name="Personal_Email" label="Personal Email"/>
                    </div>

                </div>
                <div
                    className="flex flex-wrap gap-4 border-4 border-blue-700 text-blue-850 mt-4 w-full items-center justify-between print:gap-0">
                    <div className="text-white bg-blue-500 p-2 text-xl font-bold w-full 2xl:w-auto print:text-sm">USE MY DONATION IN
                        THE
                        SELECTED
                        COMMUNITY:
                    </div>
                    <div className="flex items-center p-2 w-full sm:w-auto">
                        <input className="size-6" id="rapidCity" name="Donation_Community" value="Rapid City"
                               type="checkbox"/>
                        <label className="w-full font-bold ml-2" htmlFor="rapidCity">Rapid City</label>
                    </div>

                    <div className="flex items-center p-2 w-full sm:w-auto">
                        <input className="size-6" id="sturgis" name="Donation_Community" value="Sturgis"
                               type="checkbox"/>
                        <label className="w-full font-bold ml-2" htmlFor="sturgis">Sturgis</label>
                    </div>

                    <div className="flex items-center p-2 w-full sm:w-auto">
                        <input className="size-6" id="northernHills" name="Donation_Community" value="Northern Hills"
                               type="checkbox"/>
                        <label className="w-full font-bold ml-2" htmlFor="northernHills">Northern Hills</label>
                    </div>

                    <div className="flex items-center p-2 w-full sm:w-auto">
                        <input className="size-6" id="southernHills" name="Donation_Community" value="Southern Hills"
                               type="checkbox"/>
                        <label className="w-full font-bold ml-2" htmlFor="southernHills">Southern Hills</label>
                    </div>

                </div>
                <div className="flex flex-wrap">
                    <div
                        className="min-w-48 print:hidden print:mb-0 w-1/12 bg-orange-300 text-xl p-4 font-bold text-slate-600 mr-2 flex items-center">
                        My contribution
                        will be used to
                        support the
                        greatest need
                        in my area if
                        no selections
                        are made.
                    </div>
                    <div className="flex flex-wrap justify-around gap-2 bg-orange-50 grow p-6 mt-4 mb-4 print:m-0">
                        <div className="sm:w-3/12 mb-6 grow flex flex-col">
                            <h3 className="mb-2 underline text-lg font-bold">Education</h3>
                            <ul className="list-disc ml-4 print:hidden">
                                <li>Dolly Parton’s Imagination Library Program</li>
                                <li>Black Hills Reads</li>
                                <li>Mentorship & After School Programs</li>
                                <li>Early Childhood Education & Child Care</li>
                                <li>Access to Books</li>
                            </ul>
                            <div className="flex mt-auto">
                                <input name="Education_Percentage"
                                       className="size-14 p-1 bg-transparent border-b-2 border-b-blue-200" type="number"
                                       value={educationAmount}
                                       onChange={(e) => handleChange(e.target.value, educationAmount, setEducationAmount)}/>
                                <div className="flex items-center text-4xl font-bold">% <div className="text-xl"
                                                                                             style={{lineHeight: ".9"}}>
                                    <div>of my</div>
                                    gift</div></div>
                            </div>
                        </div>
                        <div className="sm:w-3/12 mb-6 grow flex flex-col">
                            <h3 className="mb-2 underline text-lg font-bold">Financial Stability & Basic Needs</h3>
                            <ul className="list-disc ml-4 print:hidden">
                                <li>Basic Needs & Economic Assistance</li>
                                <li>Economic & Job Opportunities</li>
                                <li>Affordable Housing</li>
                                <li>Financial Education & Services</li>
                                <li>Affordable Transportation</li>
                            </ul>
                            <div className="flex mt-auto">
                                <input name="Financial_Percentage"
                                       className="size-14 p-1 bg-transparent border-b-2 border-b-blue-200" type="number"
                                       value={stabilityAmount}
                                       onChange={(e) => handleChange(e.target.value, stabilityAmount, setStabilityAmount)}/>
                                <div className="flex items-center text-4xl font-bold">% <div className="text-xl"
                                                                                             style={{lineHeight: ".9"}}>
                                    <div>of my</div>
                                    gift</div></div>
                            </div>

                        </div>
                        <div className="sm:w-3/12 mb-6 grow flex flex-col">
                            <h3 className="mb-2 underline text-lg font-bold">Health</h3>
                            <ul className="list-disc ml-4 print:hidden">
                                <li>Mental Health Services</li>
                                <li>Substance Abuse Counseling</li>
                                <li>Home and Family Life Services</li>
                                <li>Food Security</li>
                                <li>Health Services</li>
                            </ul>
                            <div className="flex mt-auto">
                                <input name="Health_Percentage"
                                       className="size-14 p-1 bg-transparent border-b-2 border-b-blue-200" type="number"
                                       value={healthAmount}
                                       onChange={(e) => handleChange(e.target.value, healthAmount, setHealthAmount)}/>
                                <div className="flex items-center text-4xl font-bold">% <div className="text-xl"
                                                                                             style={{lineHeight: ".9"}}>
                                    <div>of my</div>
                                    gift</div></div>
                            </div>

                        </div>
                    </div>
                    {
                        state.error?.fieldName === "financialPercentage" ? <div
                            className="w-full text-red-800 font-bold p-3 text-center text-2xl bg-red-50">{state.error.message}</div> : ""
                    }
                    <div className="flex flex-wrap sm:flex-nowrap gap-4 bg-blue-50 shadow">
                        <div
                            className="print:hidden sm:[writing-mode:vertical-lr] sm:rotate-180 w-full sm:w-auto bg-blue-100 font-bold p-8 text-2xl text-center">Payroll
                            Deduction
                        </div>
                        <div className="flex flex-wrap gap-4 print:gap-0 py-6 print:p-0">
                            <div className="flex flex-wrap gap-4 print:gap-0 print:flex-nowrap w-full items-end bg-blue-200 p-2">
                                <div className="flex items-end">
                                    <span className="text-xl font-bold mr-1 mb-2">$</span>
                                    <InputField onChange={handlePayPeriodChange} ref={perPayPeriodRef} min="0"
                                                step="0.01"
                                                type="number" error={state.error} name="Amount_Per_Pay_Period"
                                                label="Amount per pay period"/>
                                </div>
                                <div className="text-xl font-bold mr-1 mb-2">X</div>
                                <InputField onChange={handlePayPeriodChange} ref={numberOfPayPeriodsRef} min="0"
                                            type="number" error={state.error} name="Number_of_Pay_Periods_Per_Year"
                                            label="Number of pay periods in full year"/>
                                <div className="text-xl font-bold mr-1 mb-2">=</div>
                                <div className="flex items-end ml-auto w-64"><span
                                    className="text-xl font-bold mr-1 mb-2">$</span>
                                    <div className="flex-col flex grow max-w-96">
                                        <p className="w-full">Total payroll deduction</p>
                                        <div
                                            className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200">
                                            {totalFromPay}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 w-full p-2">
                                <div className="flex items-center">
                                    <input ref={dollarADayRef} onChange={handleDollarADayChange} className="size-8"
                                           id="dollarADay" name="Dollar_A_Day" value="yes"
                                           type="checkbox"/>
                                    <label className="w-full font-bold ml-2" htmlFor="dollarADay">Consider “A Dollar A
                                        Day
                                        For United Way” ($365)</label>
                                </div>
                                <div className="flex items-end ml-auto w-64"><span
                                    className="text-xl font-bold mr-1 mb-2">$</span>
                                    <div className="flex-col flex grow max-w-96">
                                        <p className="w-full">$1/day amount ($365)</p>
                                        <div
                                            className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200">
                                            {dollarADayIsActive ? "365.00" : "0.00"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap print:flex-nowrap gap-4 print:gap-0 w-full items-end bg-blue-200 p-2">
                                <div>
                                    <p className="font-bold">FAIRSHARE GIFT</p>
                                    <p>(One hour&apos;s pay per month)</p>
                                </div>
                                <div className="flex items-end">
                                    <span className="text-xl font-bold mr-1 mb-2">$</span>
                                    <InputField onChange={handleHourlyRateOfPay} ref={hourlyRateOfPayRef} min="0"
                                                step="0.01"
                                                type="number" error={state.error} name="Hourly_Rate_of_Pay"
                                                label="Hourly rate of pay"/>
                                </div>
                                <div className="text-xl print:text-sm font-bold mr-1 mb-2">X</div>
                                <div className="text-xl print:text-sm font-bold mr-1 mb-2">12 Months</div>
                                <div className="text-xl print:text-sm font-bold mr-1 mb-2">=</div>
                                <div className="flex items-end ml-auto w-64 print:w-auto"><span
                                    className="text-xl font-bold mr-1 mb-2">$</span>
                                    <div className="flex-col flex grow max-w-96">
                                        <p className="w-full">Total fairshare pledge (for year)</p>
                                        <div
                                            className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200">
                                            {totalFairShare}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex grow ml-auto w-full mb-6 print:m-0">
                        <div
                            className="text-3xl print:text-sm text-right text-blue-900 p-2 shadow-lg ml-auto mt-8 bg-blue-100 border-2 border-blue-200 print:m-0">
                            TOTAL ANNUAL GIFT OF: <span className="font-bold">
                            ${completeTotal}
                        </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end w-full">
                        <div className="flex items-center mb-6">
                            <input required onChange={handleListNameChange} className="size-8"
                                   id="List_Name_In_Leadership_Directory" name="List_Name_In_Leadership_Directory"
                                   value="1"
                                   type="radio"/>
                            <label className="w-80 font-bold ml-2" htmlFor="List_Name_In_Leadership_Directory">
                                Please list my name (and spouse) in the Leadership Directory as shown below:
                            </label>
                        </div>
                        <div
                            className={`${listNameIsShowing ? "max-h-96 opacity-100" : "opacity-0 max-h-0"} overflow-hidden transition-all duration-500 mb-6`}>
                            <InputField required={listNameIsShowing} textArea ref={listNameRef} error={state.error}
                                        name="Leadership_Directory_Name"
                                        label="Please print my name (and spouse) in the Leadership Directory as shown below:"/>
                        </div>
                        <div className="flex items-center">
                            <input required ref={listRef} onChange={handleListNameChange} className="size-8"
                                   id="Dont_List_Name_In_Leadership_Directory" name="List_Name_In_Leadership_Directory"
                                   value="0"
                                   type="radio"/>
                            <label className="w-80 font-bold ml-2" htmlFor="Dont_List_Name_In_Leadership_Directory">I
                                wish to remain anonymous</label>
                        </div>
                    </div>
                    <div className="bg-orange-300 p-6 my-8 flex flex-wrap gap-4 w-full print:hidden">
                        <input className="size-6" type="checkbox" required id="authorization" name="authorization"
                               value="Authorized by user"/>
                        <label htmlFor="authorization" className="font-bold text-xl">By
                            submitting this form I acknowledge
                            that I authorize all of my donation amounts as submitted</label>

                    </div>
                </div>
            </div>
            {
                state.error?.fieldName === "all" ?
                    <div className="bg-red-200 text-red-800">{state.error.message}</div> : ""
            }
            <SubmitButton/>
        </form>
    </>
}

export default PledgeForm;
