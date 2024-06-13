import UpdateCompanyForm from "@/app/admin/companies/components/UpdateCompanyForm";
import {getCompany} from "@/app/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/auth";


const page = async ({params}: { params: { slug: string } }) => {
    const companyId = params.slug;

    const session = await getServerSession(authOptions);

    const company = await getCompany(companyId);

    //if (!session?.company?.isAdmin) redirect("/admin/companies")//Don't let non admins access this page. TODO remove this

    return <UpdateCompanyForm callbackUrl="/admin/companies" company={company[0]}/>
}

export default page;

export const dynamic = 'force-dynamic'