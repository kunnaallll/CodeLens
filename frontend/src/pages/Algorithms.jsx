import { useMemo, useState } from "react";

import AlgorithmCard from "../components/AlgorithmCard";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { listAlgorithms } from "../services/algorithms";

const CATEGORIES = ["ALL", "sorting", "searching", "graph"];
const DIFFICULTIES = ["ALL", "easy", "medium", "hard"];

export default function Algorithms() {
  const { data, loading, error, refetch } = useFetch(() => listAlgorithms(), []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [difficulty, setDifficulty] = useState("ALL");

  const filtered = useMemo(() => {
    const algorithms = data?.results || data || [];
    return algorithms.filter((a) => {
      const matchesSearch = (a.name || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || (a.category || "").toLowerCase() === category;
      const matchesDifficulty = difficulty === "ALL" || (a.difficulty || "").toLowerCase() === difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [data, search, category, difficulty]);

  if (loading) return <LoadingSpinner label="Loading algorithms..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="section-kicker">THE ALGORITHM LIBRARY</p>
        <h1>Learn how algorithms work</h1>
        <p>Browse the collection, then open an algorithm to follow its steps.</p>
      </header>

      <div className="filter-bar">
        <input
          aria-label="Search algorithms"
          type="search"
          placeholder="Search algorithms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>
          ))}
        </select>
        <select aria-label="Filter by difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d === "ALL" ? "All Difficulties" : d}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No algorithms match your filters" description="Try adjusting your search or filters." />
      ) : (
        <div className="library-grid">
          {filtered.map((algo) => (
            <AlgorithmCard key={algo.slug} algorithm={algo} />
          ))}
        </div>
      )}
    </div>
  );
}
