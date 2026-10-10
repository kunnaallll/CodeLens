import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { getAlgorithm } from "../services/algorithms";
import { apiRequest } from "../services/api";
import { recordAlgorithmRun } from "../services/progress";

export default function Visualizer() {
  const { slug, algorithm } = useParams();
  const key = slug || algorithm;
  const { data: item, loading, error } = useFetch(() => getAlgorithm(key), [key]);
  const [input, setInput] = useState("5, 3, 8, 1");
  const [result, setResult] = useState(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const recorded = useRef(false);
  const step = result?.steps[index];
  const last = Math.max(0, (result?.steps.length || 1) - 1);

  useEffect(() => {
    if (!playing || !result || index >= last) return undefined;
    const timer = setTimeout(() => {
      setIndex(index + 1);
      if (index + 1 >= last) setPlaying(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [playing, result, index, last]);

  useEffect(() => {
    if (!result || index !== last || recorded.current) return;
    recorded.current = true;
    recordAlgorithmRun(item).catch((saveError) => setMessage(`Run completed, but progress could not be saved: ${saveError.message}`));
  }, [result, index, last, item]);

  async function generate(event) {
    event.preventDefault();
    const values = input.split(",").map((value) => value.trim());
    if (!values.length || values.some((value) => value === "" || !Number.isFinite(Number(value)))) { setMessage("Enter numeric values separated by commas."); return; }
    setMessage(""); setBusy(true); setPlaying(false);
    try {
      const generated = await apiRequest("/api/algorithms/bubble-sort/steps/", { method: "POST", body: JSON.stringify({ array: values.map(Number) }) });
      recorded.current = false; setResult(generated); setIndex(0);
    } catch (generateError) { setMessage(generateError.message || "Could not generate steps."); }
    finally { setBusy(false); }
  }

  if (loading) return <p className="state-panel">Loading algorithm…</p>;
  if (error) return <p className="state-panel api-error" role="alert">{error}</p>;
  if (item?.name.toLowerCase() !== "bubble sort") return <p className="state-panel">A visualizer is not available for {item?.name} yet.</p>;
  return <div className="visualizer-content"><header className="section-heading"><div><p className="section-kicker">ALGORITHM VISUALIZER</p><h1>{item.name}</h1><p>{item.description}</p></div></header>
    <section className="visualizer-card"><form className="array-form" onSubmit={generate}><label htmlFor="array-input">Numeric array</label><div><input id="array-input" value={input} onChange={(event) => setInput(event.target.value)} /><button className="primary-button" disabled={busy}>{busy ? "Generating…" : "Generate steps"}</button></div></form>
      {message && <p className="error-message" role="alert">{message}</p>}
      <div className="array-stage" aria-live="polite">{step ? step.array.map((value, position) => <div key={position} className={`array-item ${step.compared.includes(position) ? (step.swapped ? "swapped" : "compared") : ""}`}><strong>{value}</strong><small>index {position}</small></div>) : <p className="empty-array">Enter an array and generate steps to begin.</p>}</div>
      <div className="step-description"><span><small>CURRENT OPERATION</small><strong>{step?.description || "Ready when you are"}</strong></span><span className="step-counter">Step {step ? index + 1 : 0} / {result?.steps.length || 0}</span></div>
      <div className="playback-controls"><button onClick={() => { setIndex(0); setPlaying(false); }} disabled={!result}>Reset</button><div><button onClick={() => { setPlaying(false); setIndex((n) => Math.max(0, n - 1)); }} disabled={!result || index === 0}>← Previous</button><button className="play-button" onClick={() => setPlaying((value) => !value)} disabled={!result || (index === last && !playing)}>{playing ? "Pause" : "Play"}</button><button onClick={() => { setPlaying(false); setIndex((n) => Math.min(last, n + 1)); }} disabled={!result || index === last}>Next →</button></div></div>
    </section>
    <section className="complexity-panel"><p className="section-kicker">COMPLEXITY</p><div><span>Best<strong>{result?.time_complexity.best || "O(n)"}</strong></span><span>Average<strong>{result?.time_complexity.average || item.average_case}</strong></span><span>Worst<strong>{result?.time_complexity.worst || item.worst_case}</strong></span><span>Space<strong>{result?.space_complexity || item.space_complexity}</strong></span></div>{result && <p>Comparisons: {result.comparisons} · Swaps: {result.swaps} · Steps: {result.steps.length}</p>}</section>
  </div>;
}
