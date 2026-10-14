function step(type, node, visited, description, extra = {}) {
  return { type, node, visited: [...visited], description, ...extra };
}

export function bfs(graph, start) {
  const visited = [];
  const seen = new Set([start]);
  const queue = [start];
  const steps = [step("enqueue", start, visited, `Starting at ${start}, added to queue`, { queue: [...queue] })];

  while (queue.length) {
    const node = queue.shift();
    visited.push(node);
    steps.push(step("visit", node, visited, `Visiting ${node}`, { queue: [...queue] }));

    const neighbors = [...(graph[node] || [])].sort();
    for (const neighbor of neighbors) {
      if (!seen.has(neighbor)) {
        seen.add(neighbor);
        queue.push(neighbor);
        steps.push(step("enqueue", neighbor, visited, `Discovered ${neighbor} from ${node}, added to queue`, { queue: [...queue] }));
      }
    }
  }
  steps.push(step("done", null, visited, "Traversal complete!", { queue: [] }));
  return { steps, output: visited, comparisons: steps.length, swaps: 0 };
}

export function dfs(graph, start) {
  const visited = [];
  const seen = new Set();
  const steps = [];
  const stackTrace = [];

  function visit(node) {
    seen.add(node);
    visited.push(node);
    stackTrace.push(node);
    steps.push(step("visit", node, visited, `Visiting ${node}`, { stack: [...stackTrace] }));
    const neighbors = [...(graph[node] || [])].sort();
    for (const neighbor of neighbors) {
      if (!seen.has(neighbor)) visit(neighbor);
    }
    stackTrace.pop();
  }

  visit(start);
  steps.push(step("done", null, visited, "Traversal complete!", { stack: [] }));
  return { steps, output: visited, comparisons: steps.length, swaps: 0 };
}
