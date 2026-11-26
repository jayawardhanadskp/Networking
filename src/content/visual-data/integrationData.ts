/**
 * Data for the System Integration visuals.
 * General industry picture only — NOT a description of NSB's real systems or vendors.
 */
import type { SequenceSpec, Tone } from '../types';

/* ---------- Integration map: core banking in the centre ---------- */
export type IntegrationMode = 'realtime' | 'batch';

export interface IntegrationSystem {
  id: string;
  label: string; // short label for the diagram
  emoji: string;
  name: string; // full name for the detail panel
  modes: IntegrationMode[];
  tone: Tone;
  what: string;
  how: string;
  security: string;
  watch: string;
}

export const integrationSystems: IntegrationSystem[] = [
  {
    id: 'digital', label: 'Mobile / IB', emoji: '📱', name: 'Internet & mobile banking', modes: ['realtime'], tone: 'blue',
    what: 'Customer self-service: balance, transfers, bill payments, statements.',
    how: '**Real-time REST/JSON APIs**. The app servers sit in the **DMZ** and call internal services through an **API gateway / middleware**, never the core banking database directly.',
    security: 'TLS, OAuth2/JWT tokens, customer MFA/OTP, rate limiting, WAF.',
    watch: 'API latency and error rate (HTTP 5xx), gateway health, token service, certificate expiry.',
  },
  {
    id: 'atm', label: 'ATM switch', emoji: '🏧', name: 'ATM switch', modes: ['realtime'], tone: 'amber',
    what: 'Receives every ATM request and decides: our own card (**on-us**) → ask our core banking; another bank\'s card (**off-us**) → send to the network.',
    how: 'ATMs usually talk to the switch with ATM protocols (e.g. NDC/DDC). The switch converts to **ISO 8583** messages for core banking and networks.',
    security: 'Encrypted links, PINs only processed in an **HSM**, ATM network isolated in its own VLAN/zone.',
    watch: 'Switch ↔ CBS link, approval rate, response codes (e.g. 91), reversals, HSM reachability.',
  },
  {
    id: 'cards', label: 'Cards', emoji: '💳', name: 'Card management & card networks', modes: ['realtime', 'batch'], tone: 'pink',
    what: 'Debit/credit card records, limits, card status, POS/e-commerce authorisations through international card schemes.',
    how: '**ISO 8583** online authorisations in real time + **daily clearing and settlement files** from the schemes.',
    security: 'PCI DSS controls, HSM for keys/PINs, tokenisation, no full card numbers in logs.',
    watch: 'Authorisation response times, scheme link status, settlement file arrival and processing.',
  },
  {
    id: 'lankapay', label: 'LankaPay', emoji: '🔁', name: 'LankaPay (national payment network)', modes: ['realtime', 'batch'], tone: 'teal',
    what: 'Sri Lanka\'s national payment network, operated by LankaClear: e.g. **CEFTS** (real-time transfers), **SLIPS** (batch transfers), cheque image clearing (CITS), the **Common ATM Switch**, JustPay, LankaQR.',
    how: 'A mix of **real-time messages** and **batch files** over dedicated, secured links. Each service has its own interface specification.',
    security: 'Dedicated/encrypted links, certificates, strict firewall rules, change control with the operator.',
    watch: 'Link status, real-time transaction failures, batch cut-off times, daily settlement/reconciliation.',
  },
  {
    id: 'swift', label: 'SWIFT', emoji: '🌍', name: 'SWIFT (cross-border messaging)', modes: ['realtime', 'batch'], tone: 'indigo',
    what: 'Secure messaging between banks worldwide, mainly for **cross-border payments** and statements. It carries instructions; it does not move money itself.',
    how: 'A SWIFT messaging interface in an **isolated secure zone**; payment systems send messages to it. Formats: **ISO 20022 (MX)**, older **MT** messages.',
    security: 'SWIFT Customer Security Programme (CSP) controls: isolation, MFA, least privilege, monitoring.',
    watch: 'Message queues and acknowledgements (ACK/NAK), connectivity, unusual message activity.',
  },
  {
    id: 'cbsl', label: 'CBSL', emoji: '🏛️', name: 'Central Bank (CBSL) reporting & RTGS', modes: ['batch', 'realtime'], tone: 'slate',
    what: 'Regulatory returns and statistics to the Central Bank of Sri Lanka; high-value payments through the **RTGS** system that CBSL operates; reports to the Financial Intelligence Unit (FIU).',
    how: 'Mostly **scheduled reports / files** generated from banking data (often via ETL), submitted through secure channels; RTGS uses real-time payment messages.',
    security: 'Encrypted transfer, restricted access, maker-checker approvals, audit trail.',
    watch: 'Report deadlines, file generation jobs, submission acknowledgements.',
  },
  {
    id: 'crib', label: 'CRIB', emoji: '📊', name: 'Credit bureau (CRIB)', modes: ['batch', 'realtime'], tone: 'purple',
    what: 'The Credit Information Bureau of Sri Lanka. Banks **submit** borrowers\' credit data and **request** credit reports before giving loans.',
    how: 'Periodic **data submission files** + **online enquiries** from loan officers / loan system.',
    security: 'Sensitive personal data: encryption, access only for authorised staff, logging of every enquiry.',
    watch: 'Submission jobs and rejections (format errors), enquiry service availability.',
  },
  {
    id: 'bills', label: 'Bill pay', emoji: '🧾', name: 'Bill payment partners', modes: ['realtime', 'batch'], tone: 'green',
    what: 'Utility, telecom, insurance and other billers. Customers pay bills at branches or in digital channels.',
    how: 'Real-time **APIs** (validate account → pay → confirmation), sometimes through an aggregator, plus a **daily reconciliation file**.',
    security: 'TLS/mutual TLS, API keys or OAuth2, IP whitelisting, unique payment references.',
    watch: 'Partner API timeouts, failed payments, daily reconciliation differences.',
  },
  {
    id: 'pg', label: 'Gateways', emoji: '🛒', name: 'Payment gateways (e-commerce)', modes: ['realtime'], tone: 'red',
    what: 'Online card or account payments for merchants and e-commerce sites.',
    how: '**REST APIs** with redirects and callbacks (webhooks); card payments go through card networks with 3-D Secure.',
    security: 'TLS, signed requests/callbacks, PCI DSS, fraud checks.',
    watch: 'Callback failures, payment status mismatches, latency.',
  },
  {
    id: 'loans', label: 'Loans', emoji: '🏠', name: 'Loan origination system', modes: ['realtime'], tone: 'amber',
    what: 'Loan applications, approval workflow, documents. Approved loans become loan accounts in core banking.',
    how: '**APIs or middleware services** to create customers/loan accounts in CBS; pulls credit reports from CRIB.',
    security: 'Role-based access, maker-checker approvals, audit logs.',
    watch: 'Account-creation failures, data mismatches between the two systems.',
  },
  {
    id: 'aml', label: 'AML / Fraud', emoji: '🕵️', name: 'AML & fraud monitoring', modes: ['realtime', 'batch'], tone: 'red',
    what: 'Screens customers and transactions against sanctions lists and rules; raises alerts; supports suspicious transaction reports.',
    how: 'Receives transactions **in real time** (fraud) or as **daily batches** (AML), often from a message queue or ETL.',
    security: 'Highly confidential data; strict access; tamper-proof logs.',
    watch: 'Feeds arriving on time and complete — a missing feed means missed alerts.',
  },
  {
    id: 'hr', label: 'HR / Payroll', emoji: '👥', name: 'HR & payroll system', modes: ['batch'], tone: 'teal',
    what: 'Staff records and salaries.',
    how: '**Salary file** uploaded/transferred to core banking to credit staff accounts; joiner/mover/leaver events can drive **AD account** changes.',
    security: 'Encrypted files (e.g. SFTP + PGP), maker-checker, file integrity checks (hash/control totals).',
    watch: 'File arrival before the cut-off, control totals match, rejected records.',
  },
  {
    id: 'ad', label: 'AD / LDAP', emoji: '🔑', name: 'Active Directory / LDAP', modes: ['realtime'], tone: 'blue',
    what: 'Central staff identity: one username/password, groups and roles for internal applications (single sign-on).',
    how: 'Applications authenticate users with **LDAP/LDAPS**, **Kerberos** or SSO protocols (SAML/OIDC) backed by AD.',
    security: 'LDAPS (636) not plain LDAP, service accounts with least privilege, MFA for admins.',
    watch: 'Domain controller availability, service account expiry/lockouts, LDAPS certificate expiry.',
  },
  {
    id: 'dwh', label: 'Data / MIS', emoji: '📈', name: 'Data warehouse & MIS reporting', modes: ['batch'], tone: 'purple',
    what: 'Management reports, analytics and regulatory report preparation.',
    how: '**ETL** jobs at night: extract from CBS and other systems → transform → load into the warehouse.',
    security: 'Mask/restrict personal data, access by role, secure the ETL service accounts.',
    watch: 'ETL job success, run time (must finish before business hours), row counts.',
  },
];

/* ---------- MTI decoder (ISO 8583:1987 meanings) ---------- */
export const mtiDigits: { title: string; values: Record<string, string> }[] = [
  { title: 'Version', values: { '0': 'ISO 8583:1987 (most common)', '1': 'ISO 8583:1993', '2': 'ISO 8583:2003' } },
  {
    title: 'Message class',
    values: { '1': 'Authorisation', '2': 'Financial', '3': 'File action', '4': 'Reversal / chargeback', '5': 'Reconciliation', '6': 'Administrative', '7': 'Fee collection', '8': 'Network management' },
  },
  {
    title: 'Function',
    values: { '0': 'Request', '1': 'Request response', '2': 'Advice', '3': 'Advice response', '4': 'Notification', '5': 'Notification acknowledgement' },
  },
  { title: 'Origin', values: { '0': 'Acquirer', '1': 'Acquirer repeat', '2': 'Issuer', '3': 'Issuer repeat', '4': 'Other', '5': 'Other repeat' } },
];

export const mtiExamples: { mti: string; name: string; use: string }[] = [
  { mti: '0100', name: 'Authorisation request', use: 'Ask the issuer to **approve and hold** funds, no money moves yet — e.g. a card purchase or a hotel pre-authorisation.' },
  { mti: '0110', name: 'Authorisation response', use: 'Issuer\'s answer to 0100. **DE39** carries the result (00 = approved).' },
  { mti: '0200', name: 'Financial request', use: 'A transaction that **moves money** now — e.g. an **ATM cash withdrawal**.' },
  { mti: '0210', name: 'Financial response', use: 'Issuer\'s answer to 0200: approved (00) or declined (e.g. 51 insufficient funds, 55 incorrect PIN).' },
  { mti: '0220', name: 'Financial advice', use: 'Tells the issuer about a transaction that **already happened** (e.g. approved offline) — the issuer cannot refuse, only record it.' },
  { mti: '0400', name: 'Reversal request', use: 'Asks to **undo** an earlier transaction.' },
  { mti: '0410', name: 'Reversal response', use: 'Answer to a 0400.' },
  { mti: '0420', name: 'Reversal advice', use: 'Acquirer **informs** the issuer that a transaction must be reversed — e.g. the ATM **did not dispense cash** or the response **timed out**. Very common at ATMs.' },
  { mti: '0421', name: 'Reversal advice (repeat)', use: 'The same 0420 sent again because no 0430 came back. Repeated until acknowledged — so the issuer must handle duplicates safely.' },
  { mti: '0430', name: 'Reversal advice response', use: 'Issuer acknowledges the 0420/0421. Now the acquirer can stop repeating.' },
  { mti: '0800', name: 'Network management request', use: '**Sign-on, sign-off, echo test** ("are you alive?") and key exchange between switch and host/network.' },
  { mti: '0810', name: 'Network management response', use: 'Answer to 0800. If echo tests fail, the link is treated as down.' },
];

/* ---------- Reconciliation ---------- */
export const reconSwitch: { ref: string; amount: number }[] = [
  { ref: '000101', amount: 2000 },
  { ref: '000102', amount: 5000 },
  { ref: '000103', amount: 1000 },
  { ref: '000104', amount: 3000 },
  { ref: '000105', amount: 10000 },
  { ref: '000106', amount: 2500 },
];

export const reconCbs: { ref: string; amount: number }[] = [
  { ref: '000101', amount: 2000 },
  { ref: '000102', amount: 5000 },
  { ref: '000103', amount: 1500 },
  { ref: '000105', amount: 10000 },
  { ref: '000105', amount: 10000 },
  { ref: '000106', amount: 2500 },
  { ref: '000107', amount: 4000 },
];

/* ---------- TLS vs mutual TLS (simplified TLS 1.3) ---------- */
const tlsActors: SequenceSpec['actors'] = [
  { id: 'c', label: 'Bank system', icon: 'server', sub: 'client' },
  { id: 's', label: 'Partner API', icon: 'server', sub: 'server' },
];

export const tlsSpec: SequenceSpec = {
  kind: 'sequence',
  actors: tlsActors,
  steps: [
    { from: 'c', to: 's', label: 'ClientHello', detail: '**ClientHello**: "Hi, I support TLS 1.3/1.2, these cipher suites, here is my key share." Sent to port **443**.', tone: 'blue' },
    { from: 's', to: 'c', label: 'ServerHello + server certificate', detail: 'The server picks the version and cipher, sends its key share and its **certificate** (public key + name + expiry, signed by a CA), and proves it owns the private key.', tone: 'purple' },
    { from: 'c', to: 'c', label: 'verify server certificate', detail: 'The client checks: signed by a **CA in my truststore**? **Name** matches the hostname? **Not expired**? If any check fails → handshake error (e.g. Java "PKIX path building failed").', tone: 'amber' },
    { from: 'c', to: 's', label: 'Finished', detail: 'Both sides now have the same session keys (from the key exchange). Only the **server** was authenticated — the client is anonymous at TLS level.', tone: 'green' },
    { from: 'c', to: 's', label: '🔒 encrypted HTTP request', detail: 'Application data is **encrypted and integrity-protected**. The client usually proves who it is at the application level (API key, OAuth2 token).', tone: 'teal' },
  ],
};

export const mtlsSpec: SequenceSpec = {
  kind: 'sequence',
  actors: tlsActors,
  steps: [
    { from: 'c', to: 's', label: 'ClientHello', detail: '**ClientHello**: supported versions, cipher suites, key share.', tone: 'blue' },
    { from: 's', to: 'c', label: 'ServerHello + certificate + CertificateRequest', detail: 'Same as TLS, **plus** a **CertificateRequest**: "you must show me your certificate too".', tone: 'purple' },
    { from: 'c', to: 'c', label: 'verify server certificate', detail: 'Client checks the server certificate: trusted CA, hostname, expiry.', tone: 'amber' },
    { from: 'c', to: 's', label: 'client certificate + proof', detail: 'The client sends **its own certificate** and a signature (CertificateVerify) made with its **private key** — proof it really owns that certificate.', tone: 'pink' },
    { from: 's', to: 's', label: 'verify client certificate', detail: 'The server checks the client certificate against **its truststore** (and often the exact subject name). Not trusted or **expired** → handshake rejected before any HTTP request.', tone: 'amber' },
    { from: 'c', to: 's', label: '🔒 encrypted request (both verified)', detail: '**Both sides are authenticated.** Common for bank ↔ partner and service ↔ service links. Two certificates to manage — and two expiry dates to track!', tone: 'green' },
  ],
};

/* ---------- Integration troubleshooting ladder ---------- */
export interface TroubleStep {
  key: string;
  icon: string;
  title: string;
  ask: string;
  cmd?: string;
  good?: string;
  bad?: string;
  meaning: string;
}

export const troubleSteps: TroubleStep[] = [
  {
    key: 'scope', icon: '🔎', title: 'Scope',
    ask: 'What exactly fails? All transactions or some? One channel or all? Since when? **Any change** last night (deploy, firewall, certificate, password)?',
    meaning: 'Scope tells you where to look. "Only mobile fails, branches work" → the problem is between mobile and core, not core itself. Always ask about **recent changes** first.',
  },
  {
    key: 'ping', icon: '📶', title: 'Network: ping',
    ask: 'Can the source server reach the target IP at all?',
    cmd: 'ping -c 4 10.20.30.40',
    good: '64 bytes from 10.20.30.40: icmp_seq=1 ttl=62 time=1.8 ms',
    bad: 'Request timeout for icmp_seq 0',
    meaning: 'Ping uses **ICMP**, which firewalls often block. A failed ping is **not proof** the host is down — test the real port next.',
  },
  {
    key: 'port', icon: '🔌', title: 'Network: telnet / port test',
    ask: 'Is the service port open from **this** source server?',
    cmd: 'telnet 10.20.30.40 8443\nnc -zv 10.20.30.40 8443\nTest-NetConnection 10.20.30.40 -Port 8443   # Windows PowerShell',
    good: 'Connected to 10.20.30.40.\n(nc: Connection to 10.20.30.40 port 8443 succeeded!)',
    bad: 'telnet: Unable to connect to remote host: Connection refused\n— or it hangs until timeout',
    meaning: '**Connected** = network path and port OK. **Refused** = host reached but nothing listening (service down / wrong port). **Hangs / timeout** = something **drops** the packets → usually a **firewall** or routing.',
  },
  {
    key: 'fw', icon: '🧱', title: 'Firewall',
    ask: 'Is there a rule allowing source IP → destination IP : port? Was a rule changed or did it expire? Is NAT correct? Did the partner change their IP?',
    meaning: 'Check firewall **logs for denies** with the source/destination. New integrations often fail because **one direction or one environment** (UAT vs PROD IP) was missed in the firewall request.',
  },
  {
    key: 'dns', icon: '📖', title: 'DNS',
    ask: 'Does the hostname resolve to the **expected** IP from this server?',
    cmd: 'nslookup api.partner.example\ndig +short api.partner.example',
    good: 'Address: 203.0.113.25   (the IP in the interface spec)',
    bad: "** server can't find api.partner.example: NXDOMAIN",
    meaning: 'Wrong or no answer → DNS record missing/changed, wrong DNS server, or an old **hosts file** entry. Partners sometimes move to new IPs — compare with the spec.',
  },
  {
    key: 'cert', icon: '📜', title: 'Certificate / TLS',
    ask: 'Is the certificate valid, trusted and **not expired**? Is the full chain sent? For mutual TLS, is **our client certificate** still valid and trusted by them?',
    cmd: 'openssl s_client -connect api.partner.example:443 -servername api.partner.example\nopenssl s_client -connect api.partner.example:443 </dev/null 2>/dev/null | openssl x509 -noout -dates',
    good: 'Verify return code: 0 (ok)\nnotAfter=Mar 10 23:59:59 2027 GMT',
    bad: 'Verify return code: 10 (certificate has expired)\nJava: PKIX path building failed / SSLHandshakeException',
    meaning: 'A classic "worked yesterday, broken at midnight" cause. Check **expiry dates**, the **chain** (intermediate CA), and that the CA is in the **truststore**.',
  },
  {
    key: 'auth', icon: '🔑', title: 'Authentication',
    ask: 'Do we get **401** or **403**? Is the OAuth2 token valid? Was a client secret / API key / password **rotated**? Is our IP still whitelisted?',
    cmd: 'curl -v -H "Authorization: Bearer $TOKEN" https://api.partner.example/v1/ping',
    good: '< HTTP/1.1 200 OK',
    bad: '< HTTP/1.1 401 Unauthorized   (who are you?)\n< HTTP/1.1 403 Forbidden      (I know you, but not allowed)',
    meaning: '**401** = credentials missing/wrong/expired. **403** = authenticated but no permission (scope, role, IP not allowed). Check **service account** expiry and lockouts too.',
  },
  {
    key: 'payload', icon: '📦', title: 'Payload / format',
    ask: 'Is the request in the format the other side expects? Field names, mandatory fields, lengths, date format, encoding, schema/version?',
    cmd: 'curl -v -X POST https://api.partner.example/v1/payments \\\n  -H "Content-Type: application/json" -d @payment.json',
    good: '< HTTP/1.1 201 Created',
    bad: '< HTTP/1.1 400 Bad Request\n{"error":"amount: must have 2 decimal places"}\n(SOAP: <soap:Fault> … schema validation failed)',
    meaning: '**4xx with a validation message** = our data/format. Common after a **version change** on one side. Compare with the **interface specification**.',
  },
  {
    key: 'mw', icon: '📬', title: 'Middleware / queue',
    ask: 'Is the ESB/integration flow running? Is the **queue depth** growing? Is the consumer connected? Messages in the **dead letter queue**?',
    meaning: 'Growing queue = consumer down or too slow. Messages in DLQ = poison messages or repeated failures. **502/504** from a gateway = the backend behind it failed or timed out.',
  },
  {
    key: 'logs', icon: '🧾', title: 'Logs (correlation ID)',
    ask: 'Follow **one transaction** through every system using its **correlation ID / reference**: gateway → middleware → core banking → partner.',
    cmd: 'grep "TRX-20261126-000123" /var/log/integration/*.log',
    meaning: 'The log shows **where the request stopped** and the exact error. Server clocks must be in sync (**NTP**) or timelines will not match.',
  },
  {
    key: 'vendor', icon: '📞', title: 'Vendor / escalate',
    ask: 'If the fault is on the other side, escalate with **evidence**. Follow the incident process and keep stakeholders updated.',
    meaning: 'Give the vendor: time window, source/destination IPs, request ID, error/curl output, what you already checked. Log the ticket, update the **incident** record, inform the service desk, and do a **root cause** review afterwards.',
  },
];
