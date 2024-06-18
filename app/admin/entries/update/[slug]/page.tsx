import {getCompany, getEntry} from "@/app/db";
import UpdateEntryForm from "@/app/admin/entries/components/UpdateEntryForm";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/auth";
import {notFound} from "next/navigation";


const page = async ({params}: { params: { slug: string } }) => {
    const id = params.slug;
    const entry = await getEntry(id);
    const session = await getServerSession(authOptions);

    if (!session.user.isAdmin && session.user.company !== entry[0].company_id) return notFound();

    return <UpdateEntryForm callbackUrl={`/admin/entries/update/${id}`}
                                                  entry={entry[0]}/>
}

export default page;

export const dynamic = 'force-dynamic'