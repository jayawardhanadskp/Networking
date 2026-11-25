import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const netSecurity: Module = {
  id: 'network-security',
  title: 'Network security',
  short: 'Firewalls, ACLs, DMZ, IDS/IPS, proxy, NAC, load balancers, Wi-Fi security',
  emoji: '🛡️',
  tone: 'red',
  sections,
  quiz,
  flashcards,
  interview,
};

export default netSecurity;
