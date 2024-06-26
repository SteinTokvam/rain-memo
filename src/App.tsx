import { Route, Routes } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

import Device from "./pages/Device";
import Day from "./pages/Day";
import Auth from "./pages/Auth";
import { routes } from "./global";
import Home from "./pages/Home";
import NetatmoOauth from "./pages/NetatmoOauth";
import NetatmoRedirect from "./pages/NetatmoRedirect";

import Dashboard from "@/pages/Dashboard";
import ConfirmEmail from "./pages/ConfirmEmail";

function App() {
  const supabase = createClient(
    "https://dezjrltoowqjcqiaqaog.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlempybHRvb3dxamNxaWFxYW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgyNzU1ODgsImV4cCI6MjAzMzg1MTU4OH0._xRblWp3U9fWgvYE6ntC61qNYzb_Hku9HQFaOw1B63c",
  );

  return (
    <Routes>
      <Route element={<Home supabase={supabase} />} path={routes.home} />
      <Route
        element={
          <Auth supabase={supabase}>
            <Dashboard supabase={supabase} />
          </Auth>
        }
        path={routes.dashboard}
      />
      <Route
        element={
          <Auth supabase={supabase}>
            <Device supabase={supabase} />
          </Auth>
        }
        path={routes.device}
      />
      <Route
        element={
          <Auth supabase={supabase}>
            <Day supabase={supabase} />
          </Auth>
        }
        path={routes.day}
      />
      <Route
        element={
          <Auth supabase={supabase}>
            <NetatmoOauth supabase={supabase} />
          </Auth>
        }
        path={routes.netatmoOauth}
      />
      <Route
        element={
          <Auth supabase={supabase}>
            <NetatmoRedirect supabase={supabase} />
          </Auth>
        }
        path={routes.netatmoRedirect}
      />
      <Route element={<ConfirmEmail supa/>} path={routes.confirmEmail} />
    </Routes>
  );
}

export default App;
