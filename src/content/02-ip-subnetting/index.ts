import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const ipSubnetting: Module = {
  id: 'ip-subnetting',
  title: 'IP addressing & subnetting',
  short: 'Binary, classes, private ranges, CIDR, magic number, VLSM, IPv6',
  emoji: '🔢',
  tone: 'blue',
  sections,
  quiz,
  flashcards,
  interview,
};

export default ipSubnetting;
