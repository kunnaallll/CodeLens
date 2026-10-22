import { Link, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Algorithms from "./pages/Algorithms";
import Visualizer from "./pages/Visualizer";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import Analytics from "./pages/Analytics";
import AlgorithmDetail from "./pages/AlgorithmDetail";
import Playground from "./pages/Playground";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import DataStructures from "./pages/DataStructures";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import "./App.css";

function AppFrame() {
  const { user, logout } = useAuth();
  const name = user?.first_name || user?.username || "Learner";
  const initials = name.slice(0, 1).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link to="/dashboard" className="dashboard-brand"><span className="brand-mark">C</span><span>CodeLens</span></Link>
        <p className="sidebar-label">YOUR WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <NavLink to="/dashboard"><span aria-hidden="true">⌂</span>Dashboard</NavLink>
          <NavLink to="/algorithms"><span aria-hidden="true">⌘</span>Algorithms</NavLink>
          <NavLink to="/data-structures"><span aria-hidden="true">▦</span>Data structures</NavLink>
          <NavLink to="/challenges"><span aria-hidden="true">◎</span>Challenges</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          <NavLink to="/playground">Code playground</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/achievements">Achievements</NavLink>
          {user?.role === "admin" && <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer">Admin panel</a>}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-mini"><span className="avatar">{initials}</span><span><strong>{name}</strong><small>{user?.role || "student"}</small></span></div>
          <button className="sidebar-logout" onClick={logout}>Sign out</button>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="topbar"><span>Learning workspace <b>/</b> CodeLens</span><div className="topbar-user"><span className="avatar">{initials}</span><span>{name}</span><Link className="topbar-profile" to="/profile">Account</Link></div></header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/data-structures" element={<DataStructures />} />
            <Route path="/algorithms/:slug" element={<AlgorithmDetail />} />
            <Route path="/visualizer/:algorithm" element={<Visualizer />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:slug" element={<ChallengeDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
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

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}
