import {getCompanies} from "@/app/db";
import CompanyTable from "@/app/admin/companies/components/CompanyTable";


async function fetchData() {
    return await getCompanies();
}

const companies = async () => {
    const companyData = await fetchData();

    return <div>
        <CompanyTable companyData={companyData}/>
    </div>
}

export default companies;

export const dynamic = 'force-dynamic';