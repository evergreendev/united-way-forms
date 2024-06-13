import UpdateUserForm from "@/app/components/UpdateUserForm";
import {getCompanies, getUserByID, getUserCompany, validateToken} from "@/app/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/auth";

async function getUser(userId: string) {
    return await getUserByID(userId);
}

async function fetchCompanies() {
    return await getCompanies();
}

const page = async ({params}: { params: { slug: string } }) => {
    const userId = params.slug;

    const session = await getServerSession(authOptions);

    const user = await getUser(userId);
    const userCompany = await getUserCompany(userId);
    const companies = await fetchCompanies();

    return <UpdateUserForm callbackUrl="/admin/users" user={{...user, company: userCompany[0]?.company_id}} companies={companies||[]}
                           isEditingSelf={userId === session?.user?.id} isAdmin={session?.user?.isAdmin}/>


}

export default page;

export const dynamic = 'force-dynamic'