import DataStructureCard from "../components/DataStructureCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { listDataStructures } from "../services/datastructures";

export default function DataStructures() {
  const { data, loading, error, refetch } = useFetch(listDataStructures, []);
  const items = data?.results || data || [];

  if (loading) return <LoadingSpinner label="Loading data structures..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Data Structures</h1>
        <p className="text-sm text-ink-500">Interact with core data structures and watch each operation happen live.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((ds) => (
          <DataStructureCard key={ds.slug} dataStructure={ds} />
        ))}
      </div>
    </div>
  );
}
