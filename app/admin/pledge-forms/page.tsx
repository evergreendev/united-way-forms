import {getServerSession} from "next-auth";
import {authOptions} from "@/app/auth";
import {getCompanies} from "@/app/db";
import Link from "next/link";
import CopyToClipBoard from "@/app/admin/pledge-forms/components/CopyToClipBoard";

const page = async () => {
    const session = await getServerSession(authOptions)
    const companies = await getCompanies();


    return <div>
        {
            companies?.filter(company => {
                if (session.user.isAdmin) return true;
                return parseInt(company.id||"") === parseInt(session.user.company);
            })?.map(company => {
                return <div key={company.id} className="mb-6">
                    <Link href={`/pledge-form/${company.internal_id}`} className="font-bold text-xl text-blue-900 underline">{company.company_name}</Link>
                    <CopyToClipBoard text={`/pledge-form/${company.internal_id}`}/>
                </div>
            })
        }
    </div>
}

export default page
