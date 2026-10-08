export default function GraphVisualizer({ graph, step }) {
  const nodes = Object.keys(graph);
  const radius = 120;
  const center = 150;
  const positions = {};
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    positions[node] = {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });

  const edges = [];
  const seenEdge = new Set();
  nodes.forEach((node) => {
    (graph[node] || []).forEach((neighbor) => {
      const key = [node, neighbor].sort().join("-");
      if (!seenEdge.has(key)) {
        seenEdge.add(key);
        edges.push([node, neighbor]);
      }
    });
  });

  const visited = step?.visited || [];
  const current = step?.node;
  const frontier = step?.queue || step?.stack || [];

  function gradientFor(node) {
    if (node === current) return "url(#gradCurrent)";
    if (visited.includes(node)) return "url(#gradVisited)";
    if (frontier.includes(node)) return "url(#gradFrontier)";
    return "url(#gradDefault)";
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 300 300" className="h-72 w-72">
        <defs>
          <radialGradient id="gradCurrent" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <radialGradient id="gradVisited" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          <radialGradient id="gradFrontier" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#c7d2fe" />
            <stop offset="100%" stopColor="#6366f1" />
          </radialGradient>
          <radialGradient id="gradDefault" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          <filter id="nodeShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.3" />
          </filter>
        </defs>

        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={positions[a].x}
            y1={positions[a].y}
            x2={positions[b].x}
            y2={positions[b].y}
            stroke="#cbd5e1"
            strokeWidth={2}
          />
        ))}
        {nodes.map((node) => (
          <g
            key={node}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: node === current ? "scale(1.18)" : "scale(1)",
              transition: "transform 300ms ease-out",
            }}
          >
            {node === current && (
              <circle
                cx={positions[node].x}
                cy={positions[node].y}
                r={24}
                fill="none"
                stroke="#fbbf24"
                strokeWidth={2}
                opacity={0.5}
              />
            )}
            <circle
              cx={positions[node].x}
              cy={positions[node].y}
              r={18}
              fill={gradientFor(node)}
              filter="url(#nodeShadow)"
              className="transition-all duration-300"
            />
            <text x={positions[node].x} y={positions[node].y + 5} textAnchor="middle" className="fill-white text-sm font-bold">
              {node}
            </text>
          </g>
        ))}
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <div>
          <span className="font-semibold text-ink-600">Visited: </span>
          <span className="font-mono text-ink-800">{visited.join(", ") || "—"}</span>
        </div>
        <div>
          <span className="font-semibold text-ink-600">{step?.stack ? "Stack" : "Queue"}: </span>
          <span className="font-mono text-ink-800">{frontier.join(", ") || "—"}</span>
        </div>
      </div>
    </div>
  );
}
