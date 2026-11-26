import type { Flashcard, InterviewQA, MCQ } from '../types';

/**
 * HR answers are TEMPLATES. Replace everything in [square brackets] with your real details.
 * In the app: Q&A → filter "HR" → open an answer → "Write my own version" (saved in your browser).
 */

export const quiz: MCQ[] = [];

export const flashcards: Flashcard[] = [
  { front: 'STAR', back: '**Situation · Task · Action · Result** — for "tell me about a time…" questions.', tag: 'acronym' },
  { front: 'Tell me about yourself — structure', back: '**Present → Past → Future**, about 90 seconds. End with why this role.', tag: 'definition' },
  { front: 'My bridge sentence', back: '"I already worked close to infrastructure — AWS EC2, security groups, Docker, CI/CD and production support — so administration is my natural next step."', tag: 'fact' },
  { front: 'My 3 strengths (with proof)', back: '1. **Fast learner** — [Redis certification / new framework in X weeks]\n\n2. **Problem solver** — [production issue story]\n\n3. **Full-stack view** — [app + cloud + DB experience]', tag: 'fact' },
  { front: 'My weakness + plan', back: '"Networking depth — I\'m studying CCNA-level topics (subnetting, VLANs, routing, security) and practising daily." (or spoken English + plan)', tag: 'fact' },
  { front: 'Answer structure for technical questions', back: '**Definition → how it works → bank example** (→ how I would troubleshoot it).', tag: 'definition' },
  { front: 'Answer structure for scenario questions', back: '**Gather facts → scope → steps → escalate → communicate → document.**', tag: 'definition' },
  { front: 'If I don\'t know', back: '"I haven\'t worked with that directly. My understanding is… In the job I would check the documentation / ask senior colleagues and learn it quickly."', tag: 'fact' },
  { front: 'Questions to ask the panel', back: '• What does a typical week look like in this role?\n• What training is available for new IT officers?\n• What technologies is the team focusing on next?', tag: 'fact' },
];

export const interview: InterviewQA[] = [
  {
    type: 'hr',
    q: 'Tell me about yourself.',
    answer: `Thank you. My name is [Your name]. I'm a full-stack and mobile developer with about **three years of experience**. I work mainly with **Java Spring Boot, Node.js and Flutter**, with **MySQL, Firebase and Redis** for data, and I'm a **Redis Certified Associate Developer (Java)**.

At [Company], I built and maintained [type of apps, e.g. "mobile and web applications for … customers"]. A big part of my work was close to infrastructure: I deployed services on **AWS EC2**, configured **security groups**, packaged applications with **Docker**, and set up **CI/CD pipelines** for automatic, repeatable deployments. I also handled **production issues** — checking logs and monitoring, finding the cause and fixing it quickly.

Through this work I learned how much applications depend on **networks, servers, databases and security**, and I really enjoy that side of IT. So I have been strengthening my networking and system administration knowledge.

Now I want to build a **long-term career in a stable, national bank**, where I can use my development and cloud experience to help keep **critical banking systems reliable and secure**, and keep learning from an experienced IT team. That's why I'm very excited about this opportunity.`,
    tips: ['Target 90 seconds. Time yourself in Mock mode.', 'Replace every [bracket] with real details.', 'Smile at the start and the end.'],
  },
  {
    type: 'hr',
    q: 'You are a developer. Why do you want an Administrator post?',
    answer: `It's a natural next step for me. As a developer I already worked **very close to infrastructure**:
- I deployed applications on **AWS EC2** and configured **security groups**, so I understand ports, firewall rules and least privilege.
- I used **Docker**, which taught me Linux, container networking and virtualisation concepts.
- I built **CI/CD pipelines**, which is about controlled, repeatable changes — similar to change management.
- I supported **production systems** — monitoring, logs and fixing issues under pressure.

I found that I enjoy making systems **reliable and secure** as much as building features. Because I understand how applications work inside, I can troubleshoot across the whole stack — network, server, database and application — and communicate well with developers and vendors.

To be honest, networking is the area where I'm still growing, so I have been actively studying CCNA-level topics like subnetting, VLANs, routing and network security, and I'm ready to keep learning on the job.`,
    tips: ['Sound positive about development too — you are adding skills, not running away.', 'The honest "still growing" line builds trust.'],
  },
  {
    type: 'hr',
    q: 'Why are you suited to this role (Administrator – System Integration)?',
    answer: `Because integration is what I have been doing **from the application side** for about three years — connecting systems so they exchange data **reliably and securely**.

- **APIs:** I design and build **REST APIs with Spring Boot** that mobile and web apps call — so I understand request/response formats, HTTP status codes, timeouts, validation and API documentation from both sides of an interface.
- **Security:** I implemented **JWT-based authentication**, so I already work with tokens, expiry, signatures and access control — the same ideas as OAuth2 and API gateway security in a bank.
- **Third-party integrations:** I integrated **Firebase** (authentication, push notifications) and **AI services** through their APIs — handling API keys, rate limits, errors and retries, and working from the provider's documentation. That is exactly how you onboard an external partner.
- **Production releases:** I deploy to production through **CI/CD** and support live systems — checking logs, finding where a request failed and fixing it carefully. In a bank that becomes change management, monitoring and incident handling.
- **Reliability:** I'm a **Redis Certified Associate Developer (Java)**. I've used Redis for caching and fast lookups — for example to avoid processing the same request twice — which connects directly to idempotency and performance in payment integrations.

What I'm adding now is the **banking and infrastructure side**: message standards like **ISO 8583 and ISO 20022**, middleware and message queues, mutual TLS and certificates, SIT/UAT and the bank's change process. I've been studying these seriously, and I'm confident I can learn the bank's specific systems quickly and become a reliable member of the integration team.

[Optional real example: "For example, at [Company] I integrated [service] — [one sentence on the problem and result]."]`,
    tips: [
      'Structure: "I already do X from the app side → here is the proof → here is what I am adding."',
      'Pick ONE real integration story and say it in two sentences — numbers help.',
      'Do not claim experience with ISO 8583, MQ or ESB products you have not used; say you have studied them.',
    ],
  },
  {
    type: 'hr',
    q: 'Why do you want to work for a state bank / for this bank?',
    answer: `I have three main reasons.

First, I'm looking for a **long-term, stable career** where I can grow step by step, and a respected state bank offers that.

Second, **purpose**: this bank serves customers all over the country, [research: e.g. a fact about its role/history/branch network from the official website]. Keeping its systems running well means helping a very large number of people every day, and that motivates me.

Third, **learning**: a bank has critical, large-scale systems — core banking, ATMs, a large branch network — and strong processes for security and change management. It's a great environment to become a strong infrastructure professional.

I believe my development and cloud experience, plus my willingness to learn, will let me contribute from the start.`,
    tips: ['Fill the [research] part from the bank\'s official website — in your own words.', 'Never say "it\'s an easy government job".'],
  },
  {
    type: 'hr',
    q: 'Are you willing to work long hours, nights, weekends or support operations when needed?',
    answer: `**Yes, definitely.** I understand that a bank runs **24×7** — ATMs, online banking and card services never stop — and that maintenance and upgrades are usually done at night or on weekends to avoid affecting customers. When incidents happen, a quick response is important.

In my current role I have already done [after-hours deployments / fixed production issues late at night], so I'm used to it. I'm also happy to be part of an **on-call or shift roster**. I'll always follow the procedures and keep the team updated.`,
    tips: ['Say "yes" in the first words — hesitation is noticed.'],
  },
  {
    type: 'hr',
    q: 'What are your strengths?',
    answer: `I'd mention three:
1. **I learn fast.** For example, [I earned the Redis Certified Associate Developer certification while working full-time / I learned Flutter and delivered an app in X weeks].
2. **I stay calm and solve problems.** When [production issue], I [checked logs/monitoring, found the cause, fixed it], and [result].
3. **I see the full picture.** I've worked on mobile, backend, databases and cloud deployment, so I understand how all the parts connect — very useful when troubleshooting.`,
    tips: ['Always give a short proof for each strength.'],
  },
  {
    type: 'hr',
    q: 'What is your weakness?',
    answer: `My main area for improvement is **networking depth**. As a developer I used networking concepts — ports, security groups, DNS, HTTPS — but I didn't configure routers and switches in a large enterprise network.

So I've taken action: I've been studying **CCNA-level topics** like subnetting, VLANs, routing protocols, VPNs and network security, practising subnetting questions daily, and [using Packet Tracer / labs if true]. I'm confident I'll close this gap quickly with hands-on experience in the role.

[Alternative: "Speaking English confidently in large meetings. I'm improving by practising presentations and speaking English every day."]`,
    tips: ['Choose ONE weakness. Keep it honest and show progress.'],
  },
  {
    type: 'hr',
    q: 'Tell me about a production issue you solved.',
    answer: `**Situation:** [At Company], our [mobile app backend / API] started [timing out / failing] during [peak hours], affecting [number] users.

**Task:** I was responsible for finding the cause and restoring the service quickly.

**Action:** First I checked the **monitoring and logs** to find when and where it failed. I found that [cause — e.g. a slow database query without an index / memory leak / connection pool exhausted / an expired certificate / Redis connection limit]. I [fixed it — e.g. added the index and a Redis cache / increased the pool and fixed the leak], **tested it in staging**, and deployed it through our **CI/CD pipeline** during a low-traffic window. I kept my manager and team updated during the process.

**Result:** [Response time improved from X to Y / errors stopped]. Afterwards I added **alerts** so we would notice earlier, and documented the fix for the team.

What I learned: good monitoring, logs and a calm, step-by-step approach are essential — the same approach I'll use for infrastructure incidents in the bank.`,
    tips: ['Use a REAL story with real numbers.', 'Notice the link at the end to the admin role.'],
  },
  {
    type: 'hr',
    q: 'Where do you see yourself in five years?',
    answer: `In five years, I see myself as a **strong infrastructure and security professional in this bank** — someone the team can trust with critical systems. I'd like to have deep experience in networks, servers and security operations, complete certifications such as [CCNA, a cloud or security certification], and take more responsibility — for example leading small projects like a branch network upgrade or a DR improvement, and helping train new team members. Most of all, I want to grow **with the bank** over the long term.`,
    tips: ['Show ambition within the organisation, not plans to leave.'],
  },
  {
    type: 'hr',
    q: 'Why should we select you?',
    answer: `I bring a combination that is useful for this role:
- **Hands-on technical experience** with servers, cloud, containers, databases and production support — not only theory.
- **An application view** — I understand how the systems the bank depends on actually work, so I can troubleshoot across the whole stack and work well with developers and vendors.
- **A strong learning attitude** — I've proven I can learn new technologies quickly, and I'm already studying networking in depth.
- **Commitment** — I'm looking for a long-term career here and I'm ready to support operations whenever needed.`,
  },
  {
    type: 'hr',
    q: 'How do you handle pressure or a stressful situation?',
    answer: `I try to stay **calm and structured**. First I understand the problem and its impact, then I prioritise — the most critical thing first. I communicate early with my team or manager so nobody is surprised, and I follow procedures instead of rushing changes.

For example, [during a production outage], I [stayed calm, checked logs step by step, kept the team updated every 15 minutes] and we restored the service in [time]. After the pressure is over, I like to review what happened so we can prevent it next time.`,
  },
  {
    type: 'hr',
    q: 'Do you have any questions for us?',
    answer: `Yes, thank you. I have two questions:
1. What does a typical week look like for someone in this role, and which teams would I work with most?
2. What training or learning opportunities are there for new IT officers — for example certifications or mentoring?

[Optional: "Which technology areas is the IT department focusing on in the next couple of years?"]`,
    tips: ['Do NOT ask about salary or leave in a first interview unless they bring it up.'],
  },
];
