import { useMemo, useState } from 'react';
import {
  ALL_KINDS, calculate, checkAnswer, explainSteps, generateQuestion, parseInput,
  type PracticeKind, type PracticeQuestion,
} from '../lib/subnet';
import { useProgress } from '../lib/progress';
import { inline } from '../components/Md';
import { Btn, Card, PageHeader } from '../components/ui';
import { SubnetBits } from '../components/custom/SubnetBits';

const kindLabels: Record<PracticeKind, string> = {
  network: 'Network address',
  broadcast: 'Broadcast',
  firstHost: 'First host',
  lastHost: 'Last host',
  hosts: 'Usable hosts',
  mask: 'Mask from /prefix',
  wildcard: 'Wildcard mask',
  prefixForHosts: 'Prefix for N hosts',
};

export function SubnetPage() {
  const [tab, setTab] = useState<'calc' | 'practice' | 'bits'>('calc');
  return (
    <div className="space-y-3">
      <PageHeader title="🧮 Subnetting trainer" sub="Calculator, binary view and unlimited practice questions with step-by-step solutions." />
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-200 p-1 text-[13px] font-semibold dark:bg-slate-800">
        {(['calc', 'practice', 'bits'] as const).map((t) => (
          <button type="button" key={t} onClick={() => setTab(t)} className={`rounded-lg py-2 ${tab === t ? 'bg-white shadow dark:bg-slate-950' : 'text-slate-600 dark:text-slate-400'}`}>
            {t === 'calc' ? 'Calculator' : t === 'practice' ? 'Practice' : 'Binary view'}
          </button>
        ))}
      </div>
      {tab === 'calc' && <Calculator />}
      {tab === 'practice' && <Practice />}
      {tab === 'bits' && <Card><SubnetBits /></Card>}
      <CheatSheet />
    </div>
  );
}

function Calculator() {
  const [input, setInput] = useState('192.168.10.77/26');
  const [showSteps, setShowSteps] = useState(false);
  const out = useMemo(() => {
    try {
      const { ip, prefix } = parseInput(input);
      return { r: calculate(ip, prefix), steps: explainSteps(ip, prefix), err: null };
    } catch (e) {
      return { r: null, steps: [], err: (e as Error).message };
    }
  }, [input]);

  return (
    <Card>
      <label className="text-[13px] font-semibold">
        IP / CIDR (or IP + mask)
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="10.20.5.25/24"
          inputMode="decimal"
          autoCapitalize="off"
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-[16px] dark:border-slate-600 dark:bg-slate-900"
        />
      </label>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {['10.20.5.25/24', '172.16.45.200/20', '192.168.1.130/26', '192.168.10.9/30', '10.0.0.1 255.255.255.248'].map((ex) => (
          <button type="button" key={ex} onClick={() => setInput(ex)} className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[11.5px] dark:bg-slate-800">{ex}</button>
        ))}
      </div>
      {out.err && <p className="mt-3 text-[14px] text-rose-600">{out.err}</p>}
      {out.r && (
        <>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-[13px]">
            {[
              ['Network', out.r.network],
              ['Broadcast', out.r.broadcast],
              ['First host', out.r.firstHost],
              ['Last host', out.r.lastHost],
              ['Usable hosts', out.r.usableHosts.toLocaleString('en-US')],
              ['Total addresses', out.r.totalAddresses.toLocaleString('en-US')],
              ['Subnet mask', `${out.r.mask} (/${out.r.prefix})`],
              ['Wildcard', out.r.wildcard],
              ['Class', out.r.ipClass],
              ['Type', out.r.addressType],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-slate-100 px-2.5 py-2 dark:bg-slate-800">
                <div className="text-[11px] text-slate-500">{k}</div>
                <div className="font-mono font-semibold break-all">{v}</div>
              </div>
            ))}
          </div>
          {out.r.note && <p className="mt-2 text-[13px] text-amber-700 dark:text-amber-300">ℹ️ {out.r.note}</p>}
          <Btn variant="soft" className="mt-3 w-full" onClick={() => setShowSteps(!showSteps)}>
            {showSteps ? 'Hide' : 'Show'} step-by-step method
          </Btn>
          {showSteps && <Steps steps={out.steps} />}
        </>
      )}
    </Card>
  );
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-3 space-y-2 text-[14px] leading-relaxed">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[12px] font-bold text-white">{i + 1}</span>
          <span>{inline(s)}</span>
        </li>
      ))}
    </ol>
  );
}

function Practice() {
  const { p, update } = useProgress();
  const [kinds, setKinds] = useState<PracticeKind[]>(ALL_KINDS);
  const [q, setQ] = useState<PracticeQuestion>(() => generateQuestion());
  const [input, setInput] = useState('');
  const [result, setResult] = useState<null | boolean>(null);
  const [streak, setStreak] = useState(0);

  const next = () => {
    setQ(generateQuestion(Math.random, kinds.length ? kinds : ALL_KINDS));
    setInput('');
    setResult(null);
  };

  const submit = () => {
    if (result !== null) return next();
    if (!input.trim()) return;
    const ok = checkAnswer(q, input);
    setResult(ok);
    setStreak((s) => (ok ? s + 1 : 0));
    update((s) => ({ ...s, subnet: { right: s.subnet.right + (ok ? 1 : 0), total: s.subnet.total + 1 } }));
  };

  const toggleKind = (k: PracticeKind) => setKinds((ks) => (ks.includes(k) ? ks.filter((x) => x !== k) : [...ks, k]));

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[13px] font-semibold">
        <span>🔥 Streak: {streak}</span>
        <span>All-time: {p.subnet.right}/{p.subnet.total} correct</span>
      </div>
      <Card>
        <p className="text-[16px] leading-snug font-semibold text-slate-900 dark:text-white">{inline(q.question)}</p>
        <form
          onSubmit={(e) => { e.preventDefault(); submit(); }}
          className="mt-3 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={result !== null}
            placeholder="Your answer"
            inputMode="decimal"
            autoCapitalize="off"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-[16px] disabled:opacity-70 dark:border-slate-600 dark:bg-slate-900"
          />
          <Btn type="submit">{result === null ? 'Check' : 'Next ▶'}</Btn>
        </form>
        {result === null && (
          <button type="button" onClick={() => { setResult(false); setStreak(0); }} className="mt-2 text-[12px] font-semibold text-slate-500 underline">
            I don't know — show me
          </button>
        )}
        {result !== null && (
          <div className={`mt-3 rounded-xl p-3 ${result ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-amber-50 dark:bg-amber-500/10'}`}>
            <p className="text-[15px] font-bold">
              {result ? '✅ Correct!' : '❌ Answer: '}
              {!result && <span className="font-mono">{q.answer}</span>}
            </p>
            <Steps steps={q.steps} />
          </div>
        )}
      </Card>
      <details className="rounded-xl border border-slate-200 p-3 text-[13px] dark:border-slate-700">
        <summary className="cursor-pointer font-semibold">Question types ({kinds.length}/{ALL_KINDS.length})</summary>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ALL_KINDS.map((k) => (
            <button type="button" key={k} onClick={() => toggleKind(k)} className={`rounded-full px-2.5 py-1 font-semibold ${kinds.includes(k) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
              {kindLabels[k]}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}

function CheatSheet() {
  const rows = [
    ['/24', '255.255.255.0', '256', '254'],
    ['/25', '255.255.255.128', '128', '126'],
    ['/26', '255.255.255.192', '64', '62'],
    ['/27', '255.255.255.224', '32', '30'],
    ['/28', '255.255.255.240', '16', '14'],
    ['/29', '255.255.255.248', '8', '6'],
    ['/30', '255.255.255.252', '4', '2'],
  ];
  return (
    <details className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
      <summary className="cursor-pointer text-[14px] font-bold">📋 Cheat sheet (learn this table!)</summary>
      <table className="mt-2 w-full text-left font-mono text-[13px]">
        <thead className="font-sans text-[12px] text-slate-500">
          <tr><th className="py-1">Prefix</th><th>Mask</th><th>Block</th><th>Hosts</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-slate-200 dark:border-slate-700">
              {r.map((c, i) => <td key={i} className="py-1">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400">Mask octet values: 128, 192, 224, 240, 248, 252, 254, 255. Block size = 256 − mask octet. Hosts = 2^(host bits) − 2.</p>
    </details>
  );
}
