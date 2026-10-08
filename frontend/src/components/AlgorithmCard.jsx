import { Link } from "react-router-dom";

import { CATEGORY_LABELS, CATEGORY_STYLES, DIFFICULTY_STYLES } from "../utils/badges";
import TiltCard from "./TiltCard";

export default function AlgorithmCard({ algorithm }) {
  return (
    <TiltCard className="card flex flex-col gap-3 p-5 hover:shadow-card-hover" max={7}>
      <div className="flex items-center gap-2">
        <span className={`badge ${CATEGORY_STYLES[algorithm.category]}`}>{CATEGORY_LABELS[algorithm.category]}</span>
        <span className={`badge ${DIFFICULTY_STYLES[algorithm.difficulty]}`}>{algorithm.difficulty}</span>
      </div>
      <h3 className="text-lg font-semibold text-ink-900">{algorithm.name}</h3>
      <p className="line-clamp-2 text-sm text-ink-500">{algorithm.description}</p>
      <div className="mt-1 flex items-center gap-4 text-xs text-ink-400">
        <span>Avg {algorithm.average_case}</span>
        <span>Space {algorithm.space_complexity}</span>
      </div>
      <div className="mt-2 flex gap-2">
        <Link to={`/visualizer/${algorithm.slug}`} className="btn-primary flex-1 justify-center">
          Start Visualization
        </Link>
        <Link to={`/algorithms/${algorithm.slug}`} className="btn-secondary">
          Learn More
        </Link>
      </div>
    </TiltCard>
  );
}
