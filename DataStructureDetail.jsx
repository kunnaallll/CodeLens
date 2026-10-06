import { useParams } from "react-router-dom";

import DataStructureVisualizer from "../components/DataStructureVisualizer";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { getDataStructure } from "../services/datastructures";

export default function DataStructureDetail() {
  const { slug } = useParams();
  const { data: ds, loading, error, refetch } = useFetch(() => getDataStructure(slug), [slug]);

  if (loading) return <LoadingSpinner label="Loading..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{ds.name}</h1>
        <p className="text-sm text-ink-500">{ds.description}</p>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">Complexity</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(ds.time_complexity).map(([op, complexity]) => (
            <div key={op}>
              <p className="text-xs text-ink-400 capitalize">{op}</p>
              <p className="font-mono font-bold text-brand-600">{complexity}</p>
            </div>
          ))}
          <div>
            <p className="text-xs text-ink-400">Space</p>
            <p className="font-mono font-bold text-brand-600">{ds.space_complexity}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500">Interactive Demo</h3>
        <DataStructureVisualizer slug={ds.slug} />
      </div>
    </div>
  );
}
