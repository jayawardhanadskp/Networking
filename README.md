# NSB IT Interview Prep

A study app for the **Junior Executive (IT) – Grade IV** interview (Administrator / Programmer / Analyst posts).
Vite + React + TypeScript + Tailwind. Works offline after loading; progress is saved in your browser (localStorage).

## Run it

```bash
npm install
npm run dev            # http://localhost:5173
npm run dev -- --host  # also on your phone (same Wi-Fi): open the "Network:" URL Vite prints
```

Other scripts:

```bash
npm test          # subnet calculator tests + content integrity tests
npm run build     # type-check + production build (dist/)
npm run preview   # serve the production build (also on your network)
```

## What's inside

- **Dashboard**: countdown, % ready per module, "continue where I left off", study plan
- **Lessons**: analogy first → explanation → interactive diagram/animation → 🏦 bank example → ⭐ remember → quick check
- **Subnet trainer** (🧮): calculator, binary view, unlimited practice with step-by-step answers
- **Quiz** per module with explanations; **Weak areas** collects what you got wrong
- **Flashcards** with "know it / review again"
- **Interview Q&A bank** (💬) with hide/show answers and tips; **write and save your own version** of any answer
- **Mock interview** (🎤): random questions, 2-minute timer, reveal, rate yourself 1–5
- **Search** (🔍) across lessons, quizzes, flashcards and answers
- Dark / light / system theme

## Project structure

```
src/
  content/                  ← ALL learning content (plain data)
    index.ts                ← module registry
    types.ts                ← content model (Section, MCQ, Flashcard, InterviewQA, visual specs)
    plan.ts                 ← interview date + study plan
    01-networking/          ← one folder per module
      index.ts              ← module metadata
      lessons.ts            ← sections (text, visuals, bank example, remember, quick checks)
      practice.ts           ← quiz, flashcards, interview Q&A
    …13-hr/
    shared/bankTopology.ts  ← reusable bank network diagram
    visual-data/            ← data for the hand-built visuals (OSI, packet journey, NAT, RAID, …)
  components/
    visuals/                ← data-driven diagram engines: Sequence, Flow, Topology, Compare, Fields
    custom/                 ← hand-built interactive visuals
  pages/                    ← Dashboard, Lesson, Quiz, Flashcards, Subnet, Interview, Mock, Weak, Search
  lib/                      ← subnet math (+ tests), progress storage, router, theme
```

## Add a new module (e.g. your confirmed role)

1. Copy a folder, e.g. `src/content/07-sysadmin` → `src/content/14-my-role`.
2. Edit `index.ts` (id, title, emoji, tone), `lessons.ts` and `practice.ts`.
3. Register it in `src/content/index.ts`:
   ```ts
   import myRole from './14-my-role';
   const rawModules: Module[] = [ /* … */, myRole ];
   ```
4. Run `npm test` — the content tests check every section has a visual, valid answers, and that diagram links point to real nodes.

Diagrams are written as data in the lesson files — no drawing code needed:

- `{ kind: 'sequence', actors, steps }` – step-by-step message diagrams (handshakes, DHCP, DNS…)
- `{ kind: 'flow', steps }` – numbered processes
- `{ kind: 'topology', nodes, links, zones?, steps? }` – clickable network diagrams with animated packets
- `{ kind: 'compare', columns, rows }` and `{ kind: 'fields', rows }` – comparison tables and block diagrams
- `{ kind: 'custom', id: 'raid' }` – one of the hand-built visuals

## Note

Banking content is **general industry awareness only**. It does not describe NSB's real systems or vendors.
Check facts about the bank on official sources before the interview.
