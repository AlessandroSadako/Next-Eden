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
        <div className="has-validation-tooltip">
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
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="validation-tooltip">
              {errors.email[0]}
            </span>
          )}
        </div>

        <div className="has-validation-tooltip">
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
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <span id="password-error" className="validation-tooltip">
              {errors.password[0]}
            </span>
          )}
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Attendere..." : "Accedi"}
        </button>
      </form>

      <p className="mt-3 mb-0 auth-cta">
        Non hai ancora un account?{" "}
        <Link to="/auth/signup" className="auth-cta-link">
          Registrati ora
        </Link>
      </p>
    </div>
  );
}
