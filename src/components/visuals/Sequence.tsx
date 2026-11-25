import { useState } from 'react';
import type { SequenceSpec } from '../../content/types';
import { DeviceIconSvg } from './DeviceIcon';
import { StepBadge, StepControls } from './StepControls';
import { toneHex } from '../tone';
import { inline } from '../Md';

/** Step-by-step sequence diagram (HTML/CSS so text stays readable on phones). */
export function Sequence({ spec }: { spec: SequenceSpec }) {
  const [step, setStep] = useState(0);
  const n = spec.actors.length;
  const col = (id: string) => Math.max(0, spec.actors.findIndex((a) => a.id === id));
  const center = (i: number) => ((i + 0.5) / n) * 100;
  const cur = spec.steps[step];

  return (
    <div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {spec.actors.map((a) => (
          <div key={a.id} className="flex flex-col items-center text-center">
            {a.icon && <DeviceIconSvg icon={a.icon} />}
            <div className="mt-0.5 text-[12px] font-semibold leading-tight">{a.label}</div>
            {a.sub && <div className="text-[10px] leading-tight text-slate-500 dark:text-slate-400">{a.sub}</div>}
          </div>
        ))}
      </div>
      <div className="relative mt-2 pb-2">
        {spec.actors.map((a, i) => (
          <div key={a.id} className="absolute top-0 bottom-0 border-l-2 border-dashed border-slate-300 dark:border-slate-600" style={{ left: `${center(i)}%` }} />
        ))}
        {spec.steps.map((s, i) => {
          const a = col(s.from);
          const b = col(s.to);
          const visible = i <= step;
          const active = i === step;
          const color = active ? toneHex[s.tone ?? 'indigo'] : '#94a3b8';
          const self = a === b;
          const left = self ? center(a) : center(Math.min(a, b));
          const width = self ? (100 / n) * 0.9 : Math.abs(center(b) - center(a));
          const rightward = b >= a;
          return (
            <div
              key={i}
              className={`relative py-1.5 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={!visible}
            >
              <div style={{ marginLeft: `${left}%`, width: `${width}%` }} className="relative">
                <div
                  className={`px-1 text-center text-[11.5px] leading-tight ${active ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {self ? '↻ ' : ''}
                  {s.label}
                </div>
                {!self && (
                  <div className="relative mt-1 h-3">
                    <div
                      key={active ? `a${step}` : 'static'}
                      className={`absolute top-1/2 h-0.5 w-full -translate-y-1/2 ${active ? (rightward ? 'seq-draw-r' : 'seq-draw-l') : ''}`}
                      style={{
                        background: s.dashed ? `repeating-linear-gradient(90deg, ${color} 0 6px, transparent 6px 10px)` : color,
                      }}
                    />
                    <div
                      className="absolute top-1/2 h-0 w-0 -translate-y-1/2"
                      style={
                        rightward
                          ? { right: -2, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `9px solid ${color}` }
                          : { left: -2, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: `9px solid ${color}` }
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 min-h-16 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[14px] leading-relaxed dark:border-indigo-500/30 dark:bg-indigo-500/10">
        <StepBadge step={step} total={spec.steps.length} />
        {inline(cur.detail)}
      </div>
      <StepControls step={step} total={spec.steps.length} setStep={setStep} />
    </div>
  );
}
