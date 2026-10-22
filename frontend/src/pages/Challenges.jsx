
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { listChallenges } from "../services/challenges";

export default function Challenges() {
  const { data, loading, error, refetch } = useFetch(listChallenges, []);
  const challenges = data?.results || data || [];

  if (loading) {
    return <LoadingSpinner label="Loading challenges..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="section-kicker">PRACTICE ARENA</p>
        <h1>Challenges</h1>
        <p>Apply what you have learned and see how your solution scores.</p>
      </header>

      {challenges.length === 0 ? (
        <EmptyState
          title="No challenges here"
          description="Try again later."
        />
      ) : (
        <div className="library-grid">
          {challenges.map((challenge) => (
            <article key={challenge.id} className="algorithm-card">
              <span className="badge badge-neutral">
                {challenge.difficulty}
              </span>

              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
              <p>{challenge.points} points available</p>

              <Link
                to={`/challenges/${challenge.id}`}
                className="card-action"
              >
                Open Challenge →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
