import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { algorithmKind, DEMO_GRAPH, randomArray, runAlgorithm } from "../algorithms/registry";
import { useFetch } from "../hooks/useFetch";
import { getAlgorithm } from "../services/algorithms";
import { recordAlgorithmRun } from "../services/progress";

const DEFAULT_GRAPH = JSON.stringify(DEMO_GRAPH, null, 2);

export default function Visualizer() {
  const { slug, algorithm } = useParams();
  const key = slug || algorithm;
  const { data: item, loading, error } = useFetch(() => getAlgorithm(key), [key]);
  const [input, setInput] = useState("5, 2, 8, 1, 3");
  const [target, setTarget] = useState("8");
  const [graphInput, setGraphInput] = useState(DEFAULT_GRAPH);
  const [start, setStart] = useState("A");
  const [result, setResult] = useState(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(750);
  const [message, setMessage] = useState("");
  const recorded = useRef(false);
  const kind = item ? algorithmKind(item.slug) : null;
  const step = result?.steps[index];
  const last = Math.max(0, (result?.steps.length || 1) - 1);

  useEffect(() => {
    if (!playing || !result || index >= last) return undefined;
    const timer = setTimeout(() => {
      setIndex((current) => current + 1);
      if (index + 1 >= last) setPlaying(false);
    }, speed);
    return () => clearTimeout(timer);
  }, [playing, result, index, last, speed]);

  useEffect(() => {
    if (!result || index !== last || recorded.current) return;
    recorded.current = true;
    recordAlgorithmRun(item).catch((saveError) => setMessage(`Run completed, but progress could not be saved: ${saveError.message}`));
  }, [result, index, last, item]);

  function generate(event) {
    event.preventDefault();
    setPlaying(false);
    setMessage("");
    try {
      let next;
      if (kind === "graph") {
        const graph = JSON.parse(graphInput);
        if (!graph || Array.isArray(graph) || typeof graph !== "object" || !Object.keys(graph).length) throw new Error("Enter a graph as a JSON object of node names and neighbor lists.");
        if (Object.values(graph).some((neighbors) => !Array.isArray(neighbors) || neighbors.some((node) => typeof node !== "string"))) throw new Error("Each graph node must map to a list of neighbor names in quotes.");
        const normalized = Object.fromEntries(Object.entries(graph).map(([node, neighbors]) => [node, [...new Set(neighbors)]]));
        Object.values(normalized).flat().forEach((node) => { if (!Object.hasOwn(normalized, node)) normalized[node] = []; });
        if (!Object.hasOwn(normalized, start.trim())) throw new Error("Choose a start node that exists in the graph.");
        next = runAlgorithm(item.slug, { graph: normalized, start: start.trim() });
      } else {
        const values = input.split(",").map((value) => value.trim());
        if (!values.length || values.some((value) => value === "" || !Number.isFinite(Number(value)))) throw new Error("Enter numeric values separated by commas.");
        if (kind === "search" && !Number.isFinite(Number(target))) throw new Error("Enter a numeric search target.");
        next = runAlgorithm(item.slug, { values: values.map(Number), target: Number(target) });
      }
      recorded.current = false;
      setResult(next);
      setIndex(0);
    } catch (runError) {
      setMessage(runError instanceof SyntaxError ? "Graph JSON is not valid. Check commas, quotes, and brackets." : runError.message || "Could not generate steps.");
      setResult(null);
    }
  }

  if (loading) return <p className="state-panel">Loading algorithm…</p>;
  if (error) return <p className="state-panel api-error" role="alert">{error}</p>;
  if (!kind) return <p className="state-panel">A visualizer is not available for {item?.name} yet.</p>;

  const values = step?.array || [];
  const highlighted = step?.indices || [];
  return (
    <div className="visualizer-content">
      <header className="section-heading"><div><p className="section-kicker">ALGORITHM VISUALIZER</p><h1>{item.name}</h1><p>{item.description}</p></div><Link className="btn-secondary" to={`/algorithms/${item.slug}`}>Learning module</Link></header>
      <section className="visualizer-card">
        <form className="array-form" onSubmit={generate}>
          {kind === "graph" ? <>
            <label htmlFor="graph-input">Graph (JSON adjacency list)</label>
            <textarea id="graph-input" rows="8" value={graphInput} onChange={(event) => setGraphInput(event.target.value)} spellCheck="false" />
            <p className="graph-input-copy">Each node maps to its neighbors. For an undirected graph, list each connection in both directions.</p>
            <div className="search-target"><label htmlFor="graph-start">Start node</label><input id="graph-start" value={start} onChange={(event) => setStart(event.target.value)} required /></div>
            <button className="primary-button" type="submit">Generate traversal</button>
          </> : <>
            <label htmlFor="array-input">Numeric array (comma separated)</label>
            <div><input id="array-input" value={input} onChange={(event) => setInput(event.target.value)} /><button className="primary-button" type="submit">Generate steps</button><button className="btn-secondary" type="button" onClick={() => setInput(randomArray().join(", "))}>Random array</button></div>
            {kind === "search" && <><div className="search-target"><label htmlFor="search-target">Search target</label><input id="search-target" value={target} onChange={(event) => setTarget(event.target.value)} /></div>{item.slug === "binary-search" && <p className="graph-input-copy">Binary search sorts the input first, then reports the target’s index in that sorted array.</p>}</>}
          </>}
        </form>
        {message && <p className="error-message" role="alert">{message}</p>}
        <div className="array-stage" aria-live="polite">
          {kind === "graph" ? (step ? (
            <div className="graph-step"><strong>{step.description}</strong><p>Visited: {step.visited.join(" → ") || "—"}</p>{step.queue && <p>Queue: {step.queue.join(", ") || "empty"}</p>}{step.stack && <p>Current path: {step.stack.join(" → ") || "empty"}</p>}</div>
          ) : <p className="empty-array">Edit the sample graph or use it as-is, then generate a traversal.</p>) : step ? (
            values.map((value, position) => <div key={position} className={`array-item ${highlighted.includes(position) ? (step.type === "swap" ? "swapped" : "compared") : ""}`}><strong>{value}</strong><small>index {position}</small></div>)
          ) : <p className="empty-array">Enter an array and generate steps to begin.</p>}
        </div>
        <div className="step-description"><span><small>CURRENT OPERATION</small><strong>{step?.description || "Ready when you are"}</strong></span><span className="step-counter">Step {step ? index + 1 : 0} / {result?.steps.length || 0}</span></div>
        <div className="playback-controls"><label className="speed-control">Playback speed <span>Slow</span><input aria-label="Playback speed" type="range" min="150" max="1500" step="150" value={1650 - speed} onChange={(event) => setSpeed(1650 - Number(event.target.value))} /><span>Fast</span></label><div><button onClick={() => { setIndex(0); setPlaying(false); }} disabled={!result}>Reset</button><button onClick={() => { setPlaying(false); setIndex((current) => Math.max(0, current - 1)); }} disabled={!result || index === 0}>← Previous</button><button className="play-button" onClick={() => setPlaying((value) => !value)} disabled={!result || (index === last && !playing)}>{playing ? "Pause" : "Play"}</button><button onClick={() => { setPlaying(false); setIndex((current) => Math.min(last, current + 1)); }} disabled={!result || index === last}>Next →</button></div></div>
      </section>
      <section className="complexity-panel"><p className="section-kicker">COMPLEXITY ANALYZER</p><div><span>Best<strong>{item.best_case || item.time_complexity}</strong></span><span>Average<strong>{item.average_case || item.time_complexity}</strong></span><span>Worst<strong>{item.worst_case || item.time_complexity}</strong></span><span>Space<strong>{item.space_complexity}</strong></span></div>{result && <p>Comparisons: {result.comparisons} · Swaps: {result.swaps} · Execution steps: {result.steps.length}{kind === "search" && <span> · Result index: {result.output}</span>}{kind === "graph" && <span> · Traversal: {result.output.join(" → ")}</span>}</p>}</section>
    </div>
  );
}
