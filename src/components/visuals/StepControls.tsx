export function StepControls({
  step, total, setStep, labels,
}: { step: number; total: number; setStep: (n: number) => void; labels?: { next?: string } }) {
  const atEnd = step >= total - 1;
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        onClick={() => setStep(Math.max(0, step - 1))}
        disabled={step === 0}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:opacity-40 dark:border-slate-600"
        aria-label="Previous step"
      >
        ◀ Back
      </button>
      <div className="flex flex-1 items-center justify-center gap-1" aria-label={`Step ${step + 1} of ${total}`}>
        {total <= 12 ? (
          Array.from({ length: total }, (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${i === step ? 'w-5 bg-indigo-600 dark:bg-indigo-400' : i < step ? 'w-2 bg-indigo-300 dark:bg-indigo-700' : 'w-2 bg-slate-300 dark:bg-slate-600'}`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))
        ) : (
          <span className="text-xs font-medium text-slate-500">{step + 1} / {total}</span>
        )}
      </div>
      {atEnd ? (
        <button type="button" onClick={() => setStep(0)} className="rounded-lg border border-indigo-300 px-3 py-2 text-sm font-semibold text-indigo-700 dark:border-indigo-500/50 dark:text-indigo-300">
          ↺ Again
        </button>
      ) : (
        <button type="button" onClick={() => setStep(step + 1)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm active:scale-95 dark:bg-indigo-500">
          {labels?.next ?? 'Next'} ▶
        </button>
      )}
    </div>
  );
}

export function StepBadge({ step, total }: { step: number; total: number }) {
  return <span className="mr-1.5 inline-block rounded bg-indigo-600 px-1.5 py-0.5 text-[11px] font-bold text-white dark:bg-indigo-500">Step {step + 1}/{total}</span>;
}
