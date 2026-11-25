import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const banking: Module = {
  id: 'banking-it',
  title: 'Banking IT awareness',
  short: 'Core banking, ATM switch, card networks, ISO 8583, SWIFT, LankaPay',
  emoji: '🏦',
  tone: 'indigo',
  sections,
  quiz,
  flashcards,
  interview,
};

export default banking;
