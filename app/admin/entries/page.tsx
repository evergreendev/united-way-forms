import {getCompany, getEntries} from "@/app/db";
import EntryTable from "@/app/admin/entries/components/EntryTable";
import {IEntry} from "@/app/admin/users/types";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/auth";


async function fetchData(isAdmin:boolean, companyId?: string) {
    return await getEntries(isAdmin, companyId);
}
export interface IEntriesWithCompanyName extends IEntry{
    Company_Name: string;
}

const companies = async ({searchParams}: { searchParams?: { company?: string } }) => {
    const session = await getServerSession(authOptions);
    let company = session.user.isAdmin ? searchParams?.company : session.user.company;
    const entryData = await fetchData(session.user.isAdmin, company);
    const seenCompanies = new Set<string>();
    console.log(session.user);
    const companyFilterOptions: { id: string; name: string; }[] = [];
    const entryDataWithCompanyNames = await Promise.all<IEntriesWithCompanyName>(entryData.map(async function(entry){
        const company = entry.company_id ? await getCompany(entry.company_id) : [];
        const companyName = company[0] ? company[0].company_name : "";

        if (entry.company_id && !seenCompanies.has(entry.company_id)) {
            companyFilterOptions.push({id: entry.company_id, name: companyName});
        }

        seenCompanies.add(entry.company_id||"");
        return {
            Company_Name: companyName,
            ...entry,
        }
    }))

    return <EntryTable entryData={entryDataWithCompanyNames} companyFilterOption={companyFilterOptions}/>
}

export default companies;

export const dynamic = 'force-dynamic';
