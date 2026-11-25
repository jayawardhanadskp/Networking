import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadJSON, saveJSON } from './storage';
import type { Module } from '../content/types';

const KEY = 'nsbprep-progress-v1';

export interface Progress {
  /** `${moduleId}/${sectionId}` → completed */
  sections: Record<string, true>;
  /** question key → last answer correct? (quick checks inside lessons) */
  checks: Record<string, boolean>;
  /** moduleId → best quiz score 0..1 */
  quizBest: Record<string, number>;
  /** question key → time it was last answered wrong (weak areas) */
  wrong: Record<string, number>;
  /** `${moduleId}/${cardId}` → status */
  cards: Record<string, 'know' | 'review'>;
  /** `${moduleId}/${qaId}` → self rating 1–5 from mock interviews */
  ratings: Record<string, number>;
  /** `${moduleId}/${qaId}` → user's own edited answer */
  myAnswers: Record<string, string>;
  /** practice counters for the subnet trainer */
  subnet: { right: number; total: number };
  last: { path: string; label: string } | null;
}

const empty: Progress = {
  sections: {}, checks: {}, quizBest: {}, wrong: {}, cards: {}, ratings: {}, myAnswers: {},
  subnet: { right: 0, total: 0 }, last: null,
};

interface Ctx {
  p: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  completeSection: (moduleId: string, sectionId: string) => void;
  recordAnswer: (key: string, correct: boolean) => void;
  recordCheck: (key: string, correct: boolean) => void;
  setQuizBest: (moduleId: string, score: number) => void;
  setCard: (key: string, s: 'know' | 'review') => void;
  setRating: (key: string, r: number) => void;
  setMyAnswer: (key: string, text: string) => void;
  setLast: (path: string, label: string) => void;
  resetAll: () => void;
}

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Progress>(() => loadJSON(KEY, empty));
  useEffect(() => saveJSON(KEY, p), [p]);

  const update = useCallback((fn: (p: Progress) => Progress) => setP(fn), []);

  const recordAnswer = useCallback((key: string, correct: boolean) => {
    setP((s) => {
      const wrong = { ...s.wrong };
      if (correct) delete wrong[key];
      else wrong[key] = Date.now();
      return { ...s, wrong };
    });
  }, []);

  const value = useMemo<Ctx>(() => ({
    p,
    update,
    recordAnswer,
    completeSection: (m, sId) => setP((s) => ({ ...s, sections: { ...s.sections, [`${m}/${sId}`]: true } })),
    recordCheck: (key, correct) => {
      setP((s) => ({ ...s, checks: { ...s.checks, [key]: correct } }));
      recordAnswer(key, correct);
    },
    setQuizBest: (m, score) => setP((s) => ({ ...s, quizBest: { ...s.quizBest, [m]: Math.max(score, s.quizBest[m] ?? 0) } })),
    setCard: (key, st) => setP((s) => ({ ...s, cards: { ...s.cards, [key]: st } })),
    setRating: (key, r) => setP((s) => ({ ...s, ratings: { ...s.ratings, [key]: r } })),
    setMyAnswer: (key, text) => setP((s) => {
      const myAnswers = { ...s.myAnswers };
      if (text.trim()) myAnswers[key] = text;
      else delete myAnswers[key];
      return { ...s, myAnswers };
    }),
    setLast: (path, label) => setP((s) => (s.last?.path === path ? s : { ...s, last: { path, label } })),
    resetAll: () => setP((s) => ({ ...empty, myAnswers: s.myAnswers })),
  }), [p, update, recordAnswer]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): Ctx {
  const c = useContext(ProgressContext);
  if (!c) throw new Error('useProgress must be used inside ProgressProvider');
  return c;
}

export interface ModuleStats {
  sectionsDone: number;
  sectionsTotal: number;
  quizBest: number | null;
  cardsKnown: number;
  cardsTotal: number;
  percent: number;
}

/** Completion: lessons 60%, quiz best score 25%, flashcards known 15% (weights re-balance if a part is empty). */
export function moduleStats(m: Module, p: Progress): ModuleStats {
  const sectionsDone = m.sections.filter((s) => p.sections[`${m.id}/${s.id}`]).length;
  const cardsKnown = m.flashcards.filter((c) => p.cards[`${m.id}/${c.id}`] === 'know').length;
  const quizBest = p.quizBest[m.id] ?? null;
  const parts: [number, number][] = [];
  if (m.sections.length) parts.push([0.6, sectionsDone / m.sections.length]);
  if (m.quiz.length) parts.push([0.25, quizBest ?? 0]);
  if (m.flashcards.length) parts.push([0.15, cardsKnown / m.flashcards.length]);
  const wSum = parts.reduce((a, [w]) => a + w, 0) || 1;
  const percent = Math.round((parts.reduce((a, [w, v]) => a + w * v, 0) / wSum) * 100);
  return { sectionsDone, sectionsTotal: m.sections.length, quizBest, cardsKnown, cardsTotal: m.flashcards.length, percent };
}
