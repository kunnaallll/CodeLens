import { Link } from "react-router-dom";

import TiltCard from "./TiltCard";

export default function DataStructureCard({ dataStructure }) {
  return (
    <TiltCard className="card flex flex-col gap-3 p-5 hover:shadow-card-hover" max={7}>
      <h3 className="text-lg font-semibold text-ink-900">{dataStructure.name}</h3>
      <p className="line-clamp-2 text-sm text-ink-500">{dataStructure.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {dataStructure.operations.map((op) => (
          <span key={op} className="badge bg-ink-100 text-ink-600">{op}</span>
        ))}
      </div>
      <Link to={`/data-structures/${dataStructure.slug}`} className="btn-primary mt-2 justify-center">
        Explore
      </Link>
    </TiltCard>
  );
}
