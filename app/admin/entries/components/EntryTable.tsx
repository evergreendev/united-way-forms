"use client"
import DataTable from "@/app/components/DataTableBase";
import {useEffect, useMemo, useState} from "react";
import {deleteEntry} from "@/app/db";
import {useRouter} from 'next/navigation'
import {TableColumn} from "react-data-table-component";
import {IEntriesWithCompanyName} from "@/app/admin/entries/page";


const EntryTable = ({entryData, companyFilterOption}: {
    entryData: IEntriesWithCompanyName[],
    companyFilterOption: { name: string, id: string }[]
}) => {
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const [data, setData] = useState<any>([]);
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

    const [filteredData, setFilteredData] = useState<{ [x: string]: unknown; }[]>([]);
    const [activeFilter, setActiveFilter] = useState<string | null>(null)

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    function convertArrayOfObjectsToCSV(array: any[]) {
        let result: string;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key] || "NO";

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    function downloadCSV(array: any) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;
        let yourDate = new Date()
        const filename = `${yourDate.toISOString().split('T')[0]}-uwbh-pledges${activeFilter ? "-" + filteredData[0].Company_Name : ""}.csv`;

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }


    const Export = ({onExport}: any) => <button className="bg-blue-900 text-white py-2 px-4" onClick={e => onExport()}>Export</button>;

    const actionsMemo = useMemo(() => <Export
        onExport={() => downloadCSV(filteredData)}/>, [filteredData, downloadCSV]);

    useEffect(() => {
        if (activeFilter === null || activeFilter === "") {
            setFilteredData(data);
            return;
        }
        setFilteredData(data.filter((entry: IEntriesWithCompanyName) => {
            return entry.company_id?.toString() === activeFilter
        }))
    }, [activeFilter, data]);

    useEffect(function () {
        const newData: { [x: string]: unknown; }[] = []
        let index = 0;

        entryData.forEach((row) => {
            newData[index] = {id: row.id};

            for (const [key, value] of Object.entries(row)) {
                switch (key) {
                    default:
                        newData[index][key] = value || ""
                }

                newData[index][key] = key === "submit_date" || key === "modified_date" ? value.toLocaleDateString() : value;
            }
            index++;
        });
        setData(newData);
        setFilteredData(newData);
    }, [entryData]);

    const firstEntry = entryData[0];

    if (!firstEntry) return <></>

    const colsFromEntry: TableColumn<unknown>[] | { name: string; selector: (row: any) => any; }[] = [];
    const seenKeys = new Set<string>();
    let index = 0;

    entryData.forEach((row) => {

        for (const [key, value] of Object.entries(row)) {
            if (seenKeys.has(key) || key == "id") continue;

            colsFromEntry.push({
                name: key.replaceAll("_", " "),
                minWidth: `${key.length * 12}px`,
                selector: (row: any) => row[key]
            })

            seenKeys.add(key);
        }
        index++;
    })

    return <DataTable
        title="Entries"
        subHeader
        defaultSortFieldId="entry_name"
        subHeaderComponent={
            companyFilterOption.length > 1 ?
                <div>
                    {
                        activeFilter ?
                            <button onClick={() => setActiveFilter(null)}
                                    className="text-xs bg-blue-50 p-1 hover:font-bold">
                                Clear Company Filters <span className="text-[8px] font-bold">x</span>
                            </button>
                            : ""
                    }
                    <select value={activeFilter || ""} onChange={(e) => {
                        if (e.target.value === "") setActiveFilter(null);
                        else setActiveFilter(e.target.value)
                    }}>
                        <option value="">Filter by company</option>
                        {
                            companyFilterOption.map(opt => {
                                return <option key={opt.id} value={opt.id}>{opt.name}</option>
                            })
                        }
                    </select>

                </div>
                : ""
        }
        highlightOnHover
        pointerOnHover
        selectableRows
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        onRowClicked={(row: any) => {
            router.push('/admin/entries/update/' + row.id);
        }}
        actions={actionsMemo}
        columns={colsFromEntry} data={filteredData}/>
}

export default EntryTable;