import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNetatmoUserData, routes } from "@/global";
import { useDispatch, useSelector } from "react-redux";
import { setStations } from "@/actions/netatmo";
import { SupabaseClient } from "@supabase/supabase-js";

export default function Dashboard({ supabase }: { supabase: SupabaseClient }) {

  const navigate = useNavigate();
  const stations = useSelector((state: any) => state.rootReducer.netatmo.stations);

  const dispatch = useDispatch();

  useEffect(() => {
    getNetatmoUserData(supabase)
      .then(res => {
        if (res.error) {
          console.warn(res.error)
          navigate(routes.netatmoOauth)
          return
        }
        const access_token = res.data ? res.data.access_token : ""

        fetch('https://rain-memo-backend.onrender.com/netatmo/getStations',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              access_token,
            })
          })
          .then(res => res.json())
          .then(data => {
            dispatch(setStations(data))
          })
      })
  }, []);

  return (
    <DefaultLayout supabase={supabase}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className="text-3xl text-default-600">Dine målestasjoner</h1>
        <Divider />
        {
          stations && (
            stations.map((station: any) => (
              <Card
                key={station.home_id}
                className="w-full sm:w-2/5 mx-auto bg-slate-200 dark:bg-slate-700"
                isPressable
                isHoverable
                onPress={() => {
                  navigate(routes.device.replace(':id', station.home_id))
                }}
              >
                <CardHeader className="text-3xl text-default-600">
                  <h1 className="text-3xl text-default-600 text-bold">{station.station_name} ({station.place.street}, {station.place.city})</h1>
                </CardHeader>
                <CardBody>
                  <p className="text-lg text-default-600 text-semibold">Enheter:</p>
                  {
                    station.modules
                      .map((module: any) => {
                        return (<p className="text-sm text-default-600" key={module.module_name}>{module.module_name}</p>)
                      })}</CardBody>
              </Card>
            ))
          )
        }
      </section>
    </DefaultLayout>
  );
}
