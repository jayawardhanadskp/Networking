import { useEffect, useReducer, useState } from 'react';
import {
  integrationSystems, mtiDigits, mtiExamples, mtlsSpec, reconCbs, reconSwitch, tlsSpec, troubleSteps,
  type IntegrationMode,
} from '../../content/visual-data/integrationData';
import { Sequence } from '../visuals/Sequence';
import { StepBadge, StepControls } from '../visuals/StepControls';
import { toneBg, toneHex, toneSolid } from '../tone';
import { inline } from '../Md';

const chip = (on: boolean) =>
  `rounded-full border px-2.5 py-1 text-[12px] font-semibold ${on ? 'border-transparent bg-indigo-600 text-white dark:bg-indigo-500' : 'border-slate-300 dark:border-slate-600'}`;

const infoBox = 'rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[14px] leading-relaxed dark:border-indigo-500/30 dark:bg-indigo-500/10';

/* ================= Integration map: core banking in the centre ================= */
export function IntegrationMap() {
  const [sel, setSel] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | IntegrationMode>('all');
  const W = 360;
  const H = 340;
  const cx = W / 2;
  const cy = H / 2;
  const ring = 54;
  const n = integrationSystems.length;
  const pos = integrationSystems.map((s, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { s, a, x: cx + 140 * Math.cos(a), y: cy + 130 * Math.sin(a) };
  });
  const cur = integrationSystems.find((s) => s.id === sel);

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {([['all', 'All'], ['realtime', '⚡ Real-time'], ['batch', '🗂 Batch / file']] as const).map(([k, l]) => (
          <button type="button" key={k} onClick={() => setFilter(k)} className={chip(filter === k)}>{l}</button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none" role="img" aria-label="Core banking and connected systems">
        <circle cx={cx} cy={cy} r={ring} fill="#6366f114" stroke="#6366f188" strokeDasharray="5 4" />
        <text x={cx} y={cy - ring + 13} fontSize={8.5} fontWeight={700} textAnchor="middle" fill="#6366f1">integration layer</text>
        <text x={cx} y={cy + ring - 6} fontSize={7.5} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400">API gateway · ESB · MQ</text>
        {pos.map(({ s, a, x, y }) => {
          const x1 = cx + ring * Math.cos(a);
          const y1 = cy + ring * Math.sin(a);
          const x2 = x - 18 * Math.cos(a);
          const y2 = y - 18 * Math.sin(a);
          const match = filter === 'all' || s.modes.includes(filter);
          const on = sel === s.id;
          const rt = s.modes.includes('realtime');
          const color = on ? toneHex[s.tone] : '#94a3b8';
          return (
            <g key={s.id} opacity={match ? 1 : 0.18}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={on ? 3 : 1.6} strokeDasharray={rt ? undefined : '5 4'} />
              <line x1={cx + 28 * Math.cos(a)} y1={cy + 28 * Math.sin(a)} x2={x1} y2={y1} stroke={color} strokeWidth={on ? 3 : 1} strokeOpacity={0.6} />
              {on && (
                <circle r={5} fill={toneHex[s.tone]} stroke="white" strokeWidth={1.5}>
                  <animateMotion dur="1.8s" repeatCount="indefinite" path={`M${x2},${y2} L${cx + 28 * Math.cos(a)},${cy + 28 * Math.sin(a)} L${x2},${y2}`} />
                </circle>
              )}
            </g>
          );
        })}
        <g>
          <circle cx={cx} cy={cy} r={28} fill="#6366f1" />
          <text x={cx} y={cy - 2} fontSize={16} textAnchor="middle">🏦</text>
          <text x={cx} y={cy + 13} fontSize={7.5} fontWeight={700} textAnchor="middle" fill="white">CORE BANKING</text>
        </g>
        {pos.map(({ s, x, y }) => {
          const match = filter === 'all' || s.modes.includes(filter);
          const on = sel === s.id;
          return (
            <g key={s.id} transform={`translate(${x},${y})`} opacity={match ? 1 : 0.25} onClick={() => setSel(on ? null : s.id)} className="cursor-pointer">
              <circle r={18} fill={on ? toneHex[s.tone] : `${toneHex[s.tone]}26`} stroke={toneHex[s.tone]} strokeWidth={on ? 2.5 : 1.5} />
              <text y={5} fontSize={15} textAnchor="middle">{s.emoji}</text>
              <text y={29} fontSize={9} fontWeight={700} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100">{s.label}</text>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-5 bg-slate-400" />real-time</span>
        <span className="flex items-center gap-1"><span className="inline-block w-5 border-t-2 border-dashed border-slate-400" />batch / file only</span>
      </div>
      {cur ? (
        <div className={`mt-2 ${infoBox}`}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <strong className="text-indigo-700 dark:text-indigo-300">{cur.emoji} {cur.name}</strong>
            <button type="button" onClick={() => setSel(null)} className="text-xs text-slate-500">close ✕</button>
          </div>
          <div className="mb-2 flex flex-wrap gap-1">
            {cur.modes.map((m) => (
              <span key={m} className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${toneBg[m === 'realtime' ? 'blue' : 'amber']}`}>
                {m === 'realtime' ? '⚡ real-time' : '🗂 batch / file'}
              </span>
            ))}
          </div>
          <dl className="space-y-1.5 text-[13.5px]">
            <div><dt className="inline font-semibold">What: </dt><dd className="inline">{inline(cur.what)}</dd></div>
            <div><dt className="inline font-semibold">How it connects: </dt><dd className="inline">{inline(cur.how)}</dd></div>
            <div><dt className="inline font-semibold">Security: </dt><dd className="inline">{inline(cur.security)}</dd></div>
            <div><dt className="inline font-semibold">What the integration admin watches: </dt><dd className="inline">{inline(cur.watch)}</dd></div>
          </dl>
        </div>
      ) : (
        <p className="mt-2 text-center text-[12px] text-slate-500 dark:text-slate-400">👆 Tap any system to see how it connects to core banking. (General picture — not a specific bank.)</p>
      )}
    </div>
  );
}

/* ================= Point-to-point vs hub (ESB) ================= */
export function P2pVsHub() {
  const [hub, setHub] = useState(false);
  const [count, setCount] = useState(8);
  const W = 300;
  const H = 230;
  const cx = W / 2;
  const cy = H / 2;
  const pts = Array.from({ length: count }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / count;
    return { x: cx + 100 * Math.cos(a), y: cy + 90 * Math.sin(a) };
  });
  const links = hub ? count : (count * (count - 1)) / 2;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setHub(false)} className={chip(!hub)}>🕸 Point-to-point</button>
        <button type="button" onClick={() => setHub(true)} className={chip(hub)}>⭐ Hub / ESB</button>
      </div>
      <label className="mb-1 flex items-center gap-2 text-[13px] font-semibold">
        Systems: {count}
        <input type="range" min={3} max={12} value={count} onChange={(e) => setCount(Number(e.target.value))} className="flex-1 accent-indigo-600" />
      </label>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Integration links">
        {hub
          ? pts.map((p, i) => <line key={i} x1={p.x} y1={p.y} x2={cx} y2={cy} stroke={toneHex.green} strokeWidth={2} />)
          : pts.flatMap((p, i) => pts.slice(i + 1).map((q, j) => (
            <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={toneHex.red} strokeOpacity={0.55} strokeWidth={1.4} />
          )))}
        {hub && (
          <g>
            <rect x={cx - 26} y={cy - 14} width={52} height={28} rx={8} fill={toneHex.green} />
            <text x={cx} y={cy + 4} fontSize={11} fontWeight={700} textAnchor="middle" fill="white">ESB</text>
          </g>
        )}
        {pts.map((p, i) => (
          <g key={i} transform={`translate(${p.x},${p.y})`}>
            <circle r={13} fill="#6366f1" />
            <text y={4} fontSize={10} fontWeight={700} textAnchor="middle" fill="white">{i === 0 ? 'CBS' : `S${i}`}</text>
          </g>
        ))}
      </svg>
      <div className={infoBox}>
        <div className="mb-1 text-[22px] font-black">{links} <span className="text-[13px] font-semibold">connections to build, secure and monitor</span></div>
        {inline(hub
          ? `Each system connects **once** to the hub: **n = ${count}**. The hub does routing and format translation in one place. Risk: the hub is critical — it needs **high availability**.`
          : `Every pair has its own interface: **n(n−1)/2 = ${count}×${count - 1}/2 = ${links}**. Each one has its own format, security and monitoring → "spaghetti". Fine for 2–3 systems, painful for many.`)}
      </div>
    </div>
  );
}

/* ================= Message queue: producer → queue → consumer (+ DLQ) ================= */
interface QMsg { id: number; bad: boolean; tries: number }
interface QState { queue: QMsg[]; dlq: QMsg[]; done: number; up: boolean; persistent: boolean; next: number; note: string }
type QAction = { t: 'tick' } | { t: 'send'; bad: boolean } | { t: 'toggleUp' } | { t: 'restart' } | { t: 'persistent'; on: boolean };

const qStart: QState = {
  queue: [], dlq: [], done: 0, up: true, persistent: true, next: 1,
  note: 'Press **Send** to put a payment message on the queue. The consumer (core banking adapter) takes messages one by one.',
};

function qReducer(s: QState, a: QAction): QState {
  switch (a.t) {
    case 'tick': {
      if (!s.up || !s.queue.length) return s;
      const [head, ...rest] = s.queue;
      if (!head.bad) return { ...s, queue: rest, done: s.done + 1 };
      const tries = head.tries + 1;
      if (tries >= 3) {
        return {
          ...s, queue: rest, dlq: [...s.dlq, { ...head, tries }],
          note: `Message #${head.id} failed **3 times** (bad format). It is moved to the **dead letter queue (DLQ)** so it stops blocking the others. An admin investigates it later.`,
        };
      }
      return { ...s, queue: [{ ...head, tries }, ...rest], note: `Message #${head.id} failed (try ${tries} of 3). The broker will **retry** it.` };
    }
    case 'send': {
      const m = { id: s.next, bad: a.bad, tries: 0 };
      const note = a.bad
        ? `Message #${m.id} has a **bad format** (a "poison message"). Watch what happens.`
        : !s.up
          ? 'The consumer is **down**, but the producer still gets "accepted". Messages **wait safely** in the queue — nothing is lost.'
          : s.note;
      return { ...s, queue: [...s.queue, m], next: s.next + 1, note };
    }
    case 'toggleUp':
      return {
        ...s, up: !s.up,
        note: s.up
          ? '🔴 Core banking adapter is **down** (e.g. maintenance or EOD). Keep sending — the queue **buffers** the messages.'
          : '🟢 Consumer is **back**. It drains the queue in order. With a direct API call, those requests would have **failed** while it was down.',
      };
    case 'restart':
      return s.persistent
        ? { ...s, note: 'Broker restarted. Messages were **persistent** (written to disk), so they are all **still in the queue**. ✅' }
        : { ...s, queue: [], note: `Broker restarted. Messages were **non-persistent** (memory only) → **${s.queue.length} lost**. ❌ Payments must use persistent messages.` };
    case 'persistent':
      return { ...s, persistent: a.on };
  }
}

export function MessageQueue() {
  const [s, dispatch] = useReducer(qReducer, qStart);
  const { queue, dlq, done, up, persistent, note } = s;

  useEffect(() => {
    if (!up) return;
    const t = setInterval(() => dispatch({ t: 'tick' }), 1300);
    return () => clearInterval(t);
  }, [up]);

  const send = (bad: boolean) => dispatch({ t: 'send', bad });
  const toggleUp = () => dispatch({ t: 'toggleUp' });
  const restart = () => dispatch({ t: 'restart' });

  return (
    <div>
      <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-2">
        <div className="rounded-xl border border-blue-300 bg-blue-50 p-2 text-center text-[12px] font-semibold dark:border-blue-500/40 dark:bg-blue-500/10">
          <div className="text-xl">📱</div>Producer<div className="text-[10px] font-normal text-slate-500">mobile channel</div>
        </div>
        <div className="relative min-h-16 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-600 dark:bg-slate-800/60">
          <div className="mb-1 text-center text-[10px] font-bold tracking-wide text-slate-500 uppercase">Queue · {queue.length} waiting</div>
          <div className="flex flex-wrap justify-end gap-1">
            {queue.length === 0 && <span className="w-full text-center text-[11px] text-slate-400">empty</span>}
            {queue.length > 14 && <span className="text-[11px]">+{queue.length - 14}</span>}
            {/* reversed so the head of the queue (next to be consumed) sits next to the consumer */}
            {queue.slice(0, 14).reverse().map((m) => (
              <span key={m.id} className={`pkt-in rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold text-white ${m.bad ? 'bg-rose-500' : 'bg-indigo-500'}`}>
                #{m.id}{m.tries ? `↻${m.tries}` : ''}
              </span>
            ))}
          </div>
        </div>
        <div className={`rounded-xl border p-2 text-center text-[12px] font-semibold ${up ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10' : 'border-rose-300 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10'}`}>
          <div className="text-xl">{up ? '🏦' : '💤'}</div>Consumer<div className="text-[10px] font-normal text-slate-500">{up ? `processed ${done}` : 'DOWN'}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 p-1.5 text-[12px] dark:border-rose-500/30 dark:bg-rose-500/10">
        <span className="font-bold text-rose-700 dark:text-rose-300">☠ Dead letter queue:</span>
        {dlq.length === 0 ? <span className="text-slate-500">empty</span> : dlq.map((m) => <span key={m.id} className="rounded bg-rose-500 px-1.5 font-mono text-[11px] font-bold text-white">#{m.id}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 text-[12.5px] font-semibold">
        <button type="button" onClick={() => send(false)} className="rounded-xl bg-indigo-600 px-2 py-2 text-white dark:bg-indigo-500">📨 Send message</button>
        <button type="button" onClick={() => send(true)} className="rounded-xl bg-rose-600 px-2 py-2 text-white">☠ Send bad message</button>
        <button type="button" onClick={toggleUp} className="rounded-xl border border-slate-300 px-2 py-2 dark:border-slate-600">{up ? '🔴 Take consumer down' : '🟢 Bring consumer up'}</button>
        <button type="button" onClick={restart} className="rounded-xl border border-slate-300 px-2 py-2 dark:border-slate-600">🔄 Restart broker</button>
      </div>
      <label className="mt-2 flex items-center gap-2 text-[12.5px]">
        <input type="checkbox" checked={persistent} onChange={(e) => dispatch({ t: 'persistent', on: e.target.checked })} className="accent-indigo-600" />
        Persistent messages (saved to disk)
      </label>
      <div className={`mt-2 min-h-14 ${infoBox}`}>{inline(note)}</div>
    </div>
  );
}

/* ================= ISO 8583 MTI decoder ================= */
export function MtiDecoder() {
  const [mti, setMti] = useState('0200');
  const ex = mtiExamples.find((x) => x.mti === mti)!;
  const tones = ['slate', 'purple', 'blue', 'amber'] as const;
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {mtiExamples.map((x) => (
          <button type="button" key={x.mti} onClick={() => setMti(x.mti)} className={`rounded-lg px-2 py-1 font-mono text-[13px] font-bold ${mti === x.mti ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-100 dark:bg-slate-800'}`}>{x.mti}</button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {mti.split('').map((d, i) => (
          <div key={`${mti}-${i}`} className={`flip-in rounded-xl border p-2 text-center ${toneBg[tones[i]]}`}>
            <div className="font-mono text-3xl font-black">{d}</div>
            <div className="text-[10px] font-bold tracking-wide uppercase opacity-80">{mtiDigits[i].title}</div>
            <div className="mt-0.5 text-[11.5px] leading-tight font-semibold">{mtiDigits[i].values[d] ?? '—'}</div>
          </div>
        ))}
      </div>
      <div className={`mt-2 ${infoBox}`}>
        <strong>{ex.mti} — {ex.name}.</strong> {inline(ex.use)}
      </div>
      <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">Pattern: request ends in <strong>0</strong>, its response ends in <strong>10</strong> → 0100/0110, 0200/0210, 0800/0810. Advice (2) → advice response (3): 0420/0430.</p>
    </div>
  );
}

/* ================= Idempotency: the same transfer sent twice ================= */
export function Idempotency() {
  const [on, setOn] = useState(true);
  const [step, setStep] = useState(0);
  const start = 50000;
  const debits = step < 1 ? 0 : step < 3 ? 1 : on ? 1 : 2;
  const balance = start - debits * 5000;
  const steps = [
    { who: '📱 → 🏦', text: 'The app sends **POST /transfers** for Rs. 5,000 with a unique reference **Idempotency-Key: TRX-001**.' },
    { who: '🏦', text: 'The server **debits** the account and saves "TRX-001 → success" in its idempotency table. …but the **response is lost** (network timeout).' },
    { who: '📱', text: 'The app sees a **timeout**. It does not know if the transfer worked, so it **retries** — the same request, the **same key TRX-001**.' },
    on
      ? { who: '🏦 ✅', text: 'The server finds **TRX-001 already processed** and returns the **original result**. No second debit. The customer is charged **once**.' }
      : { who: '🏦 ❌', text: 'Without an idempotency key, the server treats it as a **new transfer** and debits **again**. The customer is charged **twice** → complaint, manual reversal, reputational damage.' },
  ];
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setOn(true)} className={chip(on)}>✅ With idempotency key</button>
        <button type="button" onClick={() => setOn(false)} className={chip(!on)}>❌ Without</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className={`rounded-xl border p-3 text-center ${debits > 1 ? toneBg.red : toneBg.green}`}>
          <div className="text-[11px] font-bold uppercase opacity-80">Customer balance</div>
          <div className="font-mono text-2xl font-black">Rs. {balance.toLocaleString('en-US')}</div>
          <div className="text-[11px]">debited {debits}×</div>
        </div>
        <div className="rounded-xl border border-slate-200 p-2 text-[12px] dark:border-slate-700">
          <div className="mb-1 font-bold">Server: processed keys</div>
          {on && step >= 1 ? (
            <div className="rounded bg-slate-100 px-1.5 py-1 font-mono text-[11.5px] dark:bg-slate-800">TRX-001 → success</div>
          ) : (
            <div className="text-slate-400">{on ? '(none yet)' : '(not tracked)'}</div>
          )}
        </div>
      </div>
      <div className={`mt-2 min-h-16 ${on || step < 3 ? infoBox : 'rounded-xl border border-rose-300 bg-rose-50 p-3 text-[14px] leading-relaxed dark:border-rose-500/40 dark:bg-rose-500/10'}`}>
        <StepBadge step={step} total={steps.length} />
        <span className="mr-1">{steps[step].who}</span>{inline(steps[step].text)}
      </div>
      <StepControls step={step} total={steps.length} setStep={setStep} />
    </div>
  );
}

/* ================= Reconciliation: match two systems' records ================= */
type ReconStatus = 'match' | 'amount' | 'missingCbs' | 'missingSwitch' | 'duplicate';

const reconInfo: Record<ReconStatus, { label: string; tone: 'green' | 'amber' | 'red' | 'purple'; action: string }> = {
  match: { label: 'Matched', tone: 'green', action: 'Nothing to do.' },
  amount: { label: 'Amount differs', tone: 'amber', action: 'Investigate which amount is correct (ATM journal, logs); correct with an approved adjustment.' },
  missingCbs: { label: 'Missing in core banking', tone: 'red', action: 'Switch approved it but the account was **not debited** → bank loss. Check logs, then post the debit (approved).' },
  missingSwitch: { label: 'Missing in switch', tone: 'red', action: 'Customer **debited** but no switch record → maybe no cash given. Check the ATM journal; **reverse** if needed.' },
  duplicate: { label: 'Duplicate posting', tone: 'purple', action: 'Same reference posted **twice** → reverse the duplicate, and fix the cause (idempotency!).' },
};

function reconcile(): { ref: string; sw?: number; cbs: number[]; status: ReconStatus }[] {
  const refs = [...new Set([...reconSwitch.map((r) => r.ref), ...reconCbs.map((r) => r.ref)])].sort();
  return refs.map((ref) => {
    const sw = reconSwitch.find((r) => r.ref === ref)?.amount;
    const cbs = reconCbs.filter((r) => r.ref === ref).map((r) => r.amount);
    let status: ReconStatus = 'match';
    if (sw === undefined) status = 'missingSwitch';
    else if (cbs.length === 0) status = 'missingCbs';
    else if (cbs.length > 1) status = 'duplicate';
    else if (cbs[0] !== sw) status = 'amount';
    return { ref, sw, cbs, status };
  });
}

export function Reconciliation() {
  const rows = reconcile();
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (shown >= rows.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setShown((s) => s + 1), 650);
    return () => clearTimeout(t);
  }, [running, shown, rows.length]);

  const finished = shown >= rows.length;
  const exceptions = rows.filter((r) => r.status !== 'match');
  const last = shown > 0 ? rows[shown - 1] : null;

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-1 text-[12px]">
        <div className="text-center text-[11px] font-bold tracking-wide text-slate-500 uppercase">🏧 ATM switch log</div>
        <div />
        <div className="text-center text-[11px] font-bold tracking-wide text-slate-500 uppercase">🏦 Core banking postings</div>
        {rows.map((r, i) => {
          const done = i < shown;
          const info = reconInfo[r.status];
          const cls = done ? toneBg[info.tone] : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800';
          return (
            <div key={r.ref} className="contents">
              <div className={`rounded-lg border px-2 py-1 font-mono transition-colors ${cls}`}>
                {r.sw !== undefined ? <>{r.ref} · {r.sw.toLocaleString('en-US')}</> : <span className="opacity-50">— none —</span>}
              </div>
              <div className={`flex w-6 items-center justify-center text-[13px] ${done ? '' : 'opacity-30'}`}>{done ? (r.status === 'match' ? '✅' : '⚠️') : '⋯'}</div>
              <div className={`rounded-lg border px-2 py-1 font-mono transition-colors ${cls}`}>
                {r.cbs.length ? r.cbs.map((a, k) => <div key={k}>{r.ref} · {a.toLocaleString('en-US')}</div>) : <span className="opacity-50">— none —</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={() => { setShown(0); setRunning(true); }} className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-[13px] font-semibold text-white dark:bg-indigo-500">
          {shown === 0 ? '▶ Run end-of-day reconciliation' : '↺ Run again'}
        </button>
      </div>
      <div className={`mt-2 min-h-14 ${infoBox}`}>
        {finished ? (
          <>
            <strong>{rows.length - exceptions.length} matched, {exceptions.length} exceptions.</strong> Each exception goes to an exception report for investigation:
            <ul className="mt-1 space-y-1 text-[13px]">
              {exceptions.map((r) => (
                <li key={r.ref}><span className={`mr-1 rounded px-1.5 py-0.5 text-[11px] font-bold ${toneSolid[reconInfo[r.status].tone]}`}>{r.ref}</span><strong>{reconInfo[r.status].label}:</strong> {inline(reconInfo[r.status].action)}</li>
              ))}
            </ul>
          </>
        ) : last ? (
          <><strong>Ref {last.ref}: {reconInfo[last.status].label}.</strong> {inline(reconInfo[last.status].action)}</>
        ) : (
          <>Two systems recorded the same day's ATM withdrawals. Reconciliation matches them by the <strong>unique reference</strong> and amount. Press <strong>Run</strong>.</>
        )}
      </div>
    </div>
  );
}

/* ================= TLS vs mutual TLS handshake ================= */
export function TlsHandshake() {
  const [mutual, setMutual] = useState(false);
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setMutual(false)} className={chip(!mutual)}>🔒 TLS (server only)</button>
        <button type="button" onClick={() => setMutual(true)} className={chip(mutual)}>🔐 Mutual TLS (both sides)</button>
      </div>
      <Sequence key={mutual ? 'm' : 't'} spec={mutual ? mtlsSpec : tlsSpec} />
    </div>
  );
}

/* ================= Integration troubleshooting ladder ================= */
export function IntegrationTroubleshoot() {
  const [step, setStep] = useState(0);
  const s = troubleSteps[step];
  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {troubleSteps.map((t, i) => (
          <button
            type="button"
            key={t.key}
            onClick={() => setStep(i)}
            className={`rounded-lg border px-1.5 py-1 text-[11.5px] font-semibold ${i === step ? 'border-transparent bg-indigo-600 text-white dark:bg-indigo-500' : i < step ? toneBg.green : 'border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400'}`}
          >
            {t.icon} {t.title}
          </button>
        ))}
      </div>
      <div className={`mt-3 ${infoBox}`}>
        <StepBadge step={step} total={troubleSteps.length} />
        <strong>{s.icon} {s.title}. </strong>{inline(s.ask)}
        {s.cmd && (
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-2.5 font-mono text-[12px] leading-snug text-emerald-300 dark:bg-black/60">{s.cmd.split('\n').map((l) => `$ ${l}`).join('\n')}</pre>
        )}
        {s.good && (
          <div className="mt-2">
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">✅ Good result</div>
            <pre className="overflow-x-auto rounded-lg bg-emerald-50 p-2 font-mono text-[11.5px] leading-snug whitespace-pre-wrap text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200">{s.good}</pre>
          </div>
        )}
        {s.bad && (
          <div className="mt-2">
            <div className="text-[11px] font-bold text-rose-700 dark:text-rose-300">❌ Bad result</div>
            <pre className="overflow-x-auto rounded-lg bg-rose-50 p-2 font-mono text-[11.5px] leading-snug whitespace-pre-wrap text-rose-900 dark:bg-rose-500/10 dark:text-rose-200">{s.bad}</pre>
          </div>
        )}
        <p className="mt-2"><strong>What it means: </strong>{inline(s.meaning)}</p>
      </div>
      <StepControls step={step} total={troubleSteps.length} setStep={setStep} />
    </div>
  );
}
