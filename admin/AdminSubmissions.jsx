import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useFetch } from "../../hooks/useFetch";
import { listAllSubmissions } from "../../services/challenges";

export default function AdminSubmissions() {
  const { data, loading, error, refetch } = useFetch(listAllSubmissions, []);
  if (loading) return <LoadingSpinner label="Loading submissions..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const submissions = data.results || data;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink-900">Submissions</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Challenge</th>
              <th className="px-4 py-3">Algorithm</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Correct</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {submissions.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-ink-800">{s.username}</td>
                <td className="px-4 py-3 text-ink-600">{s.challenge_title}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-600">{s.selected_algorithm}</td>
                <td className="px-4 py-3 font-semibold">{s.total_score}/100</td>
                <td className="px-4 py-3">
                  <span className={`badge ${s.is_correct ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {s.is_correct ? "Correct" : "Incorrect"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-500">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-400">No submissions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
