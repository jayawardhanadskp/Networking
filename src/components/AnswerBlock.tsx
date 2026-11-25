import { useState } from 'react';
import type { InterviewQA } from '../content/types';
import { useProgress } from '../lib/progress';
import { Md, inline } from './Md';

/** Model answer + tips + "my version" editor (saved in localStorage). */
export function AnswerBlock({ qa, k }: { qa: InterviewQA; k: string }) {
  const { p, setMyAnswer } = useProgress();
  const mine = p.myAnswers[k];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(mine ?? qa.answer);
  const [showModel, setShowModel] = useState(!mine);

  return (
    <div className="space-y-3">
      {mine && !editing && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[14.5px] leading-relaxed dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <div className="mb-1 text-[11px] font-bold tracking-wide text-indigo-700 uppercase dark:text-indigo-300">✍️ My version</div>
          <Md text={mine} />
        </div>
      )}
      {editing ? (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-[14.5px] leading-relaxed dark:border-slate-600 dark:bg-slate-900"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={() => { setMyAnswer(k, draft); setEditing(false); }} className="rounded-lg bg-emerald-600 px-3 py-2 text-[13px] font-semibold text-white">Save my version</button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold dark:border-slate-600">Cancel</button>
            {mine && (
              <button type="button" onClick={() => { setMyAnswer(k, ''); setDraft(qa.answer); setEditing(false); setShowModel(true); }} className="ml-auto rounded-lg px-3 py-2 text-[13px] font-semibold text-rose-600">Delete my version</button>
            )}
          </div>
        </div>
      ) : (
        <>
          {mine && (
            <button type="button" onClick={() => setShowModel(!showModel)} className="text-[12.5px] font-semibold text-slate-500 underline">
              {showModel ? 'Hide' : 'Show'} original model answer
            </button>
          )}
          {showModel && (
            <div className="rounded-xl bg-slate-50 p-3 text-[14.5px] leading-relaxed dark:bg-slate-800/60">
              <div className="mb-1 text-[11px] font-bold tracking-wide text-slate-500 uppercase">{qa.type === 'hr' ? 'Template — edit with your details' : 'Model answer'}</div>
              <Md text={qa.answer} />
            </div>
          )}
          <button type="button" onClick={() => { setDraft(mine ?? qa.answer); setEditing(true); }} className="text-[13px] font-semibold text-indigo-600 dark:text-indigo-400">
            ✏️ {mine ? 'Edit my version' : 'Write my own version'}
          </button>
        </>
      )}
      {qa.tips && qa.tips.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13.5px] dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="mb-1 text-[11px] font-bold tracking-wide text-amber-700 uppercase dark:text-amber-300">💡 Tips</div>
          <ul className="space-y-1">
            {qa.tips.map((t, i) => <li key={i}>• {inline(t)}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
