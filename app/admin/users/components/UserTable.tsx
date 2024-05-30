"use client"
import DataTable from "@/app/admin/users/components/DataTableBase";
import {useMemo, useState} from "react";
import {deleteUser} from "@/app/db";
import Link from "next/link";

const UserTable = ({userData}: { userData: any }) => {
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const handleRowSelected = (selectedRows: any) => {
        setSelectedRows(selectedRows);
    }
    const contextActions = useMemo(() => {
        const handleDelete = async () => {
            for (const row of selectedRows.selectedRows) {
                await deleteUser(row.id);
            }
        };
        return <button key="delete" onClick={handleDelete} className="bg-red-600">
            Delete
        </button>;
    }, [selectedRows]);

    return <DataTable
        title="Users"
        subHeader
        subHeaderComponent={<Link href="/admin/users/create">Add User</Link>}
        highlightOnHover
        pointerOnHover
        selectableRows
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        onRowClicked={(row, e) => {
            console.log(row);/*todo change this to a redirect to manage user page*/
        }}
        columns={[
            {name: "User Name", selector: (row: any) => row["user_name"], sortable: true},
            {name: "Email", selector: (row: any) => row["email"], sortable: true},
            {name: "Is Admin", selector: (row: any) => row["is_admin"] === 1 ? "Admin" : "User", sortable: true},
        ]} data={userData}/>
}

export default UserTable;