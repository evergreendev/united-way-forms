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
        <button className="bg-blue-900 p-8 py-2 text-white ml-auto flex" type="submit" disabled={pending}>
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

    const [completeTotal, setCompleteTotal] = useState("0.00");

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

    return <form action={formAction}>
        <input type="text" hidden value={company.internal_id} name="Constituent_ID" readOnly/>
        <input type="text" hidden value={company.id} name="Company_ID" readOnly/>
        <div className="flex flex-wrap justify-between gap-8">
            <h2 className="text-3xl font-bold text-orange-400 mb-6">United Way of The Black Hills<br/> Pledge form
                for <div
                    className="text-blue-900 text-4xl">{company.company_name}</div></h2>
            <h2 className="text-4xl font-bold text-orange-400 mb-6">{pledgeYear} CAMPAIGN DONATIONS</h2>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
            <Image src={logo} className="w-40" alt="United Way of the Black Hills"/>
            <div className="w-96 grow">
                <span className="font-bold text-2xl">Mission Statement:</span>
                <div>
                    At United Way of the Black Hills, we unite people and resources to improve lives in the Black Hills
                    by
                    delivering measurable long-term solutions to community issues
                    in <span className="font-bold">education, financial stability</span> and <span
                    className="font-bold">health</span>. For more information look on the backside of this pledge form.
                </div>
                <div className="text-sm text-slate-700 text-center my-4">
                    621 6th St Ste 100, Rapid City, SD 57701 | Phone: 605-343-5872 / Fax: 605-343-9437 | Email:
                    info@unitedwayblackhills.org | www.unitedwayblackhills.org
                </div>
            </div>
        </div>

        <div className="flex flex-wrap my-4">
            <div className="flex flex-wrap gap-4">
                <InputField required error={state.error} name="First_Name" label="First Name"/>
                <InputField maxLength={1} error={state.error} name="MI" label="MI"/>
                <InputField required error={state.error} name="Last_Name" label="Last Name"/>
                <InputField required error={state.error} name="Home_Address" label="Home Address"/>
                <InputField required error={state.error} name="City" label="City"/>
                <InputField required error={state.error} name="State" label="State"/>
                <InputField required error={state.error} name="Zip" label="Zip"/>
                <div className="flex-col flex grow max-w-96">
                    <p className="w-full">Employer/Branch/Department</p>
                    <div className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200">
                        {company.company_name}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 border-4 border-blue-700 text-blue-850 mt-4 w-full items-center">
                <div className="text-white bg-blue-500 p-2 text-2xl font-bold">USE MY DONATION IN THE SELECTED
                    COMMUNITY:
                </div>
                <div className="flex items-center">
                    <input className="size-6" id="rapidCity" name="Donation_Community" value="Rapid City" type="radio"/>
                    <label className="w-full font-bold ml-2" htmlFor="rapidCity">Rapid City</label>
                </div>

                <div className="flex items-center">
                    <input className="size-6" id="sturgis" name="Donation_Community" value="Sturgis" type="radio"/>
                    <label className="w-full font-bold ml-2" htmlFor="sturgis">Sturgis</label>
                </div>

                <div className="flex items-center">
                    <input className="size-6" id="northernHills" name="Donation_Community" value="Northern Hills"
                           type="radio"/>
                    <label className="w-full font-bold ml-2" htmlFor="northernHills">Northern Hills</label>
                </div>

                <div className="flex items-center">
                    <input className="size-6" id="southernHills" name="Donation_Community" value="Southern Hills"
                           type="radio"/>
                    <label className="w-full font-bold ml-2" htmlFor="southernHills">Southern Hills</label>
                </div>

            </div>
            <div className="flex flex-wrap">
                <div
                    className="min-w-48 w-1/12 bg-orange-300 text-xl p-4 font-bold text-slate-600 mr-2 flex items-center">
                    My contribution
                    will be used to
                    support the
                    greatest need
                    in my area if
                    no selections
                    are made.
                </div>
                <div className="flex flex-wrap justify-around gap-2 bg-orange-50 grow p-6 mt-4 mb-4">
                    <div className="w-3/12 grow flex flex-col">
                        <h3 className="mb-2 underline text-lg font-bold">Education</h3>
                        <ul className="list-disc ml-4">
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
                    <div className="w-3/12 grow flex flex-col">
                        <h3 className="mb-2 underline text-lg font-bold">Financial Stability & Basic Needs</h3>
                        <ul className="list-disc ml-4">
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
                    <div className="w-3/12 grow flex flex-col">
                        <h3 className="mb-2 underline text-lg font-bold">Health</h3>
                        <ul className="list-disc ml-4">
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
                        className="[writing-mode:vertical-lr] rotate-180 bg-blue-100 font-bold p-8 text-2xl text-center">Payroll
                        Deduction
                    </div>
                    <div className="flex flex-wrap gap-4 py-6">
                        <div className="flex flex-wrap gap-4 w-full items-end bg-blue-200 p-2">
                            <div className="flex items-end">
                                <span className="text-xl font-bold mr-1 mb-2">$</span>
                                <InputField onChange={handlePayPeriodChange} ref={perPayPeriodRef} min="0" step="0.01"
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
                                <label className="w-full font-bold ml-2" htmlFor="dollarADay">Consider “A Dollar A Day
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
                        <div className="flex flex-wrap gap-4 w-full items-end bg-blue-200 p-2">
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
                            <div className="text-xl font-bold mr-1 mb-2">X</div>
                            <div className="text-xl font-bold mr-1 mb-2">12 Months</div>
                            <div className="text-xl font-bold mr-1 mb-2">=</div>
                            <div className="flex items-end ml-auto w-64"><span
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
                <div className="flex grow ml-auto">
                    <div
                        className="text-3xl text-right text-blue-900 p-2 shadow-lg ml-auto mt-8 bg-blue-100 border-2 border-blue-200">
                        TOTAL ANNUAL GIFT OF: <span className="font-bold">
                            ${completeTotal}
                        </span>
                    </div>
                </div>
                <div className="bg-orange-300 p-6 my-8 flex flex-wrap gap-4 w-full">
                    <input className="size-6" type="checkbox" required id="authorization" name="authorization"
                           value="Authorized by user"/>
                    <label htmlFor="authorization" className="font-bold text-xl">By
                        submitting this form I acknowledge
                        that I authorize all of my donation amounts as submitted</label>

                </div>
            </div>
        </div>
        <SubmitButton/>
    </form>
}

export default PledgeForm;