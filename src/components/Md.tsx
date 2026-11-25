import { Fragment, type ReactNode } from 'react';

/** Inline: **bold**, `code`, *italic* */
export function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[0.85em] text-slate-800 dark:bg-slate-700/70 dark:text-slate-100">{part.slice(1, -1)}</code>;
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/**
 * Markdown-lite block renderer.
 * Blocks are separated by blank lines. Supports "- " lists, "1. " lists, "| a | b |" tables, "### " headings, "```" code.
 */
export function Md({ text, className = '' }: { text: string; className?: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').map((l) => l.trimEnd());
        if (lines[0].startsWith('```')) {
          return (
            <pre key={bi} className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-[13px] leading-snug text-slate-100 dark:bg-black/50">
              {lines.slice(1, lines[lines.length - 1].startsWith('```') ? -1 : undefined).join('\n')}
            </pre>
          );
        }
        if (lines[0].startsWith('### ')) {
          return (
            <Fragment key={bi}>
              <h4 className="pt-1 font-semibold text-slate-900 dark:text-white">{inline(lines[0].slice(4))}</h4>
              {lines.length > 1 && <Md text={lines.slice(1).join('\n')} />}
            </Fragment>
          );
        }
        if (lines.every((l) => /^\s*- /.test(l))) {
          return (
            <ul key={bi} className="ml-1 space-y-1.5">
              {lines.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  <span>{inline(l.replace(/^\s*- /, ''))}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\. /.test(l))) {
          return (
            <ol key={bi} className="ml-1 space-y-1.5">
              {lines.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-200">{i + 1}</span>
                  <span>{inline(l.replace(/^\d+\. /, ''))}</span>
                </li>
              ))}
            </ol>
          );
        }
        if (lines.every((l) => l.startsWith('|'))) {
          const rows = lines
            .filter((l) => !/^\|[\s:|-]+\|$/.test(l))
            .map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
          const [head, ...body] = rows;
          return (
            <div key={bi} className="-mx-1 overflow-x-auto">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr>{head.map((h, i) => <th key={i} className="border-b-2 border-slate-300 px-2 py-1.5 font-semibold text-slate-900 dark:border-slate-600 dark:text-white">{inline(h)}</th>)}</tr>
                </thead>
                <tbody>
                  {body.map((r, ri) => (
                    <tr key={ri} className="odd:bg-slate-50 dark:odd:bg-white/5">
                      {r.map((c, ci) => <td key={ci} className="border-b border-slate-200 px-2 py-1.5 align-top dark:border-slate-700">{inline(c)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={bi}>{lines.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{inline(l)}</Fragment>)}</p>;
      })}
    </div>
  );
}
