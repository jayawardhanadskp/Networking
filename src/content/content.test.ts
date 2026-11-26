import { describe, expect, it } from 'vitest';
import { modules } from './index';
import type { MCQ, VisualSpec } from './types';
import { customVisualIds } from './visualIds';
import { roleModuleId } from './plan';
import { mtiDigits, mtiExamples } from './visual-data/integrationData';

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

  it('Core networking modules have at least 15 quiz questions and 15 flashcards', () => {
    const ids = ['networking', 'ip-subnetting', 'switching-routing', 'wan', 'network-security', 'troubleshooting'];
    for (const m of modules.filter((x) => ids.includes(x.id))) {
      expect(m.quiz.length, `${m.id} quiz`).toBeGreaterThanOrEqual(15);
      expect(m.flashcards.length, `${m.id} flashcards`).toBeGreaterThanOrEqual(15);
    }
  });

  describe('role module (System Integration)', () => {
    const role = modules.find((m) => m.id === roleModuleId)!;

    it('exists, is first and is marked priority', () => {
      expect(role).toBeDefined();
      expect(modules[0].id).toBe(roleModuleId);
      expect(role.priority).toBe(true);
    });

    it('has 8 sections, 30 quiz questions, 25 flashcards and 25 interview questions', () => {
      expect(role.sections.length).toBe(8);
      expect(role.quiz.length).toBe(30);
      expect(role.flashcards.length).toBe(25);
      expect(role.interview.length).toBe(25);
    });

    it('includes the required scenario questions', () => {
      const qs = role.interview.map((x) => x.q.toLowerCase());
      for (const needle of [
        'mobile banking cannot reach core banking',
        'debited the customer but no cash',
        'new bill payment partner',
        'same transfer request is sent twice',
        'message queue instead of a direct api call',
        'stopped working at midnight',
      ]) {
        expect(qs.some((q) => q.includes(needle)), needle).toBe(true);
      }
    });

    it('uses only correct ISO 8583 MTI pairings in the MTI decoder data', () => {
      const names = Object.fromEntries(mtiExamples.map((x) => [x.mti, x.name.toLowerCase()]));
      expect(names['0100']).toContain('authorisation request');
      expect(names['0110']).toContain('authorisation response');
      expect(names['0200']).toContain('financial request');
      expect(names['0210']).toContain('financial response');
      expect(names['0400']).toContain('reversal request');
      expect(names['0420']).toContain('reversal advice');
      expect(names['0430']).toContain('reversal advice response');
      expect(names['0800']).toContain('network management request');
      // Every example decodes with the digit tables: class digit 2 and function digit 3 must exist.
      for (const { mti } of mtiExamples) {
        expect(mtiDigits[1].values[mti[1]], mti).toBeDefined();
        expect(mtiDigits[2].values[mti[2]], mti).toBeDefined();
        expect(mtiDigits[3].values[mti[3]], mti).toBeDefined();
      }
    });
  });

  it('HR module has the "Why are you suited to this role" answer', () => {
    const hr = modules.find((m) => m.id === 'hr')!;
    expect(hr.interview.some((x) => /why are you suited to this role/i.test(x.q))).toBe(true);
  });
});
