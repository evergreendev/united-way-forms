import Link from "next/link";

const Header = () => {
    return <div className="w-full bg-slate-800 p-4">
        <div className="flex mx-auto max-w-screen-xl items-center flex-wrap">
            <Link className="hover:text-slate-300 border-r-slate-700 border-r-2 p-2" href="/admin">Dashboard</Link>
            <Link className="hover:text-slate-300 border-r-slate-700 border-r-2 p-2" href="/admin/users">Manage Users</Link>
            <Link className="hover:text-slate-300 border-r-slate-700 border-r-2 p-2" href="/admin/companies">Manage Companies</Link>
        </div>
    </div>
}

export default Header;