import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username || "Learner";
  return <div className="page-stack">
    <header className="page-heading"><div><p className="section-kicker">YOUR ACCOUNT</p><h1>Profile</h1><p>Manage your learning identity and find your next step.</p></div></header>
    <section className="profile-panel">
      <div className="profile-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
      <div className="profile-details"><span className="role-badge">{user?.role || "student"}</span><h2>{displayName}</h2><p>@{user?.username}</p><p>{user?.email || "No email address on file"}</p></div>
    </section>
    <section className="profile-next"><div><p className="section-kicker">KEEP LEARNING</p><h2>Your next step</h2><p>Choose a topic, follow the algorithm one step at a time, and try a challenge when you’re ready.</p></div><div className="profile-actions"><Link className="btn-primary" to="/algorithms">Browse algorithms</Link><Link className="btn-secondary" to="/challenges">Try a challenge</Link></div></section>
  </div>;
}
