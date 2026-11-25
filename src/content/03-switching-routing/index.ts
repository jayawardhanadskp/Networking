import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const switchingRouting: Module = {
  id: 'switching-routing',
  title: 'Switching & routing',
  short: 'MAC tables, VLANs, trunks, STP, inter-VLAN, routing tables, OSPF, BGP, HSRP/VRRP',
  emoji: '🔀',
  tone: 'teal',
  sections,
  quiz,
  flashcards,
  interview,
};

export default switchingRouting;
