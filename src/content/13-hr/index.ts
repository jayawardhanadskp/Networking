import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const hr: Module = {
  id: 'hr',
  title: 'HR & personal answers',
  short: 'Tell me about yourself, why admin, why a state bank, strengths, 5-year plan',
  emoji: '🙋',
  tone: 'pink',
  sections,
  quiz,
  flashcards,
  interview,
};

export default hr;
