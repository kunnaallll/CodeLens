import { Link } from "react-router-dom";

import AlgorithmCard from "../components/AlgorithmCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import StatCard from "../components/StatCard";
import { BookIcon, FlameIcon, StarIcon, TargetIcon } from "../components/icons";
import ChartCard from "../charts/ChartCard";
import WeeklyActivityChart from "../charts/WeeklyActivityChart";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { listAlgorithms } from "../services/algorithms";
import { getAnalytics } from "../services/analytics";
import { getMyProgress } from "../services/progress";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: progress, loading: pLoading, error: pError, refetch } = useFetch(getMyProgress, []);
  const { data: analytics, loading: aLoading } = useFetch(getAnalytics, []);
  const { data: algorithmsData, loading: algLoading } = useFetch(() => listAlgorithms(), []);

  if (pLoading || aLoading || algLoading) return <LoadingSpinner label="Loading your dashboard..." />;
  if (pError) return <ErrorMessage message={pError} onRetry={refetch} />;

  const algorithms = algorithmsData?.results || algorithmsData || [];
  const incomplete = algorithms.filter(
    (a) => !progress.algorithm_progress.find((ap) => ap.algorithm_slug === a.slug && ap.completed)
  );
  const recommended = incomplete.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Welcome back, {user?.username}!</h1>
        <p className="text-sm text-ink-500">Here's how your learning is going.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BookIcon} label="Algorithms Completed" value={progress.algorithms_completed} accent="brand" />
        <StatCard icon={TargetIcon} label="Challenges Completed" value={progress.challenges_completed} accent="violet" />
        <StatCard icon={StarIcon} label="Total Score" value={progress.total_score} accent="amber" />
        <StatCard icon={FlameIcon} label="Current Streak" value={`${progress.current_streak}d`} accent="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">Overall Progress</h3>
          <p className="mb-2 text-sm text-ink-600">{progress.completion_percentage}% of algorithms mastered</p>
          <ProgressBar value={progress.completion_percentage} />
          <div className="mt-4 flex items-center justify-between text-sm text-ink-500">
            <span>Accuracy</span>
            <span className="font-semibold text-ink-800">{progress.accuracy}%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-ink-500">
            <span>Average Score</span>
            <span className="font-semibold text-ink-800">{progress.average_score}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-ink-500">
            <span>Longest Streak</span>
            <span className="font-semibold text-ink-800">{progress.longest_streak}d</span>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ChartCard title="Weekly Activity" isEmpty={!analytics.has_data}>
            <WeeklyActivityChart data={analytics.weekly_activity} />
          </ChartCard>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Continue Learning</h2>
          <Link to="/algorithms" className="text-sm font-semibold text-brand-600 hover:underline">
            View all
          </Link>
        </div>
        {recommended.length === 0 ? (
          <div className="card p-6 text-center text-sm text-ink-500">
            You've completed every algorithm — amazing work! Check out the challenges next.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((algo) => (
              <AlgorithmCard key={algo.slug} algorithm={algo} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-ink-900">Recent Activity</h2>
        {progress.recent_activity.length === 0 ? (
          <div className="card p-6 text-center text-sm text-ink-500">No activity yet — try visualizing an algorithm!</div>
        ) : (
          <div className="card divide-y divide-ink-100">
            {progress.recent_activity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-ink-700">{activity.description}</span>
                <span className="text-xs text-ink-400">{new Date(activity.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
