import { useMemo, useState } from "react";

import AlgorithmCard from "../components/AlgorithmCard";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { listAlgorithms } from "../services/algorithms";

const CATEGORIES = ["ALL", "SORTING", "SEARCHING", "GRAPH"];
const DIFFICULTIES = ["ALL", "EASY", "MEDIUM", "HARD"];

export default function Algorithms() {
  const { data, loading, error, refetch } = useFetch(() => listAlgorithms(), []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [difficulty, setDifficulty] = useState("ALL");

  const algorithms = data?.results || data || [];

  const filtered = useMemo(() => {
    return algorithms.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || a.category === category;
      const matchesDifficulty = difficulty === "ALL" || a.difficulty === difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [algorithms, search, category, difficulty]);

  if (loading) return <LoadingSpinner label="Loading algorithms..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Algorithm Library</h1>
        <p className="text-sm text-ink-500">Browse and visualize sorting, searching, and graph algorithms.</p>
      </div>

      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <input
          className="input sm:max-w-xs"
          placeholder="Search algorithms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input sm:max-w-[160px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>
          ))}
        </select>
        <select className="input sm:max-w-[160px]" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d === "ALL" ? "All Difficulties" : d}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No algorithms match your filters" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((algo) => (
            <AlgorithmCard key={algo.slug} algorithm={algo} />
          ))}
        </div>
      )}
    </div>
  );
}
