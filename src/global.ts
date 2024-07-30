import { SupabaseClient } from "@supabase/supabase-js";
import { NetatmoInfo } from "./types";
import { StationData, test, getStationData } from "netatmo-client/src/index";

export const routes = {
  home: "/",
  dashboard: "/dashboard",
  device: "/device/:id",
  events: "/device/:id/events",
  createEvent: "/device/:id/create-event",
  day: "/device/:id/day/:date",
  login: "/login",
  netatmoOauth: "/netatmo/oauth",
  netatmoRedirect: "/netatmo/redirect",
  confirmEmail: "/confirm-email",
};

export const rainTableHeaders = (vocabulary: { [key: string]: string }) => {
  return [
    {
      key: "date",
      label: vocabulary["date"],
    },
    {
      key: "amount",
      label: vocabulary["amount"],
    },
  ]
};

export const styles = {
  valueText: "text-large font-bold leading-none text-default-400",
  valueHeaderText: "text-medium font-semibold leading-none text-default-600",
  textInputStyle: {
    label: "text-black/50 dark:text-white/90",
    input: [
      "bg-transparent",
      "text-black/90 dark:text-white/90",
      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
    ],
    innerWrapper: "bg-transparent",
    inputWrapper: [
      "shadow-xl",
      "bg-default-200/50",
      "dark:bg-default/60",
      "backdrop-blur-xl",
      "backdrop-saturate-200",
      "hover:bg-default-200/70",
      "dark:hover:bg-default/70",
      "group-data-[focused=true]:bg-default-200/50",
      "dark:group-data-[focused=true]:bg-default/60",
      "!cursor-text",
    ],
  },
};

export const netatmo_base_url = "https://api.netatmo.com";

export async function getNetatmoClientIdAndSecret(
  supabase: SupabaseClient,
): Promise<{ data: NetatmoInfo | null; error: any }> {
  const { data, error } = await supabase.from("netatmo_app_info").select();

  if (error) {
    console.log(error);

    return { data: null, error };
  }

  return {
    data: {
      client_id: data[0].client_id,
      client_secret: data[0].client_secret,
      redirect_uri: data[0].redirect_uri,
    },
    error: null,
  };
}

async function updateNetatmoInfo(
  id: string,
  data: { access_token: string; refresh_token: string; expires_in: number },
  supabase: SupabaseClient,
) {
  return await supabase
    .from("netatmo_user_info")
    .update({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    })
    .eq("id", id)
    .select();
}

async function refreshNetatmoToken(
  id: string,
  refresh_token: string,
  supabase: SupabaseClient,
) {
  return await getNetatmoClientIdAndSecret(supabase).then(({ data, error }) => {
    if (error) {
      console.log(error);

      return;
    }

    return (
      data &&
      fetch("https://api.netatmo.com/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token,
          client_id: data.client_id,
          client_secret: data.client_secret,
        }),
      })
        .then((res: any) => res.json())
        .then(
          (data: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
          }) => {
            console.log("Refreshed token", data);
            updateNetatmoInfo(id, data, supabase).then((res) =>
              console.log(res),
            );

            return data;
          },
        )
    );
  });
}

export async function getNetatmoUserData(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("netatmo_user_info").select();

  if (error || data.length === 0) {
    console.log(error);

    return { data: null, error: "No netatmo data found." };
  }

  if (data[0].expires_at < Date.now()) {
    return refreshNetatmoToken(
      data[0].id,
      data[0].refresh_token,
      supabase,
    ).then((data: any) => {
      console.log("Refreshed token");

      if (data.error) {
        console.error("Failed to refresh token", data.error)
      }

      return data
        ? {
          data: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: Date.now() + data.expires_in * 1000,
          },
          error: null,
        }
        : { data: null, error: "No netatmo data found." };
    });
  }

  return {
    data: {
      access_token: data[0].access_token,
      refresh_token: data[0].refresh_token,
      expires_at: data[0].expires_at,
    },
    error: null,
  };
}

export function teste(supabase: SupabaseClient) {
  getNetatmoClientIdAndSecret(supabase).then(({ data, error }) => {
    if(error) {
      console.log(error)
    }
    if(data) {
      console.log(data)
      //new NetatmoApiClient(data.client_id, data.client_secret).getStationData().then((data: StationData) => console.log(data))
      const stationData = getStationData(false, data.client_id, data.client_secret, "")
      console.log(test())
      console.log({} as StationData)
      //client.getStationData().then((station: StationData) => console.log(station))
    }
  })
}