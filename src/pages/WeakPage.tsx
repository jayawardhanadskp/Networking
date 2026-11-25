import { allInterview, getQuestion, modules } from '../content';
import { useProgress } from '../lib/progress';
import { Link } from '../lib/router';
import { inline } from '../components/Md';
import { QuestionCard } from '../components/QuestionCard';
import { Card, Empty, LinkBtn, PageHeader } from '../components/ui';

export function WeakPage() {
  const { p, recordAnswer } = useProgress();
  const refs = Object.keys(p.wrong)
    .sort((a, b) => p.wrong[b] - p.wrong[a])
    .map((k) => getQuestion(k))
    .filter((x): x is NonNullable<typeof x> => !!x);
  const byModule = modules.map((m) => ({ m, items: refs.filter((r) => r.module.id === m.id) })).filter((g) => g.items.length);
  const lowMock = allInterview.filter((x) => (p.ratings[x.key] ?? 5) <= 2);
  const reviewCards = Object.values(p.cards).filter((s) => s === 'review').length;

  return (
    <div className="space-y-4">
      <PageHeader back="/" title="🎯 Weak areas" sub="Questions you got wrong. Answer correctly to remove them from this list." />
      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="!p-3"><div className="text-2xl font-black text-rose-600">{refs.length}</div><div className="text-[11px]">wrong questions</div></Card>
        <Card className="!p-3"><div className="text-2xl font-black text-amber-600">{reviewCards}</div><div className="text-[11px]">cards to review</div></Card>
        <Card className="!p-3"><div className="text-2xl font-black text-indigo-600">{lowMock.length}</div><div className="text-[11px]">low mock ratings</div></Card>
      </div>
      {reviewCards > 0 && <LinkBtn to="/cards" variant="soft" className="w-full">🃏 Review flashcards marked "review again"</LinkBtn>}

      {refs.length === 0 ? (
        <Empty>🎉 No wrong answers right now. Take a quiz to find your weak spots.</Empty>
      ) : (
        byModule.map(({ m, items }) => (
          <section key={m.id}>
            <h2 className="mb-2 text-[15px] font-bold">{m.emoji} {m.title} <span className="text-slate-400">({items.length})</span></h2>
            <div className="space-y-3">
              {items.map((r) => (
                <div key={r.key}>
                  <Link to={r.link} className="mb-1 block text-[11.5px] text-slate-500 underline">{r.where}</Link>
                  <QuestionCard q={r.q} compact onAnswer={(c) => { if (c) setTimeout(() => recordAnswer(r.key, true), 2500); }} />
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {lowMock.length > 0 && (
        <section>
          <h2 className="mb-2 text-[15px] font-bold">🎤 Interview questions you rated 1–2</h2>
          <Card>
            <ul className="space-y-1.5 text-[14px]">
              {lowMock.map((x) => (
                <li key={x.key}>
                  <Link to={`/interview?m=${x.module.id}`} className="hover:underline">{x.module.emoji} {inline(x.qa.q)}</Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  );
}
