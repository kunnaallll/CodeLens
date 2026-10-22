export default function TopicPerformanceChart({ data, dataKey = "average_score", nameKey = "category", label = "Avg Score" }) {
  const width = 640, height = 220;
  const top = 16, chartHeight = 150;
  const maxValue = dataKey === "completed"
    ? Math.max(1, ...data.map((item) => Number(item[dataKey]) || 0))
    : 100;
  const ticks = Array.from({ length: 5 }, (_, index) => Math.round(maxValue * index / 4));
  const slot = (width - 48) / Math.max(1, data.length);
  return (
    <svg className="analytics-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label} by topic`}>
      {ticks.map((value) => {
        const y = top + chartHeight * (1 - value / maxValue);
        return <g key={value}><line x1="38" x2={width - 10} y1={y} y2={y} stroke="#e6e4ed" strokeDasharray="4 4" /><text x="30" y={y + 4} textAnchor="end" fill="#77768b" fontSize="10">{value}</text></g>;
      })}
      {data.map((item, index) => {
        const value = Number(item[dataKey]) || 0;
        const barHeight = Math.max(0, value) / maxValue * chartHeight;
        const x = 42 + index * slot + slot * 0.2;
        const y = top + chartHeight - barHeight;
        const name = String(item[nameKey] || "Unknown");
        return <g key={`${name}-${index}`}><rect x={x} y={y} width={slot * 0.6} height={Math.max(2, barHeight)} rx="5" fill="#28a978"><title>{name}: {value} {label}</title></rect><text x={x + slot * 0.3} y={height - 14} textAnchor="middle" fill="#77768b" fontSize="10">{name.slice(0, 12)}</text></g>;
      })}
    </svg>
  );
}
