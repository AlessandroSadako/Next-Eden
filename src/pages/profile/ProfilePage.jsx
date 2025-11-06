import "../../allcss/ProfilePage.css";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import UploadAvatar from "../../components/UploadAvatar";
import { useSession } from "../../context/SessionProvider";

export default function ProfilePage() {
  const { user, loading: sessionLoading } = useSession();
  const [form, setForm] = useState({ username: "", avatar_url: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error;
        setForm({
          username: data?.username || "",
          avatar_url: data?.avatar_url || "",
        });
      } catch (err) {
        setMsg({
          type: "danger",
          text: err.message || "Errore caricamento profilo",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSave(e) {
    e.preventDefault();
    if (!user) return;
    setMsg(null);
    setSaving(true);

    try {
      const updates = {
        id: user.id,
        username: form.username || null,
        avatar_url: form.avatar_url || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      setMsg({ type: "success", text: "Profilo aggiornato!" });
    } catch (err) {
      setMsg({
        type: "danger",
        text: err.message || "Errore salvataggio profilo",
      });
    } finally {
      setSaving(false);
    }
  }

  if (sessionLoading || loading) {
    return (
      <div className="container py-4">
        <div className="text-muted">Caricamento profilo...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning mb-0">
          Devi effettuare il login per visualizzare il profilo.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 profile-container">
      <h2 className="mb-3">Il mio profilo</h2>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <form onSubmit={onSave} className="vstack gap-3">
        <div>
          <label className="form-label fw-semibold">Avatar</label>
          <UploadAvatar
            url={form.avatar_url}
            onUpload={(publicUrl) =>
              setForm((s) => ({ ...s, avatar_url: publicUrl }))
            }
          />
          {form.avatar_url && (
            <div className="form-text">
              URL avatar salvato:{" "}
              <code className="user-select-all">{form.avatar_url}</code>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="username" className="form-label fw-semibold">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="form-control"
            value={form.username}
            onChange={onChange}
            placeholder="Il tuo username"
            autoComplete="nickname"
          />
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Salvataggio..." : "Salva profilo"}
          </button>
        </div>
      </form>
    </div>
  );
}
