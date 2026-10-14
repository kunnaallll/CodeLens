import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TopicPerformanceChart({ data, dataKey = "average_score", nameKey = "category", label = "Avg Score" }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey={nameKey} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: "#f1f5f9" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey={dataKey} fill="#22c55e" radius={[6, 6, 0, 0]} name={label} />
      </BarChart>
    </ResponsiveContainer>
  );
}
