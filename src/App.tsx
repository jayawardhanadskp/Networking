import { Link, useRoute } from './lib/router';
import { useTheme } from './lib/theme';
import { Dashboard } from './pages/Dashboard';
import { ModulePage } from './pages/ModulePage';
import { LessonPage } from './pages/LessonPage';
import { QuizPage } from './pages/QuizPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { SubnetPage } from './pages/SubnetPage';
import { InterviewPage } from './pages/InterviewPage';
import { MockPage } from './pages/MockPage';
import { WeakPage } from './pages/WeakPage';
import { SearchPage } from './pages/SearchPage';

const nav = [
  { to: '/', label: 'Home', icon: '🏠', match: (p: string[]) => p.length === 0 || p[0] === 'm' },
  { to: '/subnet', label: 'Subnet', icon: '🧮', match: (p: string[]) => p[0] === 'subnet' },
  { to: '/interview', label: 'Q&A', icon: '💬', match: (p: string[]) => p[0] === 'interview' },
  { to: '/mock', label: 'Mock', icon: '🎤', match: (p: string[]) => p[0] === 'mock' },
  { to: '/search', label: 'Search', icon: '🔍', match: (p: string[]) => p[0] === 'search' },
];

function Page({ path, query }: { path: string[]; query: URLSearchParams }) {
  const [a, b, c, d] = path;
  if (!a) return <Dashboard />;
  if (a === 'm' && b) {
    if (c === 'learn') return <LessonPage moduleId={b} index={Number(d ?? 0)} />;
    if (c === 'quiz') return <QuizPage moduleId={b} />;
    if (c === 'cards') return <FlashcardsPage moduleId={b} />;
    return <ModulePage moduleId={b} />;
  }
  if (a === 'cards') return <FlashcardsPage moduleId="all" />;
  if (a === 'subnet') return <SubnetPage />;
  if (a === 'interview') return <InterviewPage initialModule={query.get('m') ?? 'all'} />;
  if (a === 'mock') return <MockPage />;
  if (a === 'weak') return <WeakPage />;
  if (a === 'search') return <SearchPage initial={query.get('q') ?? ''} />;
  return <Dashboard />;
}

export default function App() {
  const { path, query } = useRoute();
  const { mode, cycle } = useTheme();

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm text-white">IT</span>
            <span className="text-[15px] leading-tight">NSB Interview Prep</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold ${n.match(path) ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                {n.icon} {n.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={cycle}
            className="ml-auto rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px] font-semibold md:ml-2 dark:border-slate-700"
            aria-label={`Theme: ${mode}. Tap to change.`}
            title={`Theme: ${mode}`}
          >
            {mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '🖥️'} <span className="text-[11px] capitalize">{mode}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4 pb-28 md:pb-12">
        <Page path={path} query={query} />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={`flex flex-col items-center py-2 text-[11px] font-semibold ${n.match(path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
              <span className="text-lg leading-none">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
