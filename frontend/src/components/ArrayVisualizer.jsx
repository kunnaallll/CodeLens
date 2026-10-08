export default function ArrayVisualizer({ array = [], step, searchRange }) {
  if (!array.length) return null;
  const max = Math.max(...array, 1);
  const type = step?.type;
  const indices = step?.indices || [];

  function styleFor(idx) {
    if (type === "found" && indices.includes(idx))
      return { gradient: "from-emerald-400 to-emerald-600", text: "text-white", active: true };
    if (type === "not_found") return { gradient: "from-ink-200 to-ink-300", text: "text-ink-500", active: false };
    if (type === "done") return { gradient: "from-emerald-400 to-emerald-600", text: "text-white", active: false };
    if (type === "swap" && indices.includes(idx))
      return { gradient: "from-rose-400 to-rose-600", text: "text-white", active: true };
    if (type === "overwrite" && indices.includes(idx))
      return { gradient: "from-brand-400 to-brand-600", text: "text-white", active: true };
    if (type === "compare" && indices.includes(idx))
      return { gradient: "from-amber-300 to-amber-500", text: "text-white", active: true };
    if (searchRange && (idx < searchRange[0] || idx > searchRange[1]))
      return { gradient: "from-ink-50 to-ink-100", text: "text-ink-300", active: false };
    return { gradient: "from-ink-200 to-ink-300", text: "text-ink-700", active: false };
  }

  return (
    <div className="flex h-56 items-end justify-center gap-2 overflow-x-auto px-2" style={{ perspective: "800px" }}>
      {array.map((value, idx) => {
        const { gradient, text, active } = styleFor(idx);
        return (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className={`flex w-9 items-end justify-center rounded-t-md bg-gradient-to-b text-xs font-bold shadow-sm transition-all duration-300 ease-out ${gradient} ${text}`}
              style={{
                height: `${Math.max((value / max) * 160, 24)}px`,
                transform: active ? "translateY(-8px) translateZ(10px) scale(1.06)" : "translateY(0) scale(1)",
                boxShadow: active ? "0 10px 18px -6px rgb(0 0 0 / 0.28)" : "0 1px 2px rgb(0 0 0 / 0.08)",
              }}
            >
              <span className="pb-1 drop-shadow-sm">{value}</span>
            </div>
            <span className="text-[10px] text-ink-400">{idx}</span>
          </div>
        );
      })}
    </div>
  );
}
