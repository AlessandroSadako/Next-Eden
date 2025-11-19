import { useState } from "react";
import "../../allcss/SignUpPage.css";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import { z } from "zod";

const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "L'username deve avere almeno 3 caratteri")
      .max(20, "L'username non può superare i 20 caratteri"),
    email: z.string().email("Inserisci un'email valida"),
    password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErrors({});

    const validation = signupSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) throw authError;

      setMsg({
        type: "success",
        text: "Registrazione completata! Controlla la tua email per verificare l'account.",
      });
      setForm({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setMsg({
        type: "danger",
        text: err.message || "Errore di registrazione",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 auth-container">
      <h2 className="mb-3">Registrati</h2>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <form onSubmit={onSubmit} className="vstack gap-3" noValidate>
        <div className="has-validation-tooltip">
          <label htmlFor="username" className="form-label">
            Username <span className="text-danger">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            value={form.username}
            onChange={onChange}
            autoComplete="username"
            placeholder="Scegli un username"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <span id="username-error" className="validation-tooltip">
              {errors.username[0]}
            </span>
          )}
        </div>

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
            aria-describedby={errors.email ? "signup-email-error" : undefined}
          />
          {errors.email && (
            <span id="signup-email-error" className="validation-tooltip">
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
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "signup-password-error" : undefined
            }
          />
          {errors.password && (
            <span id="signup-password-error" className="validation-tooltip">
              {errors.password[0]}
            </span>
          )}
        </div>

        <div className="has-validation-tooltip">
          <label htmlFor="confirmPassword" className="form-label">
            Conferma Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
            value={form.confirmPassword}
            onChange={onChange}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
          />
          {errors.confirmPassword && (
            <span id="confirm-password-error" className="validation-tooltip">
              {errors.confirmPassword[0]}
            </span>
          )}
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Attendere..." : "Registrati"}
        </button>
      </form>

      <p className="mt-3 mb-0 auth-cta">
        Hai già un account?{" "}
        <Link to="/auth/login" className="auth-cta-link">
          Accedi
        </Link>
      </p>
    </div>
  );
}
