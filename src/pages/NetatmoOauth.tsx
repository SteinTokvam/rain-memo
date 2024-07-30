import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { getNetatmoClientIdAndSecret, routes } from "@/global";
import { useTranslation } from "react-i18next";

export default function NetatmoOauth({
  supabase,
}: {
  supabase: SupabaseClient;
}) {

  const scope = "read_station";
  const state = uuidv4();
  const { t } = useTranslation();
  localStorage.setItem("state", state);
  
  useEffect(() => {
    getNetatmoClientIdAndSecret(supabase).then((res) => {
      if (res.error) {
        console.error(res.error);

        return;
      }
      if(res.data) {
        window.location.href = `https://api.netatmo.com/oauth2/authorize?client_id=${res.data.client_id}&redirect_uri=${res.data.redirect_uri}&scope=${scope}&state=${state}`;
      } else {
        console.error("No Netatmo credentials found in database.");
      }
    });
  }, []);

  return <div>{t('oAuthRedirecting')}</div>;
}
