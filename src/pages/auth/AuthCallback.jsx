import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (error) throw error;
      } catch (err1) {
        try {
          const sp = new URLSearchParams(window.location.search);
          const code = sp.get("code");
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;
          }
        } catch (err2) {
          console.error("Auth callback error:", err2?.message || err2);
        }
      } finally {
        if (active) navigate("/", { replace: true });
      }
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="container py-5 text-center">
      <h2 className="mb-3">Verifica in corso…</h2>
      <p className="mb-0">
        Attendi qualche istante, ti stiamo reindirizzando alla homepage.
      </p>
    </div>
  );
}
