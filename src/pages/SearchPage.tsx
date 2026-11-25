import { useMemo, useState } from 'react';
import { modules } from '../content';
import { Link } from '../lib/router';
import { PageHeader } from '../components/ui';

interface Entry {
  type: 'Lesson' | 'Quiz' | 'Flashcard' | 'Interview';
  icon: string;
  title: string;
  text: string;
  link: string;
  module: string;
}

const strip = (s: string) => s.replace(/\*\*|`|\|/g, ' ').replace(/\s+/g, ' ');

function buildIndex(): Entry[] {
  const out: Entry[] = [];
  for (const m of modules) {
    const mod = `${m.emoji} ${m.title}`;
    m.sections.forEach((s, i) => {
      const visualText = s.visuals
        .map((v) => {
          if (v.kind === 'sequence') return v.steps.map((x) => `${x.label} ${x.detail}`).join(' ');
          if (v.kind === 'flow') return v.steps.map((x) => `${x.label} ${x.detail}`).join(' ');
          if (v.kind === 'topology') return [...v.nodes.map((n) => `${n.label} ${n.info}`), ...(v.steps ?? []).map((x) => x.text)].join(' ');
          if (v.kind === 'compare') return v.rows.map((r) => `${r.label} ${r.values.join(' ')}`).join(' ');
          if (v.kind === 'fields') return v.rows.map((r) => r.fields.map((f) => `${f.text} ${f.sub ?? ''}`).join(' ')).join(' ');
          return '';
        })
        .join(' ');
      out.push({
        type: 'Lesson', icon: '📖', title: s.title, module: mod, link: `/m/${m.id}/learn/${i}`,
        text: strip([s.analogy ?? '', s.body, s.bank, s.remember.join(' '), visualText].join(' ')),
      });
      s.check.forEach((q) => out.push({ type: 'Quiz', icon: '✅', title: q.q, module: mod, link: `/m/${m.id}/learn/${i}`, text: strip(`${q.options[q.answer]} ${q.explain}`) }));
    });
    m.quiz.forEach((q) => out.push({ type: 'Quiz', icon: '📝', title: q.q, module: mod, link: `/m/${m.id}/quiz`, text: strip(`${q.options[q.answer]} ${q.explain}`) }));
    m.flashcards.forEach((c) => out.push({ type: 'Flashcard', icon: '🃏', title: c.front, module: mod, link: `/m/${m.id}/cards`, text: strip(c.back) }));
    m.interview.forEach((q) => out.push({ type: 'Interview', icon: '💬', title: q.q, module: mod, link: `/interview?m=${m.id}`, text: strip(q.answer) }));
  }
  return out;
}

function snippet(text: string, words: string[]): string {
  const lower = text.toLowerCase();
  const idx = Math.min(...words.map((w) => lower.indexOf(w)).filter((i) => i >= 0));
  if (!Number.isFinite(idx)) return text.slice(0, 140);
  const start = Math.max(0, idx - 50);
  return (start > 0 ? '…' : '') + text.slice(start, start + 160) + '…';
}

function Highlight({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i} className="rounded bg-amber-200 px-0.5 text-slate-900 dark:bg-amber-400/70">{part}</mark> : part))}</>;
}

export function SearchPage({ initial }: { initial: string }) {
  const [q, setQ] = useState(initial);
  const index = useMemo(buildIndex, []);
  const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  const results = useMemo(() => {
    if (!words.length) return [];
    return index
      .map((e) => {
        const t = e.title.toLowerCase();
        const body = e.text.toLowerCase();
        if (!words.every((w) => t.includes(w) || body.includes(w))) return null;
        const score = words.reduce((a, w) => a + (t.includes(w) ? 5 : 0) + (body.includes(w) ? 1 : 0), 0) + (e.type === 'Lesson' ? 1 : 0);
        return { e, score };
      })
      .filter((x): x is { e: Entry; score: number } => !!x)
      .sort((a, b) => b.score - a.score)
      .slice(0, 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, index]);

  return (
    <div className="space-y-3">
      <PageHeader title="🔍 Search" sub="Search lessons, quiz questions, flashcards and interview answers." />
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="e.g. DHCP, port 443, RAID 5, OSPF…"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[16px] dark:border-slate-600 dark:bg-slate-900"
      />
      {words.length > 0 && <div className="text-[12px] text-slate-500">{results.length} results</div>}
      <div className="space-y-2">
        {results.map(({ e }, i) => (
          <Link key={i} to={e.link} className="block rounded-xl border border-slate-200 bg-white p-3 active:scale-[0.99] dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold dark:bg-slate-800">{e.icon} {e.type}</span>
              <span className="truncate">{e.module}</span>
            </div>
            <div className="mt-1 text-[14.5px] leading-snug font-semibold text-slate-900 dark:text-white"><Highlight text={strip(e.title)} words={words} /></div>
            <div className="mt-0.5 text-[13px] leading-snug text-slate-600 dark:text-slate-400"><Highlight text={snippet(e.text, words)} words={words} /></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
