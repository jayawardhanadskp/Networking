import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const sysadmin: Module = {
  id: 'sysadmin',
  title: 'Systems administration',
  short: 'Windows Server, AD, GPO, Linux, permissions, services, virtualisation, RAID, patching',
  emoji: '🖥️',
  tone: 'slate',
  sections,
  quiz,
  flashcards,
  interview,
};

export default sysadmin;
