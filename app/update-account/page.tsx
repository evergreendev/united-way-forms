import UserEmailTokenForm from "@/app/components/UserEmailTokenForm";
import UpdateUserForm from "@/app/components/UpdateUserForm";
import {getUserByID, validateToken} from "@/app/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Login from "@/app/admin/users/components/Login";

async function getUser(userId:string){
    return await getUserByID(userId);
}

const page = async ({searchParams}: { searchParams?: { token?: string, user_id?: string } }) => {
    const token = searchParams?.token;
    const userId = searchParams?.user_id;

    const tokenIsValid = token && userId ? await validateToken(token, userId) : false;
    const session = await getServerSession(authOptions);
    const userCanAccess = tokenIsValid || session?.user?.id === userId || session?.user?.isAdmin;

    if (userCanAccess) {
        const user = await getUser(userId||session?.user?.id);

        return <UpdateUserForm user={user} isEditingSelf={userId === session?.user?.id} isAdmin={session?.user?.isAdmin} />
    }

    return <div>
        <UserEmailTokenForm/>
        <h2>OR</h2>
        <Login/>
    </div>
}

export default page;