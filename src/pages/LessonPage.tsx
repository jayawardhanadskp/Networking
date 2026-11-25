import { useEffect, useState } from 'react';
import { getModule } from '../content';
import { useProgress } from '../lib/progress';
import { Link, navigate } from '../lib/router';
import { Md, inline } from '../components/Md';
import { Visual } from '../components/Visual';
import { QuestionCard } from '../components/QuestionCard';
import { Empty, ProgressBar } from '../components/ui';

export function LessonPage({ moduleId, index }: { moduleId: string; index: number }) {
  const m = getModule(moduleId);
  const { p, completeSection, recordCheck, setLast } = useProgress();
  const sec = m?.sections[index];
  const [answered, setAnswered] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setAnswered({});
    if (m && sec) setLast(`/m/${m.id}/learn/${index}`, sec.title);
  }, [m, sec, index, setLast]);

  if (!m || !sec) return <Empty>Lesson not found. <Link to="/" className="text-indigo-600">Go home</Link></Empty>;

  const total = m.sections.length;
  const done = !!p.sections[`${m.id}/${sec.id}`];
  const allAnswered = sec.check.every((q) => answered[q.id!] !== undefined);
  const isLast = index >= total - 1;

  const finish = () => {
    if (allAnswered) completeSection(m.id, sec.id);
    navigate(isLast ? (m.quiz.length ? `/m/${m.id}/quiz` : `/m/${m.id}`) : `/m/${m.id}/learn/${index + 1}`);
  };

  return (
    <article className="text-[15.5px] leading-relaxed">
      <div className="mb-3">
        <div className="flex items-center justify-between text-[12.5px] font-semibold">
          <Link to={`/m/${m.id}`} className="text-indigo-600 dark:text-indigo-400">← {m.emoji} {m.title}</Link>
          <span className="text-slate-500">{index + 1} / {total}</span>
        </div>
        <ProgressBar value={((index + (done ? 1 : 0)) / total) * 100} className="mt-2" />
      </div>

      <h1 className="mb-3 text-[23px] leading-tight font-extrabold text-slate-900 dark:text-white">
        {sec.title} {done && <span className="align-middle text-[13px] font-semibold text-emerald-600">✓ done</span>}
      </h1>

      {sec.analogy && (
        <div className="mb-4 flex gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-3.5 dark:border-sky-500/30 dark:bg-sky-500/10">
          <span className="text-2xl">💡</span>
          <div>
            <div className="text-[11px] font-bold tracking-wide text-sky-700 uppercase dark:text-sky-300">Think of it like this</div>
            <div className="mt-0.5">{inline(sec.analogy)}</div>
          </div>
        </div>
      )}

      <Md text={sec.body} />

      {sec.visuals.map((v, i) => <Visual key={`${sec.id}-${i}`} spec={v} />)}

      <div className="my-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <div className="mb-1 text-[11px] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">🏦 Bank example</div>
        <Md text={sec.bank} />
      </div>

      <div className="my-4 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <div className="mb-1.5 text-[11px] font-bold tracking-wide text-amber-700 uppercase dark:text-amber-300">⭐ Remember for the interview</div>
        <ul className="space-y-1.5">
          {sec.remember.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-bold text-amber-600">{i + 1}.</span>
              <span>{inline(r)}</span>
            </li>
          ))}
        </ul>
      </div>

      {sec.check.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-[16px] font-bold text-slate-900 dark:text-white">✅ Quick check</h2>
          <div className="space-y-3">
            {sec.check.map((q, i) => {
              const key = `${m.id}/${sec.id}/${q.id}`;
              return (
                <QuestionCard
                  key={key}
                  q={q}
                  index={i}
                  compact
                  previous={p.checks[key]}
                  onAnswer={(c) => {
                    recordCheck(key, c);
                    setAnswered((a) => ({ ...a, [q.id!]: c }));
                  }}
                />
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-6 flex gap-2">
        {index > 0 && (
          <Link to={`/m/${m.id}/learn/${index - 1}`} className="rounded-xl border border-slate-300 px-4 py-3 text-[14px] font-semibold dark:border-slate-600">
            ◀
          </Link>
        )}
        <button
          type="button"
          onClick={finish}
          className={`flex-1 rounded-xl px-4 py-3 text-[15px] font-bold text-white shadow-sm active:scale-[0.98] ${allAnswered || done ? 'bg-emerald-600' : 'bg-indigo-600 dark:bg-indigo-500'}`}
        >
          {allAnswered || done ? '✓ Mark done & ' : 'Skip for now & '}
          {isLast ? (m.quiz.length ? 'take the quiz' : 'finish') : 'next section'} ▶
        </button>
      </div>
      {!allAnswered && !done && sec.check.length > 0 && (
        <p className="mt-2 text-center text-[12px] text-slate-500">Tip: answer the quick check first. Wrong answers go to your Weak Areas list.</p>
      )}
    </article>
  );
}
