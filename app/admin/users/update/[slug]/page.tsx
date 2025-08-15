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

    // Map all company IDs to an array for multi-select support
    const companyIds = userCompany.map(company => company.company_id);
    
    return <UpdateUserForm callbackUrl="/admin/users" user={{...user, company: companyIds}} companies={companies||[]}
                           isEditingSelf={userId === session?.user?.id} isAdmin={session?.user?.isAdmin}/>


}

export default page;

export const dynamic = 'force-dynamic'
