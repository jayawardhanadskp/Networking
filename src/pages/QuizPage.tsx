import { useMemo, useState } from 'react';
import { getModule } from '../content';
import { useProgress } from '../lib/progress';
import { shuffle } from '../lib/random';
import { Link } from '../lib/router';
import { QuestionCard } from '../components/QuestionCard';
import { Btn, Card, Empty, LinkBtn, PageHeader, ProgressBar } from '../components/ui';

export function QuizPage({ moduleId }: { moduleId: string }) {
  const m = getModule(moduleId);
  const { p, recordAnswer, setQuizBest } = useProgress();
  const [round, setRound] = useState(0);
  const questions = useMemo(() => (m ? shuffle(m.quiz) : []), [m, round]);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  if (!m) return <Empty>Module not found. <Link to="/" className="text-indigo-600">Go home</Link></Empty>;
  if (!m.quiz.length) return <Empty>No quiz for this module.</Empty>;

  const q = questions[i];
  const answered = q && results[q.id!] !== undefined;
  const correctCount = Object.values(results).filter(Boolean).length;

  const restart = () => {
    setRound((r) => r + 1);
    setI(0);
    setResults({});
    setFinished(false);
  };

  if (finished) {
    const score = correctCount / questions.length;
    const wrong = questions.filter((x) => results[x.id!] === false);
    return (
      <div className="space-y-4">
        <PageHeader back={`/m/${m.id}`} title={`${m.emoji} Quiz results`} />
        <Card className="text-center">
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{Math.round(score * 100)}%</div>
          <div className="mt-1 text-[14px]">{correctCount} of {questions.length} correct · best: {Math.round((p.quizBest[m.id] ?? 0) * 100)}%</div>
          <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">
            {score >= 0.9 ? '🎉 Excellent! You are ready for this topic.' : score >= 0.7 ? '👍 Good. Review the questions you missed.' : '📚 Read the lessons again, then retry.'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Btn onClick={restart}>↺ Try again</Btn>
            {wrong.length > 0 && <LinkBtn to="/weak" variant="soft">🎯 Weak areas</LinkBtn>}
            <LinkBtn to={`/m/${m.id}/cards`} variant="ghost">🃏 Flashcards</LinkBtn>
          </div>
        </Card>
        {wrong.length > 0 && (
          <section>
            <h2 className="mb-2 text-[15px] font-bold">Questions you missed</h2>
            <div className="space-y-2">
              {wrong.map((x) => (
                <Card key={x.id} className="text-[14px]">
                  <p className="font-semibold">{x.q}</p>
                  <p className="mt-1 text-emerald-700 dark:text-emerald-300">✓ {x.options[x.answer]}</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">{x.explain}</p>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PageHeader back={`/m/${m.id}`} title={`${m.emoji} ${m.title} quiz`} sub={`${correctCount} correct so far`} />
      <ProgressBar value={((i + (answered ? 1 : 0)) / questions.length) * 100} />
      <QuestionCard
        key={`${round}-${q.id}`}
        q={q}
        index={i}
        total={questions.length}
        onAnswer={(c) => {
          setResults((r) => ({ ...r, [q.id!]: c }));
          recordAnswer(`${m.id}/quiz/${q.id}`, c);
        }}
      />
      <div className="flex justify-end">
        {answered && (
          i < questions.length - 1 ? (
            <Btn onClick={() => setI(i + 1)}>Next question ▶</Btn>
          ) : (
            <Btn
              variant="success"
              onClick={() => {
                setQuizBest(m.id, (correctCount) / questions.length);
                setFinished(true);
              }}
            >
              See results 🏁
            </Btn>
          )
        )}
      </div>
    </div>
  );
}
