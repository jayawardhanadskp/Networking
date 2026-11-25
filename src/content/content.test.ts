import { describe, expect, it } from 'vitest';
import { modules } from './index';
import type { MCQ, VisualSpec } from './types';
import { customVisualIds } from './visualIds';

function checkMcq(q: MCQ, where: string) {
  expect(q.options.length, `${where}: needs 2+ options`).toBeGreaterThanOrEqual(2);
  expect(q.answer, `${where}: answer index out of range`).toBeGreaterThanOrEqual(0);
  expect(q.answer, `${where}: answer index out of range`).toBeLessThan(q.options.length);
  expect(new Set(q.options).size, `${where}: duplicate options`).toBe(q.options.length);
  expect(q.explain.length, `${where}: missing explanation`).toBeGreaterThan(5);
}

function checkVisual(v: VisualSpec, where: string) {
  if (v.kind === 'topology') {
    const ids = new Set(v.nodes.map((n) => n.id));
    expect(ids.size, `${where}: duplicate node ids`).toBe(v.nodes.length);
    v.links.forEach((l) => {
      expect(ids.has(l.from), `${where}: link from unknown node ${l.from}`).toBe(true);
      expect(ids.has(l.to), `${where}: link to unknown node ${l.to}`).toBe(true);
    });
    v.steps?.forEach((s, i) => {
      s.paths?.flat().forEach((id) => expect(ids.has(id), `${where} step ${i + 1}: unknown node ${id}`).toBe(true));
      s.highlight?.forEach((id) => expect(ids.has(id), `${where} step ${i + 1}: unknown node ${id}`).toBe(true));
    });
    v.nodes.forEach((n) => {
      expect(n.x >= 0 && n.x <= v.width && n.y >= 0 && n.y <= v.height, `${where}: node ${n.id} outside viewBox`).toBe(true);
    });
  }
  if (v.kind === 'sequence') {
    const ids = new Set(v.actors.map((a) => a.id));
    v.steps.forEach((s, i) => {
      expect(ids.has(s.from), `${where} step ${i + 1}: unknown actor ${s.from}`).toBe(true);
      expect(ids.has(s.to), `${where} step ${i + 1}: unknown actor ${s.to}`).toBe(true);
    });
    expect(v.steps.length).toBeGreaterThan(0);
  }
  if (v.kind === 'compare') {
    v.rows.forEach((r) => expect(r.values.length, `${where}: row "${r.label}" has wrong number of values`).toBe(v.columns.length));
  }
  if (v.kind === 'flow') expect(v.steps.length).toBeGreaterThan(0);
  if (v.kind === 'custom') expect(customVisualIds).toContain(v.id);
}

describe('content integrity', () => {
  it('has unique module ids', () => {
    expect(new Set(modules.map((m) => m.id)).size).toBe(modules.length);
  });

  for (const m of modules) {
    describe(m.title, () => {
      it('sections are complete', () => {
        expect(m.sections.length).toBeGreaterThan(0);
        expect(new Set(m.sections.map((s) => s.id)).size, 'duplicate section ids').toBe(m.sections.length);
        for (const s of m.sections) {
          const where = `${m.id}/${s.id}`;
          expect(s.visuals.length, `${where}: every section needs a visual`).toBeGreaterThanOrEqual(1);
          expect(s.remember.length, `${where}: 2–3 remember points`).toBeGreaterThanOrEqual(1);
          expect(s.remember.length, `${where}: 2–3 remember points`).toBeLessThanOrEqual(3);
          expect(s.check.length, `${where}: 1–3 quick checks`).toBeGreaterThanOrEqual(1);
          expect(s.check.length, `${where}: 1–3 quick checks`).toBeLessThanOrEqual(3);
          expect(s.bank.length, `${where}: bank example`).toBeGreaterThan(20);
          s.check.forEach((q, i) => checkMcq(q, `${where} check ${i + 1}`));
          s.visuals.forEach((v, i) => checkVisual(v, `${where} visual ${i + 1}`));
        }
      });

      it('quiz questions are valid', () => {
        m.quiz.forEach((q, i) => checkMcq(q, `${m.id} quiz ${i + 1}`));
        expect(new Set(m.quiz.map((q) => q.q)).size, 'duplicate quiz questions').toBe(m.quiz.length);
      });

      it('has interview questions', () => {
        expect(m.interview.length).toBeGreaterThan(0);
      });
    });
  }

  it('Modules 1–6 have at least 15 quiz questions and 15 flashcards', () => {
    for (const m of modules.slice(0, 6)) {
      expect(m.quiz.length, `${m.id} quiz`).toBeGreaterThanOrEqual(15);
      expect(m.flashcards.length, `${m.id} flashcards`).toBeGreaterThanOrEqual(15);
    }
  });
});
