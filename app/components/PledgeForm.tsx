"use client"
import {ICompany} from "@/app/admin/users/types";
import {useFormState, useFormStatus} from "react-dom";
import InputField from "@/app/components/InputField";
import {submitPledgeForm} from "@/app/pledgeAction";
import React, {useEffect, useRef, useState} from "react";
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

    // New allocation mode: even split or single area
    const [allocationMode, setAllocationMode] = useState<'even' | 'single'>('even');
    const [singleArea, setSingleArea] = useState<'education' | 'financial' | 'health'>('education');

    const [totalFromPay, setTotalFromPay] = useState("0.00");
    const [totalFairShare, setTotalFairShare] = useState("0.00");
    const [totalCheckCash, setTotalCheckCash] = useState("0.00");
    const [totalBill, setTotalBill] = useState("0.00");
    const [totalAutomatic, setTotalAutomatic] = useState("0.00");
    const [totalCreditCard, setTotalCreditCard] = useState("0.00");

    const [dollarADayIsActive, setDollarADayIsActive] = useState(false);

    const perPayPeriodRef = useRef<HTMLInputElement>(null);
    const cashCheckRef50 = useRef<HTMLInputElement>(null);
    const cashCheckRef100 = useRef<HTMLInputElement>(null);
    const cashCheckRef150 = useRef<HTMLInputElement>(null);
    const cashCheckRef200 = useRef<HTMLInputElement>(null);
    const cashCheckRef250 = useRef<HTMLInputElement>(null);
    const cashCheckRef = useRef<HTMLInputElement>(null);
    const otherCheckCashAmountRef = useRef<HTMLInputElement>(null);
    const dollarADayRef = useRef<HTMLInputElement>(null);
    const numberOfPayPeriodsRef = useRef<HTMLInputElement>(null);
    const automaticRef = useRef<HTMLInputElement>(null);
    const creditCardRef = useRef<HTMLInputElement>(null);

    const hourlyRateOfPayRef = useRef<HTMLInputElement>(null);

    const listRef = useRef<HTMLInputElement>(null);
    const listNameRef = useRef<HTMLInputElement>(null);

    const [completeTotal, setCompleteTotal] = useState("0.00");

    const [listNameIsShowing, setListNameIsShowing] = useState(false);

    const [otherIsShowing, setOtherIsShowing] = useState(false);

    function handleCheckCashOtherChange() {
        if (otherCheckCashAmountRef.current) {
            setTotalCheckCash(otherCheckCashAmountRef.current.value);
        }

    }

    function handleTotalAutomatic() {
        if (automaticRef.current) {
            setTotalAutomatic((parseFloat(automaticRef.current.value) * 12).toFixed(2));
        }
    }

    function handleTotalCreditCard() {
        if (creditCardRef.current) {
            setTotalCreditCard((parseFloat(creditCardRef.current.value)).toFixed(2));
        }
    }

    function handleListNameChange() {

        if (listNameRef.current) {
            listNameRef.current.value = "";
        }

        if (listRef.current) {
            setListNameIsShowing(!listRef.current.checked);
        }

    }

    function handlePayPeriodChange() {
        if (perPayPeriodRef?.current?.value && numberOfPayPeriodsRef?.current?.value) {
            setTotalFromPay((parseFloat(perPayPeriodRef.current.value) * parseInt(numberOfPayPeriodsRef.current.value)).toFixed(2));
        } else setTotalFromPay("0.00")
    }


    function handleCheckCashClear(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        if (cashCheckRef.current
            && cashCheckRef50.current
            && cashCheckRef100.current
            && cashCheckRef150.current
            && cashCheckRef200.current
            && cashCheckRef250.current
            && otherCheckCashAmountRef.current
        ) {
            cashCheckRef50.current.checked = false
            cashCheckRef.current.checked = false
            cashCheckRef100.current.checked = false
            cashCheckRef150.current.checked = false
            cashCheckRef200.current.checked = false
            cashCheckRef250.current.checked = false
            setOtherIsShowing(false);
            setTotalCheckCash("0.00");
        }
    }

    function handleCheckCashChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (cashCheckRef.current
            && cashCheckRef50.current
            && cashCheckRef100.current
            && cashCheckRef150.current
            && cashCheckRef200.current
            && cashCheckRef250.current
            && otherCheckCashAmountRef.current
        ) {

            if (e.currentTarget === cashCheckRef.current) {//if the other option is chosen make sure the rest of the radio options are off
                cashCheckRef50.current.checked = false
                cashCheckRef100.current.checked = false
                cashCheckRef150.current.checked = false
                cashCheckRef200.current.checked = false
                cashCheckRef250.current.checked = false
                setOtherIsShowing(true);
                setTotalCheckCash("0.00");

            } else {
                cashCheckRef.current.checked = false;
                setOtherIsShowing(false);
                otherCheckCashAmountRef.current.value = "";
                setTotalCheckCash(e.currentTarget.value);
            }
        }

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


        setCompleteTotal((parseFloat(totalFromPay) + parseFloat(totalFairShare) + parseFloat(totalCheckCash) +
            parseFloat(totalBill) +
            parseFloat(totalAutomatic) +
            parseFloat(totalCreditCard) + dollarADayTotal).toFixed(2));

    }, [totalFromPay, totalFairShare, dollarADayIsActive, totalCheckCash, totalBill, totalAutomatic, totalCreditCard]);

    useEffect(() => {
        setTotalAmountRemaining(100 - (stabilityAmount + healthAmount + educationAmount))
    }, [stabilityAmount, healthAmount, educationAmount]);

    // Auto-calculate percentages based on allocation mode
    useEffect(() => {
        if (allocationMode === 'even') {
            // 33/33/34 to ensure total = 100
            setEducationAmount(33);
            setStabilityAmount(33);
            setHealthAmount(34);
        } else {
            if (singleArea === 'education') {
                setEducationAmount(100);
                setStabilityAmount(0);
                setHealthAmount(0);
            } else if (singleArea === 'financial') {
                setEducationAmount(0);
                setStabilityAmount(100);
                setHealthAmount(0);
            } else {
                setEducationAmount(0);
                setStabilityAmount(0);
                setHealthAmount(100);
            }
        }
    }, [allocationMode, singleArea]);

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
                    <button onClick={() => {
                        window.print()
                    }} className="bg-slate-800 text-white px-8 py-2 mt-8  hover:bg-slate-900 flex">Print Submission
                    </button>
                </div>

            </>

        }
        <form className={`print:block print:max-h-screen print:text-sm ${state.message ? "hidden" : ""}`}
              action={formAction}>
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
                <Image src={logo} className="w-60" alt="United Way of the Black Hills"/>
                <div className="w-96 grow">
                    <span className="font-bold text-2xl">Mission Statement:</span>
                    <div>
                        At United Way of the Black Hills, we unite people and resources to improve lives in the Black
                        Hills
                        by
                        delivering measurable long-term solutions to community issues
                        in <span className="font-bold">education, financial stability</span> and <span
                        className="font-bold">health</span>.
                    </div>
                    <div className="text-sm text-slate-700 text-center my-4">
                        621 6th St Ste 100, Rapid City, SD 57701 | Phone: 605-343-5872 / Fax: 605-343-9437 | Email:
                        info@unitedwayblackhills.org | www.unitedwayblackhills.org
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap my-4">
                <div className="w-full flex flex-col sm:flex-row gap-4">
                    {/* Left: info boxes (only next to the top inputs) */}
                    <div className="w-full sm:w-3/12 print:hidden flex flex-col gap-4">
                        <div className="bg-[#ee3b32] text-white p-6 w-full">
                            <h3 className="font-bold text-2xl mb-2">Our Legacy Giving Options</h3>
                            <ul className="list-disc ml-6">
                                <li>Beneficiary Designations</li>
                                <li>Bequests</li>
                                <li>IRA RMD’s</li>
                                <li>Stock</li>
                            </ul>
                            <p className="mt-4">To learn more about planning your legacy, visit<a className="underline text-white ml-1" href="https://unitedwayblackhills.org"
                                   target="_blank" rel="noopener noreferrer">unitedwayblackhills.org</a> or contact Mari Sheldon at
                                <a className="underline text-white ml-1 whitespace-nowrap" href="tel:16055459048">605-545-9048</a> or <a className="underline text-white"
                                   href="mailto:mari@unitedwayblackhills.org">mari@unitedwayblackhills.org</a>
                            </p>
                        </div>
                        <div className="bg-[#294da1] text-white p-6 w-full">
                            <h3 className="font-bold text-2xl mb-2">Stay Informed</h3>
                            <p>To learn more or to sign up for our newsletter <a className="underline text-white"
                                                                                  href="https://unitedwayblackhills.org/for-more-information/"
                                                                                  target="_blank"
                                                                                  rel="noopener noreferrer">click
                                here</a>.</p>
                        </div>
                    </div>

                    {/* Right: the existing top input fields */}
                    <div className="w-full sm:w-9/12">
                        <div className="flex flex-wrap gap-4 print:gap-0">
                            <div className="w-full flex flex-wrap gap-4 print:gap-0">
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
                                    <div
                                        className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200 print:p-0">
                                        {company.company_name}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full flex flex-wrap gap-4 print:gap-0">
                                <InputField error={state.error} width="48%" name="Business_Phone" label="Business Phone"/>
                                <InputField error={state.error} width="48%" name="Business_Email" label="Business Email"/>
                                <InputField error={state.error} name="Cell_Phone" label="Cell Phone"/>
                                <InputField error={state.error} name="Personal_Email" label="Personal Email"/>
                            </div>

                        </div>
                    </div>
                </div>
                <div
                    className="flex flex-wrap gap-4 border-4 hidden border-blue-700 text-blue-850 mt-4 print:mt-0 w-full items-center justify-between print:gap-0">
                    <div
                        className="text-white bg-blue-500 p-2 print:p-0 text-xl font-bold w-full 2xl:w-auto print:text-sm print:hidden">USE
                        MY
                        DONATION IN
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
                    <div className="flex flex-wrap sm:flex-nowrap">
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
                        <div
                            className="flex flex-wrap justify-around gap-2 bg-orange-50 grow p-6 mt-4 mb-4 print:m-0 print:p-0">
                            {/* Allocation mode selector */}

                            {/* Hidden inputs to preserve backend contract */}
                            <input type="hidden" name="Education_Percentage" value={educationAmount} readOnly/>
                            <input type="hidden" name="Financial_Percentage" value={stabilityAmount} readOnly/>
                            <input type="hidden" name="Health_Percentage" value={healthAmount} readOnly/>

                            <div className="w-full mb-4 p-2 print:hidden">
                                <div className="flex flex-wrap gap-6 items-center justify-center">
                                    <div className="flex items-center gap-2 w-1/2">
                                        <input
                                            id="alloc_even"
                                            type="radio"
                                            className="size-6"
                                            checked={allocationMode === 'even'}
                                            onChange={() => setAllocationMode('even')}
                                        />
                                        <label htmlFor="alloc_even" className="font-bold">I want my gift to create real
                                            solutions to cover ALL impact areas of need for our communities.</label>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <input
                                                id="alloc_single"
                                                type="radio"
                                                className="size-6"
                                                checked={allocationMode === 'single'}
                                                onChange={() => setAllocationMode('single')}
                                            />
                                            <label htmlFor="alloc_single" className="font-bold">Apply all of my gift to a
                                                specific impact area</label>

                                        </div>                                            {allocationMode === 'single' && (
                                        <div className="w-full flex-col mb-4 p-2 print:hidden flex items-center justify-center">
                                            <select
                                                id="allocation_select"
                                                className="border p-2 rounded"
                                                value={singleArea}
                                                onChange={(e) => setSingleArea(e.currentTarget.value as 'education' | 'financial' | 'health')}
                                            >
                                                <option value="education">Education</option>
                                                <option value="financial">Financial Stability & Basic Needs</option>
                                                <option value="health">Health</option>
                                            </select>
                                        </div>
                                    )}
                                    </div>

                                </div>
                            </div>
                            {/* Area descriptions (unchanged) */}
                            <div className="sm:w-3/12 mb-6 print:mb-0 grow flex flex-col">
                                <h3 className="mb-2 underline text-lg print:text-sm print:mb-0 font-bold">Education</h3>
                                <ul className="list-disc ml-4 print:hidden">
                                    <li>Dolly Parton’s Imagination Library Program</li>
                                    <li>Black Hills Reads</li>
                                    <li>Mentorship & After School Programs</li>
                                    <li>Early Childhood Education & Child Care</li>
                                    <li>Access to Books</li>
                                </ul>
                            </div>
                            <div className="sm:w-3/12 mb-6 print:mb-0 grow flex flex-col">
                                <h3 className="mb-2 underline text-lg print:text-sm print:mb-0 font-bold">Financial
                                    Stability & Basic Needs</h3>
                                <ul className="list-disc ml-4 print:hidden">
                                    <li>Basic Needs & Economic Assistance</li>
                                    <li>Economic & Job Opportunities</li>
                                    <li>Affordable Housing</li>
                                    <li>Financial Education & Services</li>
                                    <li>Affordable Transportation</li>
                                </ul>
                            </div>
                            <div className="sm:w-3/12 mb-6 print:mb-0 grow flex flex-col">
                                <h3 className="mb-2 underline text-lg print:text-sm print:mb-0 font-bold">Health</h3>
                                <ul className="list-disc ml-4 print:hidden">
                                    <li>Mental Health Services</li>
                                    <li>Substance Abuse Counseling</li>
                                    <li>Home and Family Life Services</li>
                                    <li>Food Security</li>
                                    <li>Health Services</li>
                                </ul>
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
                            <div
                                className="flex flex-wrap gap-4 print:gap-0 print:flex-nowrap w-full items-end bg-blue-200 p-2">
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
                                            className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200 print:p-0">
                                            {totalFromPay}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 w-full p-2 print:gap-0 print:p-0">
                                <div className="flex items-center">
                                    <input ref={dollarADayRef} onChange={handleDollarADayChange}
                                           className="size-8 print:size-2"
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
                                            className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200 print:p-0">
                                            {dollarADayIsActive ? "365.00" : "0.00"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex flex-wrap print:flex-nowrap gap-4 print:gap-0 w-full items-end bg-blue-200 p-2 print:p-0">
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
                                            className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200 print:p-0">
                                            {totalFairShare}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-4 bg-blue-50 shadow">
                        <div
                            className="print:hidden text-white sm:[writing-mode:vertical-lr] sm:rotate-180 w-full sm:w-auto bg-[#f44d35] font-bold p-8 text-2xl text-center">
                            Direct Bill
                        </div>
                        <div className="flex flex-wrap gap-4 print:gap-0 py-6 print:p-0">
                            <div
                                className="flex flex-wrap gap-4 print:gap-0 print:flex-nowrap w-full items-center bg-blue-200 p-2">
                                <div className="flex items-end">
                                    <div>
                                        <div className="flex items-center flex-wrap">
                                            <div className="mr-3">
                                                <p className="font-bold mr-2">Check/Cash </p>
                                                <p className="text-sm">(Turn in cash/check to your HR office)</p>
                                            </div>
                                            <div>
                                                <input ref={cashCheckRef50} onChange={(e) => handleCheckCashChange(e)}
                                                       className="size-4"
                                                       id="Check/Cash_Amount50"
                                                       name="Check/Cash_Amount"
                                                       value="50"
                                                       type="radio"/>
                                                <label className="font-bold ml-2 mr-4"
                                                       htmlFor="Check/Cash_Amount50">$50</label>
                                            </div>

                                            <div><input ref={cashCheckRef100} onChange={(e) => handleCheckCashChange(e)}
                                                        className="size-4"
                                                        id="Check/Cash_Amount100"
                                                        name="Check/Cash_Amount"
                                                        value="100"
                                                        type="radio"/>
                                                <label className="font-bold ml-2 mr-4"
                                                       htmlFor="Check/Cash_Amount100">$100</label></div>
                                            <div><input ref={cashCheckRef150} onChange={(e) => handleCheckCashChange(e)}
                                                        className="size-4"
                                                        id="Check/Cash_Amount150"
                                                        name="Check/Cash_Amount"
                                                        value="150"
                                                        type="radio"/>
                                                <label className="font-bold ml-2 mr-4"
                                                       htmlFor="Check/Cash_Amount150">$150</label></div>
                                            <div><input ref={cashCheckRef200} onChange={(e) => handleCheckCashChange(e)}
                                                        className="size-4"
                                                        id="Check/Cash_Amount200"
                                                        name="Check/Cash_Amount"
                                                        value="200"
                                                        type="radio"/>
                                                <label className="font-bold ml-2 mr-4"
                                                       htmlFor="Check/Cash_Amount200">$200</label></div>
                                            <div><input ref={cashCheckRef250} onChange={(e) => handleCheckCashChange(e)}
                                                        className="size-4"
                                                        id="Check/Cash_Amount250"
                                                        name="Check/Cash_Amount"
                                                        value="250"
                                                        type="radio"/>
                                                <label className="font-bold ml-2 mr-4"
                                                       htmlFor="Check/Cash_Amount250">$250</label></div>
                                            <div><input ref={cashCheckRef} onChange={(e) => handleCheckCashChange(e)}
                                                        className="size-4"
                                                        id="Check/Cash_AmountOtherSwitch"
                                                        name=""
                                                        type="radio"/>
                                                <label className="font-bold ml-2 mr-4"
                                                       htmlFor="Check/Cash_AmountOtherSwitch">Other</label></div>
                                        </div>
                                        <div className="flex gap-3">
                                            <InputField name="Check_Number" label="Check Number:" error={state.error}/>
                                            <InputField name="Check_Date" label="Check Date:" type="date"
                                                        error={state.error}/>
                                        </div>
                                    </div>


                                </div>
                                <div className={`w-32 ${otherIsShowing ? "" : "hidden"}`}>
                                    <InputField onChange={handleCheckCashOtherChange} ref={otherCheckCashAmountRef}
                                                min="0"
                                                step={".01"}
                                                type="number" error={state.error} name="Check/Cash_Amount"
                                                label="Other:"/>
                                </div>
                                <div className="text-xl font-bold mr-1 mb-2">=</div>
                                <div className="flex items-end ml-auto w-64"><span
                                    className="text-xl font-bold mr-1 mb-2">$</span>
                                    <div className="flex-col flex grow max-w-96">
                                        <p className="w-full">Total from Check/Cash</p>
                                        <div
                                            className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200 print:p-0">
                                            {totalCheckCash}
                                        </div>
                                    </div>
                                    <button className={`print:hidden ${totalCheckCash === "0.00" ? "hidden" : ""}  `}
                                            onClick={(e) => handleCheckCashClear(e)}>clear
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 w-full p-2 print:text-xs print:flex-nowrap">
                                <div>
                                    <p className="font-bold mr-2 print:w-40">Bill Me* (Home address required above)</p>
                                    <p>*Required minimum donation of $100</p>
                                </div>
                                <div className="flex items-center">
                                    <input className="size-4"
                                           id="Billing_Period_Monthly"
                                           name="Billing_Period"
                                           value="Monthly"
                                           type="radio"/>
                                    <label className="font-bold ml-2 mr-4 print:m-0"
                                           htmlFor="Billing_Period_Monthly">Monthly</label>
                                    <input className="size-4"
                                           id="Billing_Period_Quarterly"
                                           name="Billing_Period"
                                           value="Quarterly"
                                           type="radio"/>
                                    <label className="font-bold ml-2 mr-4 print:m-0"
                                           htmlFor="Billing_Period_Quarterly">Quarterly</label>
                                    <input className="size-4"
                                           id="Billing_Period_One_Time"
                                           name="Billing_Period"
                                           value="One Time"
                                           type="radio"/>
                                    <label className="font-bold ml-2 mr-4 print:m-0"
                                           htmlFor="Billing_Period_One_Time">One Time</label>
                                </div>
                                <div className="flex items-end ml-auto w-64"><span
                                    className="text-xl font-bold mr-1 mb-2">$</span>
                                    <div className="flex-col flex grow max-w-96">
                                        <label htmlFor="Billing_Amount" className="w-full">Total Amount Billed</label>
                                        {
                                            state.error?.fieldName === "Billing_Amount" &&
                                            <div className="text-red-600 font-bold my-3">{state.error.message}</div>
                                        }
                                        <input
                                            name="Billing_Amount"
                                            id="Billing_Amount"
                                            value={totalBill}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            onChange={(e) => setTotalBill(e.currentTarget.value || "0.00")}
                                            className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950"/>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex flex-wrap print:flex-nowrap gap-4 print:gap-0 w-full items-start bg-blue-200 p-2">
                                <div className="min-w-56">
                                    <p className="font-bold">Automatic Bank Withdrawal</p>
                                    <p className="text-sm">(Turn in voided check to your HR office)</p>
                                </div>
                                <div>
                                    <InputField onChange={handleTotalAutomatic} min="0" ref={automaticRef}
                                                step="0.01" name="Automatic_Bank_Withdrawl_Amount" type="number"
                                                label="Monthly Withdrawls of" error={state.error}/>
                                    <p>will begin January 20th</p>
                                </div>

                                <div className="flex items-end ml-auto w-64 print:w-auto"><span
                                    className="text-xl font-bold mr-1 mb-2">$</span>
                                    <div className="flex-col flex grow max-w-96">
                                        <p className="w-full">Total annual withdrawal amount</p>
                                        <div
                                            className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950 bg-gray-200 print:p-0">
                                            {totalAutomatic}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex flex-wrap print:flex-nowrap gap-4 print:gap-0 w-full items-start p-2">
                                <div className="min-w-56">
                                    <p className="font-bold">Credit Card</p>
                                    <a target="_blank" rel="nofollow"
                                       className="underline print:hidden"
                                       href="https://host.nxt.blackbaud.com/donor-form/?svcid=renxt&formId=6c2a0dee-98df-4d1f-a75b-7bdf933de393&envid=p--S7Pf_n8G0attLPMKklWug&zone=usa">
                                        Donate Here<br/> (Opens in new tab)</a>
                                    <p className="italic">Please notate employer in comment box.</p>
                                    <p className="font-bold bg-white p-2 print:hidden">Once credit card transaction is
                                        complete,
                                        please return here to submit this form</p>
                                </div>
                                <div className="flex flex-col items-end ml-auto w-64 print:w-auto">
                                    <div className="flex"><input className="size-8 print:size-2"
                                                                 id="credit_card_given" name="credit_card_given"
                                                                 value="yes"
                                                                 type="checkbox"/>
                                        <label className="w-full font-bold ml-2" htmlFor="credit_card_given">I gave via
                                            my <br/>credit card online</label></div>
                                    {state.error?.fieldName === "credit_card_given" ?
                                        <p className="text-red-600 text-sm font-bold">{state.error.message}</p> : ""}
                                    <div className="flex items-end">
                                        <span className="text-xl font-bold mr-1 mb-2">$</span>
                                        <InputField onChange={handleTotalCreditCard} min="0" ref={creditCardRef}
                                                    step="0.01" name="Credit_Card_Amount" type="number"
                                                    label="Total Credit Card Donation" error={state.error}/>
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
                        <div className="flex items-center mb-6 print:mb-0 print:hidden">
                            <input required onChange={handleListNameChange} className="size-8 print:size-3"
                                   id="List_Name_In_Leadership_Directory" name="List_Name_In_Leadership_Directory"
                                   value="1"
                                   type="radio"/>
                            <label className="w-80 font-bold ml-2" htmlFor="List_Name_In_Leadership_Directory">
                                Please list my name (and spouse) in the Leadership Directory as shown below:
                            </label>
                        </div>
                        <div
                            className={`${listNameIsShowing ? "max-h-96 opacity-100" : "opacity-0 max-h-0"} overflow-hidden transition-all duration-500 mb-6 print:mb-0`}>
                            <InputField required={listNameIsShowing} textArea ref={listNameRef} error={state.error}
                                        name="Leadership_Directory_Name"
                                        label="Please print my name (and spouse) in the Leadership Directory as shown below:"/>
                        </div>
                        <div className="flex items-center">
                            <input required ref={listRef} onChange={handleListNameChange}
                                   className="size-8 print:size-3"
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
                state.error?.fieldName === "all" || state.error?.fieldName ?
                    <div className="bg-red-200 text-red-800">{state.error.message}</div> : ""
            }
            <SubmitButton/>
        </form>
    </>
}

export default PledgeForm;
