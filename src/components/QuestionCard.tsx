import { useMemo, useState } from 'react';
import type { MCQ } from '../content/types';
import { shuffle } from '../lib/random';
import { inline } from './Md';

/** One multiple-choice question with instant feedback + explanation. */
export function QuestionCard({
  q, onAnswer, index, total, compact = false, previous,
}: {
  q: MCQ;
  onAnswer?: (correct: boolean) => void;
  index?: number;
  total?: number;
  compact?: boolean;
  /** Was this answered before? (shown as a hint only) */
  previous?: boolean;
}) {
  const order = useMemo(() => shuffle(q.options.map((_, i) => i)), [q]);
  const [chosen, setChosen] = useState<number | null>(null);
  const answered = chosen !== null;
  const correct = chosen === q.answer;

  const choose = (i: number) => {
    if (answered) return;
    setChosen(i);
    onAnswer?.(i === q.answer);
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-[15px] leading-snug font-semibold text-slate-900 dark:text-white">
          {index !== undefined && <span className="mr-1 text-indigo-600 dark:text-indigo-400">Q{index + 1}{total ? `/${total}` : ''}.</span>}
          {inline(q.q)}
        </p>
        {previous !== undefined && !answered && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${previous ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'}`}>
            {previous ? 'got it before' : 'missed before'}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {order.map((i) => {
          const isAns = i === q.answer;
          const isChosen = i === chosen;
          const cls = !answered
            ? 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-indigo-500/10'
            : isAns
              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100'
              : isChosen
                ? 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-500/15 dark:text-rose-100'
                : 'border-slate-200 opacity-60 dark:border-slate-700';
          return (
            <button
              type="button"
              key={i}
              onClick={() => choose(i)}
              disabled={answered}
              className={`flex w-full items-start gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-[14px] leading-snug transition-colors ${cls}`}
            >
              <span className="mt-px w-4 shrink-0 font-bold">{answered ? (isAns ? '✓' : isChosen ? '✗' : '') : ''}</span>
              <span>{inline(q.options[i])}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-3 rounded-xl p-3 text-[14px] leading-relaxed ${correct ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-amber-50 dark:bg-amber-500/10'}`}>
          <strong className={correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}>
            {correct ? '✅ Correct! ' : '❌ Not quite. '}
          </strong>
          {inline(q.explain)}
        </div>
      )}
    </div>
  );
}
