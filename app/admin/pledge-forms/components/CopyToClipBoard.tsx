"use client"
import {useEffect, useState} from "react";

const CopyToClipBoard = ({text}: { text:string }) => {
    const [copying, setCopying] = useState(false)

    useEffect(() => {
        setTimeout(function (){
            setCopying(false);
        }, 2500);
    },[copying]);


    return <button className={`rounded font-bold bg-blue-900 transition-all text-white p-1 m-2 ${copying ? "bg-slate-800" : "bg-blue-900"}`} onClick={() => {
        navigator.clipboard.writeText(window.location.origin+"/"+text).then(value => {
            setCopying(true);
        })
    }}>{copying ? "Copied!" : "Copy form URL to clipboard"}</button>
}

export default CopyToClipBoard