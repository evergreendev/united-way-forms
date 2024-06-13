import RegisterUser from "../components/RegisterUser";
import {getCompanies} from "@/app/db";
import RequireAdminAccess from "@/app/admin/components/RequireAdminAccess";

const users = async () => {
    const companies = await getCompanies();

    return <RequireAdminAccess>
        <RegisterUser companies={companies || []}/>
    </RequireAdminAccess>
}

export default users;

export const dynamic = 'force-dynamic'