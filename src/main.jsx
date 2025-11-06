import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Routing from "./routes/Routing";
import { SessionProvider } from "./context/SessionProvider";
import { FavoritesProvider } from "./context/FavoritesContext";
import "./index.css";
import "./supabase/supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionProvider>
      <FavoritesProvider>
        <Routing />
      </FavoritesProvider>
    </SessionProvider>
  </StrictMode>
);
