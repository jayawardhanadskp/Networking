import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'cia',
    title: 'The CIA triad',
    analogy:
      'Think of a customer\'s **bank passbook**. **Confidentiality**: only the customer and the bank can read it. **Integrity**: nobody can secretly change the balance. **Availability**: the customer can use it when they need it.',
    body: `The **CIA triad** is the base of information security:

- **Confidentiality** — only authorised people can **see** data. Controls: encryption, access control, MFA, data classification.
- **Integrity** — data is **accurate and not changed** without authorisation. Controls: hashing, digital signatures, checksums, audit logs, input validation, database constraints.
- **Availability** — systems and data are **available when needed**. Controls: redundancy, backups, DR, patching, DDoS protection, monitoring.

Related ideas:
- **AAA** — **Authentication** (who are you?), **Authorisation** (what may you do?), **Accounting** (what did you do? → logs).
- **Non-repudiation** — someone cannot deny an action (digital signatures, logs).

Every attack hits at least one of C, I or A: data theft (C), changing a transaction amount (I), ransomware or DDoS (A).`,
    visuals: [
      {
        kind: 'fields',
        title: 'CIA with bank examples',
        rows: [
          {
            label: 'The three goals',
            fields: [
              { text: 'Confidentiality', sub: 'only the right people see it', tone: 'blue' },
              { text: 'Integrity', sub: 'correct, not tampered', tone: 'green' },
              { text: 'Availability', sub: 'there when needed', tone: 'amber' },
            ],
          },
          {
            label: 'Threat example',
            fields: [
              { text: 'Customer data leak', tone: 'blue' },
              { text: 'Changed transfer amount', tone: 'green' },
              { text: 'Ransomware / DDoS', tone: 'amber' },
            ],
          },
          {
            label: 'Control example',
            fields: [
              { text: 'Encryption, MFA, RBAC', tone: 'blue' },
              { text: 'Hashing, signatures, audit logs', tone: 'green' },
              { text: 'Redundancy, backups, DR', tone: 'amber' },
            ],
          },
        ],
      },
    ],
    bank: `For a bank, **integrity** of balances and transactions is critical (a changed amount is a disaster), **confidentiality** of customer data is a legal duty (e.g. Sri Lanka's Personal Data Protection Act), and **availability** of ATMs, branches and online banking keeps customers' trust.`,
    remember: [
      '**C**onfidentiality (encryption, access control), **I**ntegrity (hashing, signatures, logs), **A**vailability (redundancy, backups, DR).',
      'AAA = Authentication, Authorisation, Accounting.',
      'Every attack targets C, I or A — say which when you describe an attack.',
    ],
    check: [
      {
        q: 'A ransomware attack that encrypts servers mainly affects which part of CIA?',
        options: ['Confidentiality', 'Integrity', 'Availability', 'None'],
        answer: 2,
        explain: 'Systems become unusable → **availability** (modern ransomware also steals data → confidentiality).',
      },
      {
        q: 'Which control mainly protects integrity?',
        options: ['Load balancer', 'Hashing / digital signatures', 'UPS', 'VPN split tunnelling'],
        answer: 1,
        explain: '**Hashes and digital signatures** detect any change to data.',
      },
    ],
  },
  {
    id: 'access-mfa',
    title: 'Least privilege, MFA and access control',
    analogy:
      'A cashier gets the key to **their own cash drawer**, not the main vault. To open the vault, **two managers** must each use their own key (dual control). That is least privilege and separation of duties.',
    body: `**Least privilege** — give users and systems **only the access they need**, for only as long as needed.
**Need to know** — see only the data needed for your job.
**Separation of duties** — no single person can complete a sensitive task alone (e.g. one creates a payment, another approves it; developers do not deploy to production alone).
**RBAC** — Role-Based Access Control: permissions come from the **role** (teller, branch manager, IT admin).

**MFA (Multi-Factor Authentication)** — two or more **different** factor types:
- Something you **know** (password, PIN)
- Something you **have** (phone app, OTP token, smart card)
- Something you **are** (fingerprint, face)
(Two passwords = still only one factor!)

**Privileged accounts** (domain admins, root, DBAs): separate admin accounts, **PAM** (privileged access management) with password vaults, session recording, just-in-time access. Regular **access reviews** and fast removal for leavers.`,
    visuals: [
      {
        kind: 'sequence',
        title: 'Admin login with MFA through a PAM jump server',
        actors: [
          { id: 'u', label: 'IT admin', icon: 'user' },
          { id: 'pam', label: 'PAM / jump host', icon: 'shield' },
          { id: 'mfa', label: 'MFA app', icon: 'phone' },
          { id: 'srv', label: 'Core server', icon: 'server' },
        ],
        steps: [
          { from: 'u', to: 'pam', label: 'password (know)', detail: 'The admin logs in to the PAM portal with their **personal admin account** — factor 1: something you **know**.', tone: 'blue' },
          { from: 'pam', to: 'mfa', label: 'push / OTP', detail: 'PAM sends a push or asks for an OTP from the phone — factor 2: something you **have**.', tone: 'purple' },
          { from: 'mfa', to: 'pam', label: 'approved', detail: 'MFA approved. A stolen password alone would not be enough.', tone: 'green' },
          { from: 'pam', to: 'srv', label: 'session (vaulted pw)', detail: 'PAM opens the session using a **vaulted credential** the admin never sees, for an **approved ticket/time window** (just-in-time).', tone: 'teal' },
          { from: 'pam', to: 'pam', label: 'record + log', detail: 'The whole session is **recorded and logged** (accountability, non-repudiation).', tone: 'amber' },
        ],
      },
    ],
    bank: `Bank examples: a teller cannot approve their own large transaction (**maker-checker**); IT admins use **separate admin accounts** with MFA; vendors get **time-limited** access through PAM; quarterly **user access reviews** remove access people no longer need; leavers are disabled on their last day.`,
    remember: [
      '**Least privilege**, need to know, **separation of duties** (maker-checker), RBAC.',
      'MFA = different factor types: **know / have / are**.',
      'Privileged access: separate admin accounts, **PAM**, session recording, access reviews.',
    ],
    check: [
      {
        q: 'Which is true multi-factor authentication?',
        options: ['Password + security question', 'Password + OTP from a phone app', 'Two different passwords', 'Username + password'],
        answer: 1,
        explain: 'Password (know) + OTP from a phone (have) = **two different factors**.',
      },
      {
        q: 'One employee creates a payment and a different employee must approve it. This is…',
        options: ['Least privilege', 'Separation of duties (maker-checker)', 'MFA', 'Encryption'],
        answer: 1,
        explain: '**Separation of duties** prevents one person from committing fraud alone.',
      },
    ],
  },
  {
    id: 'crypto',
    title: 'Hashing vs encryption',
    analogy:
      '**Hashing** is like a **fingerprint**: you can check if it matches, but you cannot rebuild the person from the fingerprint. **Encryption** is like a **locked box**: with the right key, you can open it and get the original back.',
    body: `**Hashing** — one-way function → fixed-size "digest". **Cannot be reversed.**
- Same input = same hash; tiny change = totally different hash.
- Use: **integrity checks**, file verification, **password storage**.
- Algorithms: **SHA-256**, SHA-3. (MD5 and SHA-1 are broken — avoid.)
- Passwords: use **salt** + slow algorithms (**bcrypt, scrypt, Argon2, PBKDF2**) — never store plain or simply hashed passwords.

**Encryption** — two-way: plaintext ↔ ciphertext with a **key**.
- **Symmetric** — the **same key** encrypts and decrypts. Fast. **AES** (AES-256). Problem: how to share the key safely?
- **Asymmetric** — a **key pair**: **public key** (share with everyone) + **private key** (keep secret). Slower. **RSA, ECC**. Encrypt with the public key → only the private key decrypts.
- **Digital signature** — hash the data and sign the hash with the **private key**; anyone verifies with the **public key** → integrity + authenticity + non-repudiation.

TLS uses **both**: asymmetric to agree on a key, then fast symmetric (AES) for the data.

Also: **encoding** (Base64) is **not** security — anyone can decode it.`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'Hashing', icon: '🧬', tone: 'green' },
          { label: 'Symmetric', icon: '🔑', tone: 'blue' },
          { label: 'Asymmetric', icon: '🗝️', tone: 'purple' },
        ],
        rows: [
          { label: 'Reversible?', values: ['No (one-way)', 'Yes, same key', 'Yes, key pair'] },
          { label: 'Keys', values: ['None (salt for passwords)', 'One shared secret key', 'Public + private key'] },
          { label: 'Speed', values: ['Fast', 'Fast', 'Slow'] },
          { label: 'Examples', values: ['SHA-256, bcrypt', 'AES-256', 'RSA, ECC'] },
          { label: 'Used for', values: ['Integrity, passwords', 'Bulk data, disks (BitLocker), backups', 'Key exchange, signatures, certificates'] },
        ],
      },
    ],
    bank: `Customer passwords for Internet banking are stored as **salted bcrypt/Argon2 hashes** (as a developer you may have used BCrypt in Spring Security — mention it!). Databases and backups are **encrypted with AES**. Card PINs are protected inside **HSMs** (hardware security modules). Server certificates use **RSA/ECC** keys.`,
    remember: [
      '**Hashing = one-way** (integrity, passwords with salt + bcrypt/Argon2). **Encryption = reversible** with a key.',
      'Symmetric = one key (**AES**, fast). Asymmetric = public/private (**RSA/ECC**, key exchange & signatures).',
      'Digital signature = hash signed with private key → integrity, authenticity, non-repudiation.',
    ],
    check: [
      {
        q: 'Which is the best way to store user passwords?',
        options: ['Encrypted with AES', 'Plain text in a protected table', 'Salted hash with bcrypt/Argon2', 'Base64 encoded'],
        answer: 2,
        explain: 'Passwords should be **hashed with salt** using a slow algorithm, so they cannot be reversed.',
      },
      {
        q: 'In asymmetric encryption, which key do you use to encrypt a message so that only Nimal can read it?',
        options: ['Your private key', 'Nimal\'s public key', 'Nimal\'s private key', 'A shared AES key'],
        answer: 1,
        explain: 'Encrypt with the **recipient\'s public key**; only their private key can decrypt.',
      },
      {
        q: 'Which algorithm is symmetric?',
        options: ['RSA', 'ECC', 'AES', 'SHA-256'],
        answer: 2,
        explain: '**AES** is symmetric. RSA/ECC are asymmetric; SHA-256 is a hash.',
      },
    ],
  },
  {
    id: 'tls',
    title: 'TLS and certificates',
    analogy:
      'When you visit a bank branch, you trust it because of the **official signboard and licence from the Central Bank**. A website\'s **certificate** is its licence, signed by a trusted **Certificate Authority (CA)**. TLS then gives you a **private room** to talk.',
    body: `**TLS (Transport Layer Security)** protects data in transit (HTTPS, secure email, LDAPS, many VPNs). It gives **encryption**, **integrity** and **server authentication**.

**Certificates (X.509)** contain the **domain name**, the **public key**, validity dates and the **CA's signature**.
- **PKI**: Root CA → Intermediate CA → server certificate (**chain of trust**). Browsers/OSs trust root CAs.
- Banks often run an **internal CA** for internal servers and 802.1X device certificates.
- Common problems: **expired** certificate, **name mismatch**, missing intermediate, untrusted (self-signed).

Versions: use **TLS 1.2 and 1.3** only. SSL 2/3 and TLS 1.0/1.1 are **deprecated**.

**mTLS** (mutual TLS): the client also presents a certificate — used for system-to-system APIs (e.g. bank ↔ payment network).`,
    visuals: [
      {
        kind: 'sequence',
        title: 'TLS 1.3 handshake (simplified)',
        actors: [
          { id: 'c', label: 'Browser', icon: 'laptop' },
          { id: 's', label: 'Internet banking', icon: 'server', sub: 'ib.example.lk' },
        ],
        steps: [
          { from: 'c', to: 's', label: 'ClientHello + key share', detail: 'The browser says which TLS versions and **cipher suites** it supports, and sends its part of the key exchange (ECDHE).', tone: 'blue' },
          { from: 's', to: 'c', label: 'ServerHello + certificate', detail: 'The server picks the cipher, sends its key share and its **certificate** (public key signed by a CA), proving it owns the private key.', tone: 'purple' },
          { from: 'c', to: 'c', label: 'verify certificate', detail: 'The browser checks: signed by a **trusted CA** chain? **Name** matches ib.example.lk? **Not expired**/revoked? If not → warning page.', tone: 'amber' },
          { from: 'c', to: 's', label: 'Finished', detail: 'Both sides derive the same **session keys** from the key exchange. Handshake done (1 round trip in TLS 1.3).', tone: 'green' },
          { from: 'c', to: 's', label: '🔒 HTTP data (AES-GCM)', detail: 'All application data is now encrypted with fast **symmetric** encryption (e.g. AES-GCM).', tone: 'teal' },
        ],
      },
    ],
    bank: `A **certificate expiry** is a classic avoidable outage: the Internet banking site or an internal API suddenly fails because nobody renewed the certificate. Good practice: a **certificate inventory**, expiry **monitoring/alerts** (e.g. 30 days before), and automation where possible.`,
    remember: [
      'TLS = encryption + integrity + server authentication. Use **TLS 1.2/1.3** only.',
      'Certificate = domain + public key + validity + **CA signature**; chain Root → Intermediate → server.',
      'Common issues: **expired**, name mismatch, missing intermediate, untrusted. Monitor expiry!',
    ],
    check: [
      {
        q: 'Which TLS versions should be enabled on a bank\'s web server?',
        options: ['SSL 3.0 and TLS 1.0', 'TLS 1.0 and 1.1', 'TLS 1.2 and 1.3', 'All versions for compatibility'],
        answer: 2,
        explain: 'Only **TLS 1.2 and 1.3** are considered secure today.',
      },
      {
        q: 'What does a Certificate Authority do?',
        options: ['Stores user passwords', 'Signs certificates to prove a public key belongs to a domain/entity', 'Encrypts backups', 'Routes HTTPS traffic'],
        answer: 1,
        explain: 'A **CA** vouches for identities by **signing** certificates.',
      },
    ],
  },
  {
    id: 'attacks',
    title: 'Common attacks and defences',
    analogy:
      'Criminals use different tricks: **fake letters** pretending to be from the bank (phishing), **kidnapping your files** for money (ransomware), a **crowd blocking the bank door** (DDoS), **tricking the clerk with a strange form** (SQL injection), or **secretly listening between two people** (MITM).',
    body: `| Attack | What happens | CIA | Key defences |
|---|---|---|---|
| **Phishing** | Fake emails/SMS/calls trick users into giving passwords or clicking malware links. Spear phishing = targeted; vishing = voice; smishing = SMS. | C | **Awareness training**, email filtering, MFA, report button, DMARC/SPF/DKIM |
| **Ransomware** | Malware encrypts files (and often steals data) and demands payment. | A (+C) | Patching, EDR, least privilege, segmentation, **offline/immutable backups**, tested restores |
| **DDoS** | Flood of traffic from many sources makes a service unavailable. | A | DDoS protection service/ISP scrubbing, CDN, rate limiting, capacity |
| **SQL injection** | Attacker puts SQL code into input fields to read/change the database. | C, I | **Parameterised queries** / prepared statements, input validation, WAF, least-privilege DB accounts |
| **MITM** | Attacker secretly sits between two parties to read/modify traffic (ARP spoofing, fake Wi-Fi). | C, I | **TLS** with certificate validation, VPN, DAI, WPA2/3-Enterprise, HSTS |

Others to know: **malware** (virus, worm, trojan), **brute force / credential stuffing** (MFA, lockout), **XSS** (output encoding, CSP), **insider threat** (least privilege, monitoring), **social engineering**, **zero-day**.`,
    visuals: [
      {
        kind: 'flow',
        title: 'How a typical ransomware attack unfolds',
        steps: [
          { label: 'Phishing email', icon: '📧', detail: 'A staff member gets an "urgent invoice" email with a malicious attachment or link.', tone: 'amber' },
          { label: 'Initial access', icon: '🖱️', detail: 'They click; malware runs on the PC. (Defence: email filtering, awareness, EDR, no local admin rights.)', tone: 'red' },
          { label: 'Steal credentials', icon: '🔑', detail: 'Attacker dumps passwords and looks for admin accounts. (Defence: MFA, PAM, LAPS, monitoring.)', tone: 'red' },
          { label: 'Lateral movement', icon: '➡️', detail: 'Spreads to servers via RDP/SMB. (Defence: **network segmentation**, firewalls, patching.)', tone: 'red' },
          { label: 'Steal + encrypt', icon: '🔒', detail: 'Copies data out, deletes backups it can reach, encrypts servers. (Defence: **offline/immutable backups**, DLP, SIEM alerts.)', tone: 'red' },
          { label: 'Ransom', icon: '💰', detail: 'Ransom note. The organisation activates **incident response** and restores from clean backups.', tone: 'purple' },
        ],
      },
    ],
    bank: `As a developer, **SQL injection** is your strongest topic: explain that you always use **prepared statements / JPA parameters** (never string-concatenated SQL), validate input and give the app DB user only the rights it needs. For banks, **phishing** is the #1 entry point — staff training and MFA are critical. Customers are also targeted (fake bank SMS/OTP scams).`,
    remember: [
      'Phishing → training, filtering, MFA. Ransomware → patching, EDR, segmentation, **offline/immutable backups**.',
      'DDoS → scrubbing/CDN/rate limiting. **SQLi → parameterised queries**, validation, WAF. MITM → **TLS**, VPN, DAI.',
      'Link each attack to C/I/A and a defence when you answer.',
    ],
    check: [
      {
        q: 'What is the best defence against SQL injection in application code?',
        options: ['Hiding error messages only', 'Parameterised queries / prepared statements', 'Using HTTPS', 'Bigger servers'],
        answer: 1,
        explain: '**Prepared statements** separate code from data, so input cannot change the SQL.',
      },
      {
        q: 'Which control best helps a bank recover from ransomware without paying?',
        options: ['A faster Internet link', 'Offline / immutable backups that are regularly restore-tested', 'More Wi-Fi access points', 'Disabling logging'],
        answer: 1,
        explain: 'Clean, **offline/immutable** backups that you have tested let you restore.',
      },
      {
        q: 'A DDoS attack mainly affects…',
        options: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'],
        answer: 2,
        explain: 'DDoS makes services **unavailable**.',
      },
    ],
  },
  {
    id: 'incident-response',
    title: 'Incident response steps',
    analogy:
      'Like a **fire drill**: you prepare (extinguishers, training), detect (alarm), **contain** (close doors so it doesn\'t spread), **remove** the cause, **repair** the building, and afterwards **learn** what went wrong.',
    body: `A security incident needs a **planned, calm response**. Common model (NIST / SANS):

1. **Preparation** — IR plan, team and contacts, tools, logging, backups, training, playbooks.
2. **Identification / Detection & Analysis** — SIEM alerts, user reports; confirm it is real, assess scope and impact, start recording a timeline.
3. **Containment** — stop the spread: isolate infected PCs (network quarantine), disable compromised accounts, block malicious IPs/domains. Short-term then long-term containment.
4. **Eradication** — remove the cause: malware, backdoors, vulnerable software; reset credentials; patch.
5. **Recovery** — restore systems from **clean backups**, monitor closely, return to normal operations.
6. **Lessons learned** — post-incident review: what happened, what worked, what to improve; update controls and the plan.

Important rules:
- **Preserve evidence** (logs, memory, disk images) — do not just wipe machines (forensics, legal).
- **Escalate** to the information security team / CISO; follow the communication plan.
- Banks may have to **report** significant incidents to the regulator (CBSL) and affected customers within set time limits.`,
    visuals: [
      {
        kind: 'flow',
        title: 'Incident response: a branch PC with malware',
        steps: [
          { label: 'Prepare', icon: '📘', detail: 'IR plan exists; EDR on all PCs; logs go to the SIEM; IT staff know who to call.', tone: 'slate' },
          { label: 'Identify', icon: '🚨', detail: 'EDR alerts: a teller PC is contacting a known malicious server. SOC confirms it is real; checks if other PCs are affected.', tone: 'blue' },
          { label: 'Contain', icon: '🧯', detail: '**Isolate** the PC from the network (EDR quarantine or switch port), disable the user\'s account sessions, block the malicious domain at the proxy/firewall.', tone: 'red' },
          { label: 'Eradicate', icon: '🧹', detail: 'Collect evidence, then remove the malware (usually **re-image** the PC); reset the user\'s password; patch the exploited weakness.', tone: 'amber' },
          { label: 'Recover', icon: '🔁', detail: 'Return the clean PC; restore any data from backup; **monitor** for signs of return.', tone: 'green' },
          { label: 'Lessons learned', icon: '📝', detail: 'Meeting + report: how did it enter (phishing?), how fast did we detect it, what will we improve (training, email filter rule)?', tone: 'purple' },
        ],
      },
    ],
    bank: `As a junior admin, your role is often: **notice and report quickly**, follow the **playbook**, **isolate** affected systems when instructed, **preserve evidence**, and **document** everything. Never try to hide a mistake or "fix it quietly" — early reporting saves the bank.`,
    remember: [
      'Steps: **Preparation → Identification → Containment → Eradication → Recovery → Lessons learned**.',
      'Contain first (isolate, disable accounts, block IOCs); **preserve evidence**.',
      'Escalate to InfoSec, communicate per plan; regulators may need to be informed.',
    ],
    check: [
      {
        q: 'Malware is found on a branch PC. What is the FIRST priority after confirming it?',
        options: ['Delete all logs', 'Contain it — isolate the PC from the network', 'Ignore it until the weekend', 'Email all customers'],
        answer: 1,
        explain: '**Containment** stops the spread to other systems.',
      },
      {
        q: 'Why should you not immediately wipe a compromised server?',
        options: ['It takes too long', 'You may destroy evidence needed to understand the attack', 'Wiping is illegal', 'It will fix itself'],
        answer: 1,
        explain: '**Preserve evidence** (logs, images) first — then eradicate.',
      },
    ],
  },
  {
    id: 'compliance',
    title: 'PCI DSS and ISO 27001 (awareness)',
    analogy:
      '**ISO 27001** is like a **quality certificate for the whole security management system** — "we run security in an organised, improving way". **PCI DSS** is a **specific rulebook for anyone who handles card data** — "if you touch cards, you must do these things".',
    body: `**PCI DSS (Payment Card Industry Data Security Standard)**
- Required for any organisation that **stores, processes or transmits card data** (banks, merchants, processors). Current version: **v4.0.x**.
- 12 requirements in 6 goals, for example: build and maintain a **secure network** (firewalls/segmentation), **protect cardholder data** (encryption, do not store sensitive authentication data like CVV/PIN after authorisation), **vulnerability management** (antivirus, patching), **strong access control** (least privilege, MFA, unique IDs), **monitor and test** (logging, scans, penetration tests), and an **information security policy**.
- **Scope reduction**: keep card data in a small, segmented environment (CDE).

**ISO/IEC 27001**
- International standard for an **ISMS** (Information Security Management System) — certifiable.
- Risk-based: identify assets → assess **risks** → choose controls → monitor → improve (**Plan-Do-Check-Act**).
- **Annex A** (2022 version): **93 controls** in 4 themes — Organisational, People, Physical, Technological.
- ISO 27002 gives guidance on the controls.

Also in Sri Lanka (awareness): the **Central Bank of Sri Lanka (CBSL)** issues technology-risk and cyber-security requirements for banks, and the **Personal Data Protection Act (No. 9 of 2022)** covers personal data.`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'PCI DSS', icon: '💳', tone: 'red' },
          { label: 'ISO 27001', icon: '📜', tone: 'blue' },
        ],
        rows: [
          { label: 'What', values: ['Card data security standard', 'Information security management system (ISMS)'] },
          { label: 'Who needs it', values: ['Anyone handling card data', 'Any organisation (voluntary certification)'] },
          { label: 'Style', values: ['Specific, prescriptive requirements', 'Risk-based framework + Annex A controls'] },
          { label: 'Checked by', values: ['QSA audit / self-assessment, scans', 'Certification body audits'] },
          { label: 'Admin examples', values: ['Segment the CDE, MFA, log reviews, quarterly scans, firewall rule reviews', 'Risk register, asset inventory, access control policy, change management'] },
        ],
      },
    ],
    bank: `In daily admin work, compliance shows up as: **change tickets** for everything, **access reviews**, **log retention**, **patching within deadlines**, firewall rule reviews, **vulnerability scans**, and evidence for **auditors**. Saying "I understand why documentation and change control matter in a regulated bank" is a strong answer.`,
    remember: [
      '**PCI DSS** = card data standard (v4.0.x), 12 requirements: secure network, protect data, vuln mgmt, access control, monitoring/testing, policy.',
      '**ISO 27001** = certifiable **ISMS**, risk-based, PDCA, Annex A **93 controls** (2022).',
      'Sri Lanka: **CBSL** directions for banks; **PDPA No. 9 of 2022** for personal data.',
    ],
    check: [
      {
        q: 'Which standard applies specifically to organisations that handle payment card data?',
        options: ['ISO 9001', 'PCI DSS', 'ITIL', 'COBIT'],
        answer: 1,
        explain: '**PCI DSS** is the card industry security standard.',
      },
      {
        q: 'What is ISO 27001 mainly about?',
        options: ['Network cabling', 'An information security management system (ISMS)', 'Software testing', 'Accounting rules'],
        answer: 1,
        explain: 'ISO 27001 specifies requirements for an **ISMS**.',
      },
    ],
  },
];
