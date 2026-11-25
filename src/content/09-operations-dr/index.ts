import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const operations: Module = {
  id: 'operations-dr',
  title: 'Operations, backup & DR',
  short: 'Backups, restore tests, DR sites, BCP, RPO/RTO, ITIL, SLAs, data centre basics',
  emoji: '🗄️',
  tone: 'green',
  sections,
  quiz,
  flashcards,
  interview,
};

export default operations;
