import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import "../allcss/Layout.css";
import { ToastsProvider } from "../context/ToastsContext";

export default function Layout() {
  const location = useLocation();
  const hideSidebarRoutes = [
    "/profile",
    "/auth/login",
    "/auth/signup",
    "/auth/callback",
    "/chat",
    "/favorites",
  ];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <ToastsProvider>
      <div className="d-flex flex-column min-vh-100 layout-wrapper">
        <Header />

        <div className="container-fluid flex-grow-1">
          <div className="row">
            {!shouldHideSidebar && (
              <aside className="col-12 col-md-3 col-lg-2 border-end p-3 layout-sidebar">
                <Sidebar />
              </aside>
            )}
            <main
              className={`py-4 layout-main ${
                shouldHideSidebar ? "col-12" : "col-12 col-md-9 col-lg-10"
              }`}
            >
              <Outlet />
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </ToastsProvider>
  );
}
