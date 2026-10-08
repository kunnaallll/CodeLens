export default function ProgressBar({ value = 0, max = 100, colorClass = "bg-brand-600", height = "h-2" }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`w-full overflow-hidden rounded-full bg-ink-100 ${height}`}>
      <div
        className={`${height} rounded-full ${colorClass} transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
