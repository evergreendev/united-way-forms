import {getCompany, getUserCompany, getUsers} from "@/app/db";
import UserTable from "@/app/admin/users/components/UserTable";
import RequireAdminAccess from "@/app/admin/components/RequireAdminAccess";


async function fetchData() {
    return await getUsers();
}

async function fetchUserCompanies(userId: string) {
    return await getUserCompany(userId);
}

async function fetchCompany(id: string) {
    const data = await getCompany(id);
    return data[0];
}

const users = async () => {
    const userData = await fetchData();

    const formattedUserData = await Promise.all(
        userData.map(async x => {
                const userCompanies = await fetchUserCompanies(x.id||"");
                
                // Fetch all companies for this user
                const companyNames = await Promise.all(
                    userCompanies.map(async (uc) => {
                        const company = await fetchCompany(uc.company_id);
                        return company ? company.company_name : "";
                    })
                );
                
                // Filter out empty strings and join with commas
                const companyString = companyNames.filter(name => name).join(", ");

                return {
                    ...x,
                    company: companyString
                }
            }
        ));

    return <RequireAdminAccess>
        <UserTable userData={formattedUserData}/>
    </RequireAdminAccess>
}

export default users;

export const dynamic = 'force-dynamic';
