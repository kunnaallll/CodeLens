export default function VisualizerControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onRestart,
  speed,
  onSpeedChange,
  stepIndex,
  totalSteps,
  disabled,
}) {
  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between text-sm text-ink-500">
        <span>
          Step {Math.min(stepIndex + 1, totalSteps)} / {totalSteps || 0}
        </span>
        <label className="flex items-center gap-2">
          Speed
          <select
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="rounded-md border border-ink-200 bg-white px-2 py-1 text-xs"
          >
            <option value={1200}>0.5x</option>
            <option value={700}>1x</option>
            <option value={350}>2x</option>
            <option value={150}>4x</option>
          </select>
        </label>
      </div>

      <div className="w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-1.5 rounded-full bg-brand-600 transition-all duration-200"
          style={{ width: totalSteps ? `${((stepIndex + 1) / totalSteps) * 100}%` : "0%" }}
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={onRestart} disabled={disabled} className="btn-secondary" title="Restart">
          ⟲
        </button>
        <button onClick={onPrev} disabled={disabled || stepIndex <= 0} className="btn-secondary" title="Previous">
          ◀
        </button>
        {isPlaying ? (
          <button onClick={onPause} disabled={disabled} className="btn-primary w-24 justify-center" title="Pause">
            ⏸ Pause
          </button>
        ) : (
          <button onClick={onPlay} disabled={disabled || stepIndex >= totalSteps - 1} className="btn-primary w-24 justify-center" title="Play">
            ▶ Play
          </button>
        )}
        <button onClick={onNext} disabled={disabled || stepIndex >= totalSteps - 1} className="btn-secondary" title="Next">
          ▶
        </button>
      </div>
    </div>
  );
}
