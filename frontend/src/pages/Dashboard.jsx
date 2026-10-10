import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { listAlgorithms } from "../services/algorithms";
import { getMyProgress } from "../services/progress";

export default function Dashboard() {
  const { user } = useAuth();
  const algorithms = useFetch(listAlgorithms, []);
  const progress = useFetch(getMyProgress, []);
  if (algorithms.loading || progress.loading) return <p className="state-panel">Loading your learning data…</p>;
  if (algorithms.error || progress.error) return <p className="state-panel api-error" role="alert">{algorithms.error || progress.error}</p>;
  const rows = progress.data?.results || progress.data || [];
  const completed = rows.filter((item) => item.completed);
  const allAlgorithms = algorithms.data || [];
  return <div className="dashboard-content">
    <section className="welcome-banner"><div><p className="eyebrow">YOUR LEARNING SPACE</p><h1>Welcome back, {user?.first_name || user?.username}</h1><p>Pick up where you left off and keep learning.</p></div></section>
    <section className="stats-grid"><article className="stat-card"><span className="stat-label">Available algorithms</span><strong>{allAlgorithms.length}</strong></article><article className="stat-card"><span className="stat-label">Algorithms completed</span><strong>{completed.length}</strong></article><article className="stat-card"><span className="stat-label">Saved score total</span><strong>{completed.reduce((total, item) => total + item.score, 0)}</strong></article></section>
    <section className="algorithms-section"><div className="section-heading"><div><p className="section-kicker">LEARN BY DOING</p><h2>Explore algorithms</h2></div><Link to="/algorithms">Open library →</Link></div>
      {!allAlgorithms.length ? <div className="state-panel">The backend has no algorithms seeded yet.</div> : <div className="algorithm-grid">{allAlgorithms.map((item) => <article className="algorithm-card" key={item.id}><h3>{item.name}</h3><p>{item.description}</p><div className="complexities"><span><small>TIME</small><strong>{item.time_complexity}</strong></span><span><small>SPACE</small><strong>{item.space_complexity}</strong></span></div>{item.name.toLowerCase() === "bubble sort" ? <Link className="card-action" to={`/algorithms/${item.slug}`}>Open visualizer →</Link> : <span className="card-action">Visualizer coming soon</span>}</article>)}</div>}
    </section>
    <section id="progress" className="algorithms-section"><h2>Your saved progress</h2>{completed.length ? <ul>{completed.map((item) => <li key={item.id}>{item.algorithm_name || `Algorithm #${item.algorithm}`} — completed (score {item.score})</li>)}</ul> : <p>No completed algorithm runs recorded yet.</p>}</section>
  </div>;
}
