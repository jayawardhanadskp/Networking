import { getModule } from '../content';
import { moduleStats, useProgress } from '../lib/progress';
import { Link } from '../lib/router';
import { Card, Empty, LinkBtn, PageHeader, ProgressBar } from '../components/ui';
import { toneSolid } from '../components/tone';

export function ModulePage({ moduleId }: { moduleId: string }) {
  const m = getModule(moduleId);
  const { p } = useProgress();
  if (!m) return <Empty>Module not found. <Link to="/" className="text-indigo-600">Go home</Link></Empty>;
  const s = moduleStats(m, p);
  const next = Math.max(0, m.sections.findIndex((x) => !p.sections[`${m.id}/${x.id}`]));

  return (
    <div className="space-y-4">
      <PageHeader back="/" title={<span><span className="mr-2">{m.emoji}</span>{m.title}</span>} sub={m.short} />
      <Card>
        <div className="flex items-center justify-between text-[13px] font-semibold">
          <span>Module progress</span>
          <span className="text-indigo-600 dark:text-indigo-400">{s.percent}%</span>
        </div>
        <ProgressBar value={s.percent} className="mt-2" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {m.sections.length > 0 && (
            <LinkBtn to={`/m/${m.id}/learn/${next}`} className="col-span-3">
              📖 {s.sectionsDone === 0 ? 'Start lessons' : s.sectionsDone === s.sectionsTotal ? 'Review lessons' : 'Continue lessons'}
            </LinkBtn>
          )}
          {m.quiz.length > 0 && <LinkBtn to={`/m/${m.id}/quiz`} variant="soft" className="flex-col !gap-0 !px-1 text-[12.5px]"><span className="text-lg">📝</span>Quiz ({m.quiz.length})</LinkBtn>}
          {m.flashcards.length > 0 && <LinkBtn to={`/m/${m.id}/cards`} variant="soft" className="flex-col !gap-0 !px-1 text-[12.5px]"><span className="text-lg">🃏</span>Cards ({m.flashcards.length})</LinkBtn>}
          {m.interview.length > 0 && <LinkBtn to={`/interview?m=${m.id}`} variant="soft" className="flex-col !gap-0 !px-1 text-[12.5px]"><span className="text-lg">💬</span>Q&A ({m.interview.length})</LinkBtn>}
        </div>
      </Card>

      <section>
        <h2 className="mb-2 text-[13px] font-bold tracking-wide text-slate-500 uppercase">Lessons</h2>
        <ol className="space-y-1.5">
          {m.sections.map((sec, i) => {
            const done = p.sections[`${m.id}/${sec.id}`];
            return (
              <li key={sec.id}>
                <Link to={`/m/${m.id}/learn/${i}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 active:scale-[0.99] dark:border-slate-700/80 dark:bg-slate-900/60">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${done ? 'bg-emerald-500 text-white' : `${toneSolid[m.tone]} opacity-80`}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className="flex-1 text-[14px] font-semibold text-slate-800 dark:text-slate-100">{sec.title}</span>
                  <span className="text-slate-400">›</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
