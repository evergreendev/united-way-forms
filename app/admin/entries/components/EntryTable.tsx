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
            router.refresh();
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
        let totalIndexes = {
            payroll: 0,
            dollar: 0,
            fairShare: 0,
            total: 25
        }
        const anonymousIndex = 29;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keysToGetValuesFrom = Object.keys(data[0]).toSpliced(totalIndexes.total,0, "Entry_Total_Donations")
            .toSpliced(anonymousIndex, 0, "I_Wish_To_Remain_Anonymous");
        const keys = Object.keys(data[0]).map((key,index) => {
            if (key === "Number_of_Pay_Periods_Per_Year"){
                totalIndexes.payroll = index
            }
            if (key === "Dollar_A_Day"){
                totalIndexes.dollar = index
            }
            if (key === "Hourly_Rate_of_Pay"){
                totalIndexes.fairShare = index
            }




            if (key === "Donation_Community") {
                return "Area Designation";
            }

            return key.replaceAll("_", " ");

        }).toSpliced(totalIndexes.total,0, "Entry Total Donations")
            .toSpliced(anonymousIndex, 0, "I Wish To Remain Anonymous");

        let payrollDeductionTotal = 0;
        let dollarADayTotal = 0;
        let fairShareTotal = 0;
        let totalTotal = 0;

        let currPayAmount = 0;

        let currTotal = 0;



        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            currTotal = 0;
            keysToGetValuesFrom.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                if(key === "Amount_Per_Pay_Period"){
                    currPayAmount = item[key];
                }
                if (key === "Number_of_Pay_Periods_Per_Year"){
                    payrollDeductionTotal += item[key] * currPayAmount;
                    currTotal += item[key] * currPayAmount;
                }

                if (key === "Dollar_A_Day" && item[key]){
                    dollarADayTotal += 365;
                    currTotal += 365;
                }
                if (key === "Hourly_Rate_of_Pay"){
                    fairShareTotal += item[key] * 12;
                    currTotal += item[key] * 12;
                }

                if (key === "List_Name_In_Leadership_Directory"){
                    result += item[key] === 1 ? "YES" : "NO";
                } else{
                    if (key === "Entry_Total_Donations"){
                        result += currTotal;
                    } else if(key === "I_Wish_To_Remain_Anonymous"){
                        result += !item["List_Name_In_Leadership_Directory"] ? "YES" : "NO";
                    } else{
                        if (key === "Leadership_Directory_Name"){
                            result += item[key] || "";
                        } else{
                            result += item[key] || "NO";
                        }


                    }
                }

                ctr++;
            });
            totalTotal += currTotal;
            result += lineDelimiter;
        });

        result += lineDelimiter + "TOTAL:";

        for(let i = 0; i < totalIndexes.total; i++){
            result += columnDelimiter;
            if (i+1 === totalIndexes.payroll){
                result += payrollDeductionTotal;
            }
            if (i+1 === totalIndexes.dollar){
                result += dollarADayTotal;
            }
            if (i+1 === totalIndexes.fairShare){
                result += fairShareTotal;
            }
            if(i+1 === totalIndexes.total){
                result += totalTotal;
            }
        }

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


    const Export = ({onExport}: any) => <button className="bg-blue-900 text-white py-2 px-4"
                                                onClick={e => onExport()}>Export</button>;

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

            if (key === "Donation_Community") {
                colsFromEntry.push({
                    name: "Area Designation",
                    minWidth: `${key.length * 12}px`,
                    selector: (row: any) => row[key]
                })
                seenKeys.add(key);
            }

            if (key === "List_Name_In_Leadership_Directory") {
                colsFromEntry.push({
                    name: key.replaceAll("_", " "),
                    minWidth: `${key.length * 12}px`,
                    selector: (row: any) => row[key] === 1 ? "Yes" : "No"
                })
            } else {
                colsFromEntry.push({
                    name: key.replaceAll("_", " "),
                    minWidth: `${key.length * 12}px`,
                    selector: (row: any) => row[key]
                })
            }

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
        clearSelectedRows={selectedRows.length === 0}
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        onRowClicked={(row: any) => {
            router.push('/admin/entries/update/' + row.id);
        }}
        actions={actionsMemo}
        columns={colsFromEntry} data={filteredData}/>
}

export default EntryTable;
