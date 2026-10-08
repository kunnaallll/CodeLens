import { Link } from "react-router-dom";

import { CATEGORY_LABELS, CATEGORY_STYLES, DIFFICULTY_STYLES } from "../utils/badges";
import TiltCard from "./TiltCard";

export default function ChallengeCard({ challenge }) {
  return (
    <TiltCard className="card flex flex-col gap-3 p-5 hover:shadow-card-hover" max={7}>
      <div className="flex items-center gap-2">
        <span className={`badge ${CATEGORY_STYLES[challenge.category]}`}>{CATEGORY_LABELS[challenge.category]}</span>
        <span className={`badge ${DIFFICULTY_STYLES[challenge.difficulty]}`}>{challenge.difficulty}</span>
      </div>
      <h3 className="text-lg font-semibold text-ink-900">{challenge.title}</h3>
      <div className="flex items-center justify-between text-xs text-ink-400">
        <span>{challenge.points} points</span>
        <span>{challenge.time_limit_seconds}s limit</span>
      </div>
      <Link to={`/challenges/${challenge.slug}`} className="btn-primary mt-1 justify-center">
        Attempt Challenge
      </Link>
    </TiltCard>
  );
}
