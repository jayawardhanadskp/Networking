import { useState } from 'react';
import { natHosts, natPublicIp, natServer, natSteps, type NatRow } from '../../content/visual-data/natPorts';
import { DeviceIcon } from '../visuals/DeviceIcon';
import { StepBadge, StepControls } from '../visuals/StepControls';
import { inline } from '../Md';

export function NatPat() {
  const [step, setStep] = useState(0);
  const s = natSteps[step];
  const rows: NatRow[] = natSteps.slice(0, step + 1).flatMap((x) => (x.addRow ? [x.addRow] : []));
  const hostY = (id: string) => 26 + natHosts.findIndex((h) => h.id === id) * 42;
  const hy = s.host ? hostY(s.host) : 0;
  const pathOut = `M50,${hy} L180,68 L320,68`;
  const pathIn = `M320,68 L180,68 L50,${hy}`;

  return (
    <div>
      <svg viewBox="0 0 360 140" className="w-full">
        <text x={70} y={136} fontSize={9} textAnchor="middle" className="fill-emerald-600 font-bold">INSIDE (private)</text>
        <text x={290} y={136} fontSize={9} textAnchor="middle" className="fill-rose-500 font-bold">OUTSIDE (Internet)</text>
        <line x1={180} y1={10} x2={180} y2={128} stroke="#94a3b8" strokeDasharray="4 4" />
        {natHosts.map((h) => (
          <g key={h.id}>
            <line x1={50} y1={hostY(h.id)} x2={180} y2={68} className="stroke-slate-300 dark:stroke-slate-600" strokeWidth={1.5} />
            <g transform={`translate(30,${hostY(h.id)})`}>
              <DeviceIcon icon="pc" active={s.host === h.id} size={0.7} />
            </g>
            <text x={52} y={hostY(h.id) + 4} fontSize={8.5} className="fill-slate-700 dark:fill-slate-200">{h.id}: {h.ip}</text>
          </g>
        ))}
        <line x1={180} y1={68} x2={320} y2={68} className="stroke-slate-300 dark:stroke-slate-600" strokeWidth={1.5} />
        <g transform="translate(180,68)">
          <DeviceIcon icon="router" active={!!s.host} />
          <text y={-22} fontSize={8.5} fontWeight={700} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200">NAT router</text>
          <text y={29} fontSize={8.5} textAnchor="middle" className="fill-rose-500 font-semibold">{natPublicIp}</text>
        </g>
        <g transform="translate(320,68)">
          <DeviceIcon icon="server" active={!!s.host} />
          <text y={29} fontSize={8} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300">{natServer}</text>
        </g>
        {s.host && (
          <circle key={step} r={6} fill={s.direction === 'in' ? '#f43f5e' : '#10b981'} stroke="white" strokeWidth={2}>
            <animateMotion dur="2.4s" repeatCount="indefinite" path={s.direction === 'in' ? pathIn : pathOut} />
          </circle>
        )}
      </svg>

      {s.before && (
        <div className="mt-1 grid gap-1 text-[11.5px]">
          <div className="rounded-md bg-emerald-50 px-2 py-1 font-mono dark:bg-emerald-500/10"><span className="font-sans font-semibold">Before NAT: </span>{s.before}</div>
          <div className="rounded-md bg-rose-50 px-2 py-1 font-mono dark:bg-rose-500/10"><span className="font-sans font-semibold">After NAT: </span>{s.after}</div>
        </div>
      )}

      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="font-sans text-[11px]">
            <tr className="bg-slate-200 dark:bg-slate-700">
              <th className="px-1.5 py-1">#</th>
              <th className="px-1.5 py-1">Inside local</th>
              <th className="px-1.5 py-1">Inside global</th>
              <th className="px-1.5 py-1">Outside</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-1.5 py-2 text-center font-sans text-slate-400">NAT table is empty</td></tr>
            )}
            {rows.map((r, i) => (
              <tr key={i} className={`pkt-in border-b border-slate-200 dark:border-slate-700 ${s.highlightRow === i ? 'bg-amber-100 dark:bg-amber-500/25' : ''}`}>
                <td className="px-1.5 py-1">{i + 1}</td>
                <td className="px-1.5 py-1 text-emerald-700 dark:text-emerald-300">{r.inside}</td>
                <td className="px-1.5 py-1 text-rose-600 dark:text-rose-300">{r.global}</td>
                <td className="px-1.5 py-1">{r.outside}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 min-h-16 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[14px] leading-relaxed dark:border-indigo-500/30 dark:bg-indigo-500/10">
        <StepBadge step={step} total={natSteps.length} />
        {inline(s.text)}
      </div>
      <StepControls step={step} total={natSteps.length} setStep={setStep} />
    </div>
  );
}
