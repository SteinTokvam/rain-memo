import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type NetatmoInfo = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
};

export type Device = {
  _id: string;
  station_name: string;
  date_setup: number;
  last_setup: number;
  type: string;
  last_status_store: number;
  module_name: string;
  firmware: number;
  wifi_status: number;
  reachable: boolean;
  co2_calibrating: boolean;
  data_type: string[];
  place: DeviceLocation;
  invitation_disable: boolean;
  home_id: string;
  home_name: string;
  read_only: boolean;
  dashboard_data: DashboardData;
  modules: Module[];
};

export type DeviceLocation = {
  altitude: number;
  city: string;
  street: string;
  country: string;
  timezone: string;
  location: number[];
};

export type DashboardData = {
  time_utc: number;
  Temperature: number;
  CO2: number;
  Rain: number;
  sum_rain_1: number;
  sum_rain_24: number;
  Humidity: number;
  Noise: number;
  Pressure: number;
  AbsolutePressure: number;
  min_temp: number;
  max_temp: number;
  date_max_temp: number;
  date_min_temp: number;
  temp_trend: string;
  pressure_trend: string;
};

export type Module = {
  _id: string;
  type: string;
  module_name: string;
  last_setup: number;
  data_type: string[];
  battery_percent: number;
  reachable: boolean;
  firmware: number;
  last_message: number;
  last_seen: number;
  rf_status: number;
  battery_vp: number;
  dashboard_data: DashboardData;
};
