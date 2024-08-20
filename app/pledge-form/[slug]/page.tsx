import {getCompanyByInternal} from "@/app/db";
import PledgeForm from "@/app/components/PledgeForm";
import { notFound } from 'next/navigation'


const page = async ({params}: { params: { slug: string } }) => {
    const companyId = params.slug;

    const company = await getCompanyByInternal(companyId);

    if (company.length === 0) {
        return notFound();
    }

    return <div className="bg-blue-50 text-blue-900 min-h-screen print:max-h-screen print:overflow-hidden mx-auto max-w-screen-xl p-8 print:p-0 print:max-w-full">
        <PledgeForm company={company[0]}/>
</div>
}

export default page;

export const dynamic = 'force-dynamic'
