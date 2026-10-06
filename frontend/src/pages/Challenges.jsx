import { useState } from "react";

import ChallengeCard from "../components/ChallengeCard";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { listChallenges } from "../services/challenges";

const CATEGORIES = ["ALL", "SORTING", "SEARCHING", "GRAPH"];

export default function Challenges() {
  const [category, setCategory] = useState("ALL");
  const { data, loading, error, refetch } = useFetch(
    () => listChallenges(category === "ALL" ? {} : { category }),
    [category]
  );
  const challenges = data?.results || data || [];

  if (loading) return <LoadingSpinner label="Loading challenges..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Challenges</h1>
        <p className="text-sm text-ink-500">Pick an algorithm, solve the challenge, and get scored automatically.</p>
      </div>

      <div className="card flex gap-3 p-4">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              category === c ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
            }`}
          >
            {c === "ALL" ? "All" : c}
          </button>
        ))}
      </div>

      {challenges.length === 0 ? (
        <EmptyState title="No challenges here" description="Try a different category." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => (
            <ChallengeCard key={c.slug} challenge={c} />
          ))}
        </div>
      )}
    </div>
  );
}
