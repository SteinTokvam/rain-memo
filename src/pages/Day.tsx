import { useEffect, useState } from "react";
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

import { getNetatmoUserData, rainTableHeaders, routes } from "@/global";
import Graph from "@/components/Graph";
import DefaultLayout from "@/layouts/default";

export default function Day({ supabase }: { supabase: SupabaseClient }) {
  const { id, date } = useParams();
  const station = useSelector(
    (state: any) => state.rootReducer.netatmo.stations,
  ).filter((s: any) => s.home_id === id)[0];
  const [dataFormatted, setDataFormatted] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getNetatmoUserData(supabase).then((res) => {
      if (res.error) {
        console.warn(res.error);
        navigate(routes.dashboard);

        return;
      }
      const access_token = res.data ? res.data.access_token : "";
      const module_id = station.modules.find(
        (module: any) => module.type === "NAModule3",
      )._id;
      // @ts-ignore
      const begin_date = Math.floor(new Date(date) / 1000) - 60 * 60 * 2; //TODO: kan være dette blir tull med sommer/vintertid
      const end_date = begin_date + 24 * 60 * 60;

      console.log(begin_date);
      console.log(end_date);
      fetch("https://rain-memo-backend.onrender.com/netatmo/getRain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token,
          device_id: station._id,
          module_id: module_id,
          scale: "1hour",
          date_begin: begin_date,
          date_end: end_date,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const dataWithKey = data.map((d: any) => ({ ...d, key: uuidv4() }));

          setDataFormatted(
            dataWithKey.map((d: any) => ({
              key: d.key,
              date: new Date((d.date - 60 * 30) * 1000)
                .toLocaleString("no-NO")
                .split(",")[1],
              amount: parseFloat(d.amount.toFixed(2)),
            })),
          );
        });
    });
  }, []);

  return (
    <DefaultLayout supabase={supabase}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {dataFormatted.length > 0 ? (
          <>
            <Graph data={dataFormatted} />
            <Divider />
            <Table isStriped>
              <TableHeader columns={rainTableHeaders(true)}>
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
  );
}
