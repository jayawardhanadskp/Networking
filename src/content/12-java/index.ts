import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const java: Module = {
  id: 'java',
  title: 'Java / OOP quick review',
  short: 'OOP pillars, interface vs abstract, exceptions, collections, @Transactional, BigDecimal',
  emoji: '☕',
  tone: 'amber',
  sections,
  quiz,
  flashcards,
  interview,
};

export default java;
