import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import ChartCard from "../charts/ChartCard";
import ScoreHistoryChart from "../charts/ScoreHistoryChart";
import TopicPerformanceChart from "../charts/TopicPerformanceChart";
import WeeklyActivityChart from "../charts/WeeklyActivityChart";
import { useFetch } from "../hooks/useFetch";
import { getAnalytics } from "../services/analytics";

export default function Analytics() {
  const { data: analytics, loading, error, refetch } = useFetch(getAnalytics, []);

  if (loading) return <LoadingSpinner label="Crunching your analytics..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="analytics-page">
      <header className="page-heading"><p className="section-kicker">YOUR LEARNING DATA</p><h1>Analytics</h1><p>Your learning patterns, generated from real activity.</p></header>

      <div className="analytics-stats">
        <div className="analytics-stat">
          <p>Overall accuracy</p>
          <p className="text-2xl font-bold text-ink-900">{analytics.accuracy}%</p>
        </div>
        <div className="analytics-stat">
          <p>Weak areas</p>
          <p className="text-lg font-semibold text-rose-600">{analytics.weak_areas.join(", ") || "None — great job!"}</p>
        </div>
        <div className="analytics-stat">
          <p>Submissions tracked</p>
          <p className="text-2xl font-bold text-ink-900">{analytics.score_history.length}</p>
        </div>
      </div>

      <div className="analytics-chart-grid">
        <ChartCard title="Weekly Activity" isEmpty={!analytics.has_data}>
          <WeeklyActivityChart data={analytics.weekly_activity} />
        </ChartCard>
        <ChartCard title="Score History" isEmpty={analytics.score_history.length === 0}>
          <ScoreHistoryChart data={analytics.score_history} />
        </ChartCard>
        <ChartCard title="Algorithm Completion by Category" isEmpty={!analytics.algorithm_completion.some((item) => item.total)}>
          <TopicPerformanceChart data={analytics.algorithm_completion} dataKey="completed" nameKey="category" label="Completed" />
        </ChartCard>
        <ChartCard title="Challenge Performance by Difficulty" isEmpty={analytics.score_history.length === 0}>
          <TopicPerformanceChart data={analytics.challenge_performance} dataKey="average_score" nameKey="difficulty" label="Avg Score" />
        </ChartCard>
      </div>

      <ChartCard title="Topic-wise Performance" isEmpty={analytics.score_history.length === 0}>
        <TopicPerformanceChart data={analytics.topic_performance} dataKey="average_score" nameKey="category" label="Avg Score" />
      </ChartCard>
    </div>
  );
}
