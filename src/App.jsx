import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { supabase } from "./supabase/supabaseClient";

export default function App() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);
      console.log("🔌 Supabase connection test:", { data, error });
    };
    testConnection();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="d-flex flex-grow-1">
        <div className="bg-light border-end p-3 app-sidebar">
          <Sidebar />
        </div>

        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
}
