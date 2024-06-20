import FilterModal from "@/components/FilterModal";
import Graph from "@/components/Graph";
import RainFilter from "@/components/RainFilter";
import { getNetatmoUserData, rainTableHeaders, routes } from "@/global";
import DefaultLayout from "@/layouts/default";
import { Divider, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { fromDate } from "@internationalized/date";
import { SupabaseClient } from "@supabase/supabase-js";

export default function Device({ supabase }: { supabase: SupabaseClient }) {

    const { id } = useParams();
    const station = useSelector((state: any) => state.rootReducer.netatmo.stations).filter((s: any) => s.home_id === id)[0];
    const [data, setData] = useState([])
    const [dataFormatted, setDataFormatted] = useState([])

    const [page, setPage] = useState(1);
    const rowsPerPage = 15;
    const pages = Math.ceil(dataFormatted.length / rowsPerPage);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "date",
        direction: "descending",
    });

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const navigate = useNavigate();

    useEffect(() => {
        getNetatmoUserData(supabase)
            .then(res => {
                if (res.error) {
                    console.warn(res.error)
                    navigate(routes.dashboard)
                    return
                  }
                const access_token = res.data ? res.data.access_token : ""
                const module_id = station.modules.find((module: any) => module.type === 'NAModule3')._id
                fetch('https://rain-memo-backend.onrender.com/netatmo/getRain',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            access_token,
                            device_id: station._id,
                            module_id: module_id,
                            scale: '1day',
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        const dataWithKey = data.map((d: any) => ({ ...d, key: uuidv4() }))
                        setData(dataWithKey)
                        setDataFormatted(dataWithKey.filter((d: any) => d.amount > 0).map((d: any) => ({ key: d.key, date: new Date(d.date * 1000).toISOString().split('T')[0], amount: d.amount })))
                    }
                    )
            })
    }, [])

    return (
        <DefaultLayout supabase={supabase}>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                {
                    dataFormatted.length > 0 ? (
                        <>
                            <FilterModal
                                isOpen={isOpen}
                                onOpenChange={onOpenChange}
                                minDate={fromDate(new Date(data[0].date * 1000), "Europe/Oslo")}
                                maxDate={fromDate(new Date(data[data.length - 1].date * 1000), "Europe/Oslo")}
                                handleFilter={(fromDate: Date, toDate: Date) => {
                                    const from = data.findIndex((d: any) => d.date - 43200 === fromDate.getTime() / 1000)
                                    const to = data.findIndex((d: any) => d.date - 43200 === toDate.getTime() / 1000)
                                    if (from === -1 || to === -1) {
                                        // @ts-ignore
                                        setDataFormatted(data.filter((d: any) => d.amount > 0).map((d: any) => ({ key: d.key, date: new Date(d.date * 1000).toISOString().split('T')[0], amount: d.amount })))
                                        return
                                    }
                                    setDataFormatted(data.slice(from, to + 1).filter((d: any) => d.amount > 0).map((d: any) => ({ key: d.key, date: new Date(d.date * 1000).toISOString().split('T')[0], amount: d.amount })))
                                    console.log(data.slice(from, to + 1).filter((d: any) => d.amount > 0).map((d: any) => ({ key: d.key, date: new Date(d.date * 1000).toISOString().split('T')[0], amount: d.amount })))
                                }} />
                            <Graph data={dataFormatted} />
                            <Divider />

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                    <h1 className="text-xl text-default-600">Total nedbør:</h1>
                                    <h2 className="text-xl text-default-600">{dataFormatted.reduce((a: any, b: any) => a + b.amount, 0).toFixed(2)} mm</h2>
                                </div>
                                <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                    <h1 className="text-xl text-default-600">Antall regndager:</h1>
                                    <h2 className="text-xl text-default-600">{dataFormatted.length}</h2>
                                </div>

                                <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                    <h1 className="text-xl text-default-600">Dagen med mest regn:</h1>
                                    <h2 className="text-xl text-default-600">
                                        {
                                            // @ts-ignore
                                            dataFormatted.reduce((a: any, b: any) => a.amount > b.amount ? a : b).date
                                        } ({
                                            // @ts-ignore
                                            dataFormatted.reduce((a: any, b: any) => a.amount > b.amount ? a : b).amount
                                        } mm)
                                    </h2>
                                </div>
                                <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                    <h1 className="text-xl text-default-600">Dagen med minst regn:</h1>
                                    <h2 className="text-xl text-default-600">
                                        {
                                            // @ts-ignore
                                            dataFormatted.reduce((a: any, b: any) => a.amount < b.amount ? a : b).date
                                        }({
                                            // @ts-ignore
                                            dataFormatted.reduce((a: any, b: any) => a.amount < b.amount ? a : b).amount
                                        } mm)
                                    </h2>
                                </div>
                            </div>
                            <RainFilter handleClick={onOpen} />
                            <Table isStriped
                                selectionMode="none"
                                // @ts-ignore
                                sortDescriptor={sortDescriptor}
                                // @ts-ignore
                                onSortChange={setSortDescriptor}
                            >
                                <TableHeader columns={rainTableHeaders(false)}>
                                    {(column) => <TableColumn allowsSorting key={column.key}>{column.label}</TableColumn>}
                                </TableHeader>
                                <TableBody items={dataFormatted}>
                                    {(item: any) => (
                                        <TableRow
                                            key={item.key}
                                            onClick={() => { navigate(routes.day.replace(':id', station.home_id).replace(':date', item.date)) }}
                                        >
                                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>

                            </Table>
                        </>
                    ) : <Spinner color="secondary" />
                }
            </section>
        </DefaultLayout >
    )
}