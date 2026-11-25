/**
 * MODULE REGISTRY
 * ---------------
 * To add a module:
 *   1. Create a folder in src/content/ (copy an existing one, e.g. 01-networking).
 *   2. Import it below and add it to the `rawModules` array.
 * Nothing else needs to change: dashboard, quiz, flashcards, search, interview bank
 * and mock interview all read from this list.
 */
import type { InterviewQA, MCQ, Module } from './types';
import { hashId } from '../lib/random';

import networking from './01-networking';
import ipSubnetting from './02-ip-subnetting';
import switchingRouting from './03-switching-routing';
import wan from './04-wan';
import netSecurity from './05-network-security';
import troubleshooting from './06-troubleshooting';
import sysadmin from './07-sysadmin';
import infosec from './08-infosec';
import operations from './09-operations-dr';
import database from './10-database';
import banking from './11-banking-it';
import java from './12-java';
import hr from './13-hr';

const rawModules: Module[] = [
  networking,
  ipSubnetting,
  switchingRouting,
  wan,
  netSecurity,
  troubleshooting,
  sysadmin,
  infosec,
  operations,
  database,
  banking,
  java,
  hr,
];

/** Fill in stable ids (hash of the text) so progress survives re-ordering. */
function withIds(m: Module): Module {
  const ensure = <T extends { id?: string }>(items: T[], text: (t: T) => string, prefix: string) => {
    const seen = new Set<string>();
    return items.map((it) => {
      let id = it.id ?? `${prefix}${hashId(text(it))}`;
      while (seen.has(id)) id += 'x';
      seen.add(id);
      return { ...it, id };
    });
  };
  return {
    ...m,
    sections: m.sections.map((s) => ({ ...s, check: ensure(s.check, (q) => q.q, 'c') })),
    quiz: ensure(m.quiz, (q) => q.q, 'q'),
    flashcards: ensure(m.flashcards, (c) => c.front, 'f'),
    interview: ensure(m.interview, (q) => q.q, 'i'),
  };
}

export const modules: Module[] = rawModules.map(withIds);

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export interface QuestionRef {
  key: string;
  module: Module;
  q: MCQ;
  where: string;
  link: string;
}

/** Keys: quiz → `${m}/quiz/${id}`, lesson check → `${m}/${sectionId}/${id}` */
const questionIndex = new Map<string, QuestionRef>();
for (const m of modules) {
  m.quiz.forEach((q) => {
    const key = `${m.id}/quiz/${q.id}`;
    questionIndex.set(key, { key, module: m, q, where: `${m.title} · Quiz`, link: `/m/${m.id}/quiz` });
  });
  m.sections.forEach((s, i) =>
    s.check.forEach((q) => {
      const key = `${m.id}/${s.id}/${q.id}`;
      questionIndex.set(key, { key, module: m, q, where: `${m.title} · ${s.title}`, link: `/m/${m.id}/learn/${i}` });
    }),
  );
}

export function getQuestion(key: string): QuestionRef | undefined {
  return questionIndex.get(key);
}

export interface InterviewRef {
  key: string;
  module: Module;
  qa: InterviewQA;
}

export const allInterview: InterviewRef[] = modules.flatMap((m) =>
  m.interview.map((qa) => ({ key: `${m.id}/${qa.id}`, module: m, qa })),
);
