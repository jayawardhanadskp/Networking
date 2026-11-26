import { modules } from '../content';
import { interview, studyPlan } from '../content/plan';
import { moduleStats, useProgress } from '../lib/progress';
import { Link } from '../lib/router';
import { Card, LinkBtn, ProgressBar } from '../components/ui';
import { toneSolid } from '../components/tone';

function daysLeft(): number {
  const ms = new Date(interview.date).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function Dashboard() {
  const { p } = useProgress();
  const stats = modules.map((m) => ({ m, s: moduleStats(m, p) }));
  const overall = Math.round(stats.reduce((a, x) => a + x.s.percent, 0) / (stats.length || 1));
  const wrongCount = Object.keys(p.wrong).length;

  // Continue: last visited lesson, else first unfinished section.
  let cont: { to: string; label: string } | null = null;
  if (p.last) {
    const [, , mId, , idx] = p.last.path.split('/');
    const m = modules.find((x) => x.id === mId);
    const sec = m?.sections[Number(idx)];
    if (m && sec) cont = { to: p.last.path, label: `${m.title} · ${sec.title}` };
  }
  if (!cont) {
    for (const m of modules) {
      const i = m.sections.findIndex((s) => !p.sections[`${m.id}/${s.id}`]);
      if (i >= 0) {
        cont = { to: `/m/${m.id}/learn/${i}`, label: `${m.title} · ${m.sections[i].title}` };
        break;
      }
    }
  }
  const d = daysLeft();

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-emerald-600 p-5 text-white shadow-lg">
        <div className="text-[12px] font-semibold tracking-wide uppercase opacity-85">{interview.org}</div>
        <div className="text-[18px] leading-tight font-extrabold">{interview.title}</div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-4xl font-black">{d}</div>
            <div className="text-[12px] opacity-90">{d === 1 ? 'day' : 'days'} to the interview ({interview.when})</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">{overall}%</div>
            <div className="text-[12px] opacity-90">overall ready</div>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white" style={{ width: `${overall}%` }} />
        </div>
        {cont && (
          <Link to={cont.to} className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-indigo-700 shadow active:scale-[0.98]">
            <span className="min-w-0">
              <span className="block text-[11px] font-bold tracking-wide uppercase">▶ Continue where you left off</span>
              <span className="block truncate text-[14px] font-semibold text-slate-800">{cont.label}</span>
            </span>
            <span className="text-xl">→</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { to: '/subnet', icon: '🧮', label: 'Subnet trainer' },
          { to: '/mock', icon: '🎤', label: 'Mock interview' },
          { to: '/weak', icon: '🎯', label: `Weak areas${wrongCount ? ` (${wrongCount})` : ''}` },
          { to: '/cards', icon: '🃏', label: 'All flashcards' },
        ].map((x) => (
          <Link key={x.to} to={x.to} className="flex flex-col items-center gap-1 rounded-2xl border border-slate-200 bg-white p-2.5 text-center text-[11.5px] leading-tight font-semibold shadow-sm active:scale-95 dark:border-slate-700 dark:bg-slate-900/60">
            <span className="text-2xl">{x.icon}</span>
            {x.label}
          </Link>
        ))}
      </div>

      <section>
        <h2 className="mb-2 text-[13px] font-bold tracking-wide text-slate-500 uppercase">Modules</h2>
        <div className="space-y-2">
          {stats.map(({ m, s }, i) => (
            <Link key={m.id} to={`/m/${m.id}`} className={`block rounded-2xl border bg-white p-3 shadow-sm active:scale-[0.99] dark:bg-slate-900/60 ${m.priority ? 'border-violet-400 ring-2 ring-violet-200 dark:border-violet-500/70 dark:ring-violet-500/20' : 'border-slate-200 dark:border-slate-700/80'}`}>
              {m.priority && (
                <div className="mb-2 inline-block rounded-full bg-violet-600 px-2 py-0.5 text-[10.5px] font-bold tracking-wide text-white uppercase">⭐ Top priority · your role</div>
              )}
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${toneSolid[m.tone]}`}>{m.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="truncate text-[15px] font-bold text-slate-900 dark:text-white">
                      <span className="mr-1 text-slate-400">{i + 1}.</span>{m.title}
                    </div>
                    <div className="text-[13px] font-bold text-indigo-600 dark:text-indigo-400">{s.percent}%</div>
                  </div>
                  <div className="truncate text-[12px] text-slate-500">{m.short}</div>
                  <ProgressBar value={s.percent} className="mt-1.5" />
                  <div className="mt-1 flex gap-3 text-[11px] text-slate-500">
                    <span>📖 {s.sectionsDone}/{s.sectionsTotal}</span>
                    {m.quiz.length > 0 && <span>📝 {s.quizBest === null ? '–' : `${Math.round(s.quizBest * 100)}%`}</span>}
                    {m.flashcards.length > 0 && <span>🃏 {s.cardsKnown}/{s.cardsTotal}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Card>
        <h2 className="mb-2 text-[15px] font-bold text-slate-900 dark:text-white">🗓 Study plan</h2>
        <ol className="space-y-2">
          {studyPlan.map((d) => (
            <li key={d.day} className="flex gap-3 text-[13.5px]">
              <span className="w-20 shrink-0 font-bold text-indigo-600 dark:text-indigo-400">{d.day}</span>
              <span>
                {d.focus}
                {d.modules.length > 0 && (
                  <span className="mt-1 flex flex-wrap gap-1">
                    {d.modules.map((id) => {
                      const m = modules.find((x) => x.id === id);
                      if (!m) return null;
                      const pc = moduleStats(m, p).percent;
                      return (
                        <Link key={id} to={`/m/${id}`} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${pc >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                          {m.emoji} {m.title} {pc}%
                        </Link>
                      );
                    })}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="flex flex-wrap gap-2">
        <LinkBtn to="/interview" variant="soft">💬 Interview Q&A bank</LinkBtn>
        <LinkBtn to="/search" variant="ghost">🔍 Search everything</LinkBtn>
      </div>
      <ResetButton />
    </div>
  );
}

function ResetButton() {
  const { resetAll } = useProgress();
  return (
    <details className="text-[12px] text-slate-500">
      <summary className="cursor-pointer">Settings</summary>
      <p className="mt-2">Progress is saved in this browser only (localStorage). Your edited interview answers are kept when you reset.</p>
      <button type="button" className="mt-2 rounded-lg border border-rose-300 px-3 py-1.5 font-semibold text-rose-600" onClick={() => { if (window.confirm('Reset all progress?')) resetAll(); }}>
        Reset progress
      </button>
    </details>
  );
}
