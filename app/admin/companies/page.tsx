import {getCompanies} from "@/app/db";
import CompanyTable from "@/app/admin/companies/components/CompanyTable";
import RequireAdminAccess from "@/app/admin/components/RequireAdminAccess";


async function fetchData() {
    return await getCompanies();
}

const companies = async () => {
    const companyData = await fetchData();

    return <RequireAdminAccess>
        <CompanyTable companyData={companyData}/>
    </RequireAdminAccess>
}

export default companies;

export const dynamic = 'force-dynamic';