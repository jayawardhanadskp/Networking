import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'Which backup type gives the fastest restore?', options: ['Incremental', 'Differential', 'Full', 'Synthetic incremental'], answer: 2, explain: 'A **full** backup restores from a single set.' },
  { q: 'Full backup Sunday, differentials daily. Server fails Thursday night. What do you restore?', options: ['Sunday full only', 'Sunday full + Thursday differential', 'Sunday full + Mon–Thu differentials', 'Thursday differential only'], answer: 1, explain: 'Differential = all changes since full → **full + latest differential**.' },
  { q: 'Why is replication alone not enough instead of backups?', options: ['Replication is too slow', 'It also copies deletions, corruption and ransomware encryption', 'It cannot cross sites', 'It is illegal'], answer: 1, explain: 'Replication copies **bad changes too**; backups give older restore points.' },
  { q: 'In 3-2-1, what does the "2" stand for?', options: ['2 sites', '2 different media types', '2 administrators', '2 days retention'], answer: 1, explain: '**2 different media** (e.g. disk + tape/cloud).' },
  { q: 'Which statement about backups is MOST true?', options: ['A backup is only proven when a restore test succeeds', 'Backups never fail', 'Backup logs do not need checking', 'RAID replaces backups'], answer: 0, explain: '**Test restores** prove backups work.' },
  { q: 'Which DR site is the cheapest but slowest to activate?', options: ['Hot', 'Warm', 'Cold', 'Active-active'], answer: 2, explain: '**Cold** = facility only.' },
  { q: 'RPO measures…', options: ['Maximum acceptable downtime', 'Maximum acceptable data loss (time)', 'Average repair time', 'Network latency'], answer: 1, explain: '**RPO** = how much data (time) you can lose.' },
  { q: 'A system must be back within 2 hours after a disaster. This is the…', options: ['RPO', 'RTO', 'MTBF', 'SLA penalty'], answer: 1, explain: '**RTO** = recovery time objective.' },
  { q: 'Which analysis identifies critical business processes and their recovery needs?', options: ['BIA (Business Impact Analysis)', 'CVSS', 'SWOT', 'RACI'], answer: 0, explain: 'The **BIA** sets priorities, RTO and RPO.' },
  { q: 'Which ITIL practice aims to restore normal service as quickly as possible?', options: ['Problem management', 'Change management', 'Incident management', 'Release management'], answer: 2, explain: '**Incident management** = restore service fast.' },
  { q: 'Who approves normal changes in ITIL?', options: ['The user', 'The CAB (Change Advisory Board)', 'Any engineer', 'The vendor'], answer: 1, explain: 'Normal changes go to the **CAB**.' },
  { q: 'An agreement with an external telecom provider for link repair time is a(n)…', options: ['OLA', 'SLA with customers', 'Underpinning contract (UC)', 'KPI'], answer: 2, explain: 'Contracts with external suppliers = **underpinning contracts**.' },
  { q: 'What is the purpose of a hot aisle / cold aisle layout?', options: ['Security', 'Efficient cooling by separating cold intake air from hot exhaust air', 'Cable management only', 'Fire suppression'], answer: 1, explain: 'It keeps cold supply air and hot exhaust air **apart**.' },
  { q: 'Why do servers in data centres often have two power supplies?', options: ['To double performance', 'To connect to two independent power feeds (A/B) for redundancy', 'Because one is for the fans', 'For RAID'], answer: 1, explain: 'Dual PSUs on **A and B feeds** survive one feed failing.' },
];

export const flashcards: Flashcard[] = [
  { front: 'Full / incremental / differential', back: '**Full**: everything. **Incremental**: since last backup (restore full + all incs). **Differential**: since last full (restore full + latest diff).', tag: 'definition' },
  { front: '3-2-1 rule', back: '3 copies · 2 media types · 1 off-site (+1 offline/immutable, 0 errors).', tag: 'fact' },
  { front: 'Snapshot vs backup', back: 'Snapshot = quick point-in-time copy on the same storage (short-term rollback). Backup = separate copy you can restore after storage loss.', tag: 'definition' },
  { front: 'Hot / warm / cold site', back: '**Hot**: running replica, minutes–hours. **Warm**: hardware ready, hours–days. **Cold**: empty facility, days–weeks.', tag: 'definition' },
  { front: 'RPO', back: '**Recovery Point Objective**: max acceptable data loss, measured back in time from the disaster.', tag: 'acronym' },
  { front: 'RTO', back: '**Recovery Time Objective**: max acceptable time to restore the service.', tag: 'acronym' },
  { front: 'MTD', back: '**Maximum Tolerable Downtime**: after this, serious business harm. RTO must be shorter.', tag: 'acronym' },
  { front: 'BCP vs DRP', back: '**BCP**: keep the whole business running (people, process, places). **DRP**: recover IT systems and data (part of BCP).', tag: 'definition' },
  { front: 'BIA', back: '**Business Impact Analysis**: finds critical processes, impact of downtime, sets RTO/RPO.', tag: 'acronym' },
  { front: 'Incident vs problem', back: '**Incident**: unplanned interruption → restore fast. **Problem**: underlying cause of incidents → root cause fix.', tag: 'definition' },
  { front: 'Change types', back: '**Standard**: pre-approved routine. **Normal**: CAB approval. **Emergency**: urgent, expedited approval.', tag: 'definition' },
  { front: 'CAB', back: '**Change Advisory Board**: reviews and approves normal changes.', tag: 'acronym' },
  { front: 'SLA / OLA / UC', back: '**SLA**: IT ↔ customer. **OLA**: between internal teams. **UC**: with external suppliers.', tag: 'definition' },
  { front: 'CMDB', back: '**Configuration Management Database**: records configuration items (servers, apps, links) and their relationships.', tag: 'acronym' },
  { front: 'UPS / ATS / PDU', back: '**UPS**: battery bridge power. **ATS**: switches mains ↔ generator. **PDU**: rack power distribution.', tag: 'acronym' },
  { front: 'N+1 vs 2N', back: '**N+1**: one spare unit. **2N**: fully duplicated independent systems.', tag: 'definition' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'Explain full, incremental and differential backups.',
    answer: `A **full backup** copies all data. It takes the longest and uses the most space, but restoring is simplest — just one backup set.

An **incremental** backup copies only what changed since the **last backup of any type**. It is fast and small, but to restore you need the last full backup plus **every** incremental after it, in order.

A **differential** copies everything changed since the **last full backup**. It grows each day, but restoring needs only the last full plus the **latest** differential.

A common schedule is a weekly full plus nightly incrementals or differentials, following the 3-2-1 rule, with regular restore tests.`,
  },
  {
    type: 'technical',
    q: 'What are RPO and RTO? Give a bank example.',
    answer: `**RPO** — Recovery Point Objective — is the maximum amount of **data loss** we can accept, measured in time before the incident. **RTO** — Recovery Time Objective — is the maximum **downtime** we can accept before the service must be back.

For core banking, the RPO is usually close to **zero** — we can't lose transactions — so we use synchronous or near-real-time replication to the DR site, and the RTO might be a few hours or less. For a less critical system, like an internal reporting tool, the RPO could be 24 hours (nightly backup) and the RTO a day or two. These values come from the **Business Impact Analysis**, and lower values cost more.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between hot, warm and cold DR sites?',
    answer: `A **hot site** is fully equipped and running, with data replicated in near real time, so it can take over within minutes or hours — the most expensive. A **warm site** has hardware and network ready, but systems need to be started and data restored or synced — recovery in hours to a day or two. A **cold site** is only a facility with power, cooling and connectivity — hardware must be installed, so recovery takes days or weeks, but it is cheapest.

Banks usually keep critical systems like core banking, the ATM switch and payment systems on a hot or warm site, and test them with regular DR drills.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between incident, problem and change management?',
    answer: `**Incident management** restores normal service as quickly as possible — for example switching a branch to its backup link when the primary fails. A workaround is fine.

**Problem management** finds and removes the **root cause** of one or more incidents — for example discovering that the link fails because of a faulty router power supply. It records known errors and workarounds.

**Change management** controls changes to production to reduce risk — the router replacement would be a change with a plan, risk assessment, rollback plan and CAB approval, done in a maintenance window. Standard changes are pre-approved; emergency changes get fast-track approval.`,
  },
  {
    type: 'scenario',
    q: 'You need to restore a deleted folder from last night\'s backup for a user. How do you do it safely?',
    answer: `1. Get the request **approved/logged** in a ticket — confirm the user is allowed to have that data (data owner/manager approval if needed).
2. Identify the exact **folder path and the time** it was last correct.
3. In the backup tool, choose the right restore point and **restore to an alternate location** first (not overwriting live data).
4. Check the files are correct and complete with the user.
5. Move them to the original location (or let the user copy what they need), keeping permissions correct.
6. Close the ticket with details. If the deletion was suspicious (many files, ransomware signs), escalate to security.`,
  },
  {
    type: 'technical',
    q: 'Why should backups be tested?',
    answer: `Because a backup is only useful if it can be **restored**. Backups can fail silently — jobs may skip files, media can be corrupted, encryption keys can be lost, or the restore may take much longer than the RTO. Regular restore tests — files, full servers and databases — prove the backups work, measure the actual recovery time, and train staff for a real incident. Auditors also ask for restore-test evidence. I'd also check backup job reports every day and fix failures immediately.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between BCP and DRP?',
    answer: `The **Business Continuity Plan** covers how the **whole business** keeps operating during and after a disruption — people, alternative locations, manual procedures, communication, suppliers. The **Disaster Recovery Plan** is the part focused on **recovering IT systems and data** — failing over to the DR site, restoring backups, the order of recovery. Both are based on the Business Impact Analysis and must be tested regularly with tabletop exercises and DR drills.`,
  },
  {
    type: 'technical',
    q: 'What are the key components of a data centre?',
    answer: `- **Power**: utility feed, **UPS** for instant backup power, **generators** for long outages, ATS to switch between them, and dual A/B power feeds to servers with dual PSUs.
- **Cooling**: CRAC/CRAH units, hot aisle/cold aisle layout, temperature and humidity monitoring.
- **Redundancy**: N+1 or 2N for power and cooling; network and storage redundancy.
- **Fire protection**: early detection and gas-based suppression.
- **Physical security**: badge/biometric access, mantraps, CCTV, visitor logs.
- **Monitoring**: environmental sensors (water leaks), alarms, and structured, labelled cabling.`,
  },
];
