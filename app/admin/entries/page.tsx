import {getEntries} from "@/app/db";
import EntryTable from "@/app/admin/entries/components/EntryTable";


async function fetchData(companyId?: string) {
    return await getEntries(companyId);
}

const companies = async ({searchParams}: { searchParams?: { company?: string } }) => {
    const company = searchParams?.company
    const entryData = await fetchData(company);

    return <EntryTable entryData={entryData}/>
}

export default companies;

export const dynamic = 'force-dynamic';