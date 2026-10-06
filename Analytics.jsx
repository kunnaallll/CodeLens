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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Analytics</h1>
        <p className="text-sm text-ink-500">Your learning patterns, generated from real activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs text-ink-400">Overall Accuracy</p>
          <p className="text-2xl font-bold text-ink-900">{analytics.accuracy}%</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-ink-400">Weak Areas</p>
          <p className="text-lg font-semibold text-rose-600">{analytics.weak_areas.join(", ") || "None — great job!"}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-ink-400">Submissions Tracked</p>
          <p className="text-2xl font-bold text-ink-900">{analytics.score_history.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly Activity" isEmpty={!analytics.has_data}>
          <WeeklyActivityChart data={analytics.weekly_activity} />
        </ChartCard>
        <ChartCard title="Score History" isEmpty={analytics.score_history.length === 0}>
          <ScoreHistoryChart data={analytics.score_history} />
        </ChartCard>
        <ChartCard title="Algorithm Completion by Category" isEmpty={!analytics.has_data}>
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
