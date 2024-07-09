import { Card, CardBody, CardHeader, Divider, Spinner } from "@nextui-org/react";
import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SupabaseClient } from "@supabase/supabase-js";

import { getNetatmoUserData, netatmo_base_url, routes } from "@/global";
import { setStations } from "@/actions/netatmo";
import DefaultLayout from "@/layouts/default";
import { Device, Module } from "@/types";
import { useTranslation } from "react-i18next";

export default function Dashboard({ supabase }: { supabase: SupabaseClient }) {
  const navigate = useNavigate();
  const stations = useSelector(
    (state: any) => state.rootReducer.netatmo.stations,
  );

  const dispatch = useDispatch();
  const { t } = useTranslation('dashboard');

  useEffect(() => {
    getNetatmoUserData(supabase).then((res) => {
      if (res.error) {
        console.warn(res.error);
        navigate(routes.netatmoOauth);

        return;
      }
      const access_token = res.data ? res.data.access_token : "";

      const endpoint = '/api/getstationsdata'
      fetch(`${netatmo_base_url}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      })
        .then(response => response.json())
        .then(data => {
          const devicesWithRainSensors: Device[] = [];
          if (data.error) {
            return
          }
          data.body.devices.forEach((device: Device) => {
            const modules = device.modules.filter((module: Module) => module.type === 'NAModule3')//NAModule3 === rain sensor;
            modules.length > 0 && devicesWithRainSensors.push(device);
          });

          dispatch(setStations(devicesWithRainSensors));
          if (devicesWithRainSensors.length === 1) {
            navigate(routes.device.replace(":id", devicesWithRainSensors[0].home_id));
          }
        })
        .catch(error => console.error(error));
    });
    document.title = "RainMemo - Dashboard";
  }, []);

  return (
    <Suspense fallback={<Spinner />}>
      <DefaultLayout supabase={supabase}>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          {stations ?
            <>
              <h1 className="text-3xl text-default-600">{t('title')}</h1>
              <Divider />

              {stations.map((station: any) => (
                <Card
                  key={station.home_id}
                  isHoverable
                  isPressable
                  className="w-full sm:w-2/5 mx-auto bg-slate-200 dark:bg-slate-700"
                  onPress={() => {
                    navigate(routes.device.replace(":id", station.home_id));
                  }}
                >
                  <CardHeader className="text-3xl text-default-600">
                    <h1 className="text-3xl text-default-600 text-bold">
                      {station.station_name} ({station.place.street},{" "}
                      {station.place.city})
                    </h1>
                  </CardHeader>
                  <CardBody>
                    <p className="text-lg text-default-600 text-semibold">
                      {t('devices')}
                    </p>
                    {station.modules.map((module: any) => {
                      return (
                        <p
                          key={module.module_name}
                          className="text-sm text-default-600"
                        >
                          {module.module_name}
                        </p>
                      );
                    })}
                  </CardBody>
                </Card>
              ))}</> : <Spinner color="secondary" />}
        </section>
      </DefaultLayout>
    </Suspense>
  );
}
