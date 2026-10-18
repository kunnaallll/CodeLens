
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
  const { data: challenge, loading, error, refetch } = useFetch(
    () => getChallenge(slug),
    [slug]
  );

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [answer, setAnswer] = useState("");
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
    setElapsed(0);
    setStartedAt(Date.now());
  }

  async function handleSubmit() {
    if (!startedAt || submitting) return;

    if (!answer.trim()) {
      toast.error("Please enter your answer.");
      return;
    }

    const timeTaken = (Date.now() - startedAt) / 1000;
    setSubmitting(true);

    try {
      const res = await submitChallenge(challenge.id, {
        selected_algorithm: selectedAlgorithm || "addition",
        time_taken_seconds: timeTaken,
        submitted_answer: answer.trim(),
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

  return (
    <div className="flex flex-col gap-6">
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

          <div className="w-full max-w-sm">
            <label className="label" htmlFor="submitted-answer">
              Your answer
            </label>
            <input
              id="submitted-answer"
              className="input"
              type="text"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Enter your answer"
              disabled={!startedAt || submitting}
            />
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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
          </div>

          <p className="mt-3 text-sm text-ink-600">{result.feedback}</p>
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

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-700">
        {question.prompt}
      </p>

      <div className="flex flex-wrap gap-2">
        {question.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => setSelected(choice)}
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
    </div>
  );
}
