import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

const infosec: Module = {
  id: 'infosec',
  title: 'Information security',
  short: 'CIA, least privilege, MFA, hashing vs encryption, TLS, attacks, incident response, PCI DSS, ISO 27001',
  emoji: '🔐',
  tone: 'pink',
  sections,
  quiz,
  flashcards,
  interview,
};

export default infosec;
