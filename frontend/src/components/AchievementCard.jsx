const ICONS = {
  book: "📘",
  target: "🎯",
  star: "⭐",
  flame: "🔥",
  calendar: "🗓️",
};

export default function AchievementCard({ achievement, progress }) {
  const unlocked = achievement.unlocked;
  const percent = progress ? Math.min(100, Math.round((progress.current / progress.goal) * 100)) : 0;
  const date = achievement.unlocked_at
    ? new Date(achievement.unlocked_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <article className={`achievement-card ${unlocked ? "is-unlocked" : "is-locked"}`}>
      <div className="achievement-icon" aria-hidden="true">{ICONS[achievement.icon] || "🏅"}</div>
      <div className="achievement-body">
        <div className="achievement-title-row"><h2>{achievement.name}</h2><span className={`achievement-state ${unlocked ? "earned" : "locked"}`}>{unlocked ? "Earned" : "In progress"}</span></div>
        <p>{achievement.description}</p>
        {!unlocked && progress && <div className="achievement-progress" aria-label={`${progress.current} of ${progress.goal} progress`}>
          <div className="achievement-progress-label"><span>{progress.label}</span><strong>{progress.current} / {progress.goal}</strong></div>
          <div className="achievement-progress-track"><span style={{ width: `${percent}%` }} /></div>
        </div>}
        {date && <small className="achievement-date">Unlocked {date}</small>}
      </div>
      <span className="achievement-check" aria-hidden="true">{unlocked ? "✓" : "·"}</span>
    </article>
  );
}
