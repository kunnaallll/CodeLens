import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { listChallenges } from "../services/challenges";

export default function Challenges() {
  const { data, loading, error, refetch } = useFetch(listChallenges, []);
  const challenges = data?.results || data || [];

  if (loading) return <LoadingSpinner label="Loading challenges..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-bold text-ink-900">Challenges</h1><p className="text-sm text-ink-500">Challenges currently provided by the backend.</p></div>

      {challenges.length === 0 ? (
        <EmptyState title="No challenges here" description="Try a different category." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{challenges.map((challenge) => <article key={challenge.id} className="card p-5"><span className="badge badge-neutral">{challenge.difficulty}</span><h3>{challenge.title}</h3><p>{challenge.description}</p><p>{challenge.points} points available</p><p className="api-note">Submissions and scoring are not available in the current backend.</p></article>)}</div>
      )}
    </div>
  );
}
