import { routes, styles } from "@/global";
import { Input } from "@nextui-org/input";
import { Button, DateInput, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { useNavigate, useParams } from "react-router-dom";
import { SupabaseClient } from "@supabase/supabase-js";
import { useSelector } from "react-redux";
import { I18nProvider } from "@react-aria/i18n";
import DefaultLayout from "@/layouts/default";

export default function CreateEvent({ supabase }: { supabase: SupabaseClient }) {
    const [event, setEvent] = useState("");
    const [eventDate, setEventDate] = useState(parseDate("2024-04-04"));
    const navigate = useNavigate();
    let formatter = useDateFormatter({ dateStyle: "full" });
    const { id } = useParams();
    const station = useSelector((state: any) => state.rootReducer.netatmo.stations,)
        .filter((s: any) => s.home_id === id)[0];

    return (
        <DefaultLayout supabase={supabase}>
            <div className="w-2/3 mx-auto">
                <Input
                    isClearable
                    isRequired
                    classNames={styles.textInputStyle}
                    label="Hendelse"
                    type="text"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    onClear={() => setEvent("")}
                />
                <Spacer y={1} />
                <I18nProvider locale="no-NB">
                    <DateInput
                        label="Dato for hendelse"
                        value={eventDate}
                        onChange={setEventDate}

                    />
                </I18nProvider>
                <p className="text-default-500 text-sm">
                    Valgt dato: {eventDate ? formatter.format(eventDate.toDate(getLocalTimeZone())) : "--"}
                </p>
                <Button color="primary" onClick={async () => {
                    const { error } = await supabase
                        .from("user_events")
                        .insert({
                            event_text: event,
                            event_date: eventDate.toString(),
                            device_id: station.home_id
                        }).select()
                    console.log(error)
                    navigate(routes.device.replace(":id", station.home_id))
                }}>Opprett hendelse</Button>

            </div>
        </DefaultLayout>
    )
}