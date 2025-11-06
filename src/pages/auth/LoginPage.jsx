import "../../allcss/LoginPage.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Inserisci un'email valida"),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErrors({});

    const validation = loginSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword(form);
      if (error) throw error;
      setMsg({ type: "success", text: "Login effettuato!" });
      navigate("/");
    } catch (err) {
      setMsg({ type: "danger", text: err.message || "Errore di login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 auth-container">
      <h2 className="mb-3">Accedi</h2>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <form onSubmit={onSubmit} className="vstack gap-3">
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={form.email}
            onChange={onChange}
            autoComplete="email"
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email[0]}</div>
          )}
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            value={form.password}
            onChange={onChange}
            autoComplete="current-password"
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password[0]}</div>
          )}
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Attendere..." : "Accedi"}
        </button>
      </form>

      <p className="mt-3 mb-0">
        Non hai un account? <Link to="/auth/signup">Registrati</Link>
      </p>
    </div>
  );
}
