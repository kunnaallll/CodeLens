export default function LoadingSpinner({ label = "Loading...", size = "md" }) {
  const dimensions = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-6 w-6";
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-ink-500">
      <div className={`${dimensions} animate-spin rounded-full border-2 border-ink-200 border-t-brand-600`} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
