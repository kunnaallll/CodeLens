
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { CATEGORY_LABELS, CATEGORY_STYLES, DIFFICULTY_STYLES } from "../utils/badges";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import { extractErrorMessage } from "../services/api";
import { getChallenge, submitChallenge, submitQuestionAnswer } from "../services/challenges";
import { runAlgorithm } from "../algorithms/registry";

export default function ChallengeDetail() {
  const { slug } = useParams();
  const toast = useToast();
  const { data: challenge, loading, error, refetch } = useFetch(
    () => getChallenge(slug),
    [slug]
  );

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [answer, setAnswer] = useState("");
  const [pseudocode, setPseudocode] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!startedAt) return;

    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - startedAt) / 1000);
    }, 200);

    return () => clearInterval(timerRef.current);
  }, [startedAt]);

  function handleStart() {
    setResult(null);
    setAnswer("");
    setPseudocode("");
    setElapsed(0);
    setStartedAt(Date.now());
  }

  async function handleSubmit() {
    if (!startedAt || submitting) return;

    if (!answer.trim()) {
      toast.error("Please enter your answer.");
      return;
    }

    const timeTaken = elapsed;
    setSubmitting(true);

    try {
      const algorithm = selectedAlgorithm || algorithms[0] || "";
      const data = challenge.input_data || {};
      const trace = Array.isArray(data.values)
        ? runAlgorithm(algorithm, { values: data.values, target: challenge.target })
        : data.graph
          ? runAlgorithm(algorithm, { graph: data.graph, start: Object.keys(data.graph)[0] })
          : null;
      const operationCount = trace ? (trace.comparisons || 0) + (trace.swaps || 0) : null;
      const res = await submitChallenge(challenge.id, {
        selected_algorithm: algorithm,
        time_taken_seconds: timeTaken,
        submitted_answer: answer.trim(),
        submitted_pseudocode: pseudocode.trim(),
        operation_count: operationCount,
      });

      setResult(res);
      setStartedAt(null);

      toast[res.is_correct ? "success" : "info"](
        `Scored ${res.total_score}/100`
      );
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading challenge..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  const category = challenge.category || "general";
  const difficulty = String(challenge.difficulty || "Easy").toLowerCase();
  const categoryLabel = CATEGORY_LABELS[category] || "General";
  const categoryStyle = CATEGORY_STYLES[category] || "badge-neutral";
  const difficultyStyle = DIFFICULTY_STYLES[difficulty] || "badge-neutral";

  const inputData = challenge.input_data;
  const inputPreview =
    typeof inputData === "string"
      ? inputData
      : inputData?.values
        ? `[${inputData.values.join(", ")}]`
        : inputData?.graph
          ? JSON.stringify(inputData.graph)
          : JSON.stringify(inputData ?? "");

  const algorithms = challenge.allowed_algorithms || ["addition"];
  const answerHint = challenge.category === "sorting"
    ? "Enter the sorted values separated by commas, without brackets (example format: 1, 2, 3)."
    : challenge.category === "searching"
      ? "Enter the target’s zero-based index as a number."
      : challenge.category === "graph"
        ? "Enter the visited node names separated by commas (example format: A, B, C)."
        : "Enter the result requested by the challenge prompt.";
  const activeAlgorithm = selectedAlgorithm || algorithms[0] || "";
  const pseudocodeTemplates = {
    "bubble-sort": "Repeat passes through the array (loop)\n  Compare each adjacent pair\n  If they are out of order, swap them",
    "selection-sort": "For each position (loop)\n  Find the minimum value in the remaining array\n  Swap it into the current position",
    "insertion-sort": "For each item (loop)\n  Store the item as key\n  Shift larger values right, then insert key",
    "merge-sort": "Split the array into left and right halves\n  Recursively sort left and right\n  Merge the sorted halves",
    "quick-sort": "Choose a pivot\n  Partition values around the pivot\n  Swap values into position and recurse",
    "linear-search": "For each item (loop)\n  Compare it with the target\n  Return its index if it matches",
    "binary-search": "Set low and high bounds\n  While low <= high, calculate middle\n  Compare middle value; update low or high",
    bfs: "Add start node to queue and mark visited\n  While queue has nodes, dequeue one\n  Enqueue each unvisited neighbor and mark visited",
    dfs: "Mark current node visited\n  For each unvisited neighbor\n  Visit the neighbor recursively",
  };

  return (
    <div className="challenge-detail">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className={`badge ${categoryStyle}`}>{categoryLabel}</span>
          <span className={`badge ${difficultyStyle}`}>
            {challenge.difficulty}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-ink-900">
          {challenge.title}
        </h1>
        <p className="mt-1 text-ink-600">{challenge.description}</p>
      </div>

      <div className="card p-5">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">
          Input
        </h3>

        <p className="font-mono text-sm text-ink-700">{inputPreview}</p>

        {challenge.target !== null && challenge.target !== undefined && (
          <p className="mt-1 text-sm text-ink-500">
            Target:{" "}
            <span className="font-mono font-semibold">
              {challenge.target}
            </span>
          </p>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-ink-400">
          <span>{challenge.points} points available</span>
          <span>{challenge.time_limit_seconds || 60}s time limit</span>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
          Attempt
        </h3>

        <div className="flex flex-col items-start gap-4">
          <div className="w-full max-w-sm">
            <label className="label" htmlFor="algorithm">
              Choose an algorithm
            </label>
            <select
              id="algorithm"
              className="input"
              value={selectedAlgorithm || algorithms[0] || ""}
              onChange={(event) => setSelectedAlgorithm(event.target.value)}
              disabled={!!startedAt}
            >
              {algorithms.map((algorithm) => (
                <option key={algorithm} value={algorithm}>
                  {algorithm}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="label" htmlFor="submitted-pseudocode">Pseudocode for {activeAlgorithm || "your algorithm"}</label>
            <textarea
              id="submitted-pseudocode"
              className="input min-h-32 font-mono text-sm"
              rows={5}
              value={pseudocode}
              onChange={(event) => setPseudocode(event.target.value)}
              placeholder="Write the main steps in plain language or pseudocode"
              disabled={!startedAt || submitting}
            />
            <p className="mt-1 text-xs text-ink-500">The checker looks for the key steps for the selected algorithm. Enter the final result separately below.</p>
            <button type="button" className="mt-2 text-sm text-brand-700 underline" disabled={!startedAt || submitting} onClick={() => setPseudocode(pseudocodeTemplates[activeAlgorithm] || "")}>Insert a pseudocode outline</button>
          </div>

          <div className="w-full max-w-sm">
            <label className="label" htmlFor="submitted-answer">
              Your answer
            </label>
            <textarea
              id="submitted-answer"
              className="input min-h-16"
              rows={2}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={challenge.category === "searching" ? "e.g. 2" : challenge.category === "graph" ? "e.g. A, B, C" : "e.g. 1, 2, 3"}
              disabled={!startedAt || submitting}
            />
            <p className="mt-1 text-xs text-ink-500">{answerHint}</p>
          </div>

          {!startedAt ? (
            <Button onClick={handleStart}>Start Attempt</Button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-ink-600">
                Elapsed:{" "}
                <span className="font-mono font-semibold">
                  {elapsed.toFixed(1)}s
                </span>
              </p>
              <Button onClick={handleSubmit} loading={submitting}>
                Submit Solution
              </Button>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div
          className={`card p-5 ${
            result.is_correct ? "border-emerald-300" : "border-rose-300"
          }`}
        >
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
            Result
          </h3>

          <div className="challenge-score-grid">
            <div>
              <p className="text-xs text-ink-400">Correctness</p>
              <p className="text-lg font-bold text-ink-800">
                {result.correctness_score}/70
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-400">Efficiency</p>
              <p className="text-lg font-bold text-ink-800">
                {result.efficiency_score}/20
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-400">Speed</p>
              <p className="text-lg font-bold text-ink-800">
                {result.speed_score}/10
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-400">Total</p>
              <p
                className={`text-lg font-bold ${
                  result.is_correct ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {result.total_score}/100
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Your operations</p>
              <p className="text-lg font-bold text-ink-800">{result.operation_count ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Optimal operations</p>
              <p className="text-lg font-bold text-ink-800">{result.optimal_operations ?? "—"}</p>
            </div>
          </div>

          <p className="mt-3 text-sm text-ink-600">{result.feedback}</p>
          {result.pseudocode_feedback && <p className={`mt-2 text-sm ${result.pseudocode_correct ? "text-emerald-700" : "text-amber-700"}`}>Pseudocode check: {result.pseudocode_feedback}</p>}
          {result.points_awarded !== undefined && <p className="mt-1 text-sm text-ink-600">Challenge points earned: {result.points_awarded}/{challenge.points}</p>}
        </div>
      )}

      {challenge.questions?.length > 0 && (
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
            Check Your Understanding
          </h3>

          <div className="flex flex-col gap-4">
            {challenge.questions.map((question) => (
              <QuestionCheck key={question.id} question={question} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCheck({ question }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  async function checkAnswer() {
    if (!selected || checking) return;
    setChecking(true);
    try {
      setResult(await submitQuestionAnswer(question.id, selected));
    } catch (error) {
      setResult({ error: extractErrorMessage(error) });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-700">
        {question.prompt}
      </p>

      <div className="flex flex-wrap gap-2">
        {question.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => { setSelected(choice); setResult(null); }}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              selected === choice
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-ink-200 text-ink-600 hover:bg-ink-50"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
      <Button className="mt-3" onClick={checkAnswer} loading={checking} disabled={!selected || checking}>Check answer</Button>
      {result && <p className={result.error ? "mt-2 text-rose-600" : result.is_correct ? "mt-2 text-emerald-700" : "mt-2 text-rose-600"}>{result.error || result.feedback}{result.explanation ? ` ${result.explanation}` : ""}</p>}
    </div>
  );
}
