import type { Tone } from '../content/types';

/** Full class strings (so Tailwind can see them). */
export const toneBg: Record<Tone, string> = {
  blue: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-500/20 dark:text-blue-100 dark:border-blue-400/40',
  green: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-100 dark:border-emerald-400/40',
  amber: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-100 dark:border-amber-400/40',
  red: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-100 dark:border-rose-400/40',
  purple: 'bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-500/20 dark:text-violet-100 dark:border-violet-400/40',
  teal: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-500/20 dark:text-teal-100 dark:border-teal-400/40',
  slate: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-500/20 dark:text-slate-100 dark:border-slate-400/40',
  pink: 'bg-pink-100 text-pink-900 border-pink-300 dark:bg-pink-500/20 dark:text-pink-100 dark:border-pink-400/40',
  indigo: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-100 dark:border-indigo-400/40',
};

export const toneSolid: Record<Tone, string> = {
  blue: 'bg-blue-600 text-white',
  green: 'bg-emerald-600 text-white',
  amber: 'bg-amber-500 text-white',
  red: 'bg-rose-600 text-white',
  purple: 'bg-violet-600 text-white',
  teal: 'bg-teal-600 text-white',
  slate: 'bg-slate-600 text-white',
  pink: 'bg-pink-600 text-white',
  indigo: 'bg-indigo-600 text-white',
};

/** Hex colours for SVG strokes/fills (work in both themes). */
export const toneHex: Record<Tone, string> = {
  blue: '#3b82f6',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#f43f5e',
  purple: '#8b5cf6',
  teal: '#14b8a6',
  slate: '#94a3b8',
  pink: '#ec4899',
  indigo: '#6366f1',
};

export const toneText: Record<Tone, string> = {
  blue: 'text-blue-700 dark:text-blue-300',
  green: 'text-emerald-700 dark:text-emerald-300',
  amber: 'text-amber-700 dark:text-amber-300',
  red: 'text-rose-700 dark:text-rose-300',
  purple: 'text-violet-700 dark:text-violet-300',
  teal: 'text-teal-700 dark:text-teal-300',
  slate: 'text-slate-600 dark:text-slate-300',
  pink: 'text-pink-700 dark:text-pink-300',
  indigo: 'text-indigo-700 dark:text-indigo-300',
};
