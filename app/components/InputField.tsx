'use client'

import {ForwardedRef, forwardRef, useState} from "react";

const InputField = forwardRef(({name, label,defaultValue = "", required = false, password = false}: {
    name: string,
    label: string,
    defaultValue?: string,
    required?: boolean,
    password?: boolean
}, ref:ForwardedRef<any>) => {
    const [hidePassword, setHidePassword] = useState(password);

    return <div className="flex-col flex grow max-w-96">
        <label className="text-slate-950" htmlFor={name}>{label} {required ?
            <span className="text-red-600">*</span> : ""}</label>
        <input className="border-b-2 border-slate-300 p-2 shadow-sm text-slate-950" id={name}
               name={name}
               ref={ref}
               required={required}
               defaultValue={defaultValue}
               type={hidePassword ? 'password' : 'text'}
        />
        {
            password ? <button className="hover:bg-slate-200" onClick={(e) => {
                    e.preventDefault()
                    setHidePassword(!hidePassword);
                }}>
                    {hidePassword ? <span className="text-rose-900">Show</span> :
                        <span className="text-rose-900">Hide</span>}
                </button>
                : ""
        }

    </div>
});

export default InputField;