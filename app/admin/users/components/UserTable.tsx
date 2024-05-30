"use client"
import DataTable from "@/app/admin/users/components/DataTableBase";

const UserTable = ({userData}:{userData:any}) => {
    return <DataTable
        highlightOnHover
        pointerOnHover
        onRowClicked={(row,e)=> {
            console.log(row);/*todo change this to a redirect to manage user page*/
        }}
        columns={[
        {name: "User Name", selector: (row:any) => row["user_name"], sortable:true},
        {name: "Email", selector: (row:any) => row["email"], sortable: true},
        {name: "Is Admin", selector: (row:any) => row["is_admin"] === 1 ? "Admin":"User", sortable: true},
    ]} data={userData}/>
}

export default UserTable;