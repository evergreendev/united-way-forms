import {query} from "@/app/db";
import DataTable from "./components/DataTableBase";
import {selector} from "postcss-selector-parser";
import UserTable from "@/app/admin/users/components/UserTable";


async function fetchData() {
    return await query("SELECT * FROM user");
}

const users = async () => {
    const userData = await fetchData();


    return <div>
        <UserTable userData={userData}/>
    </div>
}

export default users;