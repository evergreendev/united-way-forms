import UpdateCompanyForm from "@/app/admin/companies/components/UpdateCompanyForm";
import {getCompany} from "@/app/db";
import RequireAdminAccess from "@/app/admin/components/RequireAdminAccess";


const page = async ({params}: { params: { slug: string } }) => {
    const companyId = params.slug;

    const company = await getCompany(companyId);

    return <RequireAdminAccess><UpdateCompanyForm callbackUrl="/admin/companies"
                                                  company={company[0]}/></RequireAdminAccess>
}

export default page;

export const dynamic = 'force-dynamic'