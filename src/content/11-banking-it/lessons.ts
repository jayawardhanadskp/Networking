import type { Section } from '../types';

/*
 * General industry awareness only. Nothing here describes NSB's real systems,
 * vendors or architecture. Check official sources (bank, LankaPay, CBSL websites)
 * before quoting specific facts in the interview.
 */

export const sections: Section[] = [
  {
    id: 'cbs',
    title: 'What a core banking system does',
    analogy:
      'The core banking system is the bank\'s **central ledger and brain**. Every branch, ATM, mobile app and card is like a **window** into the same ledger. Whichever window a customer uses, the balance is the same.',
    body: `A **Core Banking System (CBS)** is the central software that runs the bank's main products in **real time** for all channels.

Typical functions (general):
- **Customer information (CIF)** — one customer record across all products, KYC data.
- **Accounts** — savings, current (CASA), **fixed deposits**, loans; interest calculation and posting.
- **Transactions** — deposits, withdrawals, transfers, standing orders, charges.
- **General ledger (GL)** — accounting entries for every transaction.
- **End-of-day (EOD) / batch** — interest accrual, date change, reports, statements; often runs at night.
- **Interfaces** to channels and systems: branch teller UI, **ATM switch / card system**, Internet & mobile banking, payment systems (e.g. LankaPay services, RTGS, SWIFT), AML/fraud systems, reporting/MIS, regulatory reporting.

Typical architecture: application servers + a large **relational database**, often clustered, with a **DR replica**; channels connect through **middleware / API gateways / ESB**. Core banking products are usually bought from **vendors** and customised.

Why it matters to IT admins: it is the **most critical system** — highest availability needs, strict change control, EOD windows, performance monitoring, backups and DR.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Core banking and its channels (generic)',
        width: 360,
        height: 260,
        nodes: [
          { id: 'cbs', label: 'Core banking', icon: 'bank', x: 180, y: 130, sub: 'CIF · accounts · GL', info: '**Core banking system**: the single source of truth for customer accounts and balances, updated in real time.' },
          { id: 'mw', label: 'Middleware / API', icon: 'lb', x: 180, y: 55, info: '**Integration layer** (API gateway, ESB): channels call standard services like "get balance" or "transfer" instead of talking to the CBS database directly.' },
          { id: 'br', label: 'Branch teller', icon: 'pc', x: 45, y: 55, info: 'Teller screens for deposits, withdrawals, account opening.' },
          { id: 'ib', label: 'Internet / mobile', icon: 'phone', x: 315, y: 55, info: 'Customer self-service channels in the DMZ, calling internal APIs.' },
          { id: 'atm', label: 'ATM / card switch', icon: 'atm', x: 45, y: 200, info: 'Card transactions from ATMs and POS reach the card system, which checks balances with the CBS.' },
          { id: 'pay', label: 'Payment systems', icon: 'globe', x: 315, y: 200, info: 'Interbank and international payments (e.g. national switch, RTGS, SWIFT).' },
          { id: 'db', label: 'CBS database', icon: 'db', x: 180, y: 225, info: 'Clustered relational database, replicated to the DR site.' },
        ],
        links: [
          { from: 'br', to: 'mw' },
          { from: 'ib', to: 'mw' },
          { from: 'mw', to: 'cbs' },
          { from: 'atm', to: 'cbs' },
          { from: 'pay', to: 'cbs' },
          { from: 'cbs', to: 'db' },
        ],
        steps: [
          { text: 'A teller posts a **cash deposit**. The request goes through the integration layer to the CBS, which updates the account and the GL in one transaction.', paths: [['br', 'mw', 'cbs', 'db']], packet: 'deposit' },
          { text: 'Seconds later the customer checks the balance on the **mobile app** — same CBS, same balance.', paths: [['ib', 'mw', 'cbs']], packet: 'balance?', tone: 'teal' },
          { text: 'The customer withdraws cash at an **ATM**. The card system asks the CBS to authorise and debit the account.', paths: [['atm', 'cbs', 'db']], packet: 'withdraw', tone: 'amber' },
          { text: 'At night, the **EOD batch** runs inside the CBS: interest accrual, statements, reports. Admins monitor it closely — a failed EOD can delay the next business day.', highlight: ['cbs', 'db'], tone: 'purple' },
        ],
      },
    ],
    bank: `Interview tip: you can say *"I understand the core banking system is the most critical application, so infrastructure supporting it needs high availability, careful change management around EOD, monitoring and tested DR."* Do not guess which vendor or product a specific bank uses.`,
    remember: [
      'CBS = central real-time system for **customers (CIF), accounts, transactions, GL** across all channels.',
      'Channels connect via **middleware/APIs**; **EOD batch** runs at night.',
      'Most critical system → HA, DR, strict change control, monitoring.',
    ],
    check: [
      {
        q: 'What is CIF in core banking?',
        options: ['Card Issuing Fee', 'Customer Information File — one record for the customer across products', 'Central Internet Firewall', 'Cheque Imaging Format'],
        answer: 1,
        explain: '**CIF** holds the customer\'s details (KYC) linked to all their accounts.',
      },
      {
        q: 'What is the end-of-day (EOD) process?',
        options: ['Turning off all servers at night', 'Batch jobs like interest accrual, date change, reports and statements', 'Closing the bank permanently', 'Clearing DNS caches'],
        answer: 1,
        explain: '**EOD** runs daily batch processing to close the business day.',
      },
    ],
  },
  {
    id: 'atm-flow',
    title: 'ATM switch and a card transaction',
    analogy:
      'The ATM switch is like a **telephone operator for card transactions**: it receives every request from ATMs, decides **who must answer** (our own bank or another bank), connects the call, and passes back "approved" or "declined".',
    body: `An **ATM switch** (part of a card management / payment switch system) connects **ATMs, POS terminals and card networks** to the bank's systems.

Key terms:
- **Acquirer** — the bank that owns the ATM/POS where the card is used.
- **Issuer** — the bank that issued the card (holds the customer's account).
- **On-us** — card and ATM belong to the same bank → the switch asks its own CBS.
- **Off-us** — card from another bank → the switch routes the request through a **network/scheme** (national switch or international scheme) to the issuer.

Security:
- PIN is encrypted in the ATM's **EPP** (encrypting PIN pad) and processed only inside **HSMs** — never in clear text.
- Messages use **ISO 8583** over encrypted links; ATMs have strict network isolation.
- **Reversals** handle failures (e.g. cash not dispensed → reverse the debit).`,
    visuals: [
      {
        kind: 'sequence',
        title: 'Off-us ATM withdrawal (generic flow)',
        actors: [
          { id: 'atm', label: 'ATM', icon: 'atm', sub: 'Bank A' },
          { id: 'sw', label: 'ATM switch', icon: 'card', sub: 'acquirer: Bank A' },
          { id: 'net', label: 'Network', icon: 'globe', sub: 'national / scheme' },
          { id: 'iss', label: 'Issuer host', icon: 'bank', sub: 'Bank B' },
        ],
        steps: [
          { from: 'atm', to: 'atm', label: 'card + PIN (EPP encrypts)', detail: 'A Bank B customer inserts their card at a Bank A ATM. The PIN is **encrypted inside the PIN pad (EPP)** immediately.', tone: 'slate' },
          { from: 'atm', to: 'sw', label: 'withdrawal request', detail: 'The ATM sends the request to Bank A\'s ATM switch over an encrypted link.', tone: 'blue' },
          { from: 'sw', to: 'net', label: 'ISO 8583 0200', detail: 'The card is **not** a Bank A card (**off-us**), so the switch (after PIN translation in an **HSM**) builds an ISO 8583 financial request (MTI 0200) and routes it to the network.', tone: 'purple' },
          { from: 'net', to: 'iss', label: 'route to issuer', detail: 'The network routes the request to **Bank B**, the issuer.', tone: 'purple' },
          { from: 'iss', to: 'net', label: '0210 · DE39 = 00', detail: 'Bank B verifies PIN (HSM), checks the balance/limits in its systems and replies **approved** (response code **00**) — or e.g. 51 = insufficient funds.', tone: 'green' },
          { from: 'net', to: 'sw', label: 'approval', detail: 'The response returns to the acquirer\'s switch.', tone: 'green' },
          { from: 'sw', to: 'atm', label: 'dispense', detail: 'The ATM dispenses cash and prints a receipt. If the cash **fails to dispense**, a **reversal** (MTI 0400/0420) is sent so the customer is not debited.', tone: 'teal' },
        ],
      },
    ],
    bank: `"ATMs are down" can be: the ATM itself, its network link, the **ATM switch** application, the **HSM**, the link to the network/scheme, or the core banking system behind it. The network admin checks the links and firewalls; the card/ATM team checks the switch. On-us transactions working but off-us failing points to the **external network link**.`,
    remember: [
      '**Acquirer** = owns the ATM/POS; **issuer** = issued the card. **On-us** vs **off-us**.',
      'ATM switch routes card messages (ISO 8583) to own CBS or to the network/issuer.',
      'PINs: encrypted in the **EPP**, handled in **HSMs**. Failures → **reversal**.',
    ],
    check: [
      {
        q: 'A Bank B card is used at a Bank A ATM. Which bank is the acquirer?',
        options: ['Bank A', 'Bank B', 'The central bank', 'The card network'],
        answer: 0,
        explain: 'The **acquirer** owns the terminal (Bank A); Bank B is the issuer.',
      },
      {
        q: 'Where should PINs be decrypted/verified?',
        options: ['In the ATM switch application memory', 'Only inside a Hardware Security Module (HSM)', 'In the core banking database', 'In the branch PC'],
        answer: 1,
        explain: 'PIN processing happens inside tamper-resistant **HSMs**.',
      },
    ],
  },
  {
    id: 'iso8583',
    title: 'Card networks and ISO 8583',
    analogy:
      'ISO 8583 is like a **standard form** every bank fills in the same way: box 1 = message type, a checklist (bitmap) saying which boxes are filled, then boxes for card number, amount, time, terminal… Everyone can read the form.',
    body: `**Card networks / schemes** (e.g. Visa, Mastercard, UnionPay, American Express, and national schemes) connect issuers and acquirers worldwide and set the rules. The **four-party model**: cardholder, merchant (or ATM owner), **acquirer**, **issuer** — with the **scheme** in the middle.

**ISO 8583** is the standard **message format** for card transactions between ATMs/POS, switches and banks.
- **MTI (Message Type Indicator)** — 4 digits, e.g.:
  - **0100 / 0110** — authorisation request / response
  - **0200 / 0210** — financial request / response (e.g. ATM withdrawal)
  - **0400 / 0410** (and 0420) — reversal
  - **0800 / 0810** — network management (sign-on, echo test, key exchange)
- **Bitmap** — shows which data elements are present.
- **Data elements (DE)** — e.g. DE2 card number (PAN), DE3 processing code, DE4 amount, DE11 trace number (STAN), DE41 terminal ID, **DE39 response code** (00 approved, 51 insufficient funds, 55 incorrect PIN, 91 issuer unavailable).

**EMV chip cards** create a unique cryptogram per transaction (stops card cloning). **Tokenisation** replaces the real card number with a token (mobile wallets).`,
    visuals: [
      {
        kind: 'fields',
        title: 'An ISO 8583 message (simplified)',
        rows: [
          {
            label: 'Structure',
            fields: [
              { text: 'MTI', sub: '0200', tone: 'purple', w: 1 },
              { text: 'Bitmap', sub: 'which fields follow', tone: 'slate', w: 2 },
              { text: 'Data elements', sub: 'DE2, DE3, DE4, DE11, DE41…', tone: 'blue', w: 4 },
            ],
          },
          {
            label: 'Example data elements',
            fields: [
              { text: 'DE2', sub: 'PAN (card no.)', tone: 'amber' },
              { text: 'DE3', sub: 'processing code', tone: 'teal' },
              { text: 'DE4', sub: 'amount', tone: 'green' },
              { text: 'DE11', sub: 'STAN (trace)', tone: 'slate' },
              { text: 'DE39', sub: 'response code', tone: 'red' },
            ],
          },
          {
            label: 'Response codes (DE39)',
            fields: [
              { text: '00', sub: 'approved', tone: 'green' },
              { text: '51', sub: 'insufficient funds', tone: 'amber' },
              { text: '55', sub: 'incorrect PIN', tone: 'amber' },
              { text: '91', sub: 'issuer unavailable', tone: 'red' },
            ],
          },
        ],
        note: 'Many networks use their own variants of ISO 8583, but the idea (MTI + bitmap + data elements) is the same.',
      },
    ],
    bank: `As an admin you don't need to decode ISO 8583 by hand, but knowing the basics helps when the card team says "we are getting **response code 91** from the network" (issuer/switch unavailable → check links!) or "**0800 echo** messages are failing" (the network management heartbeat → connectivity problem).`,
    remember: [
      'Four-party model: cardholder, merchant/ATM, **acquirer**, **issuer** (+ scheme).',
      'ISO 8583 = **MTI + bitmap + data elements**. 0100 auth, **0200 financial**, 0400 reversal, **0800 network mgmt**.',
      'DE39 response: **00 approved**, 51 no funds, 55 wrong PIN, 91 issuer down. EMV chip + tokenisation reduce fraud.',
    ],
    check: [
      {
        q: 'What does ISO 8583 define?',
        options: ['A Wi-Fi standard', 'A message format for card transactions', 'An IP addressing scheme', 'A backup method'],
        answer: 1,
        explain: '**ISO 8583** is the financial card transaction message standard.',
      },
      {
        q: 'Which MTI is used for network management messages like echo tests?',
        options: ['0100', '0200', '0400', '0800'],
        answer: 3,
        explain: '**0800/0810** = network management (sign-on, echo, key exchange).',
      },
    ],
  },
  {
    id: 'swift',
    title: 'SWIFT: international payment messages',
    analogy:
      'SWIFT is like a **secure international courier for payment instructions** between banks. It carries the **letter that says "pay this person"** — it does not carry the money itself. The money moves through the banks\' accounts with each other.',
    body: `**SWIFT** is a global, secure **messaging network** used by banks to send financial messages — mainly for **cross-border payments**.

- SWIFT **does not hold or move money**; it sends **instructions**. Settlement happens through **correspondent bank accounts** (nostro/vostro).
- Each bank has a **BIC** (Bank Identifier Code, also called SWIFT code): 8 or 11 characters — **4** bank code + **2** country code + **2** location + optional **3** branch.
- Old message format: **MT** (e.g. **MT103** = customer credit transfer). New standard: **ISO 20022** "MX" messages (e.g. **pacs.008**), which carry richer structured data. The cross-border migration to ISO 20022 has been running for years (the MT/MX coexistence period for cross-border payments ended in November 2025).
- **SWIFT Customer Security Programme (CSP)**: banks must implement and attest to security controls (CSCF) for their SWIFT environment — isolated secure zone, MFA, monitoring, etc.

Lesson from history: the **2016 Bangladesh Bank heist** — attackers compromised the bank's SWIFT environment and sent fraudulent messages. That is why SWIFT systems are **heavily isolated and monitored**.`,
    visuals: [
      {
        kind: 'fields',
        title: 'BIC format (example, not a real bank)',
        rows: [
          {
            label: 'ABCDLKLXXXX',
            fields: [
              { text: 'ABCD', sub: 'bank code', tone: 'blue', w: 4 },
              { text: 'LK', sub: 'country (Sri Lanka)', tone: 'green', w: 2 },
              { text: 'LX', sub: 'location', tone: 'amber', w: 2 },
              { text: 'XXX', sub: 'branch (optional; XXX = head office)', tone: 'slate', w: 3 },
            ],
          },
        ],
      },
      {
        kind: 'sequence',
        title: 'A customer sends money abroad (simplified)',
        actors: [
          { id: 'cust', label: 'Customer', icon: 'user' },
          { id: 'a', label: 'Sending bank', icon: 'bank', sub: 'Sri Lanka' },
          { id: 'sw', label: 'SWIFT', icon: 'globe', sub: 'messages' },
          { id: 'b', label: 'Receiving bank', icon: 'bank', sub: 'abroad' },
        ],
        steps: [
          { from: 'cust', to: 'a', label: 'transfer request', detail: 'The customer asks the bank to send USD to a beneficiary abroad. The bank checks KYC/AML and sanctions screening.', tone: 'blue' },
          { from: 'a', to: 'sw', label: 'MT103 / pacs.008', detail: 'The bank\'s payment system creates a payment message (MT103 or ISO 20022 pacs.008) from its secure SWIFT zone, signed and authorised (maker-checker).', tone: 'purple' },
          { from: 'sw', to: 'b', label: 'secure delivery', detail: 'SWIFT delivers the message securely to the receiving (or correspondent) bank, identified by its **BIC**.', tone: 'purple' },
          { from: 'b', to: 'b', label: 'settle via nostro', detail: 'The money moves through **correspondent accounts** (nostro/vostro); the receiving bank credits the beneficiary.', tone: 'green' },
        ],
      },
    ],
    bank: `In a bank, the SWIFT environment is a **separate, highly secured zone**: dedicated jump servers, MFA, strict firewall rules, no Internet browsing, monitoring and yearly **CSP attestation**. Admins supporting it follow very strict change and access control.`,
    remember: [
      'SWIFT = secure **messaging** network between banks; it **does not move money** (correspondent accounts do).',
      '**BIC**: 4 bank + 2 country + 2 location (+3 branch). MT103 → **ISO 20022** (pacs.008).',
      '**SWIFT CSP** security controls; Bangladesh Bank heist (2016) = why SWIFT zones are isolated.',
    ],
    check: [
      {
        q: 'Does SWIFT transfer the actual money between banks?',
        options: ['Yes, through its own accounts', 'No — it sends payment messages; money settles through correspondent accounts', 'Only for amounts below USD 1,000', 'Only for local payments'],
        answer: 1,
        explain: 'SWIFT is a **messaging** network.',
      },
      {
        q: 'In a BIC like ABCDLKLX, what does "LK" represent?',
        options: ['Bank code', 'Country code (Sri Lanka)', 'Branch code', 'Currency'],
        answer: 1,
        explain: 'Characters 5–6 are the **ISO country code**.',
      },
    ],
  },
  {
    id: 'lankapay',
    title: 'Sri Lanka\'s payment network: LankaPay (general awareness)',
    analogy:
      'Instead of every bank building a separate road to every other bank (hundreds of roads), they all connect to **one national highway interchange** (LankaPay). One connection reaches all participating banks.',
    body: `**LankaClear (Pvt) Ltd**, operating under the **LankaPay** brand, runs Sri Lanka's national retail payment infrastructure, connecting banks and other financial institutions. At a **general level**, its services include:

- **Cheque clearing** — cheque image clearing (CITS) instead of moving paper.
- **SLIPS** — Sri Lanka Interbank Payment System for **batch** electronic transfers (e.g. salaries).
- **CEFTS** — Common Electronic Fund Transfer Switch for **real-time** interbank transfers (24×7).
- **Common ATM Switch (CAS)** — lets customers use **other banks' ATMs** (shared ATM network).
- **LankaPay JustPay** (account-based mobile payments) and **LankaQR** (national QR payment standard), and other card/POS/mobile switching services.

**High-value payments** settle through the **RTGS** system operated by the **Central Bank of Sri Lanka (CBSL)**, which is also the regulator of payment systems and banks.

⚠️ This is general awareness. Services and names change — check **LankaPay's and CBSL's official websites** before the interview, and do not claim details about how any specific bank connects.`,
    visuals: [
      {
        kind: 'topology',
        title: 'One national switch instead of many bank-to-bank links',
        width: 360,
        height: 230,
        nodes: [
          { id: 'lp', label: 'National switch', icon: 'switch', x: 180, y: 110, sub: 'e.g. LankaPay', info: 'A **central switch**: each bank connects once and can reach all other participants (ATM sharing, real-time transfers, QR, etc.).' },
          { id: 'a', label: 'Bank A', icon: 'bank', x: 50, y: 40, info: 'Participant bank.' },
          { id: 'b', label: 'Bank B', icon: 'bank', x: 310, y: 40, info: 'Participant bank.' },
          { id: 'c', label: 'Bank C', icon: 'bank', x: 50, y: 180, info: 'Participant bank.' },
          { id: 'd', label: 'Bank D', icon: 'bank', x: 310, y: 180, info: 'Participant bank.' },
          { id: 'cb', label: 'Central bank', icon: 'building', x: 180, y: 30, sub: 'RTGS / settlement', info: 'The **central bank** operates RTGS and the settlement accounts where banks settle their net positions; it also regulates payment systems.' },
        ],
        links: [
          { from: 'a', to: 'lp' },
          { from: 'b', to: 'lp' },
          { from: 'c', to: 'lp' },
          { from: 'd', to: 'lp' },
          { from: 'lp', to: 'cb', style: 'dashed', label: 'settlement' },
        ],
        steps: [
          { text: '**Real-time transfer**: a Bank A customer sends money to a Bank D account from the mobile app. The request goes through the national switch to Bank D, which credits the account within seconds.', paths: [['a', 'lp', 'd']], packet: 'transfer', tone: 'green' },
          { text: '**Shared ATM**: a Bank C customer withdraws cash at a Bank B ATM; the switch routes the request to Bank C (issuer) for approval.', paths: [['b', 'lp', 'c']], packet: 'ATM', tone: 'amber' },
          { text: '**Settlement**: banks owe each other money from thousands of transactions; net positions are settled through accounts at the **central bank**.', paths: [['lp', 'cb']], packet: 'net settle', tone: 'purple' },
        ],
      },
    ],
    bank: `Payment interfaces like these are **critical** for any bank: if the link to the national switch is down, customers cannot do interbank transfers or use other banks' ATMs. They need **redundant, encrypted links**, monitoring, strict change control and certificates/keys managed carefully.`,
    remember: [
      '**LankaPay** (LankaClear) = national payment network: cheque clearing (CITS), **SLIPS** (batch), **CEFTS** (real-time), **Common ATM Switch**, JustPay, LankaQR.',
      '**RTGS** for high-value payments is operated by the **CBSL** (also the regulator).',
      'General awareness only — verify on official websites; never invent details.',
    ],
    check: [
      {
        q: 'What is the main benefit of a national shared payment switch?',
        options: ['Banks no longer need networks', 'Each bank connects once and can reach all other participating banks', 'It replaces core banking systems', 'It removes the need for security'],
        answer: 1,
        explain: 'A **central switch** avoids many bank-to-bank connections.',
      },
      {
        q: 'Which organisation operates Sri Lanka\'s RTGS system and regulates banks?',
        options: ['LankaPay', 'The Central Bank of Sri Lanka (CBSL)', 'SWIFT', 'A card scheme'],
        answer: 1,
        explain: 'The **CBSL** operates RTGS and is the regulator.',
      },
    ],
  },
  {
    id: 'payment-security',
    title: 'Integration and payment security',
    analogy:
      'Different departments speak different "languages". The **integration layer** is a **translator and reception desk**: everyone talks to it in a standard way, and it talks to the core. The **HSM** is the bank\'s **strongest safe for keys** — even admins cannot open it.',
    body: `**Integration / middleware**
- **API gateway** — single, secured entry point for APIs (authentication, rate limiting, logging).
- **ESB / middleware** — routes and transforms messages between systems (CBS, cards, payments, CRM).
- **Message queues** — reliable asynchronous delivery (if a system is busy, messages wait).
- As a developer you already know **REST APIs, JSON, OAuth/JWT** — this is a direct bridge to bank integration work.

**Payment security building blocks**
- **HSM (Hardware Security Module)** — tamper-resistant device that stores cryptographic keys and does PIN, card and key operations. Keys never leave it in clear text.
- **EMV chip** — dynamic cryptograms; prevents cloning (vs magnetic stripe).
- **Tokenisation** — replace the card number with a token.
- **3-D Secure** — extra verification (e.g. OTP) for online card payments.
- **Fraud monitoring** — real-time rules/ML on transactions (unusual amounts, locations).
- **AML** (anti-money laundering) & sanctions screening.
- Customer side: **2FA/OTP** for Internet banking, device binding for mobile apps, transaction limits and alerts (SMS/push).`,
    visuals: [
      {
        kind: 'topology',
        title: 'Mobile transfer through the integration layer (generic)',
        width: 360,
        height: 220,
        nodes: [
          { id: 'app', label: 'Mobile app', icon: 'phone', x: 40, y: 110, info: 'Customer app with device binding and OTP/biometric confirmation.' },
          { id: 'gw', label: 'API gateway', icon: 'lb', x: 130, y: 110, sub: 'DMZ', info: 'Checks the access token (OAuth2/JWT), rate limits, logs, forwards to internal services.' },
          { id: 'fraud', label: 'Fraud engine', icon: 'shield', x: 225, y: 40, info: 'Scores the transaction in real time: new device? unusual amount? Can block or ask for more verification.' },
          { id: 'mw', label: 'Middleware', icon: 'switch', x: 225, y: 110, info: 'Orchestrates the steps and translates messages for the core.' },
          { id: 'cbs', label: 'Core banking', icon: 'bank', x: 320, y: 110, info: 'Debits and credits the accounts (ACID transaction).' },
          { id: 'hsm', label: 'HSM', icon: 'lock', x: 225, y: 185, info: 'Signs/verifies and protects keys used for tokens, PINs and message security.' },
        ],
        links: [
          { from: 'app', to: 'gw', label: 'TLS' },
          { from: 'gw', to: 'mw' },
          { from: 'mw', to: 'fraud', style: 'dashed' },
          { from: 'mw', to: 'cbs' },
          { from: 'mw', to: 'hsm', style: 'dashed' },
        ],
        steps: [
          { text: 'The customer confirms a transfer (biometric/OTP). The app calls the **API gateway** over TLS with a valid token.', paths: [['app', 'gw']], packet: 'POST /transfer' },
          { text: 'Middleware asks the **fraud engine** to score it — new device + big amount → step-up verification; normal → continue.', paths: [['gw', 'mw', 'fraud']], packet: 'score?', tone: 'amber' },
          { text: 'Cryptographic operations use keys inside the **HSM**.', paths: [['mw', 'hsm']], packet: 'sign', tone: 'purple' },
          { text: 'The **core banking** system performs the debit/credit in one ACID transaction; the customer gets an SMS/push alert.', paths: [['mw', 'cbs']], packet: 'post txn', tone: 'green' },
        ],
      },
    ],
    bank: `This is where your **developer background shines**: you understand APIs, authentication tokens, TLS, logging and failure handling. In an admin role, you would support the **infrastructure** behind them — gateways, load balancers, certificates, HSM connectivity, monitoring and DR.`,
    remember: [
      'Integration: **API gateway**, ESB/middleware, message queues.',
      '**HSM** protects keys and does PIN/crypto operations; **EMV**, **tokenisation**, 3-D Secure, fraud monitoring, AML.',
      'Your REST/OAuth/TLS developer skills map directly to bank integration infrastructure.',
    ],
    check: [
      {
        q: 'What is the main job of an HSM?',
        options: ['Route network traffic', 'Securely store cryptographic keys and perform crypto operations in tamper-resistant hardware', 'Back up databases', 'Assign IP addresses'],
        answer: 1,
        explain: 'An **HSM** keeps keys safe and performs PIN/crypto operations.',
      },
      {
        q: 'Why are EMV chip cards safer than magnetic stripe cards?',
        options: ['They are thicker', 'They generate a unique cryptogram per transaction, making cloning very hard', 'They have no PIN', 'They work without a network'],
        answer: 1,
        explain: '**Dynamic cryptograms** stop copied data from being reused.',
      },
    ],
  },
];
