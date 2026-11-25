import { useMemo, useState } from 'react';
import { modules } from '../content';
import type { Flashcard, Module } from '../content/types';
import { useProgress } from '../lib/progress';
import { shuffle } from '../lib/random';
import { Md } from '../components/Md';
import { Btn, Card, Empty, PageHeader } from '../components/ui';

interface Item { key: string; card: Flashcard; module: Module }

export function FlashcardsPage({ moduleId }: { moduleId: string }) {
  const { p, setCard } = useProgress();
  const [filter, setFilter] = useState(moduleId);
  const [hideKnown, setHideKnown] = useState(true);
  const [round, setRound] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [pos, setPos] = useState(0);

  const deck: Item[] = useMemo(() => {
    const mods = filter === 'all' ? modules : modules.filter((m) => m.id === filter);
    const items = mods.flatMap((m) => m.flashcards.map((card) => ({ key: `${m.id}/${card.id}`, card, module: m })));
    const status = (it: Item) => p.cards[it.key];
    const review = shuffle(items.filter((it) => status(it) === 'review'));
    const fresh = shuffle(items.filter((it) => !status(it)));
    const known = shuffle(items.filter((it) => status(it) === 'know'));
    return hideKnown ? [...review, ...fresh] : [...review, ...fresh, ...known];
    // Deck is rebuilt only when the filter/round changes, not on every rating.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, hideKnown, round]);

  const mod = modules.find((m) => m.id === filter);
  const allItems = (filter === 'all' ? modules : mod ? [mod] : []).flatMap((m) => m.flashcards.map((c) => `${m.id}/${c.id}`));
  const knownCount = allItems.filter((k) => p.cards[k] === 'know').length;
  const cur = deck[pos];

  const rate = (s: 'know' | 'review') => {
    if (!cur) return;
    setCard(cur.key, s);
    setFlipped(false);
    setPos((x) => x + 1);
  };

  const restart = () => {
    setRound((r) => r + 1);
    setPos(0);
    setFlipped(false);
  };

  return (
    <div className="space-y-3">
      <PageHeader back={moduleId === 'all' ? '/' : `/m/${moduleId}`} title="🃏 Flashcards" sub={`${knownCount} of ${allItems.length} known`} />
      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPos(0); setFlipped(false); }}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-600 dark:bg-slate-900"
        >
          <option value="all">All modules</option>
          {modules.filter((m) => m.flashcards.length).map((m) => <option key={m.id} value={m.id}>{m.emoji} {m.title}</option>)}
        </select>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={hideKnown} onChange={(e) => { setHideKnown(e.target.checked); setPos(0); }} className="accent-indigo-600" />
          Hide cards I know
        </label>
      </div>

      {!cur ? (
        <Empty>
          {deck.length === 0 ? '🎉 You know all the cards here!' : '✅ Round finished!'}
          <div className="mt-3 flex justify-center gap-2">
            <Btn onClick={restart}>↺ New round</Btn>
            {hideKnown && <Btn variant="ghost" onClick={() => { setHideKnown(false); restart(); }}>Include known cards</Btn>}
          </div>
        </Empty>
      ) : (
        <>
          <div className="text-center text-[12px] text-slate-500">
            Card {pos + 1} of {deck.length} · {cur.module.emoji} {cur.module.title}
            {p.cards[cur.key] === 'review' && <span className="ml-1 rounded bg-amber-100 px-1.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">review</span>}
          </div>
          <button
            type="button"
            onClick={() => setFlipped(!flipped)}
            className="block w-full [perspective:800px]"
            aria-label={flipped ? 'Show front' : 'Show answer'}
          >
            <Card className={`flex min-h-56 flex-col items-center justify-center text-center ${flipped ? 'border-indigo-300 dark:border-indigo-500/50' : ''}`}>
              <div key={String(flipped)} className="flip-in w-full">
                {!flipped ? (
                  <>
                    {cur.card.tag && <div className="mb-2 text-[11px] font-bold tracking-wide text-indigo-500 uppercase">{cur.card.tag}</div>}
                    <div className="text-[22px] leading-snug font-extrabold text-slate-900 dark:text-white">{cur.card.front}</div>
                    <div className="mt-4 text-[12px] text-slate-400">tap to flip</div>
                  </>
                ) : (
                  <div className="text-left text-[15.5px] leading-relaxed"><Md text={cur.card.back} /></div>
                )}
              </div>
            </Card>
          </button>
          <div className="grid grid-cols-2 gap-2">
            <Btn variant="ghost" onClick={() => rate('review')} className="!py-3.5">🔁 Review again</Btn>
            <Btn variant="success" onClick={() => rate('know')} className="!py-3.5">✅ Know it</Btn>
          </div>
        </>
      )}
    </div>
  );
}
