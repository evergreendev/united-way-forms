"use client"
import DataTable from "@/app/components/DataTableBase";
import {useMemo, useState} from "react";
import {deleteCompany} from "@/app/db";
import Link from "next/link";
import { useRouter } from 'next/navigation'

const CompanyTable = ({companyData}: { companyData: any }) => {
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const handleRowSelected = (selectedRows: any) => {
        setSelectedRows(selectedRows);
    }
    const router = useRouter();
    const contextActions = useMemo(() => {
        const handleDelete = async () => {
            for (const row of selectedRows.selectedRows) {
                await deleteCompany(row.id);
            }
        };
        return <button key="delete" onClick={handleDelete} className="bg-red-600">
            Delete
        </button>;
    }, [selectedRows]);

    return <DataTable
        title="Companys"
        subHeader
        defaultSortFieldId="company_name"
        subHeaderComponent={<Link href="/admin/companys/create">Add Company</Link>}
        highlightOnHover
        pointerOnHover
        selectableRows
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        onRowClicked={(row) => {
            router.push('/admin/companies/update/' + row.id);
        }}
        columns={[
            {name: "Company Name", selector: (row: any) => row["company_name"], sortable: true, id: "company_name"},
            {name: "Constituent ID", selector: (row: any) => row["internal_id"]},
        ]} data={companyData}/>
}

export default CompanyTable;