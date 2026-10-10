import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Algorithms from "./pages/Algorithms";
import Visualizer from "./pages/Visualizer";
import Challenges from "./pages/Challenges";
import NotFound from "./pages/NotFound";
import "./App.css";

function AppFrame() {
  const { user, logout } = useAuth();
  return <div className="app-frame">
    <header className="app-header"><Link to="/dashboard" className="dashboard-brand"><span className="brand-mark">C</span> CodeLens</Link><nav><Link to="/dashboard">Dashboard</Link><Link to="/algorithms">Algorithms</Link><Link to="/challenges">Challenges</Link></nav><div className="topbar-user">{user?.username}<button onClick={logout}>Sign out</button></div></header>
    <main className="app-content"><Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/algorithms" element={<Algorithms />} />
      <Route path="/algorithms/:slug" element={<Visualizer />} />
      <Route path="/visualizer/:algorithm" element={<Visualizer />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="*" element={<NotFound />} />
    </Routes></main>
  </div>;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <main className="auth-shell"><p className="loading">Loading your account…</p></main>;
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <main className="auth-shell"><section className="auth-card"><div className="brand-mark">C</div><p className="eyebrow">CODELENS · LEARN BY SEEING</p><Login /></section></main>} />
    <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <main className="auth-shell"><section className="auth-card"><div className="brand-mark">C</div><p className="eyebrow">CODELENS · LEARN BY SEEING</p><Register /></section></main>} />
    <Route element={<ProtectedRoute />}><Route path="/*" element={<AppFrame />} /></Route>
  </Routes>;
}

export default function App() { return <AuthProvider><AppRoutes /></AuthProvider>; }
