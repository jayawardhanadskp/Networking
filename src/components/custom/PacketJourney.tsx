import { useState } from 'react';
import { journeyNodes, journeySteps, partInfo } from '../../content/visual-data/packetJourney';
import { DeviceIcon } from '../visuals/DeviceIcon';
import { StepBadge, StepControls } from '../visuals/StepControls';
import { inline } from '../Md';
import type { DeviceIcon as Icon } from '../../content/types';

export function PacketJourney() {
  const [step, setStep] = useState(0);
  const s = journeySteps[step];
  const W = 360;
  const gap = W / journeyNodes.length;
  const x = (i: number) => gap * (i + 0.5);
  const decap = step >= 10;

  return (
    <div>
      <svg viewBox={`0 0 ${W} 84`} className="w-full">
        <line x1={x(0)} y1={30} x2={x(journeyNodes.length - 1)} y2={30} className="stroke-slate-300 dark:stroke-slate-600" strokeWidth={2} />
        {journeyNodes.map((n, i) => (
          <g key={i} transform={`translate(${x(i)},30)`}>
            <DeviceIcon icon={n.icon as Icon} active={i === s.at || i === s.to} size={0.82} />
            <text y={27} fontSize={8.5} fontWeight={600} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100">{n.label}</text>
            <text y={37} fontSize={7.5} textAnchor="middle" className="fill-slate-500">{n.sub}</text>
          </g>
        ))}
        <g key={step}>
          <circle r={6} cy={30} fill="#6366f1" stroke="white" strokeWidth={2} cx={x(s.at)}>
            {s.to !== undefined && <animate attributeName="cx" from={x(s.at)} to={x(s.to)} dur="1.6s" repeatCount="indefinite" />}
          </circle>
        </g>
      </svg>

      <div className="mt-1 flex items-center justify-between text-[12px] font-semibold">
        <span className={decap ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}>
          {decap ? '⬆ Decapsulation (receiver removes headers)' : step <= 4 ? '⬇ Encapsulation (sender adds headers)' : '➜ Forwarding'}
        </span>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 dark:bg-slate-700">{s.layer}</span>
      </div>

      <div className="mt-2 flex min-h-[64px] items-stretch gap-0.5 overflow-hidden rounded-lg">
        {s.parts.map((p) => (
          <div
            key={p}
            className="pkt-in flex min-w-0 flex-col items-center justify-center px-1 py-1.5 text-center text-white"
            style={{ background: partInfo[p].color, flex: p === 'data' ? 2.2 : p === 'fcs' ? 0.7 : 1.3 }}
          >
            <div className="text-[11px] leading-tight font-bold">{s.bits ? '0110…' : partInfo[p].label}</div>
            {s.details?.[p] && <div className="mt-0.5 text-[9.5px] leading-tight opacity-95">{s.details[p]}</div>}
          </div>
        ))}
      </div>
      <div className="mt-1 text-center text-[12px] text-slate-500">PDU name here: <strong className="text-slate-800 dark:text-slate-100">{s.pdu}</strong></div>

      <div className="mt-2 min-h-20 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[14px] leading-relaxed dark:border-indigo-500/30 dark:bg-indigo-500/10">
        <StepBadge step={step} total={journeySteps.length} />
        <strong>{s.title}. </strong>
        {inline(s.text)}
      </div>
      <StepControls step={step} total={journeySteps.length} setStep={setStep} />
    </div>
  );
}
