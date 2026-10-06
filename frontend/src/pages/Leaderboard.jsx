import { useState } from "react";

import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { getLeaderboard } from "../services/progress";

export default function Leaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("all");
  const { data, loading, error, refetch } = useFetch(() => getLeaderboard(period), [period]);

  if (loading) return <LoadingSpinner label="Loading leaderboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Leaderboard</h1>
          <p className="text-sm text-ink-500">See how you stack up against other learners.</p>
        </div>
        <div className="flex gap-2">
          {["all", "weekly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
                period === p ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Challenges</th>
              <th className="px-4 py-3">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {data.results.map((row) => (
              <tr key={row.rank} className={row.username === user?.username ? "bg-brand-50" : ""}>
                <td className="px-4 py-3 font-semibold text-ink-800">
                  {row.rank <= 3 ? ["\u{1F947}", "\u{1F948}", "\u{1F949}"][row.rank - 1] : `#${row.rank}`}
                </td>
                <td className="px-4 py-3 font-medium text-ink-800">{row.username}</td>
                <td className="px-4 py-3">{row.total_score}</td>
                <td className="px-4 py-3">{row.challenges_completed}</td>
                <td className="px-4 py-3">{row.accuracy}%</td>
              </tr>
            ))}
            {data.results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-400">No activity yet in this period.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
