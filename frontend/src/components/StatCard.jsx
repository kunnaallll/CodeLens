import TiltCard from "./TiltCard";

const ACCENTS = {
  brand: "bg-brand-100 text-brand-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  violet: "bg-violet-100 text-violet-600",
  cyan: "bg-cyan-100 text-cyan-600",
  rose: "bg-rose-100 text-rose-600",
};

export default function StatCard({ label, value, icon: Icon, accent = "brand" }) {
  return (
    <TiltCard className="card flex animate-pop-in items-center gap-4 p-5 hover:shadow-card-hover" max={5}>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${
          ACCENTS[accent] || ACCENTS.brand
        }`}
        style={{ transform: "translateZ(20px)" }}
      >
        <Icon size={20} />
      </div>
      <div style={{ transform: "translateZ(10px)" }}>
        <p className="text-2xl font-bold text-ink-900">{value}</p>
        <p className="text-sm text-ink-500">{label}</p>
      </div>
    </TiltCard>
  );
}
