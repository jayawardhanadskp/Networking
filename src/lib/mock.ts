import { shuffle } from './random';

export type MockMix = 'mixed' | 'technical' | 'hr';

/** Share of mock questions taken from the role module (the rest come from all other modules, incl. HR). */
export const ROLE_SHARE = 0.6;
/** In "real panel mix", this share of the non-role questions is HR (always at least one). */
const HR_SHARE_OF_OTHERS = 0.4;

interface Pickable {
  module: { id: string };
  qa: { type: 'technical' | 'scenario' | 'hr'; q: string };
}

/**
 * Pick mock interview questions.
 * - mixed: starts with "Tell me about yourself"; 60% role module, 40% others (some HR, rest technical).
 * - technical: 60% role module, 40% technical/scenario questions from other modules.
 * - hr: HR questions only.
 * If a pool runs short, the other pool fills the gap so the session still has `count` questions.
 */
export function pickMock<T extends Pickable>(all: readonly T[], count: number, mix: MockMix, roleId: string, rng: () => number = Math.random): T[] {
  const isHr = (x: T) => x.qa.type === 'hr';
  const hr = all.filter(isHr);
  if (mix === 'hr') return shuffle(hr, rng).slice(0, count);

  const role = shuffle(all.filter((x) => x.module.id === roleId && !isHr(x)), rng);
  const otherTech = shuffle(all.filter((x) => x.module.id !== roleId && !isHr(x)), rng);
  const nRole = Math.min(role.length, Math.round(count * ROLE_SHARE));

  if (mix === 'technical') {
    const picked = [...role.slice(0, nRole), ...otherTech.slice(0, count - nRole)];
    return shuffle(fill(picked, [...role, ...otherTech], count), rng);
  }

  const nOther = count - nRole;
  const intro = hr.find((x) => /tell me about yourself/i.test(x.qa.q));
  const nHr = Math.min(nOther, Math.max(1, Math.round(nOther * HR_SHARE_OF_OTHERS)));
  const hrPick = shuffle(hr.filter((x) => x !== intro), rng).slice(0, intro ? nHr - 1 : nHr);
  const head = intro && nHr > 0 ? [intro] : [];
  const rest = [...role.slice(0, nRole), ...hrPick, ...otherTech.slice(0, nOther - head.length - hrPick.length)];
  const body = fill([...head, ...rest], [...role, ...otherTech, ...hr], count).filter((x) => !head.includes(x));
  return [...head, ...shuffle(body, rng)];
}

/** Top up `picked` from `pool` (skipping duplicates) until it has `count` items. */
function fill<T>(picked: T[], pool: T[], count: number): T[] {
  const out = [...picked];
  for (const x of pool) {
    if (out.length >= count) break;
    if (!out.includes(x)) out.push(x);
  }
  return out.slice(0, count);
}
