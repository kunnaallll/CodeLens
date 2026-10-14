import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function WeeklyActivityChart({ data }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, { weekday: "short" }),
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: "#f1f5f9" }} />
        <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Activities" />
      </BarChart>
    </ResponsiveContainer>
  );
}
