import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const wan: Module = {
  id: 'wan',
  title: 'WAN & bank connectivity',
  short: 'Leased lines, MPLS, IPsec & SSL VPN, SD-WAN, branch/ATM links, redundancy',
  emoji: '🛰️',
  tone: 'purple',
  sections,
  quiz,
  flashcards,
  interview,
};

export default wan;
