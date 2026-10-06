import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ArrayVisualizer from "../components/ArrayVisualizer";
import ComplexityCard from "../components/ComplexityCard";
import ErrorMessage from "../components/ErrorMessage";
import GraphVisualizer from "../components/GraphVisualizer";
import LoadingSpinner from "../components/LoadingSpinner";
import VisualizerControls from "../components/VisualizerControls";
import { algorithmKind, DEMO_GRAPH, randomArray, runAlgorithm } from "../algorithms/registry";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import { getAlgorithm } from "../services/algorithms";
import { extractErrorMessage } from "../services/api";
import { recordAlgorithmRun } from "../services/progress";

const FINAL_TYPES = new Set(["done", "found", "not_found"]);

export default function Visualizer() {
  const { algorithm: slug } = useParams();
  const toast = useToast();
  const { data: algorithm, loading, error, refetch } = useFetch(() => getAlgorithm(slug), [slug]);
  const kind = algorithmKind(slug);

  const [values, setValues] = useState([]);
  const [target, setTarget] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [startNode, setStartNode] = useState("A");
  const [run, setRun] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const recordedRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (kind === "sort" || kind === "search") {
      const arr = randomArray(7);
      setValues(arr);
      setCustomInput(arr.join(", "));
      if (kind === "search") setTarget(String(arr[Math.floor(Math.random() * arr.length)]));
    }
  }, [kind]);

  function buildInput() {
    if (kind === "graph") return { graph: DEMO_GRAPH, start: startNode };
    return { values, target: Number(target) };
  }

  function startRun(input) {
    const result = runAlgorithm(slug, input);
    setRun(result);
    setStepIndex(0);
    setIsPlaying(false);
    recordedRef.current = false;
  }

  useEffect(() => {
    if (values.length && kind !== "graph") startRun({ values, target: Number(target) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (kind === "graph") startRun({ graph: DEMO_GRAPH, start: startNode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, startNode]);

  useEffect(() => {
    if (!isPlaying || !run) return;
    if (stepIndex >= run.steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    intervalRef.current = setTimeout(() => setStepIndex((i) => i + 1), speed);
    return () => clearTimeout(intervalRef.current);
  }, [isPlaying, stepIndex, run, speed]);

  const currentStep = run?.steps?.[stepIndex];

  useEffect(() => {
    if (!run || !currentStep || recordedRef.current) return;
    if (FINAL_TYPES.has(currentStep.type)) {
      recordedRef.current = true;
      recordAlgorithmRun({ algorithm: slug, comparisons: run.comparisons, swaps: run.swaps })
        .then(() => toast.success("Progress saved — algorithm marked complete!"))
        .catch((err) => toast.error(extractErrorMessage(err)));
    }
  }, [currentStep, run, slug, toast]);

  function handleGenerateRandom() {
    const arr = randomArray(7);
    setValues(arr);
    setCustomInput(arr.join(", "));
    if (kind === "search") setTarget(String(arr[Math.floor(Math.random() * arr.length)]));
  }

  function handleApplyCustom() {
    const parsed = customInput
      .split(",")
      .map((v) => parseInt(v.trim(), 10))
      .filter((v) => !Number.isNaN(v));
    if (!parsed.length) {
      toast.error("Enter at least one valid number.");
      return;
    }
    setValues(parsed);
    if (kind === "search" && !target) setTarget(String(parsed[0]));
  }

  const runStats = useMemo(() => {
    if (!run) return null;
    return { comparisons: run.comparisons, swaps: run.swaps, steps: run.steps.length };
  }, [run]);

  if (loading) return <LoadingSpinner label="Loading visualizer..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{algorithm.name} Visualizer</h1>
        <p className="text-sm text-ink-500">{algorithm.description}</p>
      </div>

      <div className="card flex flex-wrap items-end gap-3 p-4">
        {kind !== "graph" ? (
          <>
            <div className="flex-1 min-w-[220px]">
              <label className="label">Custom Array (comma-separated)</label>
              <input className="input" value={customInput} onChange={(e) => setCustomInput(e.target.value)} />
            </div>
            {kind === "search" && (
              <div className="w-28">
                <label className="label">Target</label>
                <input className="input" value={target} onChange={(e) => setTarget(e.target.value)} />
              </div>
            )}
            <button className="btn-secondary" onClick={handleApplyCustom}>Apply</button>
            <button className="btn-secondary" onClick={handleGenerateRandom}>Generate Random</button>
          </>
        ) : (
          <div className="w-40">
            <label className="label">Start Node</label>
            <select className="input" value={startNode} onChange={(e) => setStartNode(e.target.value)}>
              {Object.keys(DEMO_GRAPH).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {run && (
        <>
          <div className="card p-6">
            {kind === "graph" ? (
              <GraphVisualizer graph={DEMO_GRAPH} step={currentStep} />
            ) : (
              <ArrayVisualizer array={currentStep?.array || values} step={currentStep} searchRange={currentStep?.range} />
            )}
            <p className="mt-4 text-center text-sm font-medium text-ink-600">{currentStep?.description}</p>
          </div>

          <VisualizerControls
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onNext={() => setStepIndex((i) => Math.min(i + 1, run.steps.length - 1))}
            onPrev={() => setStepIndex((i) => Math.max(i - 1, 0))}
            onRestart={() => { setStepIndex(0); setIsPlaying(false); }}
            speed={speed}
            onSpeedChange={setSpeed}
            stepIndex={stepIndex}
            totalSteps={run.steps.length}
          />

          <ComplexityCard algorithm={algorithm} runStats={runStats} />
        </>
      )}
    </div>
  );
}
