import {
    Button,
    Divider,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    getKeyValue,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { fromDate } from "@internationalized/date";
import { SupabaseClient } from "@supabase/supabase-js";

import DefaultLayout from "@/layouts/default";
import { getNetatmoUserData, netatmo_base_url, rainTableHeaders, routes } from "@/global";
import RainFilter from "@/components/RainFilter";
import Graph from "@/components/Graph";
import FilterModal from "@/components/FilterModal";

export default function Device({ supabase }: { supabase: SupabaseClient }) {
    const { id } = useParams();
    const station = useSelector((state: any) => state.rootReducer.netatmo.stations,)
        .filter((s: any) => s.home_id === id)[0];
    const [data, setData] = useState<{ key: string; date: number; amount: number }[]>([]);
    const [dataFormatted, setDataFormatted] = useState<{ key: string; date: string; amount: number }[]>([]);
    const [hasAllData, setHasAllData] = useState(false);
    const [lastFetchedDate, setLastFetchedDate] = useState(0);

    const [userEvents, setUserEvents] = useState<any[]>([]);

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "date",
        direction: "descending",
    });

    const sortedItems = useMemo(() => {
        return dataFormatted ? [...dataFormatted].sort((a, b) => {
            // @ts-ignore
            const first = a[sortDescriptor.column];
            // @ts-ignore
            const second = b[sortDescriptor.column];
            var cmp = 0
            if (sortDescriptor.column === 'amount') {
                cmp = parseFloat(first) < parseFloat(second) ? -1 : parseFloat(first) > parseFloat(second) ? 1 : 0;
            } else {
                cmp = first < second ? -1 : first > second ? 1 : 0;
            }

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        }) : [];
    }, [sortDescriptor, dataFormatted]);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const navigate = useNavigate();

    useEffect(() => {
        function fetchNetatmoData(date_begin: number = 0) {
            getNetatmoUserData(supabase).then((res) => {
                if (!station) {
                    navigate(routes.dashboard);
                    return
                }
                if (res.error) {
                    console.warn(res.error);
                    navigate(routes.dashboard);

                    return;
                }

                const access_token = res.data ? res.data.access_token : "";
                const module_id = station.modules.find((module: any) => module.type === "NAModule3")._id;
                const device_id = station._id;
                const scale = "1day";

                const url = `${netatmo_base_url}/api/getmeasure?device_id=${device_id}&module_id=${module_id}&scale=${scale}&date_begin=${date_begin}&type=sum_rain&optimize=false&real_time=false`
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Content-Type': 'application/json'
                    },
                }).then(response => response.json())
                    .then(data => {
                        const keys = Object.keys(data.body);
                        const values = Object.values(data.body);
                        if (keys.length === values.length) {
                            const ret = keys.map((key, index) => {
                                return {
                                    date: key,
                                    // @ts-ignore
                                    amount: values[index][0]
                                }
                            })

                            const dataWithKey = ret.map((d: any) => ({ ...d, key: uuidv4() }));
                            const lastDateUnix = dataWithKey[dataWithKey.length - 1].date;
                            const lastDate = new Date(lastDateUnix * 1000);
                            const today = new Date();

                            // Reset today's date time to 00:00:00 to only compare dates
                            today.setHours(0, 0, 0, 0);
                            lastDate.setHours(0, 0, 0, 0);
                            if (lastDate.getTime() === today.getTime()) {
                                setHasAllData(true);
                            }
                            setLastFetchedDate(lastDateUnix);
                            setData(prevData => [...prevData, ...dataWithKey]);
                            setDataFormatted(prevDataFormatted =>
                                [...prevDataFormatted, ...dataWithKey
                                    .filter((d: any) => d.amount > 0)
                                    .map((d: any) => ({
                                        key: d.key,
                                        date: new Date(d.date * 1000).toISOString().split("T")[0],
                                        amount: d.amount,
                                    }))],
                            );
                        }
                    })
            });
        }

        if (!hasAllData) {
            fetchNetatmoData(lastFetchedDate);
        }
        supabase
            .from("user_events")
            .select("*")
            .eq("device_id", station.home_id)
            .then((res: any) => {
                setUserEvents(res.data);
            })
    }, [hasAllData, data, station]);

    function getNumberOfDaysSinceStart(start: Date, end: Date) {
        let Difference_In_Time =
            end.getTime() - start.getTime();

        return Math.round(Difference_In_Time / (1000 * 3600 * 24));
    }

    function addDays(date: Date, days: number) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function mergeEvents(userEvents: any[], dataFormatted: any[]): any[] {
        let result = [...dataFormatted];
        const eventMap = new Map<string, any>();

        for (const event of dataFormatted) {
            eventMap.set(event.date, event);
        }

        for (const eventA of userEvents) {
            if (eventMap.has(eventA.event_date)) {
                eventMap.get(eventA.event_date)!.event_text = eventA.event_text;
            } else {
                result.push({
                    date: eventA.event_date,
                    event_text: eventA.event_text,
                    amount: 0,
                });
            }
        }

        return result;
    }

    return (
        <DefaultLayout supabase={supabase}>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                {hasAllData ? (
                    <>
                        <FilterModal
                            handleFilter={(fromDate: Date, toDate: Date) => {
                                const from = data.findIndex(
                                    (d: any) => d.date - 43200 === fromDate.getTime() / 1000,
                                );
                                const to = data.findIndex(
                                    (d: any) => d.date - 43200 === toDate.getTime() / 1000,
                                );

                                if (from === -1 || to === -1) {
                                    setDataFormatted(
                                        data
                                            .filter((d: any) => d.amount > 0)
                                            .map((d: any) => ({
                                                key: d.key as string,
                                                date: new Date(d.date * 1000)
                                                    .toISOString()
                                                    .split("T")[0],
                                                amount: d.amount,
                                            })),
                                    );

                                    return;
                                }
                                setDataFormatted(
                                    data
                                        .slice(from, to + 1)
                                        .filter((d: any) => d.amount > 0)
                                        .map((d: any) => ({
                                            key: d.key,
                                            date: new Date(d.date * 1000).toISOString().split("T")[0],
                                            amount: d.amount,
                                        })),
                                );
                            }}
                            isOpen={isOpen}
                            maxDate={fromDate(
                                new Date(data[data.length - 1].date.valueOf() * 1000),
                                "Europe/Oslo",
                            )}
                            minDate={fromDate(new Date(data[0].date.valueOf() * 1000), "Europe/Oslo")}
                            onOpenChange={onOpenChange}
                        />
                        <Graph data={mergeEvents(userEvents, dataFormatted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())} />
                        <Divider />
                        <Button onClick={() => {
                            navigate(
                                routes.createEvent
                                    .replace(":id", station.home_id),
                            );
                        }}>
                            Legg til en hendelse
                        </Button>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                <h1 className="text-xl text-default-900">
                                    Total nedbør:
                                </h1>
                                <h2 className="text-md text-default-600">
                                    {dataFormatted
                                        .reduce((a: any, b: any) => a + b.amount, 0)
                                        .toFixed(2)}{" "}
                                    mm
                                </h2>
                            </div>
                            <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                <h1 className="text-xl text-default-900">
                                    Antall regndager:
                                </h1>
                                <h2 className="text-md text-default-600">
                                    {dataFormatted.length}
                                </h2>
                            </div>

                            <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                <h1 className="text-xl text-default-900">
                                    Dagen med mest regn:
                                </h1>
                                <h2 className="text-md text-default-600">
                                    {
                                        dataFormatted.reduce((a: any, b: any) =>
                                            a.amount > b.amount ? a : b,
                                        ).date + " "
                                    }
                                    (
                                    {
                                        dataFormatted.reduce((a: any, b: any) =>
                                            a.amount > b.amount ? a : b,
                                        ).amount
                                    }{" "}
                                    mm)
                                </h2>
                            </div>
                            <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                <h1 className="text-xl text-default-900">
                                    Dagen med minst regn:
                                </h1>
                                <h2 className="text-md text-default-600">
                                    {
                                        dataFormatted.reduce((a: any, b: any) =>
                                            a.amount < b.amount ? a : b,
                                        ).date + " "
                                    }
                                    (
                                    {
                                        dataFormatted.reduce((a: any, b: any) =>
                                            a.amount < b.amount ? a : b,
                                        ).amount
                                    }{" "}
                                    mm)
                                </h2>
                            </div>

                            <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                <h1 className="text-xl text-default-900">
                                    Antall dager i snitt mellom hver regndag:
                                </h1>
                                <h2 className="text-md text-default-600 py-4">
                                    {
                                        (getNumberOfDaysSinceStart(new Date(dataFormatted[0].date), new Date(dataFormatted[dataFormatted.length - 1].date)) / dataFormatted.length).toFixed(0) + " dager"
                                    }
                                </h2>
                                {
                                    //om vi er før tidspunktet for gjetningen av neste regndag så print gjetningen
                                    addDays(new Date(dataFormatted[dataFormatted.length - 1].date),
                                        Math.round(getNumberOfDaysSinceStart(new Date(dataFormatted[0].date), new Date(dataFormatted[dataFormatted.length - 1].date)) / dataFormatted.length)).getTime() > Date.now() &&
                                    <h2 className="text-md text-default-600">
                                        Kan dermed forvente regn
                                        {
                                            " " + addDays(new Date(dataFormatted[dataFormatted.length - 1].date),
                                                Math.round(getNumberOfDaysSinceStart(new Date(dataFormatted[0].date), new Date(dataFormatted[dataFormatted.length - 1].date)) / dataFormatted.length)).toLocaleDateString("nb-NO") + " "
                                        }
                                        neste gang.
                                    </h2>}
                            </div>

                        </div>
                        <RainFilter handleClick={onOpen} />
                        <Table
                            isStriped
                            selectionMode="none"
                            // @ts-ignore
                            sortDescriptor={sortDescriptor}
                            // @ts-ignore
                            onSortChange={setSortDescriptor}
                        >
                            <TableHeader columns={rainTableHeaders(false)}>
                                {(column) => (
                                    <TableColumn key={column.key} allowsSorting>
                                        {column.label}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={sortedItems}>
                                {(item: any) => (
                                    <TableRow
                                        key={item.key}
                                        onClick={() => {
                                            navigate(
                                                routes.day
                                                    .replace(":id", station.home_id)
                                                    .replace(":date", item.date),
                                            );
                                        }}
                                    >
                                        {(columnKey) => (
                                            <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </>
                ) : (
                    <Spinner color="secondary" />
                )}
            </section>
        </DefaultLayout>
    );
}
