import {getCompany, getEntry} from "@/app/db";
import UpdateEntryForm from "@/app/admin/entries/components/UpdateEntryForm";


const page = async ({params}: { params: { slug: string } }) => {
    const id = params.slug;
    const entry = await getEntry(id);

    return <UpdateEntryForm callbackUrl="/admin/companies"
                                                  entry={entry[0]}/>
}

export default page;

export const dynamic = 'force-dynamic'