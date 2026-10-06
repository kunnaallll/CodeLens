import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { CATEGORY_LABELS, CATEGORY_STYLES, DIFFICULTY_STYLES } from "../utils/badges";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import { extractErrorMessage } from "../services/api";
import { getChallenge, submitChallenge } from "../services/challenges";

export default function ChallengeDetail() {
  const { slug } = useParams();
  const toast = useToast();
  const { data: challenge, loading, error, refetch } = useFetch(() => getChallenge(slug), [slug]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (challenge && !selectedAlgorithm) setSelectedAlgorithm(challenge.allowed_algorithms[0] || "");
  }, [challenge, selectedAlgorithm]);

  useEffect(() => {
    if (!startedAt) return;
    timerRef.current = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 200);
    return () => clearInterval(timerRef.current);
  }, [startedAt]);

  function handleStart() {
    setResult(null);
    setStartedAt(Date.now());
    setElapsed(0);
  }

  async function handleSubmit() {
    if (!startedAt) return;
    const timeTaken = (Date.now() - startedAt) / 1000;
    setSubmitting(true);
    try {
      const res = await submitChallenge(slug, { selected_algorithm: selectedAlgorithm, time_taken_seconds: timeTaken });
      setResult(res);
      setStartedAt(null);
      toast[res.is_correct ? "success" : "info"](`Scored ${res.total_score}/100`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading challenge..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const inputPreview = challenge.input_data.values
    ? `[${challenge.input_data.values.join(", ")}]`
    : JSON.stringify(challenge.input_data.graph);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className={`badge ${CATEGORY_STYLES[challenge.category]}`}>{CATEGORY_LABELS[challenge.category]}</span>
          <span className={`badge ${DIFFICULTY_STYLES[challenge.difficulty]}`}>{challenge.difficulty}</span>
        </div>
        <h1 className="text-2xl font-bold text-ink-900">{challenge.title}</h1>
        <p className="mt-1 text-ink-600">{challenge.description}</p>
      </div>

      <div className="card p-5">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Input</h3>
        <p className="font-mono text-sm text-ink-700">{inputPreview}</p>
        {challenge.target !== null && challenge.target !== undefined && (
          <p className="mt-1 text-sm text-ink-500">Target: <span className="font-mono font-semibold">{challenge.target}</span></p>
        )}
        <div className="mt-3 flex items-center gap-4 text-xs text-ink-400">
          <span>{challenge.points} points available</span>
          <span>{challenge.time_limit_seconds}s time limit</span>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">Attempt</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-56">
            <label className="label">Choose an algorithm</label>
            <select className="input" value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)} disabled={!!startedAt}>
              {challenge.allowed_algorithms.map((slugOption) => (
                <option key={slugOption} value={slugOption}>{slugOption}</option>
              ))}
            </select>
          </div>

          {!startedAt ? (
            <Button onClick={handleStart}>Start Attempt</Button>
          ) : (
            <>
              <div className="text-sm text-ink-600">Elapsed: <span className="font-mono font-semibold">{elapsed.toFixed(1)}s</span></div>
              <Button onClick={handleSubmit} loading={submitting}>Submit Solution</Button>
            </>
          )}
        </div>
      </div>

      {result && (
        <div className={`card p-5 ${result.is_correct ? "border-emerald-300" : "border-rose-300"}`}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">Result</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-ink-400">Correctness</p>
              <p className="text-lg font-bold text-ink-800">{result.correctness_score}/70</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Efficiency</p>
              <p className="text-lg font-bold text-ink-800">{result.efficiency_score}/20</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Speed</p>
              <p className="text-lg font-bold text-ink-800">{result.speed_score}/10</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Total</p>
              <p className={`text-lg font-bold ${result.is_correct ? "text-emerald-600" : "text-rose-600"}`}>{result.total_score}/100</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-ink-600">{result.feedback}</p>
        </div>
      )}

      {challenge.questions?.length > 0 && (
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">Check Your Understanding</h3>
          <div className="flex flex-col gap-4">
            {challenge.questions.map((q) => (
              <QuestionCheck key={q.id} question={q} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCheck({ question }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-700">{question.prompt}</p>
      <div className="flex flex-wrap gap-2">
        {question.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => setSelected(choice)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              selected === choice ? "border-brand-500 bg-brand-50 text-brand-700" : "border-ink-200 text-ink-600 hover:bg-ink-50"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
