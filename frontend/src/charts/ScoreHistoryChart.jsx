import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ScoreHistoryChart({ data }) {
  const formatted = data.map((d, i) => ({ ...d, index: i + 1 }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="index" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} label={{ value: "Attempt #", position: "insideBottom", offset: -2, fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value, _name, item) => [`${value} pts`, item.payload.challenge]} />
        <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4, fill: "#4f46e5" }} name="Score" />
      </LineChart>
    </ResponsiveContainer>
  );
}
