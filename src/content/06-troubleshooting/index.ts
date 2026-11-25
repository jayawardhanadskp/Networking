import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const troubleshooting: Module = {
  id: 'troubleshooting',
  title: 'Troubleshooting & commands',
  short: 'Bottom-up method, ping, tracert, ipconfig, nslookup, netstat, arp, SNMP, syslog',
  emoji: '🧰',
  tone: 'amber',
  sections,
  quiz,
  flashcards,
  interview,
};

export default troubleshooting;
