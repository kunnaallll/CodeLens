export default function ScoreHistoryChart({ data }) {
  const width = 640, height = 220;
  const inset = { top: 14, right: 18, bottom: 30, left: 34 };
  const plotWidth = width - inset.left - inset.right;
  const plotHeight = height - inset.top - inset.bottom;
  const points = data.map((item, index) => ({
    ...item,
    x: inset.left + (data.length === 1 ? plotWidth / 2 : index * plotWidth / Math.max(1, data.length - 1)),
    y: inset.top + plotHeight * (1 - Math.max(0, Math.min(100, item.score)) / 100),
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  return (
    <svg className="analytics-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Challenge score history, from 0 to 100 points">
      {[0, 25, 50, 75, 100].map((score) => {
        const y = inset.top + plotHeight * (1 - score / 100);
        return <g key={score}><line x1={inset.left} x2={width - inset.right} y1={y} y2={y} stroke="#e6e4ed" strokeDasharray="4 4" /><text x={inset.left - 7} y={y + 4} textAnchor="end" fill="#77768b" fontSize="10">{score}</text></g>;
      })}
      {points.length > 1 && <polyline points={line} fill="none" stroke="#5945d3" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
      {points.map((point, index) => <g key={`${point.date}-${index}`}><circle cx={point.x} cy={point.y} r="5" fill="#5945d3"><title>{point.challenge}: {point.score}/100 ({point.date})</title></circle><text x={point.x} y={height - 8} textAnchor="middle" fill="#77768b" fontSize="10">{index + 1}</text></g>)}
    </svg>
  );
}
