import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { useSession } from "../context/SessionProvider";
import { useFavorites } from "../context/FavoritesContext";
import { useState } from "react";
import SearchBar from "./SearchBar";
import "../allcss/Header.css";

export default function Header() {
  const { user, username, avatarUrl } = useSession();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    await supabase.auth.signOut();
  };

  const onSearchSubmit = (e) => {
    e?.preventDefault?.();
    const query = q.trim();
    if (query) navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="navbar navbar-expand navbar-dark px-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <img className="logonavbar" src="/nextedenlogo.png" alt="Next Eden" />
        </Link>

        {/* Search in navbar */}
        <div className="flex-grow-1 px-3 d-none d-md-block searchbar-inline">
          <SearchBar value={q} onChange={setQ} onSubmit={onSearchSubmit} />
        </div>

        <div className="d-flex align-items-center ms-auto gap-3">
          {user && (
            <div className="user-menu position-relative">
              <button
                className="avatar-button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label="Apri menu utente"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="avatar-image" />
                ) : (
                  <img
                    src="/nextedenimg.png"
                    alt="Avatar default"
                    className="avatar-image"
                  />
                )}
              </button>
              {open && (
                <div className="user-dropdown">
                  <div className="px-3 py-2 border-bottom text-truncate">
                    {username || user.email}
                  </div>
                  <Link
                    className="dropdown-item"
                    to="/profile"
                    onClick={() => setOpen(false)}
                  >
                    Profilo
                  </Link>
                  <Link
                    className="dropdown-item d-flex justify-content-between"
                    to="/favorites"
                    onClick={() => setOpen(false)}
                  >
                    Preferiti{" "}
                    <span className="badge bg-warning text-dark">
                      {favorites?.length ?? 0}
                    </span>
                  </Link>
                  <button
                    className="dropdown-item text-danger"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!user && (
            <>
              <Link className="btn btn-outline-light btn-sm" to="/auth/login">
                Accedi
              </Link>
              <Link className="btn btn-warning btn-sm" to="/auth/signup">
                Registrati
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
