import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const networking: Module = {
  id: 'networking',
  title: 'Networking fundamentals',
  short: 'OSI & TCP/IP, devices, TCP/UDP, ports, DHCP, DNS, ARP, NAT, ICMP',
  emoji: '🌐',
  tone: 'indigo',
  sections,
  quiz,
  flashcards,
  interview,
};

export default networking;
