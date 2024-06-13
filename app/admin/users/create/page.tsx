import RegisterUser from "../components/RegisterUser";
import {getCompanies} from "@/app/db";

const users = async () => {
    const companies = await getCompanies();

    return <RegisterUser companies={companies||[]}/>
}

export default users;

export const dynamic = 'force-dynamic'