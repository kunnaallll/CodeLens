import { Link } from "react-router-dom";

import { CATEGORY_LABELS, CATEGORY_STYLES, DIFFICULTY_STYLES } from "../utils/badges";
import TiltCard from "./TiltCard";

export default function AlgorithmCard({ algorithm }) {
  return (
    <TiltCard className="algorithm-card" max={7}>
      <div className="algorithm-card-top">
        <span className={`badge ${CATEGORY_STYLES[algorithm.category]}`}>{CATEGORY_LABELS[algorithm.category]}</span>
        <span className={`badge ${DIFFICULTY_STYLES[algorithm.difficulty]}`}>{algorithm.difficulty}</span>
      </div>
      <h3>{algorithm.name}</h3>
      <p>{algorithm.description}</p>
      <div className="algorithm-meta">
        <span>Avg {algorithm.average_case}</span>
        <span>Space {algorithm.space_complexity}</span>
      </div>
      <div className="algorithm-actions">
        <Link to={`/visualizer/${algorithm.slug}`} className="btn-primary">
          Start Visualization
        </Link>
        <Link to={`/algorithms/${algorithm.slug}`} className="btn-secondary">
          Learn More
        </Link>
      </div>
    </TiltCard>
  );
}
