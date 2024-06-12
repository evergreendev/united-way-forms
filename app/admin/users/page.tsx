import {getCompany, getUserCompany, getUsers} from "@/app/db";
import UserTable from "@/app/admin/users/components/UserTable";


async function fetchData() {
    return await getUsers();
}

async function fetchUserCompany(userId: string) {
    const data = await getUserCompany(userId);
    return data[0];
}

async function fetchCompany(id: string) {
    const data = await getCompany(id);
    return data[0];
}

const users = async () => {
    const userData = await fetchData();

    const formattedUserData = await Promise.all(
        userData.map(async x => {
                const userCompany = await fetchUserCompany(x.id)
                const company = userCompany ? await fetchCompany(userCompany.company_id) : "";


                return {
                    ...x,
                    company: company ? company.company_name : ""
                }
            }
        ));

    return <div>
        <UserTable userData={formattedUserData}/>
    </div>
}

export default users;

export const dynamic = 'force-dynamic';