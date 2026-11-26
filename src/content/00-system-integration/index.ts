import type { Module } from '../types';
import { sections } from './lessons';
import { quiz, flashcards, interview } from './practice';

/** ROLE MODULE — top priority for the confirmed post. */
const systemIntegration: Module = {
  id: 'system-integration',
  title: 'Role: System Integration',
  short: 'Core banking interfaces, REST/SOAP, ESB, MQ, ISO 8583/20022, mTLS, SIT/UAT, troubleshooting',
  emoji: '🔗',
  tone: 'purple',
  priority: true,
  sections,
  quiz,
  flashcards,
  interview,
};

export default systemIntegration;
