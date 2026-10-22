import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AchievementCard from "../components/AchievementCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { listAchievements } from "../services/achievements";
import { getMyScores, getProgressSummary } from "../services/progress";

const FILTERS = ["All badges", "Unlocked", "In progress"];

function getProgress(achievement, summary, scores) {
  switch (achievement.code) {
    case "first-steps": {
      const current = Math.min(1, summary.algorithms_completed + summary.challenges_completed);
      return { current, goal: 1, label: "Complete a visualization or solve a challenge" };
    }
    case "challenge-winner":
      return { current: Math.min(1, summary.challenges_completed), goal: 1, label: "Solve a challenge correctly" };
    case "perfect-score":
      return { current: Math.max(0, ...scores.map((score) => score.total_score)), goal: 100, label: "Best challenge score" };
    case "five-challenges":
      return { current: Math.min(5, scores.length), goal: 5, label: "Challenge attempts submitted" };
    case "seven-day-streak":
      return { current: Math.min(7, summary.current_streak), goal: 7, label: "Consecutive active days" };
    default:
      return null;
  }
}

export default function Achievements() {
  const [filter, setFilter] = useState("All badges");
  const { data, loading, error, refetch } = useFetch(async () => {
    const [achievementData, summary, scoreData] = await Promise.all([
      listAchievements(), getProgressSummary(), getMyScores(),
    ]);
    return {
      achievements: achievementData?.results || achievementData || [],
      summary,
      scores: scoreData?.results || scoreData || [],
    };
  }, []);

  const achievements = useMemo(() => data?.achievements || [], [data]);
  const unlocked = achievements.filter((item) => item.unlocked);
  const filtered = useMemo(() => achievements.filter((item) => {
    if (filter === "Unlocked") return item.unlocked;
    if (filter === "In progress") return !item.unlocked;
    return true;
  }), [achievements, filter]);
  const summary = data?.summary || { algorithms_completed: 0, challenges_completed: 0, current_streak: 0 };
  const scores = data?.scores || [];
  const nextBadge = achievements.find((item) => !item.unlocked);

  if (loading) return <LoadingSpinner label="Loading your achievements..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="achievements-page">
      <header className="achievement-hero">
        <div>
          <p className="section-kicker">YOUR MILESTONES</p>
          <h1>Achievements</h1>
          <p>Every visualization, challenge, and learning streak moves you forward.</p>
        </div>
        <div className="achievement-total"><span aria-hidden="true">🏆</span><strong>{unlocked.length}<small> / {achievements.length}</small></strong><small>badges earned</small></div>
      </header>

      <section className="achievement-overview" aria-label="Learning progress">
        <article><span className="overview-icon">✨</span><div><small>Badges earned</small><strong>{unlocked.length} <span>of {achievements.length}</span></strong></div></article>
        <article><span className="overview-icon">📚</span><div><small>Visualizations completed</small><strong>{summary.algorithms_completed}</strong></div></article>
        <article><span className="overview-icon">🔥</span><div><small>Current learning streak</small><strong>{summary.current_streak} <span>{summary.current_streak === 1 ? "day" : "days"}</span></strong></div></article>
      </section>

      {nextBadge && <section className="achievement-next">
        <div><p className="section-kicker">UP NEXT</p><h2>{nextBadge.name}</h2><p>{nextBadge.description}</p></div>
        <div className="achievement-next-actions"><Link className="btn-primary" to={nextBadge.code === "seven-day-streak" ? "/algorithms" : "/challenges"}>{nextBadge.code === "seven-day-streak" ? "Keep learning" : "Try a challenge"}</Link></div>
      </section>}

      <div className="achievement-list-heading"><div><h2>Your badge collection</h2><p>{unlocked.length === achievements.length ? "You have unlocked every badge!" : `${achievements.length - unlocked.length} milestones left to earn`}</p></div>
        <div className="achievement-filters" role="group" aria-label="Filter achievements">
          {FILTERS.map((item) => <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}{item === "Unlocked" ? ` (${unlocked.length})` : ""}</button>)}
        </div>
      </div>

      {filtered.length ? <div className="achievement-grid">
        {filtered.map((achievement) => <AchievementCard key={achievement.code} achievement={achievement} progress={getProgress(achievement, summary, scores)} />)}
      </div> : <div className="achievement-empty"><span aria-hidden="true">🏅</span><h2>No badges in this view yet</h2><p>Complete a challenge or algorithm activity to unlock your first milestone.</p><Link className="btn-primary" to="/challenges">Explore challenges</Link></div>}
    </div>
  );
}
