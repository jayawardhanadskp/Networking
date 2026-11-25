import { useState } from 'react';
import { allInterview, modules } from '../content';
import type { InterviewQA } from '../content/types';
import { useProgress } from '../lib/progress';
import { inline } from '../components/Md';
import { AnswerBlock } from '../components/AnswerBlock';
import { Empty, LinkBtn, PageHeader } from '../components/ui';

const typeLabel: Record<InterviewQA['type'], string> = { technical: '🔧 Technical', scenario: '🧩 Scenario', hr: '🙋 HR / personal' };

export function InterviewPage({ initialModule }: { initialModule: string }) {
  const { p } = useProgress();
  const [mod, setMod] = useState(initialModule);
  const [type, setType] = useState<'all' | InterviewQA['type']>('all');
  const [open, setOpen] = useState<Set<string>>(new Set());
  const list = allInterview.filter((x) => (mod === 'all' || x.module.id === mod) && (type === 'all' || x.qa.type === type));

  const toggle = (k: string) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    return n;
  });

  return (
    <div className="space-y-3">
      <PageHeader
        title="💬 Interview Q&A bank"
        sub="Try to answer out loud first. Then open the model answer."
        right={<LinkBtn to="/mock" variant="soft" className="!px-3 !py-2 text-[12.5px]">🎤 Mock</LinkBtn>}
      />
      <div className="flex flex-wrap gap-2 text-[13px]">
        <select value={mod} onChange={(e) => setMod(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-600 dark:bg-slate-900">
          <option value="all">All modules ({allInterview.length})</option>
          {modules.filter((m) => m.interview.length).map((m) => <option key={m.id} value={m.id}>{m.emoji} {m.title} ({m.interview.length})</option>)}
        </select>
        <div className="flex gap-1">
          {(['all', 'technical', 'scenario', 'hr'] as const).map((t) => (
            <button type="button" key={t} onClick={() => setType(t)} className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${type === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {t === 'all' ? 'All' : typeLabel[t].split(' ')[0] + ' ' + t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[12px] text-slate-500">
        <span>{list.length} questions</span>
        <span className="space-x-3">
          <button type="button" className="font-semibold text-indigo-600 dark:text-indigo-400" onClick={() => setOpen(new Set(list.map((x) => x.key)))}>Show all answers</button>
          <button type="button" className="font-semibold text-indigo-600 dark:text-indigo-400" onClick={() => setOpen(new Set())}>Hide all</button>
        </span>
      </div>
      {list.length === 0 && <Empty>No questions match this filter.</Empty>}
      <div className="space-y-2">
        {list.map(({ key, module, qa }) => {
          const isOpen = open.has(key);
          const rating = p.ratings[key];
          return (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60">
              <button type="button" onClick={() => toggle(key)} className="flex w-full items-start gap-3 p-3.5 text-left">
                <span className="mt-0.5 text-lg">{module.emoji}</span>
                <span className="flex-1">
                  <span className="block text-[15px] leading-snug font-semibold text-slate-900 dark:text-white">{inline(qa.q)}</span>
                  <span className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span>{typeLabel[qa.type]}</span>
                    {rating && <span>⭐ {rating}/5</span>}
                    {p.myAnswers[key] && <span>✍️ my version</span>}
                  </span>
                </span>
                <span className="text-[12px] font-semibold text-indigo-600 dark:text-indigo-400">{isOpen ? 'Hide ▲' : 'Show ▼'}</span>
              </button>
              {isOpen && (
                <div className="border-t border-slate-200 p-3.5 dark:border-slate-700">
                  <AnswerBlock qa={qa} k={key} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
