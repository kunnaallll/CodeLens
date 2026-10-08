import TiltCard from "./TiltCard";

export default function AchievementCard({ achievement }) {
  const unlocked = achievement.unlocked;
  return (
    <TiltCard
      max={unlocked ? 6 : 2}
      glare={unlocked}
      className={`card flex items-center gap-4 p-4 ${unlocked ? "animate-pop-in hover:shadow-card-hover" : "opacity-60 grayscale"}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${unlocked ? "bg-amber-100" : "bg-ink-100"}`}
        style={unlocked ? { transform: "translateZ(24px)" } : undefined}
      >
        {achievement.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink-900">{achievement.name}</p>
        <p className="truncate text-sm text-ink-500">{achievement.description}</p>
      </div>
      {unlocked ? (
        <span className="badge bg-emerald-100 text-emerald-700">Unlocked</span>
      ) : (
        <span className="badge bg-ink-100 text-ink-500">Locked</span>
      )}
    </TiltCard>
  );
}
