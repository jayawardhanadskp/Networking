import { describe, expect, it } from 'vitest';
import { allInterview } from '../content';
import { roleModuleId } from '../content/plan';
import { pickMock } from './mock';

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

describe('mock interview picker', () => {
  for (const count of [5, 8, 12, 20]) {
    it(`mixed, ${count} questions: ~60% role module, starts with "Tell me about yourself", no duplicates`, () => {
      for (let s = 1; s <= 20; s++) {
        const picked = pickMock(allInterview, count, 'mixed', roleModuleId, seeded(s));
        expect(picked.length).toBe(count);
        expect(new Set(picked.map((x) => x.key)).size).toBe(count);
        expect(picked[0].qa.q).toMatch(/tell me about yourself/i);
        const role = picked.filter((x) => x.module.id === roleModuleId).length;
        expect(role).toBe(Math.round(count * 0.6));
        expect(picked.some((x) => x.qa.type === 'hr')).toBe(true);
      }
    });

    it(`technical, ${count} questions: 60% role module and no HR`, () => {
      const picked = pickMock(allInterview, count, 'technical', roleModuleId, seeded(count));
      expect(picked.length).toBe(count);
      expect(picked.filter((x) => x.module.id === roleModuleId).length).toBe(Math.round(count * 0.6));
      expect(picked.every((x) => x.qa.type !== 'hr')).toBe(true);
    });
  }

  it('hr mode returns only HR questions', () => {
    const picked = pickMock(allInterview, 8, 'hr', roleModuleId, seeded(3));
    expect(picked.length).toBeGreaterThan(0);
    expect(picked.every((x) => x.qa.type === 'hr')).toBe(true);
  });
});
