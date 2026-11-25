import { useEffect, useState } from 'react';
import { allInterview, type InterviewRef } from '../content';
import { useProgress } from '../lib/progress';
import { shuffle } from '../lib/random';
import { inline } from '../components/Md';
import { AnswerBlock } from '../components/AnswerBlock';
import { Btn, Card, PageHeader } from '../components/ui';

const SECONDS = 120;

type Mix = 'mixed' | 'technical' | 'hr';

function pick(count: number, mix: Mix): InterviewRef[] {
  const tech = allInterview.filter((x) => x.qa.type !== 'hr');
  const hr = allInterview.filter((x) => x.qa.type === 'hr');
  if (mix === 'technical') return shuffle(tech).slice(0, count);
  if (mix === 'hr') return shuffle(hr).slice(0, count);
  // Mixed: like a real panel — about 1 in 4 HR, always start with "tell me about yourself" if available.
  const nHr = Math.max(1, Math.round(count / 4));
  const intro = hr.find((x) => /tell me about yourself/i.test(x.qa.q));
  const hrPick = shuffle(hr.filter((x) => x !== intro)).slice(0, intro ? nHr - 1 : nHr);
  const techPick = shuffle(tech).slice(0, count - hrPick.length - (intro ? 1 : 0));
  return [...(intro ? [intro] : []), ...shuffle([...techPick, ...hrPick])];
}

export function MockPage() {
  const { setRating } = useProgress();
  const [session, setSession] = useState<InterviewRef[] | null>(null);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [left, setLeft] = useState(SECONDS);
  const [running, setRunning] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [count, setCount] = useState(8);
  const [mix, setMix] = useState<Mix>('mixed');

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => {
      if (s <= 1) {
        setRunning(false);
        return 0;
      }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [running]);

  const start = () => {
    setSession(pick(count, mix));
    setI(0);
    setScores({});
    setRevealed(false);
    setLeft(SECONDS);
    setRunning(true);
  };

  const next = () => {
    setI((x) => x + 1);
    setRevealed(false);
    setLeft(SECONDS);
    setRunning(true);
  };

  if (!session) {
    return (
      <div className="space-y-3">
        <PageHeader title="🎤 Mock interview" sub="Random questions from all modules + HR. Answer OUT LOUD (2 minutes each), then reveal the model answer and rate yourself honestly." />
        <Card className="space-y-4">
          <div>
            <div className="mb-1.5 text-[13px] font-semibold">Number of questions</div>
            <div className="flex gap-2">
              {[5, 8, 12, 20].map((n) => (
                <button type="button" key={n} onClick={() => setCount(n)} className={`flex-1 rounded-xl py-2 text-[14px] font-bold ${count === n ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[13px] font-semibold">Question mix</div>
            <div className="grid grid-cols-3 gap-2">
              {([['mixed', 'Real panel mix'], ['technical', 'Technical only'], ['hr', 'HR only']] as const).map(([k, l]) => (
                <button type="button" key={k} onClick={() => setMix(k)} className={`rounded-xl px-1 py-2 text-[12.5px] font-bold ${mix === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{l}</button>
              ))}
            </div>
          </div>
          <Btn onClick={start} className="w-full !py-3.5 text-[16px]">Start mock interview ▶</Btn>
          <ul className="space-y-1 text-[13px] text-slate-600 dark:text-slate-400">
            <li>• Sit up straight, look at the screen like it is the panel.</li>
            <li>• Structure: <strong>definition → how it works → bank example</strong>.</li>
            <li>• If you don't know: say what you <em>do</em> know and how you would find out.</li>
          </ul>
        </Card>
      </div>
    );
  }

  if (i >= session.length) {
    const vals = session.map((x) => scores[x.key]).filter(Boolean);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    const weak = session.filter((x) => (scores[x.key] ?? 0) <= 2);
    return (
      <div className="space-y-3">
        <PageHeader title="🎤 Mock interview finished" />
        <Card className="text-center">
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{avg.toFixed(1)}<span className="text-2xl">/5</span></div>
          <p className="mt-1 text-[14px]">Average self-rating over {vals.length} questions</p>
          <Btn onClick={() => setSession(null)} className="mt-4">↺ New mock interview</Btn>
        </Card>
        {weak.length > 0 && (
          <Card>
            <h2 className="mb-2 font-bold">Practise these again (rated 1–2)</h2>
            <ul className="space-y-1.5 text-[14px]">
              {weak.map((x) => <li key={x.key}>{x.module.emoji} {inline(x.qa.q)}</li>)}
            </ul>
          </Card>
        )}
      </div>
    );
  }

  const cur = session[i];
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');
  const pct = (left / SECONDS) * 100;
  const rated = scores[cur.key];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[13px] font-semibold">
        <span>Question {i + 1} of {session.length}</span>
        <button type="button" onClick={() => setSession(null)} className="text-slate-500">✕ End</button>
      </div>
      <Card>
        <div className="mb-2 text-[12px] text-slate-500">{cur.module.emoji} {cur.module.title}</div>
        <p className="text-[19px] leading-snug font-bold text-slate-900 dark:text-white">{inline(cur.qa.q)}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-slate-200 dark:stroke-slate-700" />
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" strokeLinecap="round" stroke={left <= 20 ? '#f43f5e' : '#6366f1'} strokeDasharray={`${(pct / 100) * 97.4} 97.4`} />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center font-mono text-[14px] font-bold ${left <= 20 ? 'text-rose-600' : ''}`}>{mm}:{ss}</span>
          </div>
          <div className="flex flex-1 flex-wrap gap-2">
            <Btn variant="ghost" onClick={() => setRunning(!running)} className="!px-3">{running ? '⏸ Pause' : '▶ Resume'}</Btn>
            {!revealed && <Btn onClick={() => { setRevealed(true); setRunning(false); }} className="!px-3">Reveal answer</Btn>}
          </div>
        </div>
        {left === 0 && !revealed && <p className="mt-2 text-[13px] font-semibold text-rose-600">⏰ Time is up — finish your sentence and reveal.</p>}
      </Card>

      {revealed && (
        <>
          <Card><AnswerBlock qa={cur.qa} k={cur.key} /></Card>
          <Card>
            <div className="mb-2 text-[14px] font-semibold">How well did you answer?</div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => { setScores((s) => ({ ...s, [cur.key]: n })); setRating(cur.key, n); }}
                  className={`rounded-xl py-2.5 text-[16px] font-bold ${rated === n ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-slate-500"><span>1 = blank</span><span>5 = perfect</span></div>
            <Btn onClick={next} disabled={!rated} className="mt-3 w-full">{i < session.length - 1 ? 'Next question ▶' : 'Finish 🏁'}</Btn>
          </Card>
        </>
      )}
    </div>
  );
}
