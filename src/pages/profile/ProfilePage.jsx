import "../../allcss/ProfilePage.css";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../supabase/supabaseClient";
import UploadAvatar from "../../components/UploadAvatar";
import { useSession } from "../../context/SessionProvider";

export default function ProfilePage() {
  const { user, loading: sessionLoading } = useSession();
  const [form, setForm] = useState({ username: "", avatar_url: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const uploadAvatarRef = useRef(null);
  const [emailValue, setEmailValue] = useState("");
  const [emailErrors, setEmailErrors] = useState({});
  const [emailLoading, setEmailLoading] = useState(false);
  const [pwd, setPwd] = useState({ current: "", password: "", confirm: "" });
  const [pwdErrors, setPwdErrors] = useState({});
  const [pwdLoading, setPwdLoading] = useState(false);

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
        setEmailValue(user.email || "");
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

  async function onChangeEmailSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setMsg(null);
    setEmailErrors({});
    const newEmail = (emailValue || "").trim();
    if (!newEmail) {
      setEmailErrors({ email: ["Inserisci una email valida"] });
      return;
    }
    if ((user.email || "").trim().toLowerCase() === newEmail.toLowerCase()) {
      setEmailErrors({ email: ["Inserisci una nuova email"] });
      return;
    }

    try {
      setEmailLoading(true);
      const { error } = await supabase.auth.updateUser(
        { email: newEmail },
        { emailRedirectTo: `${window.location.origin}/auth/callback` }
      );
      if (error) throw error;
      setMsg({
        type: "success",
        text: "Email aggiornata! Controlla la nuova casella per confermare la modifica.",
      });
    } catch (err) {
      setMsg({
        type: "danger",
        text: err.message || "Errore aggiornamento email",
      });
    } finally {
      setEmailLoading(false);
    }
  }

  async function onChangePasswordSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setMsg(null);
    setPwdErrors({});
    const current = (pwd.current || "").trim();
    const password = (pwd.password || "").trim();
    const confirm = (pwd.confirm || "").trim();
    const errs = {};
    if (current.length < 6)
      errs.current = [
        "Inserisci la password attuale corretta (min 6 caratteri)",
      ];
    if (password.length < 6)
      errs.password = ["La password deve avere almeno 6 caratteri"];
    if (confirm !== password) errs.confirm = ["Le password non coincidono"];
    if (Object.keys(errs).length) {
      setPwdErrors(errs);
      return;
    }

    try {
      setPwdLoading(true);
      const email = user?.email;
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (reauthError) {
        setPwdErrors({ current: ["Password attuale errata"] });
        return;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg({ type: "success", text: "Password aggiornata con successo" });
      setPwd({ current: "", password: "", confirm: "" });
    } catch (err) {
      setMsg({
        type: "danger",
        text: err.message || "Errore aggiornamento password",
      });
    } finally {
      setPwdLoading(false);
    }
  }

  async function handleAvatarSelect(file) {
    if (!file || !user) return;
    setMsg(null);
    setSaving(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setForm((s) => ({ ...s, avatar_url: publicUrl }));

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setMsg({ type: "success", text: "Avatar aggiornato!" });
    } catch (err) {
      setMsg({
        type: "danger",
        text: err.message || "Errore caricamento avatar",
      });
    } finally {
      setSaving(false);
    }
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
        <div className="text-gold-dark">Caricamento profilo...</div>
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
    <div className="profile-container">
      <div className="profile-header">
        <div
          className="profile-avatar-wrapper"
          onClick={() => uploadAvatarRef.current?.openFilePicker()}
        >
          <img
            src={form.avatar_url || "/nextedenimg.png"}
            alt="Avatar utente"
            className="profile-avatar"
          />
          <div className="profile-avatar-overlay">
            <span>Cambia avatar</span>
          </div>
        </div>
        <UploadAvatar ref={uploadAvatarRef} onSelect={handleAvatarSelect} />
        <div className="profile-name">
          {form.username && form.username.trim() ? form.username : "Utente"}
        </div>
        <div className="profile-email">{user?.email}</div>
      </div>

      <div className="container py-4" style={{ maxWidth: "720px" }}>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <form onSubmit={onSave} className="vstack gap-3">
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

        <hr className="my-4" />

        <h3 className="mb-3">Cambia email</h3>
        <form
          onSubmit={onChangeEmailSubmit}
          className="vstack gap-3"
          noValidate
        >
          <div className="has-validation-tooltip">
            <label htmlFor="newEmail" className="form-label fw-semibold">
              Nuova email
            </label>
            <input
              id="newEmail"
              type="email"
              className={`form-control ${
                emailErrors.email ? "is-invalid" : ""
              }`}
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              autoComplete="email"
              aria-invalid={!!emailErrors.email}
              aria-describedby={
                emailErrors.email ? "email-change-error" : undefined
              }
            />
            {emailErrors.email && (
              <span id="email-change-error" className="validation-tooltip">
                {emailErrors.email[0]}
              </span>
            )}
          </div>
          <div>
            <button className="btn btn-primary" disabled={emailLoading}>
              {emailLoading ? "Aggiornamento..." : "Aggiorna email"}
            </button>
          </div>
          <p className="small text-gold-dark m-0">
            Dopo l'aggiornamento riceverai una email di conferma all'indirizzo
            indicato.
          </p>
        </form>

        <hr className="my-4" />

        <h3 className="mb-3">Cambia password</h3>
        <form
          onSubmit={onChangePasswordSubmit}
          className="vstack gap-3"
          noValidate
        >
          <div className="has-validation-tooltip">
            <label htmlFor="currentPassword" className="form-label fw-semibold">
              Password attuale
            </label>
            <input
              id="currentPassword"
              type="password"
              className={`form-control ${
                pwdErrors.current ? "is-invalid" : ""
              }`}
              value={pwd.current}
              onChange={(e) =>
                setPwd((s) => ({ ...s, current: e.target.value }))
              }
              autoComplete="current-password"
              aria-invalid={!!pwdErrors.current}
              aria-describedby={
                pwdErrors.current ? "pwd-current-error" : undefined
              }
            />
            {pwdErrors.current && (
              <span id="pwd-current-error" className="validation-tooltip">
                {pwdErrors.current[0]}
              </span>
            )}
          </div>
          <div className="has-validation-tooltip">
            <label htmlFor="newPassword" className="form-label fw-semibold">
              Nuova password
            </label>
            <input
              id="newPassword"
              type="password"
              className={`form-control ${
                pwdErrors.password ? "is-invalid" : ""
              }`}
              value={pwd.password}
              onChange={(e) =>
                setPwd((s) => ({ ...s, password: e.target.value }))
              }
              autoComplete="new-password"
              aria-invalid={!!pwdErrors.password}
              aria-describedby={pwdErrors.password ? "pwd-error" : undefined}
            />
            {pwdErrors.password && (
              <span id="pwd-error" className="validation-tooltip">
                {pwdErrors.password[0]}
              </span>
            )}
          </div>
          <div className="has-validation-tooltip">
            <label htmlFor="confirmPassword" className="form-label fw-semibold">
              Conferma password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`form-control ${
                pwdErrors.confirm ? "is-invalid" : ""
              }`}
              value={pwd.confirm}
              onChange={(e) =>
                setPwd((s) => ({ ...s, confirm: e.target.value }))
              }
              autoComplete="new-password"
              aria-invalid={!!pwdErrors.confirm}
              aria-describedby={
                pwdErrors.confirm ? "pwd-confirm-error" : undefined
              }
            />
            {pwdErrors.confirm && (
              <span id="pwd-confirm-error" className="validation-tooltip">
                {pwdErrors.confirm[0]}
              </span>
            )}
          </div>
          <div>
            <button className="btn btn-primary" disabled={pwdLoading}>
              {pwdLoading ? "Aggiornamento..." : "Aggiorna password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
