import { DeleteIcon } from "@/components/icons";
import { routes } from "@/global";
import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function Events({ supabase }: { supabase: SupabaseClient }) {
    const [userEvents, setUserEvents] = useState<any[]>([]);

    useEffect(() => {
        document.title = "RainMemo - Hendelser";
        supabase
            .from("user_events")
            .select("*")
            .eq("device_id", station.home_id)
            .then((res: any) => {
                setUserEvents(res.data);
            })
    }, []);

    const { id } = useParams();
    const station = useSelector((state: any) => state.rootReducer.netatmo.stations,)
        .filter((s: any) => s.home_id === id)[0];
    const navigate = useNavigate();
    return (
        <DefaultLayout supabase={supabase}>
            <div className="w-2/3 mx-auto">
                <h1 className="text-3xl font-bold pb-3">Hendelser</h1>
                {
                    userEvents && userEvents.length > 0 ? userEvents.map((event: any) => {
                        return (
                            <div className="shadow-lg dark:bg-default/30 rounded-lg p-4 mb-4 grid grid-cols-2 min-w-[200px]" key={event.id}>
                                <div>
                                    <p>{event.event_text}</p>
                                    <p>{event.event_date}</p>
                                </div>
                                <Button
                                className="justify-self-end"
                                    isIconOnly
                                    color="danger"
                                    radius="full"
                                    onClick={() => {
                                        supabase
                                            .from("user_events")
                                            .delete()
                                            .eq("id", event.id)
                                            .then(() => {
                                                setUserEvents(userEvents.filter((e: any) => e.id !== event.id))
                                            })
                                    }} >
                                    <DeleteIcon />
                                </Button>
                            </div>
                        )
                    }) :
                        <p className="text-default-500 text-sm">Ingen hendelser funnet</p>
                }
                <Button onClick={() => {
                    navigate(
                        routes.createEvent
                            .replace(":id", station.home_id),
                    );
                }}>
                    Legg til en hendelse
                </Button>
            </div>
        </DefaultLayout>
    )
}