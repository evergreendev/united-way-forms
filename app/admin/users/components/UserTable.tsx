"use client"
import DataTable from "@/app/components/DataTableBase";
import {useMemo, useState} from "react";
import {deleteUser} from "@/app/db";
import Link from "next/link";
import { useRouter } from 'next/navigation'

const UserTable = ({userData}: { userData: any }) => {
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const handleRowSelected = (selectedRows: any) => {
        setSelectedRows(selectedRows);
    }
    const router = useRouter();
    const contextActions = useMemo(() => {
        const handleDelete = async () => {
            for (const row of selectedRows.selectedRows) {
                await deleteUser(row.id);
            }
            router.refresh();
            setSelectedRows([]);
        };
        return <button key="delete" onClick={handleDelete} className="bg-red-600 hover:bg-red-500 px-8 py-2 text-white">
            Delete
        </button>;
    }, [router,selectedRows]);

    return <DataTable
        title="Users"
        subHeader
        subHeaderComponent={<Link href="/admin/users/create">Add User</Link>}
        highlightOnHover
        pointerOnHover
        selectableRows
        contextActions={contextActions}
        clearSelectedRows={selectedRows.length === 0}
        onSelectedRowsChange={handleRowSelected}
        onRowClicked={(row) => {
            router.push('/admin/users/update/' + row.id);
        }}
        columns={[
            {name: "User Name", selector: (row: any) => row["user_name"], sortable: true},
            {name: "Email", selector: (row: any) => row["email"], sortable: true},
            {name: "Company", selector: (row: any) => row["company"], sortable: true},
            {name: "Receives Submission Emails", selector: (row:any)=> row["receive_form_submission_emails"] === 1 ? "Yes" : "",sortable: true},
            {name: "Is Admin", selector: (row: any) => row["is_admin"] === 1 ? "Admin" : "User", sortable: true},
        ]} data={userData}/>
}

export default UserTable;
