import {getServerSession} from "next-auth";
import {authOptions} from "@/app/auth";
import {redirect} from "next/navigation";

const RequireAdminAccess = async ({url = "/admin",children}: {url?:string, children: React.ReactNode}) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) redirect(url)

    return <>
        {children}
    </>
}

export default RequireAdminAccess;