export default function WeeklyActivityChart({ data }) {
  const width = 640, height = 220;
  const maxCount = Math.max(1, ...data.map((item) => item.count));
  const plotTop = 16, plotHeight = 154;
  const slot = (width - 60) / Math.max(1, data.length);
  return (
    <svg className="analytics-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Daily learning activity over the last seven days">
      {data.map((item, index) => {
        const barHeight = item.count / maxCount * plotHeight;
        const x = 30 + index * slot + slot * 0.2;
        const y = plotTop + plotHeight - barHeight;
        const label = new Date(`${item.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" });
        return <g key={item.date}><line x1={x + slot * 0.3} x2={x + slot * 0.3} y1={plotTop} y2={plotTop + plotHeight} stroke="#f0eff4" /><rect x={x} y={y} width={slot * 0.6} height={Math.max(2, barHeight)} rx="5" fill="#6652cf"><title>{item.count} activities on {item.date}</title></rect><text x={x + slot * 0.3} y={height - 16} textAnchor="middle" fill="#77768b" fontSize="11">{label}</text><text x={x + slot * 0.3} y={y - 5} textAnchor="middle" fill="#514e65" fontSize="10">{item.count}</text></g>;
      })}
    </svg>
  );
}
