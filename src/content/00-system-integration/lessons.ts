import type { Section } from '../types';

/*
 * ROLE MODULE: Junior Executive (Administrator – System Integration) – Grade IV.
 * General industry knowledge only. Nothing here describes NSB's real systems, products
 * or vendors. Product names (WSO2, MuleSoft, IBM MQ, Kafka…) are industry examples.
 */

export const sections: Section[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    id: 'si-landscape',
    title: 'What system integration means at a bank',
    analogy:
      'Think of a big hotel. The **main kitchen** (core banking) cooks everything. Orders come from the restaurant, room service, the bar and the banquet hall — each in its own way. **System integration** is the waiters, the order slips and the rules that make sure every order reaches the kitchen in a format the kitchen understands, and the right answer goes back to the right table.',
    body: `A bank does not run on one system. The **core banking system (CBS)** keeps customers, accounts and the ledger, but many other systems must **talk to it** — and to each other. **System integration** means designing, connecting, securing, testing and **keeping these connections running**.

Systems that typically connect to core banking (general picture):

- **Channels**: Internet and mobile banking, branch teller systems.
- **Cards and ATMs**: the **ATM switch**, card management system, international card networks.
- **National and international payments**: **LankaPay** services (e.g. CEFTS, SLIPS, cheque clearing, Common ATM Switch, LankaQR), **SWIFT**, the Central Bank's **RTGS**.
- **Regulators and bureaus**: **Central Bank (CBSL) reporting**, the **credit bureau (CRIB)**.
- **Partners**: **bill payment** companies, **payment gateways** for e-commerce.
- **Internal systems**: **loan origination**, **AML / fraud monitoring**, **HR / payroll**, data warehouse / MIS, and **Active Directory** for staff login.

Every connection is an **interface**. For each one you should be able to answer:

| Question | Example answer |
| --- | --- |
| **Who** talks to whom? | Mobile app server → core banking |
| **What** data? | Balance enquiry, fund transfer |
| **How** (style + format)? | REST API, JSON |
| **When**? | Real-time, or a nightly batch file |
| **Security**? | Mutual TLS + OAuth2 token, firewall rule |
| **Owner / support**? | Internal team, vendor, external operator |

What an **Administrator – System Integration** typically does (job descriptions differ between banks): keep interfaces and middleware **running and monitored**; manage **connectivity, certificates and credentials**; **onboard new integrations** (specs, firewall requests, SIT/UAT, go-live); **troubleshoot** failed transactions with network, application and vendor teams; follow **change and incident management**; keep **documentation** up to date.`,
    visuals: [
      { kind: 'custom', id: 'integrationMap' },
      {
        kind: 'fields',
        title: 'Anatomy of one interface',
        rows: [
          {
            label: 'Every integration has…',
            fields: [
              { text: 'Source', sub: 'who calls', tone: 'blue' },
              { text: 'Target', sub: 'who answers', tone: 'purple' },
              { text: 'Style', sub: 'API · MQ · file', tone: 'teal', w: 1.2 },
              { text: 'Format', sub: 'JSON · XML · ISO 8583', tone: 'amber', w: 1.4 },
            ],
          },
          {
            fields: [
              { text: 'Timing', sub: 'real-time · batch', tone: 'green', w: 1.2 },
              { text: 'Security', sub: 'TLS · auth · firewall', tone: 'red', w: 1.4 },
              { text: 'Owner', sub: 'team · vendor', tone: 'slate' },
              { text: 'Monitoring', sub: 'alerts · logs', tone: 'indigo', w: 1.2 },
            ],
          },
        ],
        note: 'Write these down in the **interface specification** for every connection. When something breaks at 2 a.m., this is the first document you open.',
      },
    ],
    bank: `A customer pays an electricity bill in the mobile app: the **app** calls the bank's **API gateway** → middleware asks **core banking** to debit the account → middleware calls the **bill payment partner's API** with a unique reference → the partner confirms → the app shows "Paid". The **AML system** receives a copy of the transaction. At night a **reconciliation file** from the partner is matched with the bank's records. **One customer tap = at least five integrations.**`,
    remember: [
      'System integration = making many systems **exchange data reliably and securely** — with core banking at the centre.',
      'For each interface know: **who, what, how (style/format), when (real-time/batch), security, owner**.',
      'Do not guess a specific bank\'s products. Say "a typical bank connects…".',
    ],
    check: [
      {
        q: 'Which of these is usually a BATCH (file-based) integration?',
        options: ['Mobile app balance enquiry', 'ATM cash withdrawal authorisation', 'Monthly salary file from the payroll system', 'Card POS authorisation'],
        answer: 2,
        explain: 'Salary credits are usually a **file** sent before a cut-off time. The others need a real-time answer.',
      },
      {
        q: 'Why should the mobile banking server NOT read the core banking database directly?',
        options: ['Databases cannot be read over a network', 'It creates tight coupling and a big security risk; channels should call controlled services/APIs', 'Because mobile apps only use XML', 'It is faster to use files'],
        answer: 1,
        explain: 'Channels should use **APIs through middleware**: controlled access, validation, logging and no direct exposure of the database.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    id: 'si-styles',
    title: 'Integration styles: REST, SOAP, sync, async, files, ETL',
    analogy:
      'There are many ways to send information: a **phone call** (you wait for the answer — synchronous API), a **letter in a post box** (you post it and go — asynchronous message), a **courier truck at night** carrying one big parcel (batch file), **sharing one notebook** (database integration — anyone can scribble in it), or a **clerk who copies data into a report book every night** (ETL).',
    body: `### REST vs SOAP
| | **REST** | **SOAP** |
| --- | --- | --- |
| What it is | An architectural **style** using HTTP | A strict **protocol** with an XML envelope |
| Format | Usually **JSON** (light) | Always **XML** (Envelope, Header, Body, Fault) |
| Contract | **OpenAPI / Swagger** (optional) | **WSDL** — machine-readable contract of operations and types |
| Operations | HTTP methods on resources: GET /accounts/123 | Named operations, usually HTTP POST: getBalance |
| Errors | HTTP status codes (400, 401, 500…) | **SOAP Fault** element |
| Security | TLS + OAuth2/JWT/API keys | TLS + **WS-Security** (message signing/encryption) |
| Where | Mobile/web APIs, modern partners | Older enterprise and core banking interfaces |

\`\`\`
POST /api/v1/transfers            (REST + JSON)
Content-Type: application/json
Idempotency-Key: TRX-20261126-000123
{ "fromAccount": "1001234567", "toAccount": "2009876543", "amount": 5000.00, "currency": "LKR" }
\`\`\`

\`\`\`
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header/>
  <soapenv:Body>
    <getBalance><accountNo>1001234567</accountNo></getBalance>
  </soapenv:Body>
</soapenv:Envelope>
\`\`\`

### Synchronous vs asynchronous
- **Synchronous**: the caller **waits** for the answer (REST/SOAP call). Simple, needed when the customer is waiting (ATM, balance). Problem: if the target is slow or down, the caller fails too.
- **Asynchronous**: the caller sends a **message** (to a queue) and continues; the answer comes later or not at all. Survives outages and peaks. Harder to trace.

### Point-to-point vs hub / ESB
- **Point-to-point**: each pair of systems has its own interface → **n(n−1)/2** links (10 systems → **45**).
- **Hub / ESB**: everyone connects once to a central integration layer that routes and translates → **n** links. The hub must be **highly available**.

### File-based integration (batch)
Systems exchange **files** (CSV, fixed-width, XML) on a schedule, usually over **SFTP** (SSH, port **22**). Typical for salary files, SLIPS-type batch transfers, card settlement files, credit bureau submissions and **End of Day (EOD)** processing. Good for large volumes; not real-time. Checks: **file arrives on time, not duplicated, complete (record count / control total / hash), right format**.

### Database integration
One system reads/writes **another system's database** directly (shared tables, DB links). Quick to build, but **tightly coupled** (a schema change breaks the other system), bypasses business rules and is a security risk. Avoid for core banking; use APIs.

### ETL
**Extract → Transform → Load**: nightly jobs copy data from source systems, clean/convert it, and load it into a **data warehouse** for MIS, regulatory and AML reporting. Must finish before business hours.`,
    visuals: [
      {
        kind: 'compare',
        title: 'Sync vs async',
        columns: [
          { label: 'Synchronous', icon: '📞', tone: 'blue' },
          { label: 'Asynchronous', icon: '📮', tone: 'green' },
        ],
        rows: [
          { label: 'Like', values: ['A phone call — you wait', 'A letter — you post it and go'] },
          { label: 'Tech', values: ['REST, SOAP, gRPC', 'Message queue (IBM MQ, RabbitMQ), Kafka'] },
          { label: 'Target down?', values: ['Caller gets an **error / timeout**', 'Message **waits in the queue**'] },
          { label: 'Use when', values: ['Customer is waiting: ATM, balance, login', 'Notifications, AML feeds, posting that can be slightly delayed'] },
          { label: 'Watch', values: ['Timeouts, latency, error rate', 'Queue depth, consumer status, DLQ'] },
        ],
      },
      { kind: 'custom', id: 'p2pHub' },
      {
        kind: 'flow',
        title: 'A nightly file-based integration (EOD batch)',
        steps: [
          { label: 'Cut-off', icon: '⏰', detail: 'At the cut-off time (e.g. after business hours) the source system stops accepting changes for "today".', tone: 'slate' },
          { label: 'Generate file', icon: '📄', detail: 'A batch job creates the file: header (date, batch no.), detail records, **trailer** with **record count and control total**.', tone: 'blue' },
          { label: 'Encrypt + SFTP', icon: '🔐', detail: 'The file is often **encrypted** (e.g. PGP) and sent over **SFTP (port 22)** using an SSH key — no plain FTP.', tone: 'purple' },
          { label: 'Validate', icon: '🧮', detail: 'The receiver checks: file name/date, **not a duplicate**, record count and totals match the trailer, format valid.', tone: 'amber' },
          { label: 'Process', icon: '⚙️', detail: 'Records are posted (e.g. salary credits). Rejected records go to an **exception file** for follow-up.', tone: 'green' },
          { label: 'Acknowledge', icon: '📨', detail: 'A response/ack file goes back with success and reject counts. Then **reconciliation**.', tone: 'teal' },
        ],
      },
      {
        kind: 'compare',
        title: 'API vs database integration vs ETL',
        columns: [
          { label: 'API', icon: '🔌', tone: 'green' },
          { label: 'Database integration', icon: '🗄', tone: 'red' },
          { label: 'ETL', icon: '🚚', tone: 'purple' },
        ],
        rows: [
          { label: 'How', values: ['Call a published service', 'Read/write the other system\'s tables', 'Copy + transform data in bulk'] },
          { label: 'Timing', values: ['Real-time', 'Real-time', 'Scheduled (nightly)'] },
          { label: 'Coupling', values: ['Loose — contract only', '**Tight** — schema change breaks it', 'Medium — job must follow source changes'] },
          { label: 'Use for', values: ['Channels, partners', 'Avoid (legacy only)', 'Data warehouse, MIS, regulatory reports'] },
        ],
      },
    ],
    bank: `**End of Day (EOD)** in core banking is a big batch: interest accrual, date change, statements and many **outgoing files** (to card systems, the data warehouse, regulators, partners). Integration admins watch that inbound files arrive **before the cut-off** and outbound files are **sent and acknowledged** — a late file can delay the next business day.`,
    remember: [
      '**REST** = style, JSON, HTTP verbs, OpenAPI. **SOAP** = protocol, XML envelope, **WSDL**, SOAP Fault, WS-Security.',
      '**Sync** waits (fails if target down); **async** queues (survives outages). P2P = n(n−1)/2 links; hub = n.',
      'Files over **SFTP** with counts/control totals; avoid **DB integration**; **ETL** feeds the data warehouse.',
    ],
    check: [
      {
        q: 'Which document describes the operations and data types of a SOAP web service?',
        options: ['OpenAPI YAML', 'WSDL', 'JWT', 'README'],
        answer: 1,
        explain: 'A **WSDL** (Web Services Description Language) is the XML contract of a SOAP service.',
      },
      {
        q: 'How many point-to-point interfaces are needed to connect 6 systems to each other?',
        options: ['6', '12', '15', '36'],
        answer: 2,
        explain: 'n(n−1)/2 = 6×5/2 = **15**. With a hub/ESB: just 6.',
      },
      {
        q: 'A salary file arrives with a trailer record. What is it mainly used for?',
        options: ['Styling the file', 'Checking completeness — record count and control total must match', 'Encrypting the file', 'Storing the SFTP password'],
        answer: 1,
        explain: 'The **trailer** lets the receiver verify the file is complete and not altered.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    id: 'si-middleware',
    title: 'Middleware: ESB, API gateway and message queues',
    analogy:
      'The **API gateway** is the security reception desk at head office: it checks your ID, writes your name in the visitor book, sends you to the right floor and stops too many people coming in at once. The **ESB** is a central post office with translators: it receives letters in any language and delivers them in the language the receiver reads. A **message queue** is a post box: the sender drops a letter even if the receiver is on leave — the letter waits safely.',
    body: `**Middleware** is software in the middle that connects systems so they do not need to know each other's details.

### API gateway
The single **front door for APIs** (e.g. in front of mobile banking or partner APIs). Main jobs:

- **Routing** — /accounts goes to service A, /payments to service B; versioning (/v1, /v2).
- **Transformation** — e.g. JSON from the app ↔ XML/SOAP for an older backend; add/remove headers.
- **Rate limiting / throttling** — e.g. 100 requests/second per client → extra requests get **HTTP 429 Too Many Requests**. Protects the backend.
- **Security** — TLS termination, validating **OAuth2/JWT** tokens and **API keys**, IP allowlists, sometimes a WAF.
- **Logging and monitoring** — every call, response time, errors, per-client usage; correlation IDs.

### ESB (Enterprise Service Bus) / integration platform
A central integration layer that does **routing, transformation, protocol bridging** (REST ↔ SOAP ↔ MQ ↔ files ↔ ISO 8583) and **orchestration** (call 3 systems in order for one business process). Industry examples: **WSO2** (API Manager, Micro Integrator), **MuleSoft Anypoint**, **IBM App Connect Enterprise (ACE)** — earlier called IBM Integration Bus. These are examples only — every bank picks its own.

### Message queues and brokers
- **Producer** sends a message → **broker** stores it in a **queue** → **consumer** reads it and sends an **acknowledgement**.
- **Persistence**: persistent messages are written to disk and **survive a broker restart**. Payment messages must be persistent.
- **Retry and dead letter queue (DLQ)**: if a message keeps failing (e.g. bad format — a "poison message") it is moved to a **DLQ** after N tries so it does not block the rest. Admins monitor and re-process DLQ messages.
- **Queue vs topic**: a queue = one consumer gets each message (point-to-point); a topic = every subscriber gets a copy (publish/subscribe).

| Product | Type | Notes |
| --- | --- | --- |
| **IBM MQ** | Enterprise message queue | Very common in banks; queue managers and channels; default listener port **1414**; strong delivery guarantees |
| **RabbitMQ** | Open-source broker | **AMQP** protocol (port **5672**); flexible routing with exchanges |
| **Apache Kafka** | Distributed event **log** / streaming | Topics + partitions; messages **kept for a retention period** and can be re-read; very high throughput (port **9092**) |

**Why queues help when a system is down**: the producer does not depend on the consumer being up. Messages **wait** in the queue during maintenance/EOD/outages and are processed **in order** when it returns. Queues also **smooth peaks** (salary day) and **decouple** systems.`,
    visuals: [
      { kind: 'custom', id: 'messageQueue' },
      {
        kind: 'flow',
        title: 'One API call through the gateway',
        steps: [
          { label: 'TLS', icon: '🔒', detail: 'The gateway terminates **TLS** (or mutual TLS for partners) — the connection is encrypted.', tone: 'slate' },
          { label: 'Authenticate', icon: '🔑', detail: 'Validates the **OAuth2 access token / JWT** (signature, expiry, scope) or the **API key**; checks the client IP allowlist. Fails → **401/403**.', tone: 'red' },
          { label: 'Rate limit', icon: '🚦', detail: 'Is this client over its quota? Yes → **429 Too Many Requests**. Protects core banking from overload and abuse.', tone: 'amber' },
          { label: 'Transform', icon: '🔄', detail: 'Converts formats if needed: JSON → XML/SOAP for an older backend; adds headers like a **correlation ID**.', tone: 'purple' },
          { label: 'Route', icon: '🧭', detail: 'Sends the request to the right backend service / version. Backend fails → **502**; too slow → **504**.', tone: 'blue' },
          { label: 'Log & monitor', icon: '📊', detail: 'Records client, API, status, latency — used for dashboards, alerts, troubleshooting and audit. **No passwords, PINs or full card numbers in logs.**', tone: 'green' },
        ],
      },
      {
        kind: 'compare',
        title: 'API gateway vs ESB vs message queue',
        columns: [
          { label: 'API gateway', icon: '🚪', tone: 'blue' },
          { label: 'ESB', icon: '🔀', tone: 'purple' },
          { label: 'Message queue', icon: '📬', tone: 'green' },
        ],
        rows: [
          { label: 'Main job', values: ['Secure front door for APIs', 'Route + translate between many systems', 'Store and deliver messages reliably'] },
          { label: 'Typical style', values: ['Sync REST', 'Sync and async, many protocols', 'Async'] },
          { label: 'Examples', values: ['WSO2 API Manager, Kong, Apigee', 'WSO2 MI, MuleSoft, IBM ACE', 'IBM MQ, RabbitMQ, Kafka'] },
          { label: 'Admin watches', values: ['Latency, 4xx/5xx, 429s, certs', 'Flow status, errors, throughput', 'Queue depth, consumers, DLQ'] },
        ],
      },
    ],
    bank: `During core banking **EOD**, real-time posting may pause. If channels call core banking **directly**, customer requests fail. With a **queue**, non-urgent postings (e.g. notifications, some partner payments) wait in the queue and are processed when EOD finishes. A rising **queue depth** alert at 1 a.m. tells the admin "the consumer has stopped" before customers complain.`,
    remember: [
      '**API gateway**: routing, transformation, **rate limiting (429)**, security (OAuth2/JWT/API keys), logging.',
      '**ESB**: route + translate + bridge protocols between many systems (e.g. WSO2, MuleSoft, IBM ACE).',
      '**Queue**: producer → broker → consumer; **persistent** messages; **DLQ** for poison messages; buffers outages.',
    ],
    check: [
      {
        q: 'An API client sends too many requests and the gateway rejects some. Which HTTP status is returned?',
        options: ['401 Unauthorized', '404 Not Found', '429 Too Many Requests', '500 Internal Server Error'],
        answer: 2,
        explain: '**429** is the rate-limit response.',
      },
      {
        q: 'What is a dead letter queue (DLQ) used for?',
        options: ['Deleting old logs', 'Holding messages that could not be delivered/processed after retries', 'Storing passwords', 'Speeding up the queue'],
        answer: 1,
        explain: 'The **DLQ** parks failed ("poison") messages so they do not block the others.',
      },
      {
        q: 'Why must payment messages on a queue be persistent?',
        options: ['To make them smaller', 'So they survive a broker restart and are not lost', 'So they skip the consumer', 'Persistence encrypts them'],
        answer: 1,
        explain: '**Persistent** messages are written to disk; non-persistent ones live only in memory.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    id: 'si-standards',
    title: 'Banking message standards: ISO 8583 and ISO 20022',
    analogy:
      '**ISO 8583** is a **standard form with numbered boxes**. The top of the form says what kind of form it is (the **MTI**), then a **checklist** shows which boxes are filled (the **bitmap**), then the boxes themselves (card number, amount, time…). **ISO 20022** is a newer, much richer form where every field has a **clear name** — like moving from a short telegram to a full structured letter.',
    body: `### ISO 8583 — card and ATM messages
Used between ATMs/POS, switches, card networks and the issuer's host (core banking/card system). Real networks use their own **variants** of it, but the structure is the same.

**1. MTI (Message Type Indicator)** — 4 digits: **version · class · function · origin**.

| MTI | Meaning | Example |
| --- | --- | --- |
| **0100 / 0110** | Authorisation request / response | Approve and hold funds (no money moved yet) |
| **0200 / 0210** | Financial request / response | **ATM cash withdrawal** |
| **0220 / 0230** | Financial advice / response | Report a transaction that already happened |
| **0400 / 0410** | Reversal request / response | Undo a transaction |
| **0420 / 0430** | Reversal **advice** / response | **ATM did not dispense**, or the reply **timed out** → acquirer tells issuer to reverse. Repeated as **0421** until 0430 arrives |
| **0800 / 0810** | Network management | Sign-on, **echo test**, key exchange |

Pattern: request **…0**, response **…10** (0200 → 0210). The first digit **0** = the 1987 version, which is the most widely used.

**2. Bitmap** — 64 bits; **bit n = 1 means data element n is present**. Bit 1 = a **secondary bitmap** follows (elements 65–128). Example: first byte 0111 0000 = hex **70** → elements 2, 3 and 4 are present.

**3. Data elements (DE)** — common ones:

| DE | Name |
| --- | --- |
| 2 | **PAN** (card number) |
| 3 | Processing code (e.g. 01 = cash withdrawal, 31 = balance enquiry) |
| 4 | Transaction amount |
| 7 | Transmission date and time |
| 11 | **STAN** — System Trace Audit Number |
| 37 | **RRN** — Retrieval Reference Number |
| 38 | Authorisation (approval) code |
| 39 | **Response code**: 00 approved · 05 do not honour · 51 insufficient funds · 55 incorrect PIN · 91 issuer/switch inoperative |
| 41 | Terminal ID (which ATM) |
| 49 | Currency code (ISO 4217: LKR = 144) |
| 52 | PIN block (encrypted) |
| 90 | Original data elements — links a **reversal** to the original transaction |

### ISO 20022 — the modern payments standard
- A global standard for financial messages with a **rich, structured data model**, usually sent as **XML** ("MX" messages).
- Message families: **pain** (customer ↔ bank payment initiation, e.g. pain.001), **pacs** (bank ↔ bank clearing and settlement, e.g. **pacs.008** customer credit transfer, pacs.009, pacs.002 status, pacs.004 return), **camt** (cash management: statements and notifications, e.g. **camt.053**, camt.054).
- Why: structured names and addresses, purpose codes, end-to-end references (**UETR**) → better **AML/sanctions screening**, automation and tracking.
- **SWIFT's move**: for cross-border payments SWIFT ran a **coexistence period from March 2023 to November 2025**. Payment instructions are now expected in ISO 20022 (**pacs.008 replaces MT103**, pacs.009 replaces MT202). SWIFT is also phasing out fully unstructured postal addresses (from November 2026). Many domestic RTGS and instant payment systems worldwide are moving to ISO 20022 too — check CBSL/LankaClear for Sri Lanka's current status.`,
    visuals: [
      {
        kind: 'sequence',
        title: 'ATM withdrawal: ATM → switch → network → core banking → response',
        actors: [
          { id: 'atm', label: 'ATM', icon: 'atm', sub: 'Bank A' },
          { id: 'sw', label: 'ATM switch', icon: 'card', sub: 'acquirer' },
          { id: 'net', label: 'Network', icon: 'globe', sub: 'shared switch' },
          { id: 'cbs', label: 'Core banking', icon: 'bank', sub: 'issuer: Bank B' },
        ],
        steps: [
          { from: 'atm', to: 'atm', label: 'card + PIN (encrypted in PIN pad)', detail: 'A Bank B customer uses a Bank A ATM. The **encrypting PIN pad** encrypts the PIN at once.', tone: 'slate' },
          { from: 'atm', to: 'sw', label: 'withdraw Rs. 10,000', detail: 'The ATM sends the request to Bank A\'s **ATM switch** (ATMs often use protocols like NDC/DDC; the switch converts to **ISO 8583**).', tone: 'blue' },
          { from: 'sw', to: 'net', label: '0200 · DE2 PAN · DE4 amount · DE11 STAN', detail: '**Off-us** card → the switch translates the PIN block in its **HSM** and sends an **ISO 8583 0200** financial request to the network.', tone: 'purple' },
          { from: 'net', to: 'cbs', label: '0200 → issuer', detail: 'The network routes it to **Bank B** (the issuer) by the card number range.', tone: 'purple' },
          { from: 'cbs', to: 'cbs', label: 'verify PIN · check balance · debit', detail: 'Bank B verifies the PIN (HSM), checks balance and limits, and **debits** the account.', tone: 'amber' },
          { from: 'cbs', to: 'net', label: '0210 · DE39 = 00', detail: 'Bank B replies **0210** with response code **00 = approved** and an approval code (DE38).', tone: 'green' },
          { from: 'net', to: 'sw', label: '0210 approved', detail: 'The response returns to the acquirer\'s switch.', tone: 'green' },
          { from: 'sw', to: 'atm', label: 'dispense cash', detail: 'The ATM dispenses the notes and prints a receipt. ✅', tone: 'teal' },
          { from: 'sw', to: 'net', label: '❗ cash jam / timeout → 0420 reversal advice', detail: 'If the ATM **could not dispense** (or the 0210 never arrived in time), the switch sends a **0420 reversal advice** (DE90 = original transaction). It repeats as **0421** until it gets a **0430**.', tone: 'red' },
          { from: 'net', to: 'cbs', label: '0420 → credit back', detail: 'The issuer **reverses the debit** and replies **0430**. The customer gets the money back. If anything is still missing, **reconciliation** with the ATM journal catches it.', tone: 'red' },
        ],
      },
      { kind: 'custom', id: 'mtiDecoder' },
      {
        kind: 'fields',
        title: 'Inside an ISO 8583 message',
        rows: [
          {
            label: 'Structure',
            fields: [
              { text: 'MTI', sub: '0200', tone: 'purple' },
              { text: 'Bitmap', sub: '70 20 … (hex)', tone: 'slate', w: 1.6 },
              { text: 'Data elements', sub: 'DE2 · DE3 · DE4 · DE11 …', tone: 'blue', w: 2.6 },
            ],
          },
          {
            label: 'Bitmap byte 1 = 0111 0000 = hex 70',
            fields: [
              { text: '0', sub: 'bit 1: no 2nd bitmap', tone: 'slate' },
              { text: '1', sub: 'DE2 PAN', tone: 'green' },
              { text: '1', sub: 'DE3 proc.', tone: 'green' },
              { text: '1', sub: 'DE4 amt', tone: 'green' },
              { text: '0', sub: 'DE5', tone: 'slate' },
              { text: '0', sub: 'DE6', tone: 'slate' },
              { text: '0', sub: 'DE7', tone: 'slate' },
              { text: '0', sub: 'DE8', tone: 'slate' },
            ],
          },
          {
            label: 'ISO 20022 message families',
            fields: [
              { text: 'pain', sub: 'customer → bank (pain.001)', tone: 'teal', w: 1.3 },
              { text: 'pacs', sub: 'bank ↔ bank (pacs.008)', tone: 'indigo', w: 1.3 },
              { text: 'camt', sub: 'statements (camt.053)', tone: 'amber', w: 1.3 },
            ],
          },
        ],
        note: 'In the second byte, bit 11 (STAN) set = 0010 0000 = hex **20**. So a bitmap starting **70 20** means DE 2, 3, 4 and 11 are present.',
      },
    ],
    bank: `Typical integration admin work with ISO 8583: checking the **0800 echo** messages to see if the link to the network is alive, searching switch logs by **STAN/RRN** for a customer complaint, reading **DE39** to see why transactions decline (many **91** = issuer/link unavailable, not a customer problem), and making sure **0420 reversals** are being acknowledged.`,
    remember: [
      'MTI pairs: **0100/0110** auth · **0200/0210** financial (ATM withdrawal) · **0400/0410** reversal · **0420/0430** reversal advice · **0800/0810** network mgmt.',
      'Message = **MTI + bitmap + data elements**. DE39 response code: **00** approved, **51** funds, **55** PIN, **91** issuer down.',
      '**ISO 20022** = rich structured XML (pain/pacs/camt). SWIFT cross-border: MT → MX, coexistence ended **Nov 2025** (MT103 → pacs.008).',
    ],
    check: [
      {
        q: 'Which ISO 8583 MTI is the response to an ATM withdrawal request (0200)?',
        options: ['0110', '0210', '0220', '0410'],
        answer: 1,
        explain: 'Request ends in 0, response ends in 10: **0200 → 0210**.',
      },
      {
        q: 'The ATM approved a withdrawal but the cash jammed. Which message does the acquirer usually send?',
        options: ['0800 echo test', '0100 authorisation', '0420 reversal advice', '0210 financial response'],
        answer: 2,
        explain: 'A **0420 reversal advice** (repeated as 0421 until a 0430 arrives) undoes the debit.',
      },
      {
        q: 'Which ISO 20022 message replaces the SWIFT MT103 customer credit transfer?',
        options: ['camt.053', 'pain.001', 'pacs.008', 'pacs.002'],
        answer: 2,
        explain: '**pacs.008** = FI-to-FI customer credit transfer. camt.053 = statement; pacs.002 = status report.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    id: 'si-reliability',
    title: 'Reliability: idempotency, timeouts, retries, reversals, reconciliation',
    analogy:
      'A good lift button is **idempotent**: press it five times and the lift still comes **once**. A **unique reference number** is like a cheque number — the bank will never pay cheque no. 000123 twice. **Reconciliation** is like matching your own notebook of spending with the bank statement at the end of the month.',
    body: `In integration, **networks fail in the middle**. The hardest case: you sent a request and got **no answer** — did it work or not? Reliability patterns handle this safely.

### Idempotency and unique references
- **Idempotent** = doing the same request **many times has the same effect as once**.
- Every transaction carries a **unique reference**: REST **Idempotency-Key** header, ISO 8583 **STAN + RRN**, ISO 20022 **end-to-end ID / UETR**, file **batch number**.
- The receiver stores "reference → result". A repeat with the same reference returns the **stored result** instead of processing again.
- GET/PUT/DELETE are idempotent by design; **POST is not** — so payment POSTs need an idempotency key.

### Timeouts
- Always set a **connect timeout** and a **read timeout** — never wait forever (threads pile up and the whole channel freezes).
- A **timeout does not mean "failed"** — it means **"unknown"**. The debit may have happened. So: do a **status enquiry** with the same reference, or send a **reversal**.

### Retries
- Retry only **safe/idempotent** operations (or with the same idempotency key).
- Use **limited attempts** with **exponential backoff** (1s, 2s, 4s…) and some random jitter, so retries do not overload a struggling system.
- **Circuit breaker**: after many failures, stop calling for a short time and fail fast.

### Reversals
A **compensating transaction** that undoes a debit when the full transaction could not complete (cash not dispensed, partner timed out). ISO 8583: **0400/0420**. Reversals must be idempotent too (they are often repeated).

### Duplicate prevention
- **Unique constraint** on the transaction reference in the database.
- Duplicate checks for **files** (same file name/batch number/hash already processed?).
- ISO 8583 response code **94 = duplicate transmission**.

### Reconciliation
Compare **two systems' records** for the same period (e.g. ATM switch vs core banking, bank vs bill partner, bank vs network settlement file). Match by **reference + amount**. Exceptions: **missing on one side, amount differs, duplicates**. Investigate, then correct with **approved** adjustments (maker-checker).

### Logging and monitoring
- A **correlation ID** passed through every system so one transaction can be traced end-to-end.
- Log request/response **metadata** — but **never** PINs, passwords, CVV or full card numbers (**mask PAN**, PCI DSS).
- Monitor **TPS, latency, error rate, timeouts, reversal count, queue depth, certificate expiry, file arrival**; alert before customers notice.
- Keep server clocks in sync with **NTP** so logs from different systems line up.`,
    visuals: [
      { kind: 'custom', id: 'idempotency' },
      { kind: 'custom', id: 'reconciliation' },
      {
        kind: 'flow',
        title: 'What to do after a timeout (unknown result)',
        steps: [
          { label: 'Send', icon: '📤', detail: 'Bank sends a transfer to the partner with reference **TRX-001**.', tone: 'blue' },
          { label: 'Timeout', icon: '⏱', detail: 'No response within the read timeout. Result is **UNKNOWN** — do not tell the customer "failed" yet, and do **not** blindly send a new transfer.', tone: 'amber' },
          { label: 'Status enquiry', icon: '❓', detail: 'Ask the partner: "what happened to **TRX-001**?" (same reference).', tone: 'purple' },
          { label: 'Decide', icon: '⚖️', detail: '**Success** → mark complete. **Not found** → safe to retry with the **same reference**. **Failed after our debit** → send a **reversal** / credit back.', tone: 'teal' },
          { label: 'Reconcile', icon: '🧮', detail: 'End-of-day **reconciliation** catches anything still out of line.', tone: 'green' },
        ],
      },
    ],
    bank: `Classic complaint: "**My account was debited but the transfer did not reach the beneficiary.**" Usually a timeout between systems. Good integration design means: the request had a **unique reference**, the system did a **status check or reversal automatically**, and **daily reconciliation** flagged it. The admin finds the transaction in the logs by its reference and correlation ID.`,
    remember: [
      '**Idempotency + unique reference** → the same request twice = processed once.',
      '**Timeout = unknown**, not failed → status enquiry or reversal; retries with backoff and the same key.',
      '**Reconciliation** matches two systems by reference + amount; log with correlation IDs, **mask sensitive data**.',
    ],
    check: [
      {
        q: 'A transfer request times out. What is the correct first assumption?',
        options: ['It definitely failed — send it again as a new transfer', 'The result is unknown — check status with the same reference or reverse', 'It definitely succeeded', 'Ignore it'],
        answer: 1,
        explain: 'A **timeout means unknown**. Re-sending as new risks a **double debit**.',
      },
      {
        q: 'Which HTTP method is NOT idempotent by default and therefore needs an idempotency key for payments?',
        options: ['GET', 'PUT', 'DELETE', 'POST'],
        answer: 3,
        explain: '**POST** creates a new resource each time.',
      },
      {
        q: 'What should NEVER be written to integration logs?',
        options: ['Correlation ID', 'Response time', 'Full card number, PIN or password', 'HTTP status code'],
        answer: 2,
        explain: 'Sensitive data must be **masked or excluded** (PCI DSS).',
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    id: 'si-security',
    title: 'Integration security: mTLS, certificates, OAuth2, JWT, HSM, SSO',
    analogy:
      '**TLS** is like checking the shop\'s registration before you give your card — you check **them**. **Mutual TLS** is two bank branches exchanging **signed letters** — **both** check each other. A **certificate** is a **passport**: it has a name, a photo (public key), an issuer and an **expiry date**. An **HSM** is a bank **vault** for keys — keys are used inside it and never leave.',
    body: `### TLS vs mutual TLS
- **TLS**: encrypts the connection and proves the **server's** identity with its certificate. Use **TLS 1.2 or 1.3**; disable SSL, TLS 1.0 and 1.1.
- **Mutual TLS (mTLS)**: **both** sides present certificates. Common for **bank ↔ partner** and service ↔ service links — only clients with a trusted certificate can even connect.

### Certificates and expiry
- A certificate holds a **public key**, the **subject/SAN** (hostname), the **issuer (CA)** and **validity dates**. Chain: **root CA → intermediate CA → server certificate**.
- **Keystore** = your own private key + certificate. **Truststore** = CA certificates you trust (Java: "PKIX path building failed" = the CA is not in the truststore).
- **Expiry is a top cause of outages**: everything works, then at midnight the certificate expires and every handshake fails. Keep a **certificate inventory**, alert at 60/30/7 days, and renew through change management. Public TLS certificate lifetimes are getting shorter (maximum **200 days** since March 2026, going down to 47 days by 2029) → automation matters.

### OAuth2 client credentials
For **machine-to-machine** APIs: the client sends its **client_id + client_secret** (or a certificate) to the **token endpoint** and gets a short-lived **access token**, then calls the API with **Authorization: Bearer <token>**. No user involved.

### JWT (JSON Web Token)
**header.payload.signature**, each part Base64URL-encoded. The payload holds **claims**: iss (issuer), sub, aud (audience), **exp (expiry)**, scope. The signature (e.g. RS256) proves it was not changed. A JWT is **signed, not encrypted** — anyone can read it, so never put secrets inside. The API must check **signature, exp, iss, aud**.

### API keys and IP whitelisting
- **API key**: a long secret string identifying the calling application. Simple but weak alone (can leak, no expiry) — send in a header (not the URL), rotate, combine with other controls.
- **IP whitelisting (allowlist)**: only known partner IPs can connect (firewall/gateway). Good **extra layer**, never the only one.

### Encryption in transit and at rest
- **In transit**: TLS/mTLS for APIs, **SFTP** for files (often plus **PGP** file encryption), IPsec VPN / dedicated links to partners.
- **At rest**: database encryption (e.g. TDE), encrypted disks and **backups**, encrypted files in staging folders.

### HSM basics
A **Hardware Security Module** is tamper-resistant hardware that **stores keys and does crypto inside itself** — keys never leave in clear text. Used for **PIN translation/verification**, card keys, **signing** messages, and protecting TLS/PGP private keys. Usually certified (e.g. FIPS 140, PCI HSM) and deployed in **redundant pairs** — if the HSM is unreachable, card transactions fail.

### SSO with LDAP / Active Directory
Internal applications should not keep their own passwords. They authenticate staff against **Active Directory** using **LDAPS (port 636)** — not plain LDAP 389 — or **Kerberos (88)**, or web SSO (**SAML / OpenID Connect**). Benefits: one login, **disable one account when someone leaves**, group-based roles. Integration **service accounts** need least privilege, strong secrets stored in a vault, and **expiry tracking** (an expired service-account password breaks integrations too).`,
    visuals: [
      { kind: 'custom', id: 'tlsHandshake' },
      {
        kind: 'sequence',
        title: 'OAuth2 client credentials + JWT',
        actors: [
          { id: 'c', label: 'Bank service', icon: 'server', sub: 'client' },
          { id: 'a', label: 'Auth server', icon: 'lock', sub: 'token endpoint' },
          { id: 'g', label: 'API gateway', icon: 'lb' },
          { id: 'api', label: 'Partner API', icon: 'server' },
        ],
        steps: [
          { from: 'c', to: 'a', label: 'POST /token  grant_type=client_credentials', detail: 'The service authenticates with its **client_id + client_secret** (or a certificate) and asks for a token with a **scope**, e.g. payments.write.', tone: 'blue' },
          { from: 'a', to: 'c', label: 'access_token (JWT), expires_in=300', detail: 'The auth server returns a **short-lived access token** — often a **JWT** signed with its private key. Cache it until it expires; don\'t request a new one per call.', tone: 'purple' },
          { from: 'c', to: 'g', label: 'Authorization: Bearer eyJhbGci…', detail: 'Every API call carries the token in the **Authorization** header.', tone: 'teal' },
          { from: 'g', to: 'g', label: 'check signature · exp · aud · scope', detail: 'The gateway validates the **signature** (public key), **expiry**, **audience** and **scope**. Invalid/expired → **401**. Valid but wrong scope → **403**.', tone: 'amber' },
          { from: 'g', to: 'api', label: 'forward request', detail: 'Only valid requests reach the backend.', tone: 'green' },
        ],
      },
      {
        kind: 'fields',
        title: 'A JWT has three parts',
        rows: [
          {
            label: 'header . payload . signature',
            fields: [
              { text: 'Header', sub: '{"alg":"RS256","typ":"JWT"}', tone: 'red' },
              { text: 'Payload (claims)', sub: '{"iss":"auth.bank","aud":"payments-api","scope":"payments.write","exp":1764150000}', tone: 'purple', w: 2 },
              { text: 'Signature', sub: 'sign(header.payload, private key)', tone: 'blue' },
            ],
          },
        ],
        note: 'Base64URL is **encoding, not encryption** — anyone can decode the payload. The **signature** stops tampering. Always check **exp**.',
      },
      {
        kind: 'compare',
        title: 'How a partner proves who it is',
        columns: [
          { label: 'API key', icon: '🗝', tone: 'amber' },
          { label: 'OAuth2 token', icon: '🎫', tone: 'blue' },
          { label: 'Mutual TLS', icon: '📜', tone: 'green' },
          { label: 'IP allowlist', icon: '🧱', tone: 'slate' },
        ],
        rows: [
          { label: 'What', values: ['Static secret string', 'Short-lived signed token', 'Client certificate in handshake', 'Only listed IPs connect'] },
          { label: 'Strength', values: ['Weak alone', 'Strong, expires', 'Strong', 'Extra layer only'] },
          { label: 'Breaks when', values: ['Key rotated/leaked', 'Secret rotated, clock skew', '**Cert expires** / not trusted', 'Partner changes IP'] },
        ],
      },
    ],
    bank: `Good practice for a new partner integration: **mutual TLS** on a dedicated link or VPN, **OAuth2** tokens with narrow scopes, **IP allowlist** on the firewall, payloads with **unique references**, files over **SFTP + PGP**, keys in an **HSM or vault**, and every certificate and secret in the **expiry calendar**. Defence in depth: no single control is enough.`,
    remember: [
      '**TLS** = server proves identity; **mTLS** = both sides. Track **certificate expiry** — a classic midnight outage.',
      '**OAuth2 client credentials** → short-lived token; **JWT** = header.payload.signature, signed not encrypted; check **exp/aud/signature**.',
      '**HSM** keeps keys inside; **AD/LDAPS (636)** for staff SSO; encryption **in transit and at rest**.',
    ],
    check: [
      {
        q: 'What extra step does mutual TLS add compared with normal TLS?',
        options: ['It removes encryption', 'The client also presents a certificate and the server verifies it', 'It uses port 80', 'It replaces certificates with passwords'],
        answer: 1,
        explain: 'In **mTLS** both sides authenticate with certificates.',
      },
      {
        q: 'Which statement about a JWT is TRUE?',
        options: ['It is encrypted, so it can hold passwords', 'It is signed, so it cannot be changed without detection — but anyone can read it', 'It never expires', 'It is the same as an API key'],
        answer: 1,
        explain: 'A JWT is **signed, not encrypted** (unless JWE). Never put secrets in it.',
      },
      {
        q: 'Which port does LDAP over TLS (LDAPS) use?',
        options: ['389', '443', '636', '88'],
        answer: 2,
        explain: '**636** = LDAPS. 389 = plain LDAP, 88 = Kerberos.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    id: 'si-testing',
    title: 'Testing environments and the change process',
    analogy:
      'Building a new bridge: first test **each beam** (unit test), then test **the joints** between parts (SIT), then the **city inspector drives on it** (UAT), then check the **old roads still work** (regression). On opening day, traffic police stand ready to **close the bridge** if something goes wrong (go-live with a **rollback plan**).',
    body: `### Test types
| Test | Who | Checks |
| --- | --- | --- |
| **Unit** | Developer | One function/component works alone |
| **SIT** (System Integration Testing) | IT / integration team + vendor | The **systems work together**: connectivity, formats, error handling, timeouts, reversals |
| **UAT** (User Acceptance Testing) | **Business users** | It meets the **business requirement**; users sign off |
| **Regression** | IT / QA | **Old features still work** after the change |
| Performance / load | IT | Peak volumes (salary day), response times |
| Security | Security team | Vulnerability scan / penetration test, configuration review |

### Environments
**DEV → SIT/Test → UAT → (Pre-prod) → PRODUCTION**, plus **DR**.

- Each environment has its **own endpoints, credentials and certificates** — never point UAT at production by mistake.
- **No real customer data** in test environments — use masked or synthetic data.
- **Production access is restricted**; developers do not deploy to production themselves (**segregation of duties**).
- Keep environments similar (same versions) so test results mean something.

### Onboarding a new integration — the full process
1. **Requirements** — business need, volumes, real-time or batch, SLAs, cut-off times.
2. **Interface specification** — endpoints, message formats/fields, error codes, references, security, timeouts, reconciliation file. Both sides sign off.
3. **Security review / risk assessment** — data sensitivity, encryption, authentication method, vendor due diligence.
4. **Firewall and connectivity requests** — source/destination IPs and ports for **each environment**; VPN/dedicated link; certificate exchange; DNS.
5. **Development / configuration** — middleware flows, gateway policies, monitoring and alerts.
6. **SIT** — positive and negative tests: timeouts, duplicates, reversals, invalid data, partner down.
7. **UAT** — business users test real scenarios and **sign off**.
8. **Change approval (CAB)** — change request with risk, implementation steps, test evidence, **rollback plan**, time window.
9. **Go-live** — in an approved window; smoke test / pilot transactions.
10. **Monitoring / hypercare** — watch closely for the first days; first reconciliations.
11. **Rollback plan** — prepared **before** go-live: how to switch back, who decides, how long it takes.

### Vendor coordination
- Clear **single points of contact** on both sides and an **escalation matrix**.
- Agreed **test windows** and a shared **defect log**.
- Contracts/NDAs and **SLAs** (support hours, response times).
- Vendor remote access only through approved, **time-limited, monitored** access (e.g. PAM), never shared passwords.
- Keep **documentation** updated after go-live: spec, contacts, certificates, runbook.`,
    visuals: [
      {
        kind: 'flow',
        title: 'Onboarding a new integration: step-by-step timeline',
        steps: [
          { label: 'Requirements', icon: '📝', detail: 'What does the business need? Volumes, real-time vs batch, SLAs, cut-off times, who owns it.', tone: 'slate' },
          { label: 'Interface spec', icon: '📐', detail: 'Endpoints, message formats, mandatory fields, error codes, **unique references**, timeouts, security, reconciliation file. **Signed off by both sides.**', tone: 'blue' },
          { label: 'Security review', icon: '🛡', detail: 'Data classification, encryption in transit/at rest, authentication (mTLS/OAuth2), vendor risk.', tone: 'red' },
          { label: 'Firewall request', icon: '🧱', detail: 'Source/destination **IPs and ports for UAT and PROD**, link/VPN, certificate exchange, DNS. Missing one direction is a classic delay.', tone: 'amber' },
          { label: 'Development', icon: '🛠', detail: 'Middleware flows, gateway policies, **monitoring and alerts** built in from the start.', tone: 'purple' },
          { label: 'SIT', icon: '🔗', detail: 'Systems tested together: success, timeout, duplicate, reversal, invalid data, partner-down cases.', tone: 'indigo' },
          { label: 'UAT', icon: '👩‍💼', detail: 'Business users test real scenarios and **sign off**.', tone: 'teal' },
          { label: 'Change approval', icon: '✅', detail: 'Change request to the **CAB**: risk, steps, test evidence, window, **rollback plan**.', tone: 'green' },
          { label: 'Go-live', icon: '🚀', detail: 'Deploy in the approved window; smoke test / pilot transactions; vendor on the call.', tone: 'blue' },
          { label: 'Monitoring', icon: '📊', detail: 'Hypercare: watch errors, latency, first **reconciliation** results closely.', tone: 'purple' },
          { label: 'Rollback plan', icon: '↩️', detail: 'Prepared **before** go-live: trigger conditions, who decides, steps, time needed. Used if go-live fails.', tone: 'red' },
        ],
      },
      {
        kind: 'fields',
        title: 'Environments: changes move left → right',
        rows: [
          {
            fields: [
              { text: 'DEV', sub: 'build', tone: 'slate' },
              { text: 'SIT', sub: 'systems together', tone: 'blue' },
              { text: 'UAT', sub: 'business sign-off', tone: 'teal' },
              { text: 'PROD', sub: 'real customers', tone: 'red' },
              { text: 'DR', sub: 'standby copy', tone: 'purple' },
            ],
          },
        ],
        note: 'Each has **separate** endpoints, credentials, certificates and firewall rules. Test data is **masked**. Only approved changes reach **PROD**, and DR must be updated too.',
      },
      {
        kind: 'compare',
        title: 'SIT vs UAT vs regression',
        columns: [
          { label: 'SIT', icon: '🔗', tone: 'indigo' },
          { label: 'UAT', icon: '👩‍💼', tone: 'teal' },
          { label: 'Regression', icon: '🔁', tone: 'amber' },
        ],
        rows: [
          { label: 'Question', values: ['Do the systems talk correctly?', 'Is this what the business needs?', 'Did we break anything old?'] },
          { label: 'Done by', values: ['IT / integration team + vendor', 'Business users', 'IT / QA (often automated)'] },
          { label: 'Example', values: ['Partner timeout → reversal works', 'Teller can pay a bill end-to-end', 'Existing transfers still work after upgrade'] },
        ],
      },
    ],
    bank: `A vendor wants to "quickly fix" a production interface at 4 p.m. on a working day. The right answer: raise a **change request** (or an **emergency change** if there is a real incident), test in **UAT** first, get **approval**, deploy in the **agreed window** with a **rollback plan**, and update documentation. Speed never replaces control in a bank.`,
    remember: [
      '**Unit** (one part) → **SIT** (systems together) → **UAT** (business sign-off) → **regression** (nothing old broke).',
      'Separate **DEV/SIT/UAT/PROD/DR** with their own credentials and certs; **no real customer data** in test.',
      'Onboarding: requirements → spec → security → firewall → dev → SIT → UAT → **CAB** → go-live → monitor, with a **rollback plan**.',
    ],
    check: [
      {
        q: 'Who normally performs UAT and signs it off?',
        options: ['The network team', 'Business users', 'The vendor only', 'Nobody'],
        answer: 1,
        explain: '**UAT** = business users confirm it meets the requirement.',
      },
      {
        q: 'When must the rollback plan be prepared?',
        options: ['After go-live fails', 'Before go-live, as part of the change request', 'Only for emergency changes', 'It is not needed if SIT passed'],
        answer: 1,
        explain: 'The CAB approves the change **with** its rollback plan.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    id: 'si-troubleshoot',
    title: 'Troubleshooting integrations step by step',
    analogy:
      'A plumber with no water at the tap does not replace the tap first. They check from the **tank → main valve → pipes → filter → tap**, one by one. Integration troubleshooting is the same: check **layer by layer**, from "is there a road?" to "is the letter written correctly?".',
    body: `Follow the path **from the network up to the application**, and collect evidence as you go.

1. **Scope** — what fails, for whom, since when? All or some transactions? **Any recent change?**
2. **Network** — \`ping\` the target (ICMP may be blocked), then test the **real port**: \`telnet host port\`, \`nc -zv host port\`, PowerShell \`Test-NetConnection host -Port 8443\`.
3. **Firewall** — is there a rule for source → destination : port? Recent change? Partner changed IP? Check firewall **deny logs**.
4. **DNS** — \`nslookup\` / \`dig\`: does the name resolve to the expected IP?
5. **Certificate / TLS** — \`openssl s_client -connect host:443 -servername host\`: expired? chain complete? trusted?
6. **Authentication** — **401** (bad/expired credentials or token) vs **403** (no permission, IP not allowed). Secret rotated? Service account expired or locked?
7. **Payload / format** — **400/422** with a validation message; schema/version changed; field length, date format, encoding; SOAP Fault.
8. **Middleware / queue** — flow stopped? **queue depth** growing? consumer disconnected? messages in the **DLQ**?
9. **Logs** — follow the **correlation ID / reference** through gateway → middleware → core → partner.
10. **Vendor / escalation** — give evidence; follow the incident process; update stakeholders; root cause afterwards.

### Reading telnet results
| Result | Meaning |
| --- | --- |
| **Connected to …** | Network path and port are **open** |
| **Connection refused** | Host reached, but **nothing listening** on that port (service down / wrong port) or actively rejected |
| **Hangs → timeout** | Packets **dropped** — usually a **firewall** or routing problem |

### Useful curl commands
\`\`\`
curl -v https://api.partner.example/health
curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" https://api.partner.example/health
curl -v --cert client.crt --key client.key https://api.partner.example/v1/ping
curl -v -H "Authorization: Bearer $TOKEN" https://api.partner.example/v1/accounts/123
\`\`\`
\`-v\` shows DNS resolution, the TCP connect, the **TLS handshake and certificate**, request headers and the **HTTP status** — one command checks many layers.

### HTTP status codes to know
| Code | Meaning | Look at |
| --- | --- | --- |
| 200 / 201 | OK / created | — |
| 400 / 422 | Bad request / validation | Payload, spec |
| 401 | Unauthorized | Token, key, password, client cert |
| 403 | Forbidden | Scope, role, IP allowlist |
| 404 | Not found | URL, version, routing |
| 429 | Too many requests | Rate limit |
| 500 | Server error | Backend logs |
| 502 | Bad gateway | Gateway got a bad reply from the backend |
| 503 | Service unavailable | Backend down / maintenance |
| 504 | Gateway timeout | Backend too slow / unreachable |`,
    visuals: [
      { kind: 'custom', id: 'integrationTroubleshoot' },
      {
        kind: 'topology',
        title: 'Where can mobile → core banking break?',
        width: 360,
        height: 200,
        zones: [
          { label: 'Internet', x: 5, y: 40, w: 75, h: 120, tone: 'slate' },
          { label: 'DMZ', x: 85, y: 40, w: 130, h: 120, tone: 'amber' },
          { label: 'Internal', x: 220, y: 40, w: 135, h: 120, tone: 'green' },
        ],
        nodes: [
          { id: 'app', label: 'Mobile app', icon: 'phone', x: 42, y: 100, info: 'Customer\'s app. If **only some customers** fail, check app version or their network first.' },
          { id: 'fw1', label: 'Firewall', icon: 'firewall', x: 110, y: 100, info: 'External firewall / WAF. Check rules and deny logs.' },
          { id: 'gw', label: 'API gateway', icon: 'lb', x: 180, y: 100, sub: 'TLS · auth', info: '**API gateway**: TLS certificate, token validation, rate limits. Look for 401/429/502/504 in its logs.' },
          { id: 'fw2', label: 'Firewall', icon: 'firewall', x: 245, y: 100, info: 'Internal firewall between DMZ and internal network. A changed rule here blocks gateway → middleware.' },
          { id: 'mw', label: 'Middleware', icon: 'server', x: 300, y: 60, sub: 'ESB / MQ', info: '**Middleware**: flow status, queue depth, DLQ, connection pool to core banking.' },
          { id: 'cbs', label: 'Core banking', icon: 'bank', x: 300, y: 145, info: '**Core banking**: is it up? In **EOD**? Do branches work? (If branches work, core is probably fine.)' },
        ],
        links: [
          { from: 'app', to: 'fw1', label: 'HTTPS' },
          { from: 'fw1', to: 'gw' },
          { from: 'gw', to: 'fw2' },
          { from: 'fw2', to: 'mw' },
          { from: 'mw', to: 'cbs' },
        ],
        steps: [
          { text: 'Normal path: app → firewall → **API gateway** → internal firewall → **middleware** → **core banking**, and back.', paths: [['app', 'fw1', 'gw', 'fw2', 'mw', 'cbs']], packet: 'balance?' },
          { text: '**Scope first**: branches can use core banking? Then core banking itself is up. Focus on the **channel path**.', highlight: ['cbs'], tone: 'green' },
          { text: 'From the gateway server: \`telnet <middleware-IP> <port>\` **hangs** → packets dropped at the **internal firewall**. Was a rule changed last night?', paths: [['gw', 'fw2']], blocked: true, tone: 'red' },
          { text: 'Port is open, but middleware logs show **"certificate expired"** calling core banking → renew the certificate through an emergency change.', paths: [['mw', 'cbs']], blocked: true, tone: 'red' },
          { text: 'Fixed → **test** with a real transaction, monitor, update the incident, inform the service desk, then do a **root cause** review (why didn\'t the expiry alert fire?).', paths: [['app', 'fw1', 'gw', 'fw2', 'mw', 'cbs']], tone: 'green', packet: '200 OK' },
        ],
      },
    ],
    bank: `In the interview, show **method**, not magic: *"First I confirm the scope and ask about recent changes. Then I test layer by layer from the source server — port with telnet, DNS, certificate, authentication, payload — check the middleware and queue, and follow the transaction in the logs by its reference. If the fault is on the partner side, I escalate with evidence and keep everyone updated through the incident process."*`,
    remember: [
      'Order: **scope → network (ping, telnet port) → firewall → DNS → certificate → auth → payload → middleware/queue → logs → vendor**.',
      'telnet: **connected** = open · **refused** = nothing listening · **timeout** = firewall/routing drop.',
      '**401** credentials · **403** permission · **502** bad backend reply · **504** backend timeout. Test from the **source server**.',
    ],
    check: [
      {
        q: '`telnet 10.20.30.40 8443` hangs and then times out. What is the most likely cause?',
        options: ['The service is listening normally', 'A firewall (or routing) is dropping the traffic', 'The certificate expired', 'The JSON payload is wrong'],
        answer: 1,
        explain: 'A **hang/timeout** means packets are dropped. "Connection refused" would mean the host answered but nothing is listening.',
      },
      {
        q: 'An API returns 403 Forbidden. What does it usually mean?',
        options: ['Wrong URL', 'The caller is identified but not allowed (scope, role or IP)', 'The server crashed', 'The request was too large'],
        answer: 1,
        explain: '**403** = authenticated but not authorised. 401 = not authenticated.',
      },
      {
        q: 'Why should you run connectivity tests from the source server, not your own PC?',
        options: ['Your PC is faster', 'Firewall rules allow specific source IPs — your PC\'s path may be different', 'telnet only works on servers', 'It is not important'],
        answer: 1,
        explain: 'Rules are per **source IP**. Test from the server that really makes the call.',
      },
    ],
  },
];
