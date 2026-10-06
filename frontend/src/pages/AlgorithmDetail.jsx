import { Link, useParams } from "react-router-dom";

import ComplexityCard from "../components/ComplexityCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { CATEGORY_LABELS, CATEGORY_STYLES, DIFFICULTY_STYLES } from "../utils/badges";
import { useFetch } from "../hooks/useFetch";
import { getAlgorithm } from "../services/algorithms";

export default function AlgorithmDetail() {
  const { slug } = useParams();
  const { data: algorithm, loading, error, refetch } = useFetch(() => getAlgorithm(slug), [slug]);

  if (loading) return <LoadingSpinner label="Loading algorithm..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className={`badge ${CATEGORY_STYLES[algorithm.category]}`}>{CATEGORY_LABELS[algorithm.category]}</span>
          <span className={`badge ${DIFFICULTY_STYLES[algorithm.difficulty]}`}>{algorithm.difficulty}</span>
        </div>
        <h1 className="text-2xl font-bold text-ink-900">{algorithm.name}</h1>
        <p className="mt-1 text-ink-600">{algorithm.description}</p>
      </div>

      <Link to={`/visualizer/${algorithm.slug}`} className="btn-primary w-fit">
        ▶ Start Visualization
      </Link>

      <ComplexityCard algorithm={algorithm} />

      {algorithm.explanation && (
        <div className="card p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">How It Works</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">{algorithm.explanation}</p>
        </div>
      )}

      {algorithm.pseudocode && (
        <div className="card p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Pseudocode</h3>
          <pre className="overflow-x-auto rounded-lg bg-ink-900 p-4 font-mono text-sm text-ink-100">{algorithm.pseudocode}</pre>
        </div>
      )}

      {algorithm.example && (
        <div className="card p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Example</h3>
          <p className="font-mono text-sm text-ink-700">{algorithm.example}</p>
        </div>
      )}
    </div>
  );
}
