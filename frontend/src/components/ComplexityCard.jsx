export default function ComplexityCard({ algorithm, runStats }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500">Complexity Analysis</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium text-ink-400">Best</p>
          <p className="font-mono text-lg font-bold text-emerald-600">{algorithm.best_case}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-ink-400">Average</p>
          <p className="font-mono text-lg font-bold text-amber-600">{algorithm.average_case}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-ink-400">Worst</p>
          <p className="font-mono text-lg font-bold text-rose-600">{algorithm.worst_case}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-ink-400">Space</p>
          <p className="font-mono text-lg font-bold text-brand-600">{algorithm.space_complexity}</p>
        </div>
      </div>

      {runStats && (
        <>
          <div className="my-4 border-t border-ink-100" />
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">Current Run</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-medium text-ink-400">Comparisons</p>
              <p className="text-lg font-bold text-ink-800">{runStats.comparisons}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-ink-400">Swaps</p>
              <p className="text-lg font-bold text-ink-800">{runStats.swaps}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-ink-400">Steps</p>
              <p className="text-lg font-bold text-ink-800">{runStats.steps}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
