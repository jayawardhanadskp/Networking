import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'What does the "I" in CIA stand for?', options: ['Identity', 'Integrity', 'Interface', 'Inspection'], answer: 1, explain: 'CIA = Confidentiality, **Integrity**, Availability.' },
  { q: 'Which is an example of "something you have"?', options: ['Password', 'Fingerprint', 'OTP token / phone app', 'Mother\'s maiden name'], answer: 2, explain: 'A token or phone is a **possession** factor.' },
  { q: 'What is the principle of least privilege?', options: ['Give everyone admin rights to save time', 'Give users only the access they need for their job', 'Share passwords within a team', 'Disable all logging'], answer: 1, explain: '**Least privilege** minimises damage from mistakes and attacks.' },
  { q: 'Which hashing algorithms should NOT be used for security anymore?', options: ['SHA-256 and SHA-3', 'MD5 and SHA-1', 'bcrypt and Argon2', 'AES and RSA'], answer: 1, explain: '**MD5 and SHA-1** have known collision attacks.' },
  { q: 'What is a salt in password hashing?', options: ['A secret encryption key', 'Random data added to each password before hashing so identical passwords get different hashes', 'A type of firewall', 'A backup copy'], answer: 1, explain: 'A **salt** defeats rainbow tables and hides identical passwords.' },
  { q: 'A digital signature is created with…', options: ['The sender\'s public key', 'The sender\'s private key', 'The receiver\'s private key', 'A shared password'], answer: 1, explain: 'Sign with your **private key**; others verify with your public key.' },
  { q: 'Why does TLS use both asymmetric and symmetric encryption?', options: ['To confuse attackers', 'Asymmetric to securely agree on keys, symmetric for fast bulk encryption', 'Symmetric is only for passwords', 'It does not'], answer: 1, explain: 'Key exchange (asymmetric) + data (fast symmetric AES).' },
  { q: 'A website shows a certificate warning because the certificate is for www.example.lk but you visited ib.example.lk. This is a…', options: ['Expired certificate', 'Name mismatch', 'Revoked CA', 'Weak cipher'], answer: 1, explain: 'The certificate **name does not match** the host name.' },
  { q: 'A fake SMS asks a customer to "verify your account" via a link. This is…', options: ['Vishing', 'Smishing', 'DDoS', 'SQL injection'], answer: 1, explain: 'SMS phishing = **smishing**. Voice = vishing.' },
  { q: 'Which attack sends huge traffic from many machines to take a service offline?', options: ['MITM', 'DDoS', 'XSS', 'Phishing'], answer: 1, explain: '**Distributed Denial of Service**.' },
  { q: 'What is the correct incident response order (SANS)?', options: ['Recovery, Identification, Containment, Eradication', 'Preparation, Identification, Containment, Eradication, Recovery, Lessons learned', 'Containment, Preparation, Lessons learned, Recovery', 'Eradication first'], answer: 1, explain: '**PICERL**: Preparation, Identification, Containment, Eradication, Recovery, Lessons learned.' },
  { q: 'Under PCI DSS, which data must NEVER be stored after authorisation?', options: ['Cardholder name', 'Full magnetic stripe / CVV / PIN data', 'Expiry date', 'Masked card number'], answer: 1, explain: '**Sensitive authentication data** (track data, CVV2, PIN/PIN block) must not be stored after authorisation.' },
  { q: 'How many controls are in ISO/IEC 27001:2022 Annex A?', options: ['14', '93', '114', '12'], answer: 1, explain: 'The 2022 version has **93 controls** (the 2013 version had 114).' },
  { q: 'Which control best protects against a MITM attack on a web login?', options: ['TLS with proper certificate validation (and HSTS)', 'Bigger password field', 'RAID 10', 'Longer DHCP lease'], answer: 0, explain: '**TLS** encrypts and authenticates the server.' },
];

export const flashcards: Flashcard[] = [
  { front: 'CIA triad', back: '**Confidentiality** (only authorised see) · **Integrity** (accurate, unchanged) · **Availability** (accessible when needed).', tag: 'definition' },
  { front: 'AAA', back: '**Authentication** (who?) · **Authorisation** (what can you do?) · **Accounting** (what did you do? logs).', tag: 'acronym' },
  { front: 'MFA factors', back: 'Something you **know** (password) · **have** (token/phone) · **are** (biometric).', tag: 'definition' },
  { front: 'Separation of duties', back: 'No single person completes a critical task alone — e.g. maker-checker for payments.', tag: 'definition' },
  { front: 'PAM', back: '**Privileged Access Management**: vaulted admin passwords, MFA, just-in-time access, session recording.', tag: 'acronym' },
  { front: 'Hashing vs encryption', back: '**Hashing**: one-way (SHA-256, bcrypt) for integrity/passwords. **Encryption**: reversible with a key (AES, RSA).', tag: 'definition' },
  { front: 'Symmetric vs asymmetric', back: '**Symmetric**: one shared key, fast (AES). **Asymmetric**: public/private key pair, slower (RSA, ECC).', tag: 'definition' },
  { front: 'Digital signature', back: 'Hash of the data signed with the sender\'s **private key** → integrity, authenticity, non-repudiation.', tag: 'definition' },
  { front: 'PKI / certificate chain', back: 'Root CA → Intermediate CA → server certificate. Certificate = name + public key + validity + CA signature.', tag: 'definition' },
  { front: 'TLS versions', back: 'Use **TLS 1.2 / 1.3**. SSL and TLS 1.0/1.1 are deprecated.', tag: 'fact' },
  { front: 'Phishing types', back: '**Spear phishing** (targeted) · **whaling** (executives) · **vishing** (voice) · **smishing** (SMS).', tag: 'definition' },
  { front: 'SQL injection defence', back: '**Parameterised queries / prepared statements**, input validation, least-privilege DB account, WAF.', tag: 'definition' },
  { front: 'Ransomware defence', back: 'Patching, EDR, MFA, least privilege, segmentation, email filtering, **offline/immutable tested backups**.', tag: 'definition' },
  { front: 'Incident response (PICERL)', back: 'Preparation · Identification · Containment · Eradication · Recovery · Lessons learned.', tag: 'acronym' },
  { front: 'PCI DSS', back: '**Payment Card Industry Data Security Standard** (v4.0.x): 12 requirements for protecting card data.', tag: 'acronym' },
  { front: 'ISO 27001', back: 'Certifiable **ISMS** standard: risk-based, Plan-Do-Check-Act, Annex A 93 controls (2022).', tag: 'acronym' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'What is the CIA triad? Give a bank example for each.',
    answer: `The CIA triad is the foundation of information security:
- **Confidentiality** — only authorised people can see data. Example: customer account details are encrypted and only visible to staff whose role needs them.
- **Integrity** — data is accurate and not changed without authorisation. Example: a transaction amount cannot be altered in transit or in the database; we use hashing, signatures, audit logs and maker-checker controls.
- **Availability** — systems are available when needed. Example: ATMs and core banking keep running thanks to redundancy, backups and a DR site.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between hashing and encryption?',
    answer: `**Hashing** is a **one-way** function: it turns data into a fixed-size digest that cannot be reversed. It's used for **integrity** checks and for **storing passwords** — with a salt and a slow algorithm like bcrypt or Argon2. In my Spring Boot projects I used BCrypt for password storage.

**Encryption** is **two-way**: data can be decrypted with the right key. **Symmetric** encryption (AES) uses one shared key and is fast — used for data at rest and bulk data. **Asymmetric** encryption (RSA/ECC) uses a public/private key pair — used for key exchange, certificates and digital signatures. TLS combines both.`,
    tips: ['Mention BCrypt/Spring Security if you have used it — real experience beats theory.'],
  },
  {
    type: 'technical',
    q: 'How do you protect an application against SQL injection?',
    answer: `The main defence is **parameterised queries / prepared statements**, so user input is always treated as data, never as SQL code. In Java I use JDBC PreparedStatement or JPA/Hibernate with bound parameters, and never build SQL by concatenating strings.

Additional layers: **input validation** (whitelisting), giving the application's database account **least privilege** (no DROP, no access to other schemas), hiding detailed error messages from users, using a **WAF**, and regular code reviews and security testing.`,
  },
  {
    type: 'technical',
    q: 'What are the steps of incident response?',
    answer: `I follow the standard model: **Preparation** (plan, tools, logging, backups, training), **Identification** (detect and confirm the incident and its scope), **Containment** (isolate affected systems, disable compromised accounts, block malicious IPs), **Eradication** (remove malware and the root cause, patch, reset credentials), **Recovery** (restore from clean backups and monitor), and **Lessons learned** (post-incident review and improvements).

Throughout, it's important to **preserve evidence**, **escalate** to the security team, document everything with a timeline, and follow the communication plan — in a bank, regulators may need to be informed.`,
  },
  {
    type: 'scenario',
    q: 'A staff member reports they clicked a link in a suspicious email and entered their password. What do you do?',
    answer: `1. **Thank them for reporting quickly** — that is the right behaviour.
2. **Reset their password immediately** and revoke active sessions/tokens; check MFA is enabled and see if any new MFA devices were registered.
3. **Check for suspicious activity**: sign-in logs (unusual locations/times), mailbox rules (forwarding), emails sent from the account.
4. Check whether malware ran — scan/isolate the PC with EDR if they downloaded something.
5. **Block** the phishing URL/sender at the email gateway and proxy, and search for the same email in other mailboxes and remove it.
6. **Report to the information security team** and log an incident; follow their playbook.
7. Afterwards: awareness reminder to staff about that campaign.`,
  },
  {
    type: 'technical',
    q: 'What is MFA and why is it important?',
    answer: `Multi-factor authentication requires **two or more different types** of factors: something you **know** (password), something you **have** (phone app, token, smart card) and something you **are** (biometrics). Two passwords are still one factor.

It's important because passwords are often stolen through phishing, reuse or leaks. With MFA, a stolen password alone is not enough. In a bank, MFA should be used for remote access/VPN, privileged admin accounts, email, cloud services and Internet banking for customers.`,
  },
  {
    type: 'technical',
    q: 'What do you know about PCI DSS and ISO 27001?',
    answer: `**PCI DSS** is the security standard for any organisation that stores, processes or transmits **payment card data**. It has 12 requirements — for example network security controls and segmentation, protecting stored card data with encryption, never storing CVV or PIN data after authorisation, vulnerability management and patching, strong access control with MFA, logging and monitoring, regular testing, and a security policy. The current version is 4.0.

**ISO 27001** is an international standard for an **Information Security Management System**. It is risk-based — identify assets and risks, apply controls from Annex A (93 controls in the 2022 version), and continuously improve using Plan-Do-Check-Act. Organisations can be certified.

For an admin, this means following change management, access reviews, patch timelines, log retention and keeping evidence for audits.`,
  },
  {
    type: 'technical',
    q: 'What is a certificate, and what happens when one expires?',
    answer: `A digital certificate binds a **public key to an identity**, like a domain name, and is **signed by a Certificate Authority**. Browsers and systems trust it if the CA chain is trusted, the name matches and it is within its validity dates.

When a certificate **expires**, clients reject the connection — users see security warnings and system-to-system APIs fail. This causes avoidable outages. To prevent it, I would keep a **certificate inventory**, set **expiry alerts** (for example 30 and 7 days before), automate renewal where possible, and test after renewal (including the full chain).`,
  },
];
