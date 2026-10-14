import EmptyState from "../components/EmptyState";
import { TrendDownIcon } from "../components/icons";

export default function ChartCard({ title, children, isEmpty, emptyMessage = "Not enough data yet." }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500">{title}</h3>
      {isEmpty ? (
        <EmptyState icon={TrendDownIcon} title="No data yet" description={emptyMessage} />
      ) : (
        children
      )}
    </div>
  );
}
