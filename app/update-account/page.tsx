import UserEmailTokenForm from "@/app/components/UserEmailTokenForm";
import UpdateUserForm from "@/app/components/UpdateUserForm";
import {getCompanies, getUserByID, getUserCompany, validateToken} from "@/app/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/auth";

async function getUser(userId:string){
    return await getUserByID(userId);
}
async function fetchCompanies(){
    return await getCompanies();
}

const page = async ({searchParams}: { searchParams?: { token?: string, user_id?: string } }) => {
    const token = searchParams?.token;
    const userId = searchParams?.user_id;


    const tokenIsValid = token && userId ? await validateToken(token, userId) : false;
    const session = await getServerSession(authOptions);
    const userCanAccess = tokenIsValid || (session && session?.user?.id === userId) || session?.user?.isAdmin;
    if (userCanAccess) {
        const user = await getUser(userId||session?.user?.id);
        const userCompany = await getUserCompany(user.id);
        const companies = await fetchCompanies();
        return <UpdateUserForm token={token} callbackUrl="/admin" user={{...user, company:userCompany[0]?.company_id}} companies={companies||[]} isEditingSelf={true} isAdmin={user.isAdmin} />
    }

    return <div className="max-w-screen-sm mx-auto text-white">
        <UserEmailTokenForm/>
    </div>
}

export default page;

export const dynamic = 'force-dynamic'
