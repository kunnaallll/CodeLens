import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { listAlgorithms } from "../services/algorithms";
import { getMyProgress, getProgressSummary } from "../services/progress";
import { listChallenges } from "../services/challenges";
import { getAnalytics } from "../services/analytics";

export default function Dashboard() {
  const { user } = useAuth();
  const algorithms = useFetch(listAlgorithms, []);
  const progress = useFetch(getMyProgress, []);
  const summary = useFetch(getProgressSummary, []);
  const challenges = useFetch(listChallenges, []);
  const analytics = useFetch(getAnalytics, []);
  const requests = [algorithms, progress, summary, challenges, analytics];
  if (requests.some((request) => request.loading)) return <p className="state-panel">Loading your learning data…</p>;
  const failed = requests.find((request) => request.error);
  if (failed) return <p className="state-panel api-error" role="alert">{failed.error}</p>;

  const rows = progress.data?.results || progress.data || [];
  const completed = rows.filter((item) => item.completed);
  const allAlgorithms = algorithms.data || [];
  const challengeRows = challenges.data?.results || challenges.data || [];
  const progressSummary = summary.data;
  const weakAreas = analytics.data.weak_areas || [];

  return <div className="dashboard-content">
    <section className="welcome-banner"><div><p className="eyebrow">YOUR LEARNING SPACE</p><h1>Welcome back, {user?.first_name || user?.username}</h1><p>Pick up where you left off and keep learning.</p></div></section>
    <section className="stats-grid">
      <article className="stat-card"><span className="stat-label">Algorithms completed</span><strong>{progressSummary.algorithms_completed} / {allAlgorithms.length}</strong></article>
      <article className="stat-card"><span className="stat-label">Challenges completed</span><strong>{progressSummary.challenges_completed} / {challengeRows.length}</strong></article>
      <article className="stat-card"><span className="stat-label">Learning streak</span><strong>{progressSummary.current_streak} days</strong></article>
      <article className="stat-card"><span className="stat-label">Points earned</span><strong>{progressSummary.total_score}</strong></article>
    </section>
    <section className="algorithms-section">
      <div className="section-heading"><div><p className="section-kicker">LEARN BY DOING</p><h2>Explore algorithms</h2></div><Link to="/algorithms">Open library →</Link></div>
      {!allAlgorithms.length ? <div className="state-panel">The backend has no algorithms seeded yet.</div> : <div className="algorithm-grid">{allAlgorithms.map((item) => <article className="algorithm-card" key={item.id}><h3>{item.name}</h3><p>{item.description}</p><div className="complexities"><span><small>TIME</small><strong>{item.time_complexity}</strong></span><span><small>SPACE</small><strong>{item.space_complexity}</strong></span></div><Link className="card-action" to={`/visualizer/${item.slug}`}>Open visualizer →</Link></article>)}</div>}
    </section>
    <section className="dashboard-insights"><div><p className="section-kicker">AREAS TO PRACTICE</p><h2>{weakAreas.length ? weakAreas.join(", ") : "Keep up the good work"}</h2><p>{weakAreas.length ? "Try a few more runs and challenges in these topics." : "Your analytics will highlight topics as you build activity."}</p></div><Link className="btn-secondary" to="/analytics">View analytics</Link><Link className="btn-primary" to="/challenges">Practice challenges</Link></section>
    <section id="progress" className="algorithms-section"><h2>Your saved algorithm progress</h2>{completed.length ? <ul>{completed.map((item) => <li key={item.id}>{item.algorithm_name || `Algorithm #${item.algorithm}`} — completed (score {item.score})</li>)}</ul> : <p>No completed algorithm runs recorded yet.</p>}</section>
  </div>;
}
