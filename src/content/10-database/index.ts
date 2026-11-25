import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const database: Module = {
  id: 'database',
  title: 'Database basics for admins',
  short: 'Backup/restore, users & roles, indexes, ACID, basic SQL',
  emoji: '🛢️',
  tone: 'blue',
  sections,
  quiz,
  flashcards,
  interview,
};

export default database;
