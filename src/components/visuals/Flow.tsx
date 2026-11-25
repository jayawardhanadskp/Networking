import { Fragment, useState } from 'react';
import type { FlowSpec } from '../../content/types';
import { StepBadge, StepControls } from './StepControls';
import { toneBg, toneSolid } from '../tone';
import { inline } from '../Md';

/** Numbered process steps revealed one by one. */
export function Flow({ spec }: { spec: FlowSpec }) {
  const [step, setStep] = useState(0);
  const cur = spec.steps[step];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
        {spec.steps.map((s, i) => (
          <Fragment key={i}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-left text-[12.5px] font-semibold transition-all ${
                i === step
                  ? `${toneSolid[s.tone ?? 'indigo']} border-transparent shadow-md ring-2 ring-indigo-300 dark:ring-indigo-700`
                  : i < step
                    ? toneBg[s.tone ?? 'indigo']
                    : 'border-dashed border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500'
              }`}
            >
              <span className="text-[13px]">{s.icon ?? `${i + 1}.`}</span>
              {s.label}
            </button>
            {i < spec.steps.length - 1 && <span className={`text-sm ${i < step ? 'text-indigo-500' : 'text-slate-300 dark:text-slate-600'}`}>➜</span>}
          </Fragment>
        ))}
        {spec.cycle && <span className="text-sm text-indigo-500" title="repeats">↺</span>}
      </div>
      <div className="mt-3 min-h-16 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[14px] leading-relaxed dark:border-indigo-500/30 dark:bg-indigo-500/10">
        <StepBadge step={step} total={spec.steps.length} />
        <strong className="font-semibold">{cur.label}: </strong>
        {inline(cur.detail)}
      </div>
      <StepControls step={step} total={spec.steps.length} setStep={setStep} />
    </div>
  );
}
