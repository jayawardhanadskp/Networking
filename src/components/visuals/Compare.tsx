import type { CompareSpec, FieldsSpec } from '../../content/types';
import { toneBg, toneSolid } from '../tone';
import { inline } from '../Md';

export function Compare({ spec }: { spec: CompareSpec }) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-[13px]">
        <thead>
          <tr>
            <th className="w-[26%]" />
            {spec.columns.map((c, i) => (
              <th key={i} className={`rounded-lg px-2 py-2 text-center font-bold ${toneSolid[c.tone]}`}>
                {c.icon && <div className="text-lg leading-none">{c.icon}</div>}
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.rows.map((r, ri) => (
            <tr key={ri}>
              <td className="rounded-lg bg-slate-100 px-2 py-2 align-top text-[12px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{r.label}</td>
              {r.values.map((v, vi) => (
                <td key={vi} className={`rounded-lg border px-2 py-2 align-top leading-snug ${toneBg[spec.columns[vi].tone]}`}>{inline(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Fields({ spec }: { spec: FieldsSpec }) {
  return (
    <div className="space-y-3">
      {spec.rows.map((row, ri) => (
        <div key={ri}>
          {row.label && <div className="mb-1 text-[12px] font-semibold text-slate-600 dark:text-slate-300">{inline(row.label)}</div>}
          <div className="flex gap-1">
            {row.fields.map((f, fi) => (
              <div
                key={fi}
                className={`flex min-w-0 flex-col items-center justify-center rounded-lg border px-1 py-2 text-center ${toneBg[f.tone]}`}
                style={{ flex: f.w ?? 1 }}
              >
                <div className="w-full break-words font-mono text-[12.5px] font-bold leading-tight">{f.text}</div>
                {f.sub && <div className="mt-0.5 w-full break-words text-[10.5px] leading-tight opacity-80">{f.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
      {spec.note && <p className="text-[12.5px] text-slate-600 dark:text-slate-400">{inline(spec.note)}</p>}
    </div>
  );
}
