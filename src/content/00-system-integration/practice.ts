import type { Flashcard, InterviewQA, MCQ } from '../types';

/* ============================== QUIZ (30) ============================== */
export const quiz: MCQ[] = [
  // Landscape
  { q: 'What does "system integration" mainly mean in a bank?', options: ['Installing Windows on branch PCs', 'Connecting systems (core banking, channels, payment networks, partners) so they exchange data reliably and securely', 'Designing the bank\'s logo', 'Only buying new servers'], answer: 1, explain: 'Integration = making many systems **work together** — with core banking at the centre.' },
  { q: 'Which system is the "central ledger" that most integrations connect to?', options: ['Active Directory', 'Core banking system', 'Email server', 'Data warehouse'], answer: 1, explain: 'The **core banking system** holds customers, accounts and the general ledger.' },
  { q: 'Which of these is a Sri Lankan national payment network that banks integrate with?', options: ['LankaPay (e.g. CEFTS, SLIPS, Common ATM Switch)', 'Kafka', 'WSDL', 'OAuth2'], answer: 0, explain: '**LankaPay**, operated by LankaClear, provides national payment services.' },
  { q: 'Banks submit borrower data to and request reports from which body in Sri Lanka?', options: ['SWIFT', 'CRIB (Credit Information Bureau)', 'LankaQR', 'ICANN'], answer: 1, explain: 'The **CRIB** is Sri Lanka\'s credit bureau.' },
  // Styles
  { q: 'What message format does SOAP always use?', options: ['JSON', 'XML', 'CSV', 'YAML'], answer: 1, explain: 'SOAP messages are **XML envelopes** (Envelope, Header, Body, Fault).' },
  { q: 'What is the usual contract document for a REST API?', options: ['WSDL', 'OpenAPI (Swagger) specification', 'ISO 8583 bitmap', 'X.509 certificate'], answer: 1, explain: 'REST APIs are typically described with **OpenAPI/Swagger**. WSDL is for SOAP.' },
  { q: 'In synchronous integration, what happens if the target system is down?', options: ['The message waits safely in a queue', 'The caller gets an error or timeout', 'Nothing — it is unaffected', 'The data is emailed instead'], answer: 1, explain: 'The caller **waits for an answer**, so it fails too. Async messaging would queue it.' },
  { q: 'Which protocol is the secure choice for sending batch files between bank and partner?', options: ['FTP (port 21)', 'TFTP', 'SFTP (SSH, port 22)', 'Telnet'], answer: 2, explain: '**SFTP** runs over SSH (port 22) and encrypts credentials and data.' },
  { q: 'Why is direct database integration with core banking discouraged?', options: ['Databases are slow', 'Tight coupling and security risk — a schema change breaks the other system and business rules are bypassed', 'SQL cannot be used across networks', 'It needs SOAP'], answer: 1, explain: 'Use **APIs/middleware** instead of reading another system\'s tables.' },
  { q: 'What does ETL stand for?', options: ['Encrypt, Transfer, Log', 'Extract, Transform, Load', 'Error, Timeout, Latency', 'Enterprise Transaction Layer'], answer: 1, explain: '**ETL** jobs feed the data warehouse, usually at night.' },
  // Middleware
  { q: 'Which is NOT a typical API gateway function?', options: ['Rate limiting', 'Token/API key validation', 'Request routing and logging', 'Running core banking EOD interest calculation'], answer: 3, explain: 'EOD is a core banking job. Gateways do **routing, transformation, rate limiting, security and logging**.' },
  { q: 'Which product is an example of an enterprise message queue widely used in banks?', options: ['IBM MQ', 'Nginx', 'Active Directory', 'Wireshark'], answer: 0, explain: '**IBM MQ** (default listener port 1414). RabbitMQ and Kafka are other examples.' },
  { q: 'What makes Kafka different from a classic message queue?', options: ['It only supports SOAP', 'It is a distributed log: messages are kept for a retention period and can be re-read by many consumer groups', 'It cannot be used in banks', 'It has no topics'], answer: 1, explain: 'Kafka stores events in **topics/partitions** with **retention**; consumers track their own position.' },
  { q: 'Why does a message queue help when core banking is down for maintenance?', options: ['It speeds up core banking', 'Messages wait safely in the queue and are processed when it comes back', 'It deletes failed messages', 'It converts XML to JSON'], answer: 1, explain: 'Queues **decouple** producer and consumer and **buffer** outages.' },
  { q: 'Which is an example of an ESB/integration platform?', options: ['MuleSoft Anypoint', 'Microsoft Excel', 'Cisco IOS', 'OpenSSL'], answer: 0, explain: 'Examples: **MuleSoft, WSO2, IBM App Connect Enterprise (ACE)**.' },
  // Standards
  { q: 'In ISO 8583, which MTI pair is used for authorisation (approve and hold funds)?', options: ['0100 / 0110', '0200 / 0210', '0400 / 0410', '0800 / 0810'], answer: 0, explain: '**0100/0110** = authorisation request/response.' },
  { q: 'Which ISO 8583 MTI is used for echo tests and sign-on between a switch and the network?', options: ['0200', '0420', '0800', '0110'], answer: 2, explain: '**0800/0810** = network management.' },
  { q: 'In an ISO 8583 MTI, what does the SECOND digit tell you?', options: ['The version', 'The message class (e.g. 1 authorisation, 2 financial, 4 reversal, 8 network)', 'The currency', 'The terminal ID'], answer: 1, explain: 'Digits: **version · class · function · origin**.' },
  { q: 'What does the ISO 8583 bitmap do?', options: ['Encrypts the PIN', 'Shows which data elements are present in the message', 'Stores the card image', 'Holds the response code'], answer: 1, explain: 'Bit n = 1 → **data element n** is present. Bit 1 = secondary bitmap follows.' },
  { q: 'Which ISO 8583 data element carries the response code (00 = approved)?', options: ['DE2', 'DE4', 'DE11', 'DE39'], answer: 3, explain: '**DE39** = response code. DE2 = PAN, DE4 = amount, DE11 = STAN.' },
  { q: 'Many ATM transactions fail with response code 91. What does that usually mean?', options: ['Customer entered the wrong PIN', 'Insufficient funds', 'Issuer or switch is unavailable (inoperative)', 'Card expired'], answer: 2, explain: '**91** points to a link/host problem, not the customer.' },
  { q: 'What does ISO 20022 mainly bring compared with older formats?', options: ['Shorter messages with less data', 'Rich, structured data (usually XML) — better automation and AML screening', 'It only works for ATMs', 'It replaces TLS'], answer: 1, explain: 'Structured names, addresses, purpose codes and references (e.g. **UETR**).' },
  // Reliability
  { q: 'What is idempotency?', options: ['Encrypting a request twice', 'Sending the same request many times has the same effect as sending it once', 'A type of firewall', 'Retrying forever'], answer: 1, explain: 'With a **unique reference**, duplicates return the stored result.' },
  { q: 'Which retry approach is best when a partner API is struggling?', options: ['Retry immediately in a tight loop', 'Limited retries with exponential backoff and the same idempotency key', 'Never use timeouts', 'Create a new reference for each retry'], answer: 1, explain: 'Backoff avoids overloading; the **same key** prevents double processing.' },
  { q: 'Daily reconciliation finds a reference posted twice in core banking but once in the ATM switch. What is this exception?', options: ['Matched', 'Duplicate posting — reverse the duplicate and fix the cause', 'Missing in core banking', 'Amount mismatch'], answer: 1, explain: 'A **duplicate** debit must be reversed (with approval) and investigated.' },
  // Security
  { q: 'An integration fails at exactly midnight with "certificate has expired". What should have prevented it?', options: ['A bigger server', 'A certificate inventory with expiry alerts and planned renewal', 'Turning off TLS', 'Using HTTP instead'], answer: 1, explain: 'Track every certificate and **alert at 60/30/7 days**.' },
  { q: 'Which OAuth2 grant type is used for machine-to-machine API calls with no user?', options: ['Authorization code', 'Client credentials', 'Implicit', 'Password'], answer: 1, explain: '**Client credentials**: client_id + secret (or certificate) → access token.' },
  { q: 'What is the main purpose of an HSM?', options: ['To store log files', 'To store cryptographic keys and perform crypto operations inside tamper-resistant hardware', 'To balance web traffic', 'To replace Active Directory'], answer: 1, explain: 'Keys **never leave** the HSM in clear text: PINs, signing, key management.' },
  // Testing & troubleshooting
  { q: 'Which test checks that two or more systems work together correctly (formats, connectivity, timeouts)?', options: ['Unit test', 'SIT (System Integration Testing)', 'UAT', 'Penetration test'], answer: 1, explain: '**SIT** = systems together. UAT = business sign-off.' },
  { q: 'From the source server, `telnet partner-ip 443` returns "Connection refused". What does it suggest?', options: ['A firewall is silently dropping packets', 'The host was reached but nothing is listening on that port (or it actively rejected)', 'The certificate expired', 'DNS failed'], answer: 1, explain: '**Refused** = reached the host; a **timeout** would suggest a firewall drop.' },
];

/* ============================== FLASHCARDS (25) ============================== */
export const flashcards: Flashcard[] = [
  { front: 'System integration (bank)', back: 'Connecting core banking with channels, cards/ATM, payment networks, regulators, partners and internal systems — **reliably and securely**.', tag: 'definition' },
  { front: 'Interface checklist', back: '**Who · what · how (style/format) · when (real-time/batch) · security · owner/support · monitoring.**', tag: 'fact' },
  { front: 'REST vs SOAP', back: '**REST**: style, JSON, HTTP verbs, OpenAPI. **SOAP**: protocol, XML envelope, **WSDL**, SOAP Fault, WS-Security.', tag: 'definition' },
  { front: 'WSDL', back: '**Web Services Description Language** — XML contract of a SOAP service (operations, messages, endpoint).', tag: 'acronym' },
  { front: 'Sync vs async', back: '**Sync**: caller waits (REST/SOAP) — fails if target down. **Async**: message queued — survives outages.', tag: 'definition' },
  { front: 'Point-to-point vs hub', back: 'P2P links = **n(n−1)/2** (10 systems → 45). Hub/ESB = **n**. Hub must be highly available.', tag: 'fact' },
  { front: 'ETL', back: '**Extract · Transform · Load** — nightly bulk copy into the data warehouse for MIS/regulatory/AML reports.', tag: 'acronym' },
  { front: 'File integration checks', back: 'Arrived **before cut-off** · **not a duplicate** · record count/**control total** match trailer · valid format · ack sent.', tag: 'fact' },
  { front: 'API gateway jobs', back: '**Routing · transformation · rate limiting (429) · security (TLS, OAuth2/JWT, API keys, IP allowlist) · logging.**', tag: 'fact' },
  { front: 'ESB', back: '**Enterprise Service Bus**: central routing, transformation, protocol bridging, orchestration. E.g. WSO2, MuleSoft, IBM ACE.', tag: 'acronym' },
  { front: 'Message queue terms', back: '**Producer** → broker/**queue** → **consumer** (ack). **Persistent** = survives restart. **DLQ** = failed/poison messages.', tag: 'definition' },
  { front: 'IBM MQ · RabbitMQ · Kafka', back: '**IBM MQ**: enterprise queues (port 1414). **RabbitMQ**: AMQP broker (5672). **Kafka**: distributed event log with retention (9092).', tag: 'fact' },
  { front: 'ISO 8583 structure', back: '**MTI** (4 digits) + **bitmap** (which fields present) + **data elements**.', tag: 'definition' },
  { front: 'ISO 8583 MTI digits', back: '**Version · class · function · origin**. Class: 1 auth, 2 financial, 4 reversal, 8 network. Function: 0 request, 1 response, 2 advice, 3 advice response.', tag: 'fact' },
  { front: 'Key ISO 8583 MTIs', back: '**0100/0110** auth · **0200/0210** financial (ATM withdrawal) · **0400/0410** reversal · **0420/0430** reversal advice (0421 = repeat) · **0800/0810** network mgmt.', tag: 'fact' },
  { front: 'Key data elements', back: 'DE2 **PAN** · DE3 processing code · DE4 amount · DE11 **STAN** · DE37 **RRN** · DE39 **response code** · DE41 terminal ID · DE52 PIN block · DE90 original data (reversals).', tag: 'fact' },
  { front: 'DE39 response codes', back: '**00** approved · 05 do not honour · **51** insufficient funds · **55** incorrect PIN · **91** issuer/switch inoperative · 94 duplicate.', tag: 'fact' },
  { front: 'ISO 20022', back: 'Rich structured (XML) financial messages. **pain** = customer→bank, **pacs** = bank↔bank (pacs.008), **camt** = statements (camt.053).', tag: 'definition' },
  { front: 'SWIFT MT → ISO 20022', back: 'Cross-border coexistence **Mar 2023 – Nov 2025**. **MT103 → pacs.008**, MT202 → pacs.009, MT940 → camt.053.', tag: 'fact' },
  { front: 'Idempotency', back: 'Same request many times = **same effect as once**. Use a **unique reference / Idempotency-Key**; store reference → result.', tag: 'definition' },
  { front: 'Timeout rule', back: '**Timeout = unknown, not failed.** Do a status enquiry with the same reference, or reverse. Retry with backoff + same key.', tag: 'fact' },
  { front: 'Reconciliation', back: 'Match two systems\' records by **reference + amount**. Exceptions: missing on one side, amount differs, duplicates → investigate + approved fix.', tag: 'definition' },
  { front: 'TLS vs mTLS', back: '**TLS**: server proves identity. **mTLS**: client also sends a certificate; both verified. Track **both** certificates\' expiry.', tag: 'definition' },
  { front: 'OAuth2 client credentials + JWT', back: 'client_id + secret → **access token** (often a JWT: header.payload.signature, **signed not encrypted**). Check **signature, exp, aud, scope**.', tag: 'definition' },
  { front: 'Integration troubleshooting order', back: '**Scope → ping → telnet port → firewall → DNS → certificate → auth (401/403) → payload (400) → middleware/queue → logs → vendor.**', tag: 'fact' },
];

/* ============================== INTERVIEW (25) ============================== */
export const interview: InterviewQA[] = [
  /* ---------- Technical ---------- */
  {
    type: 'technical',
    q: 'What does system integration mean in a bank, and what would you do as an Administrator – System Integration?',
    answer: `In a bank, the **core banking system** is the centre, but many systems must exchange data with it: **Internet and mobile banking, the ATM switch and card systems, national payment services like LankaPay, SWIFT, Central Bank reporting, the credit bureau, bill payment partners, payment gateways, and internal systems** like loans, AML, HR and Active Directory. System integration means making all these connections **work reliably and securely**.

As an integration administrator I would expect to:
- **Keep interfaces and middleware running** — monitor APIs, queues, file transfers and alerts.
- Manage **connectivity, certificates and credentials** — firewall rules, mutual TLS certificates, service accounts, and their expiry dates.
- **Onboard new integrations** — interface specs, security review, firewall requests, SIT and UAT, change approval and go-live.
- **Troubleshoot** failed transactions with network, application and vendor teams, following the incident process.
- Keep **documentation** and runbooks up to date.

My development background helps because I have **built and consumed REST APIs** myself, so I understand both sides of an interface.`,
    tips: ['Do not name NSB\'s actual products or vendors — say "a typical bank".', 'End with the bridge to your API experience.'],
  },
  {
    type: 'technical',
    q: 'What is the difference between REST and SOAP?',
    answer: `**REST** is an **architectural style** over HTTP. It uses resources and HTTP methods — GET, POST, PUT, DELETE — usually with **JSON**, standard HTTP status codes, and is often documented with **OpenAPI/Swagger**. It is light and common for mobile and modern partner APIs.

**SOAP** is a **protocol** with a strict **XML envelope** — Envelope, Header, Body and Fault. The contract is a **WSDL** file that defines operations and data types. It supports **WS-Security** for message-level signing and encryption, and it is still common in older enterprise and core banking interfaces.

In practice a bank has both, and middleware or an API gateway often **translates** between them — for example the mobile app sends JSON, and the backend receives SOAP/XML. In my projects I built REST APIs with **Spring Boot**, so I'm comfortable with JSON, status codes and API documentation.`,
  },
  {
    type: 'technical',
    q: 'Explain synchronous vs asynchronous integration. When would you use each?',
    answer: `**Synchronous** means the caller **waits** for the answer — like a phone call. REST or SOAP calls are synchronous. We need it when the **customer is waiting**: ATM withdrawal, balance enquiry, login. The weakness: if the target is slow or down, the caller fails too, so we need **timeouts** and good error handling.

**Asynchronous** means the caller sends a **message** — usually to a **queue** — and continues, like posting a letter. The consumer processes it when it can. It's good for things that can be slightly delayed: notifications, AML feeds, some postings, and for **absorbing peaks** or **outages**.

Many real flows mix both: the customer gets a quick synchronous "accepted" response, and the rest is processed asynchronously with a status update later.`,
  },
  {
    type: 'technical',
    q: 'What is an API gateway and what does it do?',
    answer: `An API gateway is the **single front door** for APIs, for example in front of mobile banking or partner APIs. Its main jobs:
1. **Routing** — send each request to the right backend service and version.
2. **Transformation** — convert formats, for example JSON to XML, and add headers like a correlation ID.
3. **Rate limiting** — limit requests per client; extra requests get **HTTP 429**. This protects core banking from overload and abuse.
4. **Security** — TLS termination, validating **OAuth2/JWT tokens** and **API keys**, IP allowlists.
5. **Logging and monitoring** — every call, its status and response time, for dashboards, alerts and audit.

Because it's in front of everything, it must be **highly available**, and its certificates and policies must go through change control.`,
  },
  {
    type: 'technical',
    q: 'What is an ESB? How is it different from point-to-point integration?',
    answer: `With **point-to-point**, every pair of systems has its own interface. With many systems that becomes "spaghetti": **n(n−1)/2** connections — 10 systems need 45 interfaces, each with its own format, security and monitoring.

An **ESB (Enterprise Service Bus)** is a central integration layer. Each system connects **once** to it, and the ESB does **routing, transformation, protocol bridging** (REST, SOAP, MQ, files) and **orchestration**. Examples in the industry are **WSO2, MuleSoft and IBM App Connect Enterprise**.

Benefits: fewer connections, reuse, central monitoring and security. The risk is that the ESB becomes **critical**, so it needs clustering, DR and careful change management.`,
  },
  {
    type: 'technical',
    q: 'Why use a message queue instead of a direct API call?',
    answer: `A direct API call is **synchronous** — both systems must be up at the same moment. A message queue **decouples** them. The benefits:
1. **Resilience** — if the consumer (for example a core banking adapter) is down for maintenance or EOD, messages **wait safely** in the queue and are processed when it comes back. With a direct call, those requests would fail.
2. **Guaranteed delivery** — with **persistent** messages and acknowledgements, a message is not lost even if the broker restarts.
3. **Load levelling** — on peak days like salary day, the queue absorbs the burst and the consumer works at a steady speed.
4. **Retry and dead letter queue** — failed messages are retried and "poison" messages go to a **DLQ** for investigation instead of blocking others.
5. **Loose coupling** — producers don't need to know where or how many consumers there are.

But it's not for everything: when the customer is **waiting for an answer**, like an ATM withdrawal, a synchronous call is still needed. Examples of brokers are **IBM MQ, RabbitMQ and Kafka**. As an admin I would monitor **queue depth, consumer connections and the DLQ**.`,
    tips: ['Give the "consumer down" example — it is the most convincing.'],
  },
  {
    type: 'technical',
    q: 'Explain ISO 8583 and the common message types.',
    answer: `ISO 8583 is the standard **message format for card and ATM transactions** between terminals, switches, card networks and the issuing bank. A message has three parts:
1. **MTI** — four digits: version, message class, function and origin.
2. **Bitmap** — shows which data elements are present.
3. **Data elements** — for example DE2 card number, DE4 amount, DE11 STAN trace number, DE37 retrieval reference number, DE41 terminal ID, and **DE39 response code**.

Common MTIs:
- **0100/0110** — authorisation request and response (approve and hold funds).
- **0200/0210** — financial request and response, for example an **ATM withdrawal**.
- **0400/0410** — reversal; **0420/0430** — reversal advice, used when the ATM didn't dispense or the reply timed out. It's repeated as 0421 until acknowledged.
- **0800/0810** — network management: sign-on, echo test, key exchange.

Response codes: **00 approved**, 51 insufficient funds, 55 incorrect PIN, **91 issuer or switch unavailable**. Real networks use their own variants, so the interface specification is always the final reference.`,
    tips: ['Request ends in 0, response ends in 10 — say it if you blank on a number.'],
  },
  {
    type: 'technical',
    q: 'What is ISO 20022 and why is SWIFT moving to it?',
    answer: `ISO 20022 is a global standard for financial messages with a **rich, structured data model**, usually in **XML**. Messages are grouped into families: **pain** for customer-to-bank payment initiation, **pacs** for bank-to-bank payments — for example **pacs.008** customer credit transfer — and **camt** for statements and notifications, like camt.053.

Compared with the older SWIFT MT messages, it carries **structured names, addresses, purpose codes and end-to-end references**. That means better **automation**, better **AML and sanctions screening**, and easier tracking.

For cross-border payments, SWIFT ran a **coexistence period from March 2023 to November 2025**. Now payment instructions are expected in ISO 20022 — pacs.008 replaces MT103. Many domestic RTGS and instant payment systems are also adopting it. For a bank's integration team this means updated message formats, mapping and validation in middleware, and more testing.`,
  },
  {
    type: 'technical',
    q: 'What is idempotency and why does it matter for payment integrations?',
    answer: `Idempotency means that **sending the same request many times has the same effect as sending it once**. It matters because networks fail in the middle: a client may send a transfer, the server processes it, but the response is lost — so the client **retries**.

To make this safe, every transaction carries a **unique reference** — an **Idempotency-Key** header in REST, **STAN/RRN** in ISO 8583, an end-to-end ID or UETR in ISO 20022. The server stores "reference → result". If the same reference comes again, it returns the **stored result** instead of processing again. A **unique constraint** in the database adds another safety net.

In my own Spring Boot work I'd implement this with a table or **Redis** key for processed references with an expiry — Redis is good for fast duplicate checks.`,
    tips: ['Mentioning Redis connects to your certification — keep it short.'],
  },
  {
    type: 'technical',
    q: 'What is reconciliation and why is it important?',
    answer: `Reconciliation means **comparing the records of two systems** for the same period to make sure they agree — for example the **ATM switch log vs core banking postings**, or the bank's records vs a **bill payment partner's** daily file, or the bank vs the **network settlement file**.

Records are matched by **unique reference and amount**. The exceptions are:
- **Missing in one system** — for example the switch approved but core banking has no debit, or a debit with no switch record.
- **Amount differences.**
- **Duplicates.**

Each exception is investigated — using logs, the ATM electronic journal, the partner — and corrected through an **approved adjustment or reversal** (maker-checker).

It's important because integrations can fail halfway, especially with timeouts. Reconciliation is the **safety net** that protects both customers and the bank from money being lost, and it's also an audit requirement.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between TLS and mutual TLS? When would you use mTLS?',
    answer: `With normal **TLS**, only the **server** proves its identity with a certificate. The client checks that the certificate is issued by a trusted CA, matches the hostname and is not expired. Then the connection is encrypted. The client usually proves who it is later, with an API key or OAuth2 token.

With **mutual TLS**, the **client also presents a certificate**, and the server verifies it against its truststore during the handshake. So both sides are authenticated **before** any data is sent — an unknown client can't even connect.

I'd use mTLS for **bank-to-partner** and **service-to-service** connections — for example a bill payment partner or a payment network link — usually together with IP allowlisting and OAuth2. The operational point: there are **two certificates** to manage, so both expiry dates must be tracked. In Java terms, the **keystore** holds our own certificate and private key, and the **truststore** holds the CAs we trust.`,
  },
  {
    type: 'technical',
    q: 'How do OAuth2 client credentials and JWT work for API security?',
    answer: `**OAuth2 client credentials** is for **machine-to-machine** calls where no user is involved. The calling service sends its **client ID and secret** — or a certificate — to the **token endpoint** of the authorisation server and gets a **short-lived access token** with specific **scopes**. It then calls the API with **Authorization: Bearer <token>**.

The access token is often a **JWT**: three Base64URL parts — **header, payload and signature**. The payload holds claims like issuer, audience, scope and **expiry**. The signature proves it wasn't changed. Important: a JWT is **signed, not encrypted**, so anyone can read it — no secrets inside.

The API gateway validates the **signature, expiry, audience and scope**. Invalid or expired gives **401**; valid but not allowed gives **403**. I've used **JWT authentication in Spring Boot** projects, so I know common issues like expired tokens, clock skew and wrong audience.`,
  },
  {
    type: 'technical',
    q: 'What is an HSM and where is it used in integrations?',
    answer: `A **Hardware Security Module** is a tamper-resistant device that **stores cryptographic keys and performs cryptographic operations inside itself**, so keys never leave it in clear text.

In banking integrations it's used for:
- **PIN translation and verification** — for example when an ATM switch passes a PIN block from one key zone to another.
- **Card keys** and EMV cryptogram checks.
- **Signing and encryption** of messages and files, and protecting private keys for TLS or PGP.
- **Key management** with payment networks.

HSMs are usually certified (FIPS 140, PCI HSM) and installed in **redundant pairs**. From an integration view, if the switch can't reach the HSM, **card transactions fail**, so HSM connectivity is monitored like any critical interface.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between unit testing, SIT, UAT and regression testing?',
    answer: `- **Unit testing** — developers test **one component** alone.
- **SIT, System Integration Testing** — the IT and integration team, often with the vendor, test that **systems work together**: connectivity, message formats, error codes, timeouts, duplicates and reversals.
- **UAT, User Acceptance Testing** — **business users** test real scenarios and **sign off** that it meets the requirement.
- **Regression testing** — checks that **existing features still work** after a change.

Each has its own **environment** — DEV, SIT, UAT, then production and DR — with separate endpoints, credentials and certificates, and **no real customer data** in test. Only changes that passed testing and got **CAB approval** go to production.`,
  },
  {
    type: 'technical',
    q: 'How do you prevent integration outages caused by expired certificates or passwords?',
    answer: `Expiry is one of the most common causes of "it worked yesterday" outages, so I'd manage it **proactively**:
1. Keep an **inventory** of every certificate — server, client mTLS, CA chains, LDAPS, SFTP/PGP keys — and every service-account password and API secret, with **owner and expiry date**.
2. **Automated alerts** at 60, 30 and 7 days, and monitoring that checks the live endpoints' certificates.
3. Plan renewal as a normal **change** — test in UAT first, coordinate with the partner if they must trust a new certificate, and schedule a window.
4. Where possible, **automate renewal**. Public certificate lifetimes are getting shorter, so manual tracking won't scale.
5. After any incident, do a **root cause review** and add the missed item to the inventory.`,
  },
  {
    type: 'technical',
    q: 'How would you monitor integrations?',
    answer: `I'd monitor at several levels:
- **Availability** — health checks on APIs, middleware, queues, SFTP servers and partner links; 0800 echo for card networks.
- **Performance** — transactions per second, **latency**, timeouts.
- **Errors** — HTTP 4xx/5xx rates, ISO 8583 decline codes like 91, SOAP faults, **reversal counts**.
- **Queues** — **queue depth**, consumer connections, **DLQ** messages.
- **Batch** — files **arrived before cut-off**, processed, acknowledged; ETL job success.
- **Security and expiry** — certificate and secret expiry, failed authentication spikes.

Logs should have a **correlation ID** so one transaction can be traced across systems, with **sensitive data masked**. Alerts go to the on-call team with a **runbook**, and dashboards show the business view — for example "mobile transfers success rate".`,
  },
  {
    type: 'technical',
    q: 'How would you secure a new partner integration end to end?',
    answer: `I'd use **defence in depth**:
1. **Network** — dedicated link or IPsec VPN, **firewall rules** for exact source/destination IPs and ports, partner IPs **allowlisted**, DMZ placement.
2. **Transport** — **TLS 1.2/1.3** or **mutual TLS**; files over **SFTP**, often PGP-encrypted.
3. **Authentication and authorisation** — OAuth2 client credentials with narrow scopes, or API keys plus mTLS; least-privilege **service accounts**.
4. **Message level** — validation of every field, **unique references** for idempotency, signatures where required.
5. **Keys and secrets** — in an **HSM or secrets vault**, never in code; rotation and expiry tracking.
6. **Data at rest** — encrypted databases, files and backups; sensitive data **masked in logs**.
7. **Monitoring and audit** — logging, alerts, regular reviews, and a **security review** before go-live.`,
  },

  /* ---------- Scenarios ---------- */
  {
    type: 'scenario',
    q: 'Mobile banking cannot reach core banking. How do you troubleshoot?',
    answer: `I'd work **step by step** and keep the incident updated.
1. **Scope** — Is it all customers or some? All functions or only transfers? Since when? **Do branches work?** If tellers can use core banking, core banking itself is up and the problem is on the **mobile path**. Was there **any change** — deployment, firewall, certificate, password?
2. **Gateway logs** — what errors do we see? **401/403** points to authentication; **502/504** means the backend failed or timed out.
3. **Network from the right server** — from the gateway/middleware server, \`telnet\` or \`nc\` to the core banking service **port**. Connected, refused or timeout tells me if it's the service or a **firewall**.
4. **Firewall and DNS** — recent rule changes, deny logs, does the hostname resolve to the right IP?
5. **Certificates and credentials** — has a **certificate or service-account password expired**? \`openssl s_client\` shows the expiry.
6. **Middleware** — is the flow running, is the connection pool exhausted, is a **queue** building up?
7. **Logs with the correlation ID** — follow one failed transaction to see exactly where it stops.

Throughout, I'd inform the service desk, escalate to the right team or vendor **with evidence**, and after the fix test with a real transaction and do a **root cause** review.`,
    tips: ['Lead with "do branches work?" — it shows you know how to scope.'],
  },
  {
    type: 'scenario',
    q: 'An ATM debited the customer but no cash came out. What happened and what do you do?',
    answer: `Most likely the transaction was **approved and the account debited**, but the ATM **failed to dispense** — a cash jam or hardware fault — or the approval reached the ATM **too late** after a timeout.

Normally the system fixes this automatically: the ATM switch sends an **ISO 8583 reversal advice (0420)**, repeated as 0421 until the issuer replies **0430**, and the debit is credited back. If the customer is still debited, the reversal **failed or never reached** the issuer.

What I'd do:
1. Find the transaction by **card, time, terminal ID, STAN/RRN** in the switch and core banking logs.
2. Check whether a **reversal** was sent and acknowledged.
3. Check the **ATM electronic journal** and cash counters to confirm no cash was dispensed.
4. If confirmed, the card/operations team processes a **refund** through the approved dispute process.
5. Check **reconciliation** — the daily ATM-switch vs core banking reconciliation should flag it.
6. If many cases happen, look for a pattern: one ATM (hardware), or reversals failing across the link (integration issue), and raise an incident.

I'd also make sure the customer is kept informed through the branch or call centre.`,
  },
  {
    type: 'scenario',
    q: 'How would you integrate a new bill payment partner?',
    answer: `I'd follow the bank's standard onboarding process:
1. **Requirements** — which bills, channels (branch, mobile), volumes, real-time or batch, settlement and **reconciliation** needs, SLAs.
2. **Interface specification** — the partner's API (e.g. validate bill → pay → confirm → status enquiry), message formats, error codes, **unique payment reference**, timeouts, and the **daily reconciliation file**. Both sides sign off.
3. **Security review** — data shared, **mutual TLS** or OAuth2, IP allowlisting, vendor risk assessment.
4. **Connectivity** — **firewall requests** for UAT and production IPs/ports, certificate exchange, DNS.
5. **Development** — middleware flow and gateway policies, mapping to core banking debit/GL entries, **idempotency**, timeout and reversal handling, monitoring and alerts.
6. **SIT** — success, invalid bill number, duplicate, **timeout**, partner down, reversal.
7. **UAT** — business users test end-to-end and **sign off**.
8. **Change approval** with a **rollback plan**, then **go-live** in a window — often a pilot first.
9. **Hypercare** — monitor errors and check the first **reconciliations** closely.

And I'd keep the **documentation** — spec, contacts, escalation matrix, certificate dates — updated for the support team.`,
  },
  {
    type: 'scenario',
    q: 'What happens if the same transfer request is sent twice?',
    answer: `Without protection, the customer could be **debited twice** — a serious issue for a bank. This usually happens when the first request **timed out** and the client or user **retried**, or the user double-tapped.

A well-designed integration prevents it with **idempotency**:
- Each request has a **unique reference** — an Idempotency-Key, transaction reference, or STAN/RRN.
- The server checks whether that reference was **already processed**. If yes, it returns the **original result** and does not debit again.
- A **unique constraint** in the database on the reference is a second safety net.
- For ISO 8583, a duplicate can be answered with code **94**.

If a duplicate still gets through, **daily reconciliation** flags it, and the duplicate is **reversed** through an approved process. Then we find the root cause — for example, a retry that created a **new** reference instead of reusing the same one.`,
  },
  {
    type: 'scenario',
    q: 'An integration stopped working at midnight. What do you check first?',
    answer: `Midnight is a big clue — things that happen **on a schedule or a date**:
1. **Certificate expiry** — the most common one. Check with \`openssl s_client\` and look for "certificate has expired" or handshake errors in the logs.
2. **Password, API key or token expiry** — service accounts or client secrets that expire on a date.
3. **Scheduled jobs** — **EOD/batch** in core banking may have started and paused real-time processing or locked tables; a batch job may have failed.
4. **Scheduled changes** — a **change window** at midnight: firewall rule, deployment, patching or server reboot.
5. **Date-related logic** — date rollover, a new file name/date format not found, log or disk full after a daily rotation.
6. **Partner side** — their maintenance window.

Then I'd continue with the normal steps — scope, connectivity, logs — and update the incident. Afterwards I'd make sure expiry dates and maintenance windows are on an **alert calendar** so it doesn't happen again.`,
    tips: ['"Midnight = certificate or password expiry, EOD, or a change window" — say this first.'],
  },
  {
    type: 'scenario',
    q: 'A partner API suddenly returns HTTP 401 for all our requests. What do you check?',
    answer: `**401 Unauthorized** means the partner doesn't accept our **credentials**. So the network path works — it's an **authentication** problem. I'd check:
1. **Token** — is our OAuth2 token expired, or is the token request itself failing? Is the server **clock** correct (clock skew makes valid tokens look expired)?
2. **Secret or key rotation** — did we or the partner **rotate** the client secret or API key? Is the new value deployed in the right environment?
3. **Client certificate** — for mutual TLS, has our certificate expired or did the partner change their truststore?
4. **Changes** — any recent deployment on our side (wrong config, UAT credentials in production)?
5. **Partner side** — did they change their auth server or scopes?

I'd test with \`curl -v\` and a fresh token, compare with the spec, and contact the partner with **request IDs and timestamps** if needed. If it were **403**, I'd focus on permissions, scopes or IP allowlisting instead.`,
  },
  {
    type: 'scenario',
    q: 'The message queue depth keeps growing and transactions are delayed. What do you do?',
    answer: `A growing queue means messages are **arriving faster than they are consumed**. I'd check:
1. **Consumers** — are they **connected and running**? A crashed or hung consumer is the most common cause. Restart it according to the runbook if safe.
2. **Downstream system** — is the system the consumer writes to (for example core banking) **slow or down**, or in **EOD**?
3. **Poison message** — is one bad message failing again and again and **blocking** the queue? It should go to the **DLQ**; check the retry/backout settings.
4. **Volume spike** — is it a peak like salary day? Then we may need **more consumer instances**.
5. **Broker health** — disk space, memory, connection limits.

Meanwhile I'd inform stakeholders about the delay, make sure messages are **persistent** so nothing is lost, and watch the queue **drain** after the fix. Then I'd review alert thresholds so we catch it earlier next time.`,
  },
  {
    type: 'scenario',
    q: 'A partner says they sent this morning\'s payment file, but our system did not process it. How do you investigate?',
    answer: `I'd follow the file's path step by step:
1. **Did it arrive?** Check the **SFTP server logs** and the inbound folder for the partner's login and the file name at that time. If there's no login, check **connectivity**: firewall, their source IP, our SSH key/host key, SFTP account locked or password expired.
2. **Right place, right name?** A wrong folder, file name or date pattern means our job won't pick it up.
3. **Did the job run?** Check the scheduler / batch job logs — did it run, fail or is it waiting?
4. **Was it rejected?** Validation errors: **duplicate** file (same batch number already processed), **record count or control total** doesn't match the trailer, format error, PGP decryption failed (key changed or expired).
5. **Was it partly processed?** Check the exception/reject file and the acknowledgement sent back.

Then I'd agree the fix with the partner — for example a corrected file with a **new batch number** — making sure we **don't process it twice**, and reconcile the results. If it's near the **cut-off time**, I'd inform operations early so they can manage customer impact.`,
  },
];
