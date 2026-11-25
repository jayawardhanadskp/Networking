import { useState } from 'react';
import { ports } from '../../content/visual-data/natPorts';

/** Tap a port to flip it and see the service. */
export function PortGrid() {
  const [mustOnly, setMustOnly] = useState(true);
  const [revealAll, setRevealAll] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const list = ports.filter((p) => !mustOnly || p.must);
  const [detail, setDetail] = useState<string | null>(null);
  const d = ports.find((p) => p.port === detail);

  const toggle = (port: string) => {
    setDetail(port);
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(port)) n.delete(port);
      else n.add(port);
      return n;
    });
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2 text-[12px]">
        <button type="button" onClick={() => setMustOnly(!mustOnly)} className="rounded-full border border-slate-300 px-3 py-1 font-semibold dark:border-slate-600">
          {mustOnly ? '⭐ Must-know only' : 'All ports'}
        </button>
        <button type="button" onClick={() => { setRevealAll(!revealAll); setOpen(new Set()); }} className="rounded-full border border-slate-300 px-3 py-1 font-semibold dark:border-slate-600">
          {revealAll ? '🙈 Hide names (test me)' : '👀 Show all names'}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
        {list.map((p) => {
          const shown = revealAll || open.has(p.port);
          const tcp = p.proto === 'TCP';
          const udp = p.proto === 'UDP';
          return (
            <button
              type="button"
              key={p.port}
              onClick={() => toggle(p.port)}
              className={`flex h-16 flex-col items-center justify-center rounded-xl border-2 px-1 text-center transition-all active:scale-95 ${
                shown
                  ? tcp ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/15' : udp ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/15' : 'border-violet-400 bg-violet-50 dark:bg-violet-500/15'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              <span className="font-mono text-[15px] font-bold">{p.port}</span>
              <span className="text-[11px] leading-tight font-semibold">{shown ? p.name : '?'}</span>
              <span className="text-[9px] text-slate-500">{shown ? p.proto : 'tap'}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-center gap-3 text-[11px]">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-blue-400" />TCP</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />UDP</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-violet-400" />Both</span>
      </div>
      {d && (
        <div className="mt-2 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[14px] dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <strong>{d.port} {d.proto} — {d.name}:</strong> {d.use}
        </div>
      )}
    </div>
  );
}
