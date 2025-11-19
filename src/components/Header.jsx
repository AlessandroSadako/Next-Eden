import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { useSession } from "../context/SessionProvider";
import { useFavorites } from "../context/FavoritesContext";
import { useEffect, useRef, useState } from "react";
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

  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav className="navbar navbar-expand navbar-dark px-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <img className="logonavbar" src="/nextedenlogo.png" alt="Next Eden" />
        </Link>
        <div className="flex-grow-1 px-3 d-none d-md-block searchbar-inline">
          <SearchBar value={q} onChange={setQ} onSubmit={onSearchSubmit} />
        </div>

        <div className="d-flex align-items-center ms-auto gap-3">
          {user && (
            <div className="user-menu position-relative" ref={menuRef}>
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
                <div
                  className="user-dropdown"
                  role="menu"
                  aria-label="Menu utente"
                >
                  <div
                    className="user-dropdown-header text-truncate"
                    title={username || user.email}
                  >
                    {username || user.email}
                  </div>
                  <Link
                    className="user-dropdown-item"
                    to="/profile"
                    onClick={() => setOpen(false)}
                  >
                    <span className="udi-icon" aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.418 0-8 2.91-8 6.5V22h16v-1.5C20 16.91 16.418 14 12 14z" />
                      </svg>
                    </span>
                    <span className="udi-label">Profilo</span>
                  </Link>
                  <Link
                    className="user-dropdown-item"
                    to="/favorites"
                    onClick={() => setOpen(false)}
                  >
                    <span className="udi-icon" aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 21s-6.716-4.35-9.428-7.062C.86 12.226 0 10.86 0 9.357 0 6.45 2.318 4 5.143 4 6.86 4 8.43 4.86 9.257 6.257 10.084 4.86 11.654 4 13.371 4 16.196 4 18.514 6.45 18.514 9.357c0 1.503-.86 2.869-2.572 4.581C18.716 16.65 12 21 12 21z" />
                      </svg>
                    </span>
                    <span className="udi-label">Preferiti</span>
                    <span className="udi-badge">{favorites?.length ?? 0}</span>
                  </Link>
                  <button
                    type="button"
                    className="user-dropdown-item"
                    onClick={onLogout}
                  >
                    <span className="udi-icon" aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.41 1.41A7 7 0 0 1 19 12a7 7 0 1 1-11.42-5.42l-1.41-1.41A9 9 0 1 0 21 12c0-2.39-.94-4.68-2.17-6.83z" />
                      </svg>
                    </span>
                    <span className="udi-label">Logout</span>
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
