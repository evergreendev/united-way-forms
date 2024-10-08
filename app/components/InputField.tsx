'use client'

import {ForwardedRef, forwardRef, useState} from "react";

const InputField = forwardRef(({name, label,error,defaultValue = "", required = false, password = false,step,min,type = "text",maxLength,width,onChange,textArea=false}: {
    name: string,
    label: string,
    error: {
        message: string,
        fieldName: string
    } | null
    defaultValue?: string,
    required?: boolean,
    password?: boolean,
    step?: string,
    width?: string,
    min?: string,
    type?: string,
    maxLength?: number,
    onChange?: () => void;
    textArea?:boolean
}, ref:ForwardedRef<any>) => {
    const [hidePassword, setHidePassword] = useState(password);

    return <div className="flex-col flex grow" style={{maxWidth:maxLength ? maxLength*36+"px" : "100%", width:width?width:"auto"}}>
        <label className="text-slate-950 print:text-xs" htmlFor={name}>{label} {required ?
            <span className="text-red-600">*</span> : ""}</label>
        {
            textArea ? <textarea
                    onChange={onChange}
                    maxLength={maxLength}
                     autoComplete="new-password"
                    className={`border-b-2 border-slate-300 p-2 print:p-0 shadow-sm text-slate-950`} id={name}
                    name={name}
                    rows={5}
                    ref={ref}
                    required={required}
                    defaultValue={defaultValue}
                /> :
            <input
            onChange={onChange}
            maxLength={maxLength}
            step={step} min={min} autoComplete="new-password"
            className={`border-b-2 border-slate-300 p-2 print:p-0 shadow-sm text-slate-950`} id={name}
            name={name}
            ref={ref}
            required={required}
            defaultValue={defaultValue}
            type={hidePassword ? 'password' : type}
        />}
        {
            error && error.fieldName === name ? <div className="text-red-500">{error.message}</div> : null
        }
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

InputField.displayName = "InputField";

export default InputField;
