import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import { extractErrorMessage } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.username, form.password);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-ink-900">Sign in</h2>
      <p className="mb-6 text-sm text-ink-500">Continue your learning journey.</p>

      {error && <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Username</label>
          <input
            className="input"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoFocus
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-4 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500">
        Demo accounts — student: <span className="font-mono">demo / Demo@12345</span> · admin:{" "}
        <span className="font-mono">admin / Admin@12345</span>
      </div>

      <p className="mt-5 text-center text-sm text-ink-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-brand-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
