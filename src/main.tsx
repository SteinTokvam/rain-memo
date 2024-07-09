import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import './i18n';

ReactDOM.createRoot(document.getElementById("root")!).render(

    <BrowserRouter>
      <Provider>
        <Analytics />
        <App />
      </Provider>
    </BrowserRouter>

);
