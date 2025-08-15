"use client"
import Link from "next/link";
import {SessionProvider, signOut, useSession} from "next-auth/react";


const Header = () => {
    return <SessionProvider>
        <Inner/>
    </SessionProvider>
}

const Inner = () => {

    const {data: session, status} = useSession();


    if (status === "loading") {
        return <div className="w-full bg-slate-800 p-4">
            <div className="flex mx-auto max-w-screen-xl items-center flex-wrap w-full">Loading...</div>
        </div>
            ;
    }
    if (status === "authenticated") {
        const isAdmin = session?.user.isAdmin
        const company = session?.user.company

        return <div className="w-full bg-slate-800 p-4">
            <div className="flex mx-auto max-w-screen-xl items-center flex-wrap w-full">
                {
                    isAdmin ? <><Link className="hover:text-slate-300 border-r-slate-700 border-r-2 p-2"
                                      href="/admin/users">Manage Users</Link>
                        <Link className="hover:text-slate-300 border-r-slate-700 border-r-2 p-2"
                              href="/admin/companies">Manage Companies</Link></> : ""
                }
                {
                    company ? <Link className="hover:text-slate-300 border-r-slate-700 border-r-2 p-2"
                                    href={`/admin/entries?company=${company.map(c => c.company_id).join(',')}`}>Entries</Link> :
                        <Link className="hover:text-slate-300 border-r-slate-700 border-r-2 p-2"
                              href={`/admin/entries`}>Entries</Link>
                }
                <Link className="hover:text-slate-300 border-r-slate-700 border-r-2 p-2"
                      href={`/admin/users/update/${session?.user.id}`}>Manage Account</Link>
                <Link className="hover:text-slate-300 border-r-slate-700 border-r-2 p-2"
                      href={`/admin/pledge-forms`}>Pledge Forms</Link>
                <button className="hover:text-slate-300 border-r-slate-700 p-2 self-end ml-auto"
                        onClick={() => signOut()}>Sign Out
                </button>
            </div>
        </div>
    }

}

export default Header;
