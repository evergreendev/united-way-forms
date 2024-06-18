import RequireAdminAccess from "@/app/admin/components/RequireAdminAccess";
import AddCompanyForm from "@/app/admin/companies/components/AddCompanyForm";


const page = async () => {

    return <RequireAdminAccess>
        <AddCompanyForm callbackUrl="/admin/companies"/>
    </RequireAdminAccess>
}

export default page;

export const dynamic = 'force-dynamic'