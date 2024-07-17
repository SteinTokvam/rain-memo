import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
    Divider,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    getKeyValue,
} from "@nextui-org/react";
import { SupabaseClient } from "@supabase/supabase-js";

import { getNetatmoUserData, netatmo_base_url, rainTableHeaders, routes } from "@/global";
import Graph from "@/components/Graph";
import DefaultLayout from "@/layouts/default";
import { useTranslation } from "react-i18next";

export default function Day({ supabase }: { supabase: SupabaseClient }) {
    const { id, date } = useParams();
    const station = useSelector(
        (state: any) => state.rootReducer.netatmo.stations,
    ).filter((s: any) => s.home_id === id)[0];
    const [dataFormatted, setDataFormatted] = useState<{ key: string; date: string; amount: number }[]>([]);
    const navigate = useNavigate();
    const { t } = useTranslation('day');

    useEffect(() => {
        getNetatmoUserData(supabase).then((res) => {
            if (res.error) {
                console.warn(res.error);
                navigate(routes.dashboard);

                return;
            }
            const access_token = res.data ? res.data.access_token : "";
            const module_id = station.modules.find((module: any) => module.type === "NAModule3",)._id;
            const device_id = station._id;
            const scale = "1hour";
            // @ts-ignore
            const date_begin = Math.floor(new Date(date) / 1000) - 60 * 60 * 2; //TODO: kan være dette blir tull med sommer/vintertid
            const date_end = date_begin + 24 * 60 * 60;

            const url = `${netatmo_base_url}/api/getmeasure?device_id=${device_id}&module_id=${module_id}&scale=${scale}&date_begin=${date_begin}&date_end=${date_end}&type=sum_rain&optimize=false&real_time=false`
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

                        setDataFormatted(
                            dataWithKey.map((d: any) => ({
                                key: d.key,
                                date: new Date((d.date - 60 * 30) * 1000)
                                    .toLocaleString("no-NO")
                                    .split(",")[1],
                                amount: parseFloat(d.amount.toFixed(2)),
                            })),
                        );

                    }
                })
        });
        document.title = "RainMemo - Dag";
    }, []);

    return (
        <Suspense fallback={<Spinner />}>
            <DefaultLayout supabase={supabase}>
                <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                    {dataFormatted.length > 0 ? (
                        <>
                            <Graph data={dataFormatted} />
                            <Divider />
                            <div className="shadow-lg dark:bg-default/30 rounded-lg p-4">
                                <h1 className="text-3xl text-default-600 text-bold">{t('header')}</h1>
                                <h2 className="text-lg text-default-600 text-semibold">{dataFormatted.reduce((a: any, b: any) => a + b.amount, 0).toFixed(2)}mm</h2>
                            </div>
                            <Table isStriped>
                                <TableHeader columns={rainTableHeaders(
                                    {
                                        date: t('timeOfDay', { ns: 'translation' }),
                                        amount: t('rainfall', { ns: 'translation' })
                                    }
                                )}>
                                    {(column) => (
                                        <TableColumn key={column.key}>{column.label}</TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody items={dataFormatted}>
                                    {(item: any) => (
                                        <TableRow key={item.key}>
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
        </Suspense>
    );
}
