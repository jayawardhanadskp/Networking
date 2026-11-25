import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'backup-types',
    title: 'Backup types: full, incremental, differential',
    analogy:
      'A **full backup** is photocopying the **whole ledger** every night. An **incremental** is photocopying only the pages that changed **since yesterday**. A **differential** is photocopying all pages that changed **since the last full copy** on Sunday.',
    body: `- **Full** — copies **everything**. Slowest backup, most storage, but **fastest and simplest restore** (one set).
- **Incremental** — copies only data changed **since the last backup of any type**. Fastest backup, least storage, but **restore needs the last full + every incremental** since, in order.
- **Differential** — copies everything changed **since the last full**. Grows each day; **restore needs the last full + the latest differential** only.

A common schedule: **full every weekend + incremental (or differential) every night**.

(Windows uses an "archive bit": full and incremental clear it; differential does not.)

**Other terms**
- **Synthetic full** — a full backup built from previous full + incrementals on the backup server (no extra load on the source).
- **Snapshot** — point-in-time copy on the same storage; fast, but **not a real backup** by itself.
- **Replication** — continuous copy to another site; great for DR, but it also copies **corruption and deletions** → you still need backups.`,
    visuals: [{ kind: 'custom', id: 'backupTimeline' }],
    bank: `A core banking database might use **weekly full + daily differential + transaction log backups every 15 minutes**, so it can be restored to almost any point in time. File servers use weekly full + nightly incremental. Backups run at **night**, after end-of-day (EOD) processing.`,
    remember: [
      'Full = everything (slow backup, fast restore). **Incremental** = since last backup (fast backup, slow restore: full + all incs).',
      '**Differential** = since last full (restore: full + latest diff).',
      'Snapshots and replication are **not** substitutes for backups.',
    ],
    check: [
      {
        q: 'Full backup on Sunday, incrementals Monday–Friday. The server fails Friday night. What do you need to restore?',
        options: ['Only Friday\'s incremental', 'Sunday full + Friday incremental', 'Sunday full + all incrementals Mon–Fri', 'Only Sunday full'],
        answer: 2,
        explain: 'Incrementals depend on each other: **full + every incremental** in order.',
      },
      {
        q: 'Which backup type grows larger each day until the next full backup?',
        options: ['Incremental', 'Differential', 'Full', 'Snapshot'],
        answer: 1,
        explain: 'A **differential** contains all changes since the last full, so it keeps growing.',
      },
    ],
  },
  {
    id: 'backup-strategy',
    title: 'The 3-2-1 rule, retention and restore testing',
    analogy:
      'Keep **three copies** of your important house deeds, on **two different kinds** of storage (paper + scanned), and **one copy at a relative\'s house in another town** — so a fire at home does not destroy everything.',
    body: `**3-2-1 rule**: **3** copies of data, on **2** different media types, with **1** copy **off-site**. Modern version **3-2-1-1-0**: + **1 offline/immutable** copy (protects against ransomware) + **0 errors** after verification.

**Retention** — how long backups are kept (e.g. daily for 30 days, monthly for 12 months, yearly for 7+ years) — based on business, legal and regulatory needs.

**Protect backups**
- **Encrypt** backups (they contain all your data!).
- **Immutable / air-gapped** copies that ransomware cannot delete (WORM storage, tape, isolated vault).
- Separate credentials for the backup system (not normal domain admin).

**Restore testing** — "A backup is only as good as its last successful restore."
- Regularly **test restores** (files, full servers, databases), measure time against RTO, document results.
- Monitor backup **job success/failure** every day and fix failures.`,
    visuals: [
      {
        kind: 'fields',
        title: '3-2-1-1-0',
        rows: [
          {
            label: 'The rule',
            fields: [
              { text: '3', sub: 'copies of data', tone: 'blue' },
              { text: '2', sub: 'different media', tone: 'purple' },
              { text: '1', sub: 'off-site', tone: 'green' },
              { text: '1', sub: 'offline / immutable', tone: 'amber' },
              { text: '0', sub: 'errors (verified restores)', tone: 'teal' },
            ],
          },
          {
            label: 'Bank example',
            fields: [
              { text: 'Production DB', sub: 'copy 1', tone: 'slate' },
              { text: 'Backup appliance in DC', sub: 'copy 2 (disk)', tone: 'blue' },
              { text: 'Replica at DR site', sub: 'off-site', tone: 'green' },
              { text: 'Immutable vault / tape', sub: 'offline', tone: 'amber' },
            ],
          },
        ],
      },
    ],
    bank: `Auditors often ask: "**When did you last test a restore?**" A good bank keeps **restore-test records** (what, when, how long, result). During ransomware, attackers try to **delete backups first** — that is why the immutable/offline copy and separate backup admin credentials matter.`,
    remember: [
      '**3-2-1** (3 copies, 2 media, 1 off-site) + 1 offline/immutable + 0 errors.',
      'Encrypt backups, protect backup credentials, define **retention**.',
      '**Test restores regularly**; check backup jobs daily.',
    ],
    check: [
      {
        q: 'What does the "1" (off-site) in the 3-2-1 rule protect against?',
        options: ['Slow networks', 'A site-wide disaster like fire or flood', 'Weak passwords', 'Software bugs only'],
        answer: 1,
        explain: 'An **off-site** copy survives if the main site is destroyed.',
      },
      {
        q: 'Why are immutable / offline backups important today?',
        options: ['They are faster', 'Ransomware cannot encrypt or delete them', 'They need no storage', 'They replace DR sites'],
        answer: 1,
        explain: 'Attackers target backups; **immutable/offline** copies survive.',
      },
    ],
  },
  {
    id: 'dr-sites',
    title: 'DR sites: hot, warm and cold',
    analogy:
      'If your house burns down: a **hot site** is a second fully furnished house with food in the fridge — move in **today**. A **warm site** has furniture but you must bring food and set things up — **a day or two**. A **cold site** is an **empty plot** with water and electricity — you must build and furnish it: **weeks**.',
    body: `**Disaster recovery (DR)** = restoring IT systems after a major disruption (fire, flood, power, ransomware, hardware failure of the main DC).

| Site | Ready? | Recovery time | Cost |
|---|---|---|---|
| **Hot** | Fully equipped, running, data **replicated** in (near) real time | Minutes – hours | Highest |
| **Warm** | Hardware/network ready; data restored or periodically synced | Hours – days | Medium |
| **Cold** | Space, power, cooling, connectivity only | Days – weeks | Lowest |

Other options: **cloud DR / DRaaS**, reciprocal agreements, mobile sites.

DR designs: **active-passive** (DR waits) or **active-active** (both sites serve traffic).

The DR site should be **far enough** away not to share the same disaster (flood area, power grid), but close enough for the needed replication speed.`,
    visuals: [{ kind: 'custom', id: 'drSites' }],
    bank: `Banks keep **critical systems** (core banking, ATM switch, payment interfaces, Internet banking) on a **hot or warm DR site**, often replicated continuously. Regulators expect banks to have DR plans and to run **DR drills** — actually switching operations to the DR site for a period and switching back.`,
    remember: [
      '**Hot** = running copy, minutes–hours, expensive. **Warm** = partly ready, hours–days. **Cold** = empty facility, days–weeks, cheap.',
      'Choose based on **RTO/RPO** and cost; critical bank systems → hot/warm.',
      'DR site must not share the same risks; run **DR drills**.',
    ],
    check: [
      {
        q: 'Which DR site can take over fastest?',
        options: ['Cold', 'Warm', 'Hot', 'All the same'],
        answer: 2,
        explain: 'A **hot site** is running with replicated data and can take over within minutes/hours.',
      },
      {
        q: 'A DR site has power, cooling and network, but no servers installed. What type is it?',
        options: ['Hot', 'Warm', 'Cold', 'Active-active'],
        answer: 2,
        explain: 'Only the facility = **cold** site.',
      },
    ],
  },
  {
    id: 'rpo-rto-bcp',
    title: 'RPO, RTO and business continuity',
    analogy:
      '**RPO** asks: "How many **pages of the diary** can we afford to lose?" **RTO** asks: "How long can the **shop stay closed** before we must reopen?"',
    body: `- **RPO (Recovery Point Objective)** — the **maximum data loss** acceptable, measured in **time before** the disaster. RPO 15 min → backups/replication at least every 15 minutes.
- **RTO (Recovery Time Objective)** — the **maximum downtime** acceptable, measured from the disaster until the service is **back**.
- **MTD / MTPD** (Maximum Tolerable Downtime) — after this, the business suffers unacceptable harm. RTO must be **less** than MTD.
- **MTTR** (mean time to repair) and **MTBF** (mean time between failures) — reliability measures.

**BCP vs DRP**
- **Business Continuity Plan (BCP)** — keeps the **whole business** running (people, buildings, manual procedures, communication, suppliers).
- **Disaster Recovery Plan (DRP)** — part of BCP: recovering **IT systems and data**.
- **BIA (Business Impact Analysis)** — identifies critical processes and sets their RTO/RPO.

Plans must be **tested**: tabletop exercises, simulations, full DR drills.`,
    visuals: [{ kind: 'custom', id: 'rpoRto' }],
    bank: `For a core banking system, the bank may need **RPO ≈ 0** (no lost transactions → synchronous replication) and **RTO of a few hours or less**. For an internal HR portal, RPO 24 h and RTO 2–3 days may be fine. The BIA decides this. BCP also covers **manual workarounds** at branches (e.g. offline procedures) and staff working from alternate locations.`,
    remember: [
      '**RPO = max data loss** (look back). **RTO = max downtime** (look forward). RTO < MTD.',
      '**BCP** = whole business continuity; **DRP** = IT recovery (part of BCP); **BIA** sets priorities.',
      'Smaller RPO/RTO = more cost. **Test** the plans.',
    ],
    check: [
      {
        q: 'Backups run every 4 hours. What is the worst-case RPO?',
        options: ['0', 'About 4 hours', '24 hours', 'It depends on RTO'],
        answer: 1,
        explain: 'If disaster happens just before the next backup, you lose up to **4 hours** of data.',
      },
      {
        q: 'Which document focuses on keeping the whole business operating, including people and processes?',
        options: ['DRP', 'BCP', 'SLA', 'CMDB'],
        answer: 1,
        explain: 'The **BCP** covers the whole business; the DRP covers IT recovery.',
      },
    ],
  },
  {
    id: 'itil',
    title: 'ITIL: incident, problem and change management',
    analogy:
      '**Incident** = a pipe is leaking → put a bucket and stop the water **now**. **Problem** = find **why** pipes keep leaking (old pipes) → fix the cause. **Change** = replacing the pipes, **planned and approved**, so you don\'t flood the building.',
    body: `**ITIL** is a framework of best practices for IT service management.

**Incident management** — restore normal service **as fast as possible**.
- Log → categorise → **prioritise** (impact × urgency) → diagnose → resolve (workaround OK) → close.
- **Major incident** = high impact (e.g. core banking down) → special fast process, regular communication.

**Problem management** — find and remove the **root cause** of one or more incidents.
- Root cause analysis (5 Whys, fishbone); **known error** = root cause known + workaround documented; permanent fix via a change.

**Change management (change enablement)** — control changes to reduce risk.
- **Standard change** — pre-approved, low risk, routine (e.g. password reset, adding a user).
- **Normal change** — assessed and approved by the **CAB** (Change Advisory Board): plan, impact, test, **rollback plan**, schedule.
- **Emergency change** — urgent (e.g. fix an outage or critical vulnerability); fast approval by an emergency CAB, documented afterwards.

Other ITIL practices: service request management, configuration management (**CMDB**), service level management.`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'Incident', icon: '🔥', tone: 'red' },
          { label: 'Problem', icon: '🔍', tone: 'amber' },
          { label: 'Change', icon: '🛠️', tone: 'blue' },
        ],
        rows: [
          { label: 'Goal', values: ['Restore service fast', 'Find & fix root cause', 'Make changes safely'] },
          { label: 'Question', values: ['"How do we get working again?"', '"Why did it happen?"', '"How do we change without breaking things?"'] },
          { label: 'Output', values: ['Resolved ticket / workaround', 'RCA, known error, fix', 'Approved, tested, implemented change'] },
          { label: 'Bank example', values: ['Branch link down → switch to 4G', 'Link fails weekly → faulty router PSU', 'Replace router PSU on Sunday night (CAB approved)'] },
        ],
      },
      {
        kind: 'flow',
        title: 'Normal change lifecycle',
        steps: [
          { label: 'Request (RFC)', icon: '📝', detail: 'Describe the change: what, why, systems affected, risk, schedule, **rollback plan**, test evidence.', tone: 'slate' },
          { label: 'Assess', icon: '⚖️', detail: 'Impact and risk assessment; check conflicts with other changes and business events (e.g. month-end).', tone: 'blue' },
          { label: 'CAB approval', icon: '✅', detail: 'The **Change Advisory Board** approves, rejects or asks for more info.', tone: 'purple' },
          { label: 'Implement', icon: '🔧', detail: 'In the approved **maintenance window**, following the plan.', tone: 'teal' },
          { label: 'Review & close', icon: '📊', detail: 'Verify success (or roll back); post-implementation review; update CMDB and documentation.', tone: 'green' },
        ],
      },
    ],
    bank: `In a bank, **almost nothing changes in production without a change ticket**. Avoid changes during **business hours, month-end, salary days** or EOD processing. Showing that you respect change management (and know when to raise an **emergency change**) tells the panel you are safe to trust with production.`,
    remember: [
      '**Incident** = restore service fast. **Problem** = root cause. **Change** = controlled modification.',
      'Change types: **standard** (pre-approved), **normal** (CAB), **emergency** (urgent, expedited).',
      'Priority = **impact × urgency**; major incidents need fast escalation and communication.',
    ],
    check: [
      {
        q: 'The same server crashes every week. Each time, IT restarts it. Which ITIL practice should now investigate?',
        options: ['Incident management', 'Problem management', 'Service request', 'Asset management'],
        answer: 1,
        explain: 'Repeated incidents → **problem management** finds the root cause.',
      },
      {
        q: 'A routine, low-risk, pre-approved task like adding a user to a group is a…',
        options: ['Normal change', 'Emergency change', 'Standard change', 'Major incident'],
        answer: 2,
        explain: '**Standard changes** are pre-approved and follow a documented procedure.',
      },
    ],
  },
  {
    id: 'sla',
    title: 'SLAs, priorities and service levels',
    analogy:
      'An SLA is like the **promise on a courier receipt**: "Delivered within 24 hours, or your money back." It sets clear, measurable expectations between the provider and the customer.',
    body: `- **SLA (Service Level Agreement)** — agreement between a service provider and the **customer/business**: availability (e.g. 99.9%), response and resolution times, support hours.
- **OLA (Operational Level Agreement)** — agreement **between internal teams** (e.g. network team ↔ service desk) that supports the SLA.
- **UC (Underpinning Contract)** — contract with an **external supplier** (e.g. telecom provider's link SLA, hardware vendor 4-hour replacement).
- **KPI** — measures used to track performance (e.g. % incidents resolved within SLA, uptime %, MTTR).

**Priority matrix** (impact × urgency) decides response/resolution targets, for example:
| Priority | Example | Response | Resolve |
|---|---|---|---|
| **P1 Critical** | Core banking down for many branches | 15 min | 4 h |
| **P2 High** | One branch down / ATM network partly down | 30 min | 8 h |
| **P3 Medium** | One user cannot print | 4 h | 2 days |
| **P4 Low** | Request for new software | 1 day | 5 days |
*(Example values only — every organisation sets its own.)*`,
    visuals: [
      {
        kind: 'fields',
        title: 'Who promises what to whom',
        rows: [
          { label: 'Business / users', fields: [{ text: 'SLA', sub: 'IT ↔ business: 99.9% core banking availability', tone: 'blue' }] },
          {
            label: 'Inside IT',
            fields: [
              { text: 'OLA', sub: 'network team ↔ service desk', tone: 'purple' },
              { text: 'OLA', sub: 'DBA team ↔ app team', tone: 'purple' },
            ],
          },
          {
            label: 'External suppliers',
            fields: [
              { text: 'UC', sub: 'telecom: link repair 4 h', tone: 'amber' },
              { text: 'UC', sub: 'hardware vendor: next-day parts', tone: 'amber' },
            ],
          },
        ],
        note: 'The SLA can only be met if the OLAs and UCs behind it are strong enough.',
      },
    ],
    bank: `If the business SLA says "branch link restored within 4 hours" but the telecom contract (UC) says "repair within 8 hours", the SLA is impossible — that is why banks use **backup links** and align contracts. When you raise a ticket with a provider, note the **circuit ID and time** so SLA breaches can be tracked.`,
    remember: [
      '**SLA** = provider ↔ customer; **OLA** = between internal teams; **UC** = with external suppliers.',
      'Priority = **impact × urgency** → response and resolution targets.',
      'KPIs measure performance (uptime %, MTTR, % within SLA).',
    ],
    check: [
      {
        q: 'An agreement between the network team and the service desk inside the same IT department is an…',
        options: ['SLA', 'OLA', 'UC', 'NDA'],
        answer: 1,
        explain: '**Operational Level Agreement** — between internal teams.',
      },
      {
        q: 'How is incident priority usually decided?',
        options: ['By who shouts loudest', 'Impact × urgency', 'Alphabetically', 'By the time of day only'],
        answer: 1,
        explain: 'A **priority matrix** combines impact and urgency.',
      },
    ],
  },
  {
    id: 'datacentre',
    title: 'Data centre basics',
    analogy:
      'A data centre is like a **hospital ICU for servers**: constant power (with backup generators), the right temperature, fire protection, strict entry control, and **two of everything important**.',
    body: `**Power**
- **UPS** (Uninterruptible Power Supply) — batteries give **instant** power during a cut (minutes) and clean the power.
- **Generator** — starts within seconds/minutes for long outages; **ATS** (Automatic Transfer Switch) switches between mains and generator.
- **PDUs** — power strips in racks; servers have **dual power supplies** connected to **A and B feeds**.

**Cooling**
- CRAC/CRAH units, **hot aisle / cold aisle** layout (server fronts face the cold aisle), containment, temperature & humidity monitoring.

**Redundancy levels**
- **N** = just enough; **N+1** = one extra unit; **2N** = fully duplicated (two independent systems).
- Uptime Institute **Tier I–IV** (Tier III = concurrently maintainable; Tier IV = fault tolerant).

**Other**: fire detection and **gas suppression** (inert gas or clean agent — no water on servers), raised floors/cable trays, **physical security** (badges, biometrics, mantraps, CCTV, visitor logs), environmental monitoring (water leak sensors), structured cabling and labelling.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Power path during a power cut',
        width: 360,
        height: 230,
        nodes: [
          { id: 'grid', label: 'Mains (CEB)', icon: 'building', x: 40, y: 50, info: 'Utility power from the grid.' },
          { id: 'gen', label: 'Generator', icon: 'disk', x: 40, y: 175, info: 'Diesel generator. Takes some seconds to start and stabilise. Needs fuel contracts and regular test runs.' },
          { id: 'ats', label: 'ATS', icon: 'switch', x: 140, y: 110, info: '**Automatic Transfer Switch**: switches the load from mains to generator (and back).' },
          { id: 'ups', label: 'UPS', icon: 'lb', x: 230, y: 110, info: '**UPS**: batteries supply power **instantly** while the generator starts; also filters power problems.' },
          { id: 'pdua', label: 'PDU A', icon: 'hub', x: 300, y: 50, info: 'Feed A to the racks.' },
          { id: 'pdub', label: 'PDU B', icon: 'hub', x: 300, y: 175, info: 'Feed B (ideally from a separate UPS) — if one feed fails, servers stay up.' },
          { id: 'srv', label: 'Server (2 PSUs)', icon: 'server', x: 330, y: 112, info: 'Dual power supplies: one on PDU A, one on PDU B.' },
        ],
        links: [
          { from: 'grid', to: 'ats' },
          { from: 'gen', to: 'ats', style: 'dashed' },
          { from: 'ats', to: 'ups' },
          { from: 'ups', to: 'pdua' },
          { from: 'ups', to: 'pdub' },
          { from: 'pdua', to: 'srv' },
          { from: 'pdub', to: 'srv' },
        ],
        steps: [
          { text: 'Normal: mains power → ATS → UPS (charging batteries) → PDUs → servers.', paths: [['grid', 'ats', 'ups', 'pdua', 'srv']], packet: 'power', tone: 'green' },
          { text: '**Power cut!** The **UPS batteries** take over **instantly** — servers do not notice.', paths: [['ups', 'pdua', 'srv'], ['ups', 'pdub', 'srv']], packet: 'battery', tone: 'amber' },
          { text: 'The **generator** starts; the **ATS** switches the load to the generator. The UPS recharges.', paths: [['gen', 'ats', 'ups', 'pdub', 'srv']], packet: 'generator', tone: 'purple' },
          { text: 'Mains returns; the ATS switches back after it is stable. Lesson: test the generator and UPS **regularly** and monitor battery health.', paths: [['grid', 'ats', 'ups']], packet: 'mains', tone: 'green' },
        ],
      },
    ],
    bank: `Bank data centres (and even branch server/network cabinets) use **UPS**; DCs add **generators**, redundant cooling and strict access control. Data Centre operations staff do daily checks: alarms, temperatures, UPS status, generator fuel, access logs. Branches have small UPS units so a short power cut does not drop the network.`,
    remember: [
      '**UPS** = instant battery power; **generator** = long outages; **ATS** switches; dual PSUs on **A/B feeds**.',
      'Cooling: **hot aisle / cold aisle**. Redundancy: N, **N+1**, **2N**; Tier I–IV.',
      'Gas fire suppression, physical security (badges, mantrap, CCTV), environmental monitoring.',
    ],
    check: [
      {
        q: 'What provides power instantly during the seconds before a generator starts?',
        options: ['PDU', 'UPS', 'ATS', 'CRAC'],
        answer: 1,
        explain: 'The **UPS** batteries bridge the gap.',
      },
      {
        q: 'What does N+1 redundancy mean?',
        options: ['No redundancy', 'One extra component beyond what is needed', 'Two complete independent systems', 'One component only'],
        answer: 1,
        explain: '**N+1** = the needed number plus one spare (2N = full duplicate).',
      },
    ],
  },
];
