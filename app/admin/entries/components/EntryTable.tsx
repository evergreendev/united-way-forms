"use client"
import DataTable from "@/app/components/DataTableBase";
import {useMemo, useState} from "react";
import {deleteEntry} from "@/app/db";
import { useRouter } from 'next/navigation'
import { TableColumn } from "react-data-table-component";

const EntryTable = ({entryData}: { entryData: any }) => {
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const handleRowSelected = (selectedRows: any) => {
        setSelectedRows(selectedRows);
    }
    const router = useRouter();
    const contextActions = useMemo(() => {
        const handleDelete = async () => {
            for (const row of selectedRows.selectedRows) {
                await deleteEntry(row.id);
            }
        };
        return <button key="delete" onClick={handleDelete} className="bg-red-600 hover:bg-red-500 px-8 py-2 text-white">
            Delete
        </button>;
    }, [selectedRows]);

    const firstEntry = entryData[0]?.entry;

    if (!firstEntry) return <></>

    const colsFromEntry: TableColumn<unknown>[] | { name: string; selector: (row: any) => any; }[] = [];
    const data: { [x: string]: unknown; }[] = []
    const seenKeys = new Set<string>();
    let index = 0;

    entryData.forEach((row: any) => {
        data[index] = {id: row.id};
        for (const [key, value] of Object.entries(row.entry)) {
            data[index][key] = value;
            if (seenKeys.has(key)) continue;

            colsFromEntry.push({name: key.replaceAll("_", " "), selector: (row: any) => row[key]})

            seenKeys.add(key);
        }
        index++;
    })

    return <DataTable
        title="Entrys"
        subHeader
        defaultSortFieldId="entry_name"
        //subHeaderComponent={<Link href="/admin/entries/create">Add Entry</Link>}
        highlightOnHover
        pointerOnHover
        selectableRows
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        onRowClicked={(row:any) => {
            router.push('/admin/entries/update/' + row.id);
        }}
        columns={colsFromEntry} data={data}/>
}

export default EntryTable;