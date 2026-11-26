/**
 * Content model for the study app.
 * All learning content lives in src/content/** as plain data.
 * Components only render these shapes.
 */

import type { customVisualIds } from './visualIds';

export type Tone = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'teal' | 'slate' | 'pink' | 'indigo';

/** Multiple-choice question. `answer` is the index of the correct option. */
export interface MCQ {
  id?: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Flashcard {
  id?: string;
  front: string;
  back: string;
  tag?: 'port' | 'acronym' | 'definition' | 'command' | 'fact';
}

export interface InterviewQA {
  id?: string;
  q: string;
  /** Model answer (markdown-lite). For HR questions this is an editable template. */
  answer: string;
  tips?: string[];
  type: 'technical' | 'scenario' | 'hr';
}

/* ---------------- Visual specs (data-driven diagrams) ---------------- */

export type DeviceIcon =
  | 'pc' | 'laptop' | 'phone' | 'server' | 'db' | 'router' | 'switch' | 'hub' | 'firewall'
  | 'ap' | 'cloud' | 'atm' | 'lb' | 'printer' | 'internet' | 'dns' | 'user' | 'building'
  | 'shield' | 'disk' | 'camera' | 'card' | 'bank' | 'globe' | 'lock' | 'monitor';

export interface SequenceSpec {
  kind: 'sequence';
  title?: string;
  actors: { id: string; label: string; icon?: DeviceIcon; sub?: string }[];
  steps: {
    from: string;
    to: string;
    label: string;
    detail: string;
    tone?: Tone;
    dashed?: boolean;
  }[];
}

export interface FlowSpec {
  kind: 'flow';
  title?: string;
  steps: { label: string; icon?: string; detail: string; tone?: Tone }[];
  /** Draw an arrow from last step back to first (cycle). */
  cycle?: boolean;
}

export interface TopologyNode {
  id: string;
  label: string;
  icon: DeviceIcon;
  x: number;
  y: number;
  sub?: string;
  info: string;
}

export interface TopologyLink {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'tunnel' | 'wireless' | 'trunk';
  tone?: Tone;
}

export interface TopologyStep {
  text: string;
  /** Each path is a list of node ids; a packet dot travels along it. */
  paths?: string[][];
  highlight?: string[];
  packet?: string;
  tone?: Tone;
  /** Mark the last node of each path as "blocked" (red X). */
  blocked?: boolean;
}

export interface TopologySpec {
  kind: 'topology';
  title?: string;
  width: number;
  height: number;
  zones?: { label: string; x: number; y: number; w: number; h: number; tone: Tone }[];
  nodes: TopologyNode[];
  links: TopologyLink[];
  steps?: TopologyStep[];
  hint?: string;
}

export interface CompareSpec {
  kind: 'compare';
  title?: string;
  columns: { label: string; icon?: string; tone: Tone }[];
  rows: { label: string; values: string[] }[];
}

export interface FieldsSpec {
  kind: 'fields';
  title?: string;
  rows: {
    label?: string;
    fields: { text: string; sub?: string; tone: Tone; w?: number }[];
  }[];
  note?: string;
}

export type CustomVisualId = (typeof customVisualIds)[number];

export interface CustomSpec {
  kind: 'custom';
  id: CustomVisualId;
  title?: string;
}

export type VisualSpec = SequenceSpec | FlowSpec | TopologySpec | CompareSpec | FieldsSpec | CustomSpec;

/* ---------------- Lessons and modules ---------------- */

export interface Section {
  id: string;
  title: string;
  /** Real-life analogy shown first, before the technical explanation. */
  analogy?: string;
  /** Technical explanation (markdown-lite: **bold**, `code`, "- " lists, "| a | b |" tables). */
  body: string;
  visuals: VisualSpec[];
  /** "Bank example" box. */
  bank: string;
  /** "Remember for the interview" box: 2–3 points. */
  remember: string[];
  /** 2–3 quick-check questions shown at the end of the section. */
  check: MCQ[];
}

export interface Module {
  id: string;
  title: string;
  short: string;
  emoji: string;
  tone: Tone;
  /** Shown first and badged "Top priority" on the dashboard (the confirmed role module). */
  priority?: boolean;
  sections: Section[];
  quiz: MCQ[];
  flashcards: Flashcard[];
  interview: InterviewQA[];
}
