import { useMemo, useState } from 'react';
import type { TopologySpec } from '../../content/types';
import { DeviceIcon } from './DeviceIcon';
import { StepBadge, StepControls } from './StepControls';
import { toneHex } from '../tone';
import { inline } from '../Md';

/** Clickable network diagram with optional step-by-step packet animation. */
export function Topology({ spec }: { spec: TopologySpec }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const nodeById = useMemo(() => Object.fromEntries(spec.nodes.map((n) => [n.id, n])), [spec.nodes]);
  const cur = spec.steps?.[step];
  const color = toneHex[cur?.tone ?? 'indigo'];

  const activePairs = new Set<string>();
  cur?.paths?.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      activePairs.add(`${path[i]}|${path[i + 1]}`);
      activePairs.add(`${path[i + 1]}|${path[i]}`);
    }
  });
  const activeNodes = new Set([...(cur?.highlight ?? []), ...(cur?.paths?.flat() ?? [])]);
  const sel = selected ? nodeById[selected] : null;

  return (
    <div>
      <svg viewBox={`0 0 ${spec.width} ${spec.height}`} className="w-full select-none" role="img" aria-label={spec.title ?? 'Network diagram'}>
        {spec.zones?.map((z, i) => (
          <g key={i}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={12} fill={`${toneHex[z.tone]}14`} stroke={`${toneHex[z.tone]}88`} strokeDasharray="5 4" />
            <text x={z.x + 8} y={z.y + 14} fontSize={10.5} fontWeight={700} fill={toneHex[z.tone]}>{z.label}</text>
          </g>
        ))}
        {spec.links.map((l, i) => {
          const a = nodeById[l.from];
          const b = nodeById[l.to];
          if (!a || !b) return null;
          const on = activePairs.has(`${l.from}|${l.to}`);
          const base = l.tone ? toneHex[l.tone] : '#94a3b8';
          const stroke = on ? color : base;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <g key={i}>
              {l.style === 'tunnel' && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? color : toneHex[l.tone ?? 'green']} strokeOpacity={0.22} strokeWidth={14} strokeLinecap="round" />}
              {l.style === 'trunk' && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={stroke} strokeWidth={7} strokeOpacity={0.35} />}
              <line
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={stroke}
                strokeWidth={on ? 3 : 2}
                strokeDasharray={l.style === 'dashed' || l.style === 'tunnel' ? '7 5' : l.style === 'wireless' ? '2 4' : undefined}
                strokeLinecap="round"
              />
              {l.label && (
                <g>
                  <rect x={mx - l.label.length * 2.7 - 3} y={my - 7} width={l.label.length * 5.4 + 6} height={13} rx={4} className="fill-white dark:fill-slate-900" opacity={0.92} />
                  <text x={mx} y={my + 3} fontSize={9} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300">{l.label}</text>
                </g>
              )}
            </g>
          );
        })}
        {spec.nodes.map((n) => {
          const on = activeNodes.has(n.id) || selected === n.id;
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`} onClick={() => setSelected(selected === n.id ? null : n.id)} className="cursor-pointer">
              <DeviceIcon icon={n.icon} active={on} tone={selected === n.id ? '#6366f1' : color} />
              <text y={29} fontSize={10.5} fontWeight={600} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100">{n.label}</text>
              {n.sub && <text y={40} fontSize={8.5} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400">{n.sub}</text>}
            </g>
          );
        })}
        {cur?.paths?.map((path, pi) => {
          const pts = path.map((id) => nodeById[id]).filter(Boolean);
          if (pts.length < 2) return null;
          const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
          let len = 0;
          for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
          const dur = Math.max(1.2, len / 110);
          const last = pts[pts.length - 1];
          return (
            <g key={`${step}-${pi}`}>
              <g>
                <circle r={7} fill={color} stroke="white" strokeWidth={2} />
                {cur.packet && pi === 0 && (
                  <text y={-11} fontSize={9} fontWeight={700} textAnchor="middle" fill={color}>{cur.packet}</text>
                )}
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} keyPoints="0;1;1" keyTimes="0;0.8;1" calcMode="linear" />
              </g>
              {cur.blocked && (
                <g transform={`translate(${last.x + 15},${last.y - 15})`}>
                  <circle r={9} fill="#f43f5e" />
                  <path d="M-4 -4L4 4M4 -4L-4 4" stroke="white" strokeWidth={2.4} strokeLinecap="round" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {sel ? (
        <div className="mt-2 rounded-xl border border-indigo-300 bg-white p-3 text-[14px] leading-relaxed shadow-sm dark:border-indigo-500/40 dark:bg-slate-800">
          <div className="mb-1 flex items-center justify-between">
            <strong className="text-indigo-700 dark:text-indigo-300">{sel.label}</strong>
            <button type="button" onClick={() => setSelected(null)} className="text-xs text-slate-500">close ✕</button>
          </div>
          {inline(sel.info)}
        </div>
      ) : (
        <p className="mt-1 text-center text-[12px] text-slate-500 dark:text-slate-400">👆 {spec.hint ?? 'Tap any device to see what it does.'}</p>
      )}
      {spec.steps && cur && (
        <>
          <div className={`mt-2 min-h-16 rounded-xl border p-3 text-[14px] leading-relaxed ${cur.blocked ? 'border-rose-300 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10' : 'border-indigo-200 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10'}`}>
            <StepBadge step={step} total={spec.steps.length} />
            {cur.text.split('\n\n').map((t, i) => <span key={i}>{i > 0 && <><br /><br /></>}{inline(t)}</span>)}
          </div>
          <StepControls step={step} total={spec.steps.length} setStep={setStep} />
        </>
      )}
    </div>
  );
}
