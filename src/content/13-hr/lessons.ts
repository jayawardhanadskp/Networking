import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'star',
    title: 'How to answer: the STAR method',
    analogy:
      'A good answer is like a **short story with a happy ending**: where were you, what was the problem, what did **you** do, and what was the result. Panels remember stories, not lists of words.',
    body: `For "Tell me about a time…" questions, use **STAR**:
- **S — Situation**: short background (1–2 sentences).
- **T — Task**: what was your responsibility / the goal?
- **A — Action**: what **you** did, step by step (say "I", not only "we"). This is the longest part.
- **R — Result**: the outcome, with a number if possible (time saved, downtime reduced) + what you learned.

Speaking tips for intermediate English:
- Use **short sentences**. It is fine to pause and think: "Let me think for a moment."
- If you don't understand a question: "Sorry, could you repeat the question, please?" or "Do you mean…?"
- If you don't know: "I haven't worked with that directly, but my understanding is… and I would learn it by…"
- Speak **slowly** — nervous speakers go too fast.
- End answers clearly: "…so that's how I solved it."`,
    visuals: [
      {
        kind: 'flow',
        title: 'STAR in action (example story)',
        steps: [
          { label: 'Situation', icon: 'S', detail: 'Our mobile app\'s backend API started timing out every evening at peak time, affecting thousands of users.', tone: 'blue' },
          { label: 'Task', icon: 'T', detail: 'I was responsible for finding the cause and restoring normal performance quickly.', tone: 'purple' },
          { label: 'Action', icon: 'A', detail: 'I checked the monitoring and logs, found slow database queries, added the missing index and a Redis cache for frequent reads, tested in staging, and deployed through our CI/CD pipeline in a low-traffic window.', tone: 'amber' },
          { label: 'Result', icon: 'R', detail: 'Response time dropped from about 4 seconds to under 300 ms and the timeouts stopped. I also added alerts so we would notice earlier next time.', tone: 'green' },
        ],
      },
    ],
    bank: `Replace this example with **your real story** (see the Q&A bank → HR module → "production issue"). Real details (numbers, tools) make you believable. Practise saying each story in **about 90 seconds**.`,
    remember: [
      'STAR: **Situation, Task, Action (most detail, "I"), Result (numbers + lesson)**.',
      'Short sentences, speak slowly, it is OK to ask the panel to repeat.',
      'If you don\'t know: say what you **do** know + how you would learn.',
    ],
    check: [
      {
        q: 'In a STAR answer, which part should be the longest?',
        options: ['Situation', 'Task', 'Action', 'Result'],
        answer: 2,
        explain: 'The **Action** shows what you personally did.',
      },
      {
        q: 'You do not understand a panel question. What is the best response?',
        options: ['Guess and talk for a long time', 'Politely ask them to repeat or clarify', 'Stay silent', 'Change the topic'],
        answer: 1,
        explain: 'Asking politely ("Could you repeat that, please?") is professional.',
      },
    ],
  },
  {
    id: 'intro',
    title: '"Tell me about yourself": structure',
    analogy:
      'Like introducing a **product**: what it is **now**, what it **has done before**, and why it is **perfect for this customer** — in 90 seconds.',
    body: `Use **Present → Past → Future**:
1. **Present** (who you are now): your role and main skills.
2. **Past** (what you have done): 2–3 achievements that relate to **infrastructure / operations / security** (AWS, Docker, CI/CD, production support).
3. **Future** (why this job): why the bank, why this IT role, what you will bring.

Rules:
- **90 seconds** (about 200–230 words). Do **not** tell your whole life story.
- Do not just repeat your CV — **connect** your experience to the job.
- End with a clear sentence: "…that's why I'm excited about this opportunity."

Your full template is in **💬 Q&A → HR & personal answers**. Tap "Write my own version" to edit and save it, then practise it in the **🎤 Mock interview** with the timer.`,
    visuals: [
      {
        kind: 'flow',
        title: '90-second structure',
        steps: [
          { label: 'Present (20 s)', icon: '🧑‍💻', detail: '"I\'m a full-stack and mobile developer with about three years of experience in Java Spring Boot, Node.js, Flutter and AWS."', tone: 'blue' },
          { label: 'Past (40 s)', icon: '🏗️', detail: 'Two or three achievements linked to infrastructure: deploying on AWS EC2, Docker, CI/CD pipelines, handling production issues, Redis certification.', tone: 'purple' },
          { label: 'Bridge (15 s)', icon: '🌉', detail: '"Through this work I learned how much applications depend on networks, servers and security — and I enjoy that side."', tone: 'amber' },
          { label: 'Future (15 s)', icon: '🏦', detail: '"I want to grow as an IT professional in a stable, national bank, and this role lets me use my skills to keep critical systems reliable and secure."', tone: 'green' },
        ],
      },
    ],
    bank: `Panels in state banks often value **stability, commitment, honesty and willingness to learn** as much as technical skill. Show calm confidence, respect, and a clear wish to build a long-term career.`,
    remember: [
      '**Present → Past → Future**, about **90 seconds**.',
      'Connect your developer experience to **infrastructure, operations and security**.',
      'Finish with why **this** bank and **this** role.',
    ],
    check: [
      {
        q: 'How long should "Tell me about yourself" be?',
        options: ['10 seconds', 'About 60–90 seconds', '5 minutes', 'As long as possible'],
        answer: 1,
        explain: 'Around **60–90 seconds** — clear and focused.',
      },
    ],
  },
  {
    id: 'bridge',
    title: 'The bridge: developer → administrator',
    analogy:
      'A **car designer** who has also changed tyres, fixed engines and driven in races understands cars better than most mechanics. You **built** applications **and** deployed and supported them — that is a strong base for an admin role.',
    body: `The panel will likely ask: **"You are a developer — why an Administrator post?"** Your answer must show it is a **logical step**, not a random change.

Map your experience to admin skills:
- **AWS EC2 + security groups** → servers, firewalls rules, ports, least privilege.
- **VPC/subnets** (if you used them) → IP addressing, routing, public vs private networks.
- **Docker** → virtualisation concepts, Linux, networking between services, ports.
- **CI/CD pipelines** → automation, controlled deployments, rollback (change management).
- **Production deployments & incidents** → monitoring, logs, troubleshooting under pressure.
- **MySQL, Redis** → databases, backups, performance, caching.
- **Linux commands, SSH, Nginx** (if used) → system administration.

And be honest: "Networking is the area where I am **still growing**. I have been studying CCNA-level topics like subnetting, VLANs, routing and security, and I learn fast."`,
    visuals: [
      {
        kind: 'compare',
        title: 'What I did → how it helps an admin',
        columns: [
          { label: 'My developer experience', icon: '💻', tone: 'blue' },
          { label: 'Admin skill it proves', icon: '🖧', tone: 'green' },
        ],
        rows: [
          { label: 'Cloud', values: ['Deployed apps on AWS EC2, configured security groups', 'Servers, firewall rules, ports, least privilege'] },
          { label: 'Containers', values: ['Docker images, container networking', 'Virtualisation, Linux, ports, isolation'] },
          { label: 'Automation', values: ['CI/CD pipelines', 'Controlled, repeatable changes + rollback'] },
          { label: 'Operations', values: ['Production deployments, fixing live issues', 'Monitoring, logs, incident handling'] },
          { label: 'Data', values: ['MySQL, Firebase, Redis (certified)', 'Database basics, backups, performance'] },
          { label: 'Security', values: ['Auth, BCrypt, HTTPS, input validation', 'InfoSec awareness, secure configuration'] },
        ],
      },
    ],
    bank: `Strong closing line: *"Because I know how applications work inside, I can troubleshoot faster across the whole stack — network, server, database and application — and communicate well with developers and vendors."*`,
    remember: [
      'It is a **logical next step**: you already worked close to infrastructure.',
      'Map: **EC2/security groups → firewalls**, Docker → virtualisation/Linux, **CI/CD → change management**, prod support → incident handling.',
      'Be honest about networking + show you are studying it actively.',
    ],
    check: [
      {
        q: 'Which experience best shows understanding of firewall rules?',
        options: ['Designing app icons', 'Configuring AWS security groups (allowed ports and sources)', 'Writing unit tests for UI', 'Choosing app colours'],
        answer: 1,
        explain: '**Security groups** are stateful firewall rules — a direct link to network security.',
      },
    ],
  },
  {
    id: 'why-bank',
    title: 'Why a state bank? Why this bank?',
    analogy:
      'When you join a team, the coach wants to know you chose **this team for real reasons**, not just because it was the first one that called you.',
    body: `Good reasons to mention (choose the ones that are **true for you**):
- **Stability and long-term career** — you want to build your career and grow over many years.
- **Purpose / national impact** — a state bank serves people all over the country, including rural areas; keeping its systems reliable helps millions of customers.
- **Critical, large-scale systems** — core banking, ATMs, a big branch network: a great place to learn infrastructure deeply.
- **Learning and structure** — strong processes (change management, security, compliance) and training.
- **Trust and reputation** of the institution.

**Do your research before the interview** (official sources only): the bank's history, its role (e.g. savings), its branch network size, recent digital services, its mission/vision. Put 1–2 facts **in your own words** in your answer.

Avoid: "Because it is a government job and easy", "Because the salary is good" (as the main reason), or criticising your current employer.`,
    visuals: [
      {
        kind: 'fields',
        title: 'Build your answer from these blocks',
        rows: [
          {
            label: 'Motivation',
            fields: [
              { text: 'Stability', sub: 'long-term career', tone: 'blue' },
              { text: 'Purpose', sub: 'serve the whole country', tone: 'green' },
              { text: 'Scale', sub: 'critical systems to learn', tone: 'purple' },
            ],
          },
          {
            label: 'Research (fill in from official sources)',
            fields: [
              { text: '[fact about the bank]', tone: 'amber' },
              { text: '[recent digital service]', tone: 'amber' },
              { text: '[mission / value you like]', tone: 'amber' },
            ],
          },
          {
            label: 'What you bring',
            fields: [
              { text: 'Dev + cloud skills', tone: 'teal' },
              { text: 'Fast learner', tone: 'teal' },
              { text: 'Commitment', tone: 'teal' },
            ],
          },
        ],
      },
    ],
    bank: `Be careful: do not claim facts you are not sure about (like specific systems or vendors the bank uses). If you mention a fact, make sure you read it on an **official** source. It is better to say less but be correct.`,
    remember: [
      'Reasons: **stability, purpose/national impact, critical systems at scale, structured learning**.',
      'Research the bank on **official** sources; use 1–2 facts in your own words.',
      'Never say "easy government job" or attack your current employer.',
    ],
    check: [
      {
        q: 'Which is the weakest answer to "Why do you want to join a state bank?"',
        options: ['I want a stable long-term career where my work helps people across the country', 'I want to work on critical, large-scale systems and learn', 'It is a government job, so the work will be easy', 'I like the structured processes and training'],
        answer: 2,
        explain: 'Saying the work will be "easy" shows low motivation.',
      },
    ],
  },
  {
    id: 'tough',
    title: 'Tough questions: long hours, weaknesses, questions for the panel',
    analogy:
      'Tough questions are like **speed bumps**: if you slow down, stay calm and go over them smoothly, nothing bad happens. Panic and you crash.',
    body: `**"Are you willing to work long hours / nights / weekends / support operations?"**
→ Say **yes** clearly, and show you understand **why**: banks run 24×7 (ATMs, online banking); maintenance happens at night; incidents need fast response. Mention you have done after-hours deployments or fixed production issues.

**"What is your weakness?"**
→ A **real but safe** weakness + **what you are doing** about it. For you, honest options: *networking depth* (studying CCNA topics), or *spoken English confidence* (practising daily, presenting in meetings). Never say "I have no weaknesses" or "I work too hard".

**"Where do you see yourself in 5 years?"**
→ Growing **inside the bank**: strong in infrastructure/security, certifications (e.g. CCNA, Azure/AWS, security), taking more responsibility, maybe leading projects.

**"Do you have any questions for us?"** — Always ask 1–2:
- "What does a typical week look like for this role?"
- "What training opportunities are there for new IT officers?"
- "Which technologies is the IT team focusing on in the next year or two?"`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'Do ✅', icon: '👍', tone: 'green' },
          { label: 'Don\'t ❌', icon: '👎', tone: 'red' },
        ],
        rows: [
          { label: 'Long hours', values: ['"Yes — banks run 24×7, I understand on-call and night maintenance."', '"Only if paid extra" / hesitation'] },
          { label: 'Weakness', values: ['Real weakness + action plan', '"No weaknesses" / "I\'m a perfectionist"'] },
          { label: 'Unknown question', values: ['"I\'m not sure, but my understanding is… I would check…"', 'Inventing an answer'] },
          { label: 'Previous job', values: ['Positive: what you learned', 'Complaining about your manager'] },
          { label: 'End of interview', values: ['Ask 1–2 good questions, thank them', '"No questions."'] },
        ],
      },
    ],
    bank: `In operations roles, **reliability and attitude** matter. Show that you stay calm under pressure, communicate clearly during incidents, follow procedures, and are happy to keep learning.`,
    remember: [
      'Long hours: **clear yes + why** (24×7 bank, maintenance windows, incidents).',
      'Weakness: real + improvement plan (networking depth / spoken English).',
      'Always ask the panel 1–2 thoughtful questions.',
    ],
    check: [
      {
        q: 'Which is the best way to answer "What is your weakness?"',
        options: ['"I have no weaknesses."', '"I work too hard."', 'A real weakness plus what you are actively doing to improve it', 'Refuse to answer'],
        answer: 2,
        explain: 'Honesty + a plan shows self-awareness and growth.',
      },
    ],
  },
  {
    id: 'interview-day',
    title: 'Interview day checklist',
    analogy:
      'Like a pilot\'s **pre-flight checklist**: simple steps, done every time, so nothing important is forgotten when you are nervous.',
    body: `**Day before**
- Read your HR answers out loud 2–3 times. Do one **mock interview** in this app.
- Prepare documents: NIC, certificates (degree, Redis certification…), CV copies, call letter, pen.
- Plan the journey; aim to arrive **30 minutes early**. Sleep well.

**On the day**
- Formal, neat clothes. Switch phone to silent.
- Quick review: **flashcards** (ports, OSI, subnet table) for 15 minutes — not new topics.
- Greet the panel, wait to be invited to sit, keep good posture and **eye contact** with all panel members.

**During answers**
- Listen to the full question. Pause 2 seconds. Answer with structure (definition → how it works → bank example).
- For scenarios: **scope → steps → escalation → communication → documentation**.
- Be honest. Stay calm if you don't know.

**At the end**
- Ask 1–2 questions. Thank the panel: "Thank you for your time. I would be happy to contribute to the bank."`,
    visuals: [
      {
        kind: 'flow',
        title: 'Your last 24 hours',
        steps: [
          { label: 'Evening before', icon: '🌙', detail: 'One mock interview (8 questions). Read your HR answers aloud. Prepare documents & clothes.', tone: 'blue' },
          { label: 'Sleep', icon: '😴', detail: 'Stop studying early. A rested brain remembers more than a tired one.', tone: 'purple' },
          { label: 'Morning', icon: '☀️', detail: '15 min of flashcards: ports, OSI layers, subnet cheat sheet, AD/RAID basics.', tone: 'amber' },
          { label: 'Arrive early', icon: '🚶', detail: '30 min early. Breathe slowly. Remind yourself of your 3 strengths.', tone: 'teal' },
          { label: 'In the room', icon: '🤝', detail: 'Greet, sit when invited, eye contact, short clear answers, structure, honesty.', tone: 'green' },
          { label: 'Finish', icon: '🙏', detail: 'Ask 1–2 questions, thank the panel, leave calmly.', tone: 'indigo' },
        ],
      },
    ],
    bank: `Good luck on Sunday! Remember: the panel wants to know you are **trustworthy, willing to learn, and safe with critical systems**. Your developer background is a strength — explain it with confidence.`,
    remember: [
      'Documents, journey, sleep. Arrive **30 minutes early**.',
      'Answer structure: **definition → how it works → bank example**; scenarios: scope → steps → escalate → communicate → document.',
      'Finish with questions and a thank-you.',
    ],
    check: [
      {
        q: 'What is the best thing to do on the morning of the interview?',
        options: ['Learn a completely new topic', 'Quick review of flashcards and key tables', 'Skip breakfast to study', 'Arrive exactly on time'],
        answer: 1,
        explain: 'A **light review** of known material builds confidence.',
      },
    ],
  },
];
