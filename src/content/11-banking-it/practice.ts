import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'What is the main role of a core banking system?', options: ['Email service', 'Central real-time processing of customer accounts and transactions for all channels', 'Only ATM cash management', 'Network routing'], answer: 1, explain: 'The **CBS** is the central ledger for accounts and transactions.' },
  { q: 'In card payments, the bank that issued the customer\'s card is the…', options: ['Acquirer', 'Issuer', 'Scheme', 'Merchant'], answer: 1, explain: 'The **issuer** holds the cardholder\'s account.' },
  { q: 'An ATM transaction where the card and ATM belong to the same bank is called…', options: ['Off-us', 'On-us', 'Cross-border', 'Chargeback'], answer: 1, explain: '**On-us** — handled within the same bank.' },
  { q: 'Which ISO 8583 MTI is a financial request (e.g. ATM withdrawal)?', options: ['0100', '0200', '0800', '0400'], answer: 1, explain: '**0200** financial request; 0210 response.' },
  { q: 'ISO 8583 response code 00 means…', options: ['Declined', 'Approved', 'Incorrect PIN', 'System error'], answer: 1, explain: '**00 = approved**. 51 = insufficient funds, 55 = incorrect PIN, 91 = issuer unavailable.' },
  { q: 'If cash fails to dispense after approval, which message type corrects it?', options: ['Network management', 'Reversal', 'Authorisation', 'Balance enquiry'], answer: 1, explain: 'A **reversal** (0400/0420) undoes the debit.' },
  { q: 'What does SWIFT mainly provide?', options: ['A currency', 'A secure messaging network for financial institutions', 'An ATM network in Sri Lanka', 'A core banking product'], answer: 1, explain: 'SWIFT is **messaging**, not money movement.' },
  { q: 'Which message standard is replacing SWIFT MT for cross-border payments?', options: ['ISO 8583', 'ISO 20022', 'ISO 27001', 'ISO 9001'], answer: 1, explain: '**ISO 20022** (MX messages, e.g. pacs.008).' },
  { q: 'Which LankaPay service is used for real-time interbank fund transfers?', options: ['CITS', 'SLIPS', 'CEFTS', 'RTGS'], answer: 2, explain: '**CEFTS** = Common Electronic Fund Transfer Switch (real-time). SLIPS is batch; CITS is cheques.' },
  { q: 'What does the Common ATM Switch allow?', options: ['Only the bank\'s own cards at its ATMs', 'Customers to use other participating banks\' ATMs', 'Card printing', 'Cheque scanning'], answer: 1, explain: 'A **shared ATM network** between banks.' },
  { q: 'What is tokenisation?', options: ['Encrypting the whole database', 'Replacing a card number with a substitute value (token)', 'Printing tokens for queues', 'A type of RAID'], answer: 1, explain: 'A **token** stands in for the real card number.' },
  { q: 'Why was the 2016 Bangladesh Bank incident important for bank IT?', options: ['It showed DNS was weak', 'Attackers abused the bank\'s SWIFT environment to send fraudulent payment messages — SWIFT zones must be isolated and monitored', 'It was a power failure', 'It was about Wi-Fi'], answer: 1, explain: 'It led to stronger controls like the **SWIFT CSP**.' },
];

export const flashcards: Flashcard[] = [
  { front: 'Core banking system (CBS)', back: 'Central real-time system for customers (CIF), accounts, transactions, GL — shared by all channels.', tag: 'definition' },
  { front: 'EOD', back: '**End of Day**: nightly batch (interest, date change, statements, reports) in the CBS.', tag: 'acronym' },
  { front: 'Acquirer vs issuer', back: '**Acquirer**: owns the ATM/POS. **Issuer**: issued the card / holds the account.', tag: 'definition' },
  { front: 'On-us vs off-us', back: '**On-us**: card and terminal from the same bank. **Off-us**: card from another bank → routed via network.', tag: 'definition' },
  { front: 'ISO 8583', back: 'Card transaction message standard: **MTI + bitmap + data elements**.', tag: 'definition' },
  { front: 'Key ISO 8583 MTIs', back: '0100/0110 authorisation · 0200/0210 financial · 0400/0410 reversal · 0800/0810 network management.', tag: 'fact' },
  { front: 'DE39 response codes', back: '00 approved · 05 do not honour · 51 insufficient funds · 55 incorrect PIN · 91 issuer/switch unavailable.', tag: 'fact' },
  { front: 'HSM', back: '**Hardware Security Module**: tamper-resistant device for keys and PIN/crypto operations.', tag: 'acronym' },
  { front: 'SWIFT & BIC', back: 'Secure inter-bank messaging (does not move money). **BIC** = 4 bank + 2 country + 2 location (+3 branch).', tag: 'definition' },
  { front: 'MT103 / ISO 20022', back: '**MT103** = customer credit transfer (old MT format). **ISO 20022** MX (e.g. pacs.008) = new richer standard.', tag: 'fact' },
  { front: 'LankaPay services (general)', back: 'Cheque clearing (CITS), **SLIPS** (batch), **CEFTS** (real-time), **Common ATM Switch**, JustPay, LankaQR.', tag: 'fact' },
  { front: 'RTGS', back: '**Real-Time Gross Settlement**: high-value interbank payments settled individually in real time — operated by the central bank (CBSL).', tag: 'acronym' },
  { front: 'EMV', back: 'Chip card standard: dynamic cryptogram per transaction → prevents cloning.', tag: 'acronym' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'What is a core banking system and why is it so important?',
    answer: `A core banking system is the **central, real-time system** that manages customers, accounts — savings, current, fixed deposits, loans — and all transactions, and keeps the general ledger. Every channel — branches, ATMs, Internet and mobile banking, cards and payment systems — connects to it, so customers see the same balance everywhere. It also runs end-of-day batch processing.

Because the whole bank depends on it, the infrastructure behind it needs **high availability, clustering, a DR site with replication, strong security, careful change management** (especially around EOD) and continuous monitoring.`,
    tips: ['Do NOT guess which CBS product NSB uses. Speak in general terms.'],
  },
  {
    type: 'technical',
    q: 'Explain what happens when a customer withdraws cash from another bank\'s ATM.',
    answer: `1. The customer inserts the card and enters the PIN; the **encrypting PIN pad** encrypts the PIN immediately.
2. The ATM sends the request to the **acquiring bank's ATM switch**.
3. The switch sees it is an **off-us** card, translates the PIN block in an **HSM**, and sends an **ISO 8583** financial request (0200) through the network — for example the national shared ATM switch — to the **issuing bank**.
4. The issuer verifies the PIN and the account balance and replies — **00 = approved**, or a decline code like 51 for insufficient funds.
5. The response comes back, the ATM dispenses the cash and prints a receipt. If the cash fails to dispense, a **reversal** is sent so the customer is not charged.`,
  },
  {
    type: 'technical',
    q: 'What is SWIFT?',
    answer: `SWIFT is a global **secure messaging network** that banks use to exchange financial messages, mainly for **cross-border payments**. It doesn't move money itself — it carries payment **instructions**, and the money settles through correspondent (nostro/vostro) accounts. Banks are identified by their **BIC**. The traditional message format is MT, such as MT103 for customer transfers, and the industry has moved to **ISO 20022** messages, which carry richer data.

SWIFT environments are high-value targets — the 2016 Bangladesh Bank heist showed that — so banks must isolate them, use MFA, monitor them closely, and comply with the **SWIFT Customer Security Programme**.`,
  },
  {
    type: 'technical',
    q: 'What do you know about LankaPay?',
    answer: `LankaPay, operated by LankaClear, is Sri Lanka's **national payment network** that connects banks and financial institutions. At a general level, it provides cheque image clearing, **SLIPS** for batch interbank transfers, **CEFTS** for real-time interbank transfers, the **Common ATM Switch** that lets customers use other banks' ATMs, and services like JustPay and LankaQR. High-value payments settle through the **RTGS** system operated by the Central Bank of Sri Lanka.

For a bank's IT team, these connections are critical — they need redundant, secure links, monitoring and careful change control.`,
    tips: ['Check LankaPay\'s official website the day before and update this answer in your own words.'],
  },
  {
    type: 'technical',
    q: 'What is ISO 8583?',
    answer: `ISO 8583 is the standard **message format for card transactions** between ATMs, POS terminals, switches, networks and banks. Each message has a **Message Type Indicator** — for example 0100 for authorisation, 0200 for a financial request like a withdrawal, 0400 for a reversal and 0800 for network management like echo tests — then a **bitmap** that shows which data elements are present, and the **data elements**, such as the card number, amount, trace number, terminal ID and the **response code** (00 approved, 51 insufficient funds, 91 issuer unavailable).`,
  },
  {
    type: 'technical',
    q: 'What is an HSM and why do banks use it?',
    answer: `A **Hardware Security Module** is a tamper-resistant hardware device that **stores cryptographic keys** and performs cryptographic operations inside itself — keys never leave it in clear text. Banks use HSMs for **PIN verification and translation**, card verification values, EMV cryptograms, key management for ATMs and payment networks, and signing. This is required by card scheme and PCI rules. HSMs are usually deployed in redundant pairs and their connectivity is monitored, because if the HSM is unreachable, card transactions fail.`,
  },
  {
    type: 'scenario',
    q: 'On-us ATM transactions work, but customers of other banks cannot withdraw at your ATMs. Where would you look?',
    answer: `Because on-us works, the ATMs, their network links and our own switch-to-core path are fine. The problem is likely on the **off-us path**:
1. The **link to the external network** (national switch / card scheme): is the circuit/VPN up? Any firewall changes?
2. **Network management messages** (0800 echo/sign-on) — is our switch signed on to the network?
3. **Response codes** in the switch logs — e.g. 91 (issuer/switch unavailable) or key-related errors (HSM/key exchange issues).
4. Contact the network operator's support to check their side.
I would work with the card/ATM team, keep the incident ticket updated, and inform the service desk so branches can tell customers.`,
  },
];
