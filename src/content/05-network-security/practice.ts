import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'What is the main difference between a stateless and a stateful firewall?', options: ['Stateless firewalls encrypt traffic', 'Stateful firewalls track connections and allow return traffic automatically', 'Stateless firewalls are always hardware', 'There is no difference'], answer: 1, explain: 'A **stateful** firewall keeps a state table of connections.' },
  { q: 'In which order are firewall rules / ACL lines processed?', options: ['Bottom-up', 'Random', 'Top-down, first match wins', 'Most specific first automatically'], answer: 2, explain: 'Rules are checked **top-down** and processing stops at the **first match**.' },
  { q: 'What is at the end of every Cisco ACL?', options: ['permit any', 'An implicit deny any', 'A log statement', 'Nothing'], answer: 1, explain: 'There is an invisible **implicit deny any**.' },
  { q: 'A standard ACL filters on…', options: ['Source IP only', 'Destination port', 'Source and destination IP and port', 'MAC address'], answer: 0, explain: 'Standard ACLs match **source IP only** (place them near the destination).' },
  { q: 'Which ACL line allows only HTTPS from 10.20.5.0/24 to host 10.1.10.50?', options: ['permit ip any any', 'permit tcp 10.20.5.0 0.0.0.255 host 10.1.10.50 eq 443', 'permit udp 10.20.5.0 255.255.255.0 host 10.1.10.50 eq 443', 'deny tcp any any eq 443'], answer: 1, explain: 'Extended ACL with TCP, wildcard 0.0.0.255 and **eq 443**.' },
  { q: 'What is a DMZ?', options: ['The most trusted internal zone', 'A network zone for Internet-facing servers between the Internet and internal network', 'A wireless guest network only', 'A backup data centre'], answer: 1, explain: 'The **DMZ** hosts public-facing services with controlled access.' },
  { q: 'Which flow should normally be DENIED?', options: ['Internet → DMZ web server on 443', 'Internal users → proxy', 'Internet → internal database', 'Internal app → internal database'], answer: 2, explain: 'The Internet must **never** reach internal databases directly.' },
  { q: 'What is the advantage of back-to-back firewalls from different vendors?', options: ['Cheaper', 'Defence in depth: one vendor vulnerability does not expose everything', 'Faster routing', 'No rules needed'], answer: 1, explain: 'Two layers from different vendors = **defence in depth**.' },
  { q: 'An IDS is typically connected…', options: ['Inline', 'To a SPAN/mirror port or TAP', 'To the console port', 'Only to the DMZ'], answer: 1, explain: 'An IDS receives a **copy** of traffic and is out of band.' },
  { q: 'Which detection method can find new (zero-day) attacks but gives more false positives?', options: ['Signature-based', 'Anomaly/behaviour-based', 'Port-based', 'MAC-based'], answer: 1, explain: '**Anomaly-based** detection flags unusual behaviour, including unknown attacks.' },
  { q: 'Which is worse for security?', options: ['False positive', 'False negative'], answer: 1, explain: 'A **false negative** means a real attack was missed.' },
  { q: 'What does a reverse proxy do?', options: ['Filters staff web browsing', 'Receives requests for backend servers and forwards them, hiding the servers', 'Assigns VLANs', 'Stores backups'], answer: 1, explain: 'A **reverse proxy** stands in front of servers (TLS termination, LB, WAF).' },
  { q: 'In 802.1X, the end device is called the…', options: ['Authenticator', 'Supplicant', 'Authentication server', 'Controller'], answer: 1, explain: 'Device = **supplicant**, switch/AP = authenticator, RADIUS = server.' },
  { q: 'Which port does RADIUS authentication use?', options: ['UDP 1812', 'TCP 49', 'UDP 514', 'TCP 389'], answer: 0, explain: 'RADIUS auth = **UDP 1812** (accounting 1813). TACACS+ = TCP 49.' },
  { q: 'What is a "sticky session" on a load balancer?', options: ['A session that never ends', 'Keeping a user on the same backend server', 'Encrypting the session twice', 'A session stored on the LB disk'], answer: 1, explain: '**Session persistence** sends a user to the same server each time.' },
  { q: 'Which Wi-Fi security protocol is broken and must never be used?', options: ['WEP', 'WPA2', 'WPA3', 'WPA2-Enterprise'], answer: 0, explain: '**WEP** (RC4) can be cracked in minutes.' },
  { q: 'What does WPA3 SAE improve?', options: ['Signal range', 'Protection against offline password-guessing attacks', 'Number of SSIDs', 'DHCP speed'], answer: 1, explain: '**SAE** (Simultaneous Authentication of Equals) resists offline dictionary attacks.' },
];

export const flashcards: Flashcard[] = [
  { front: 'Stateless vs stateful firewall', back: '**Stateless**: each packet alone, no memory. **Stateful**: state table, return traffic allowed automatically.', tag: 'definition' },
  { front: 'NGFW', back: '**Next-Generation Firewall**: stateful + app awareness, user identity, IPS, URL filtering, TLS inspection.', tag: 'acronym' },
  { front: 'WAF', back: '**Web Application Firewall**: protects web apps from SQL injection, XSS, etc. (L7).', tag: 'acronym' },
  { front: 'ACL processing rules', back: 'Top-down · first match wins · **implicit deny any** at the end · one ACL per interface/direction/protocol.', tag: 'definition' },
  { front: 'Standard vs extended ACL', back: '**Standard** (1–99): source only → near destination. **Extended** (100–199): src/dst/protocol/port → near source.', tag: 'definition' },
  { front: 'DMZ', back: '**Demilitarised zone**: network for Internet-facing servers, between Internet and internal network.', tag: 'acronym' },
  { front: 'Defence in depth', back: 'Multiple layers of security (firewalls, IPS, segmentation, host security, MFA) so one failure does not expose everything.', tag: 'definition' },
  { front: 'IDS vs IPS', back: '**IDS**: passive copy, alerts. **IPS**: inline, blocks.', tag: 'definition' },
  { front: 'False positive / false negative', back: '**FP**: alert, but no attack. **FN**: real attack, but no alert (worse).', tag: 'definition' },
  { front: 'SIEM', back: '**Security Information and Event Management**: collects and correlates logs/alerts; used by the SOC.', tag: 'acronym' },
  { front: 'Forward vs reverse proxy', back: '**Forward**: users → Internet (filtering, logging). **Reverse**: Internet → servers (TLS offload, LB, WAF).', tag: 'definition' },
  { front: 'NAC', back: '**Network Access Control**: checks who/what connects (802.1X, posture), assigns VLAN or quarantine.', tag: 'acronym' },
  { front: '802.1X roles', back: '**Supplicant** (device) · **Authenticator** (switch/AP) · **Authentication server** (RADIUS). Uses EAP.', tag: 'definition' },
  { front: 'RADIUS vs TACACS+', back: '**RADIUS**: UDP 1812/1813, network access (VPN, Wi-Fi, 802.1X). **TACACS+**: TCP 49, device admin, per-command authorisation, full encryption.', tag: 'definition' },
  { front: 'Load balancer features', back: 'VIP, health checks, algorithms (round robin, least connections), sticky sessions, L4/L7, TLS offload, HA pair.', tag: 'definition' },
  { front: 'Wi-Fi security levels', back: 'WEP broken · WPA (TKIP) weak · **WPA2 (AES-CCMP)** good · **WPA3 (SAE)** best.', tag: 'fact' },
  { front: 'Personal vs Enterprise Wi-Fi', back: '**Personal**: shared PSK. **Enterprise**: 802.1X/RADIUS, per-user credentials — use in companies.', tag: 'definition' },
  { front: 'Rogue AP / evil twin', back: '**Rogue AP**: unauthorised AP connected to the network. **Evil twin**: fake AP copying the real SSID to steal credentials.', tag: 'definition' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'What is the difference between a stateful and a stateless firewall?',
    answer: `A **stateless** firewall checks each packet on its own, using fields like source/destination IP and port. It has no memory, so return traffic must be allowed with separate rules — basic router ACLs work like this.

A **stateful** firewall keeps a **state table** of active connections. When an inside user opens a connection, the firewall records it and automatically allows the **reply traffic**, while blocking unsolicited inbound connections. This is more secure and easier to manage.

A **next-generation firewall** adds application awareness, user identity, IPS, URL filtering and TLS inspection.`,
  },
  {
    type: 'technical',
    q: 'What is a DMZ and why is it used?',
    answer: `A DMZ is a separate network zone for servers that must be reachable from the Internet — for example Internet banking web front-ends, email gateways, reverse proxies and VPN gateways.

The firewall allows the Internet to reach the DMZ **only on required ports** (like 443), denies the Internet from reaching the internal network, and allows the DMZ to reach internal systems **only on specific ports** to specific servers. So if a DMZ server is compromised, the attacker is still **contained** and cannot directly reach the core banking database. Banks often use two layers of firewalls from different vendors for defence in depth.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between IDS and IPS?',
    answer: `An **IDS** receives a **copy** of traffic (from a SPAN port or TAP), detects suspicious activity and **alerts** — it cannot block, and if it fails, traffic is not affected.

An **IPS** sits **inline**, so it can **block** attacks in real time. The risk is that a false positive can block legitimate traffic, so new signatures are often tested in detect-only mode first.

Both can use **signature-based** detection (known attacks) or **anomaly-based** detection (unusual behaviour). Alerts go to a **SIEM** for the SOC team.`,
  },
  {
    type: 'technical',
    q: 'Explain how ACLs work. Where do you place standard and extended ACLs?',
    answer: `An ACL is an ordered list of permit and deny statements. The device checks it **top-down** and stops at the **first match**. At the end there is an **implicit deny any**, so anything not permitted is blocked.

A **standard ACL** matches only the source IP, so it is placed **close to the destination** — otherwise it could block too much. An **extended ACL** matches source, destination, protocol and port, so it is placed **close to the source** to drop unwanted traffic early. ACLs use wildcard masks, for example 0.0.0.255 for a /24.`,
  },
  {
    type: 'technical',
    q: 'What is 802.1X / NAC?',
    answer: `NAC controls **who and what can connect** to the network. 802.1X is the standard for port-based authentication: the **supplicant** (the PC) sends its credentials or certificate to the **authenticator** (the switch or access point), which forwards them to a **RADIUS** server. RADIUS checks them against Active Directory and policy, and returns accept or reject — and can assign a **VLAN**. Until then, the port only allows authentication traffic.

Unknown or non-compliant devices can be put in a **guest or quarantine VLAN**. In a bank this stops someone plugging a personal laptop into a branch socket.`,
  },
  {
    type: 'technical',
    q: 'What does a load balancer do?',
    answer: `A load balancer distributes client requests across a pool of servers behind a single **virtual IP**. It uses **health checks** to detect failed servers and stops sending them traffic, which gives high availability and lets us patch servers one at a time with no downtime. Common algorithms are round robin and least connections, and it can keep **sticky sessions**. A Layer 7 load balancer can route by URL or header and do **TLS offloading**. Load balancers are deployed in pairs so they are not a single point of failure.

As a developer, I have used health endpoints like Spring Boot Actuator, which load balancers use for health checks.`,
    tips: ['Connecting to your developer experience here is a strong move.'],
  },
  {
    type: 'technical',
    q: 'How do you secure Wi-Fi in a bank?',
    answer: `- Use **WPA2/WPA3-Enterprise** with **802.1X** and RADIUS — each user or device has its own credentials or certificate — not a shared password.
- Put staff Wi-Fi users in the correct VLAN based on their role, with firewall rules.
- Keep **guest Wi-Fi completely separate** — its own VLAN or Internet line, client isolation, no access to internal systems.
- Use a **wireless controller** for central management, and wireless IPS to detect **rogue APs and evil twins**.
- Disable WPS and old standards (WEP/WPA), keep AP firmware patched, and log all connections.`,
  },
  {
    type: 'scenario',
    q: 'The business asks you to open a firewall rule from the Internet directly to a database server "for a vendor". What do you do?',
    answer: `I would **not** open it directly — exposing a database to the Internet is a major risk and against least privilege and PCI DSS.

1. Understand the **business need** — what exactly does the vendor need to do?
2. Propose a **secure alternative**: vendor connects through the **VPN with MFA** or a **privileged access management** jump server, with time-limited access, only to the required system, with session recording.
3. Follow **change management**: risk assessment, approval from the information security team and the system owner.
4. If approved, make the rule as **specific** as possible (source IP, destination, port, time window), enable logging, and set a **review/expiry date**.`,
    tips: ['Show you balance security with business needs — never just say "no".'],
  },
  {
    type: 'scenario',
    q: 'Users say a business website is blocked by the proxy. How do you handle it?',
    answer: `1. Get the **exact URL**, user, time and the block message.
2. Check the **proxy logs** — which category/rule blocked it? Is it miscategorised, or actually risky (malware, phishing)?
3. Check the site's reputation with threat intelligence.
4. If it is a legitimate business need, raise a **change/request** with approval (manager + security), and add a specific **allow** exception — for that URL and, if possible, only for the user group that needs it.
5. Inform the user and document. If the site is malicious, explain why it stays blocked.`,
  },
];
