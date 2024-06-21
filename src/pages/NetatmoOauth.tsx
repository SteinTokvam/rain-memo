import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { getNetatmoClientIdAndSecret, routes } from "@/global";

export default function NetatmoOauth({
  supabase,
}: {
  supabase: SupabaseClient;
}) {

  const redirect_uri = "https://rain-memo-steintokvams-projects.vercel.app" + routes.netatmoRedirect;
  const scope = "read_station";
  const state = uuidv4();

  useEffect(() => {
    localStorage.setItem("state", state);
    getNetatmoClientIdAndSecret(supabase).then((res) => {
      if (res.error) {
        console.error(res.error);

        return;
      }
      window.location.href = `https://api.netatmo.com/oauth2/authorize?client_id=${res.data ? res.data.client_id : ""}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;
    });
  }, []);

  return <div>Redirecting to Netatmo for authentication...</div>;
}
