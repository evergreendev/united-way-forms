'use client'
import {useRouter} from "next/navigation";
import Link from "next/link";


const UpdateUserForm = ({callbackUrl}:{callbackUrl:string}) => {
    const router = useRouter();

   router.push(callbackUrl);

    return <div className="max-w-screen-xl mx-auto bg-blue-100 p-8 text-blue-950" >
        <Link href={callbackUrl} className="underline">
            If not redirected automatically to log in screen click here
        </Link>
    </div>
}

export default UpdateUserForm;
