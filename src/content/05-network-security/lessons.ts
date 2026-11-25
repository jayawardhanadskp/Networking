import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'firewalls',
    title: 'Firewalls: stateless, stateful and next-generation',
    analogy:
      'A **stateless** guard checks each visitor\'s ID card with no memory. A **stateful** guard remembers: "Kasun went out to buy lunch, so when he comes back, let him in." A **next-generation** guard also **opens bags** and knows which apps people are carrying.',
    body: `A **firewall** allows or blocks traffic using **rules** (source, destination, port, protocol, app…). Rules are checked **top-down**, first match wins, and there is a **default deny** at the end.

**Stateless (packet filter)**
- Checks each packet alone (IP, port). No memory.
- Fast but you must allow return traffic manually. Example: basic router ACLs.

**Stateful**
- Keeps a **state (connection) table**. If an inside user starts a connection, the **return traffic is allowed automatically**; unsolicited inbound traffic is dropped.
- The standard today.

**Next-Generation Firewall (NGFW)**
- Stateful + **application awareness** (knows "this is Facebook" even on port 443), **user identity** (AD groups), **IPS**, URL filtering, malware sandboxing, TLS inspection.

Also: **WAF** (Web Application Firewall) protects web apps from SQL injection, XSS etc. **Host firewall** (Windows Defender Firewall, iptables) protects each server.`,
    visuals: [
      {
        kind: 'sequence',
        title: 'How a stateful firewall uses its state table',
        actors: [
          { id: 'pc', label: 'Staff PC', icon: 'pc', sub: '10.3.4.20' },
          { id: 'fw', label: 'Stateful firewall', icon: 'firewall' },
          { id: 'srv', label: 'Vendor site', icon: 'server', sub: '203.0.113.80' },
        ],
        steps: [
          { from: 'pc', to: 'fw', label: 'SYN → 203.0.113.80:443', detail: 'Rule: "inside → Internet TCP 443 allowed". The firewall allows it and writes an entry in its **state table**: 10.3.4.20:51000 ↔ 203.0.113.80:443.', tone: 'blue' },
          { from: 'fw', to: 'srv', label: 'forwarded', detail: 'The packet goes out (usually NATed to a public IP).', tone: 'blue' },
          { from: 'srv', to: 'fw', label: 'SYN-ACK (reply)', detail: 'The reply arrives. There is **no inbound rule**, but it **matches the state table**, so it is allowed.', tone: 'green' },
          { from: 'fw', to: 'pc', label: 'delivered', detail: 'Return traffic reaches the PC. The entry is removed when the connection closes or times out.', tone: 'green' },
          { from: 'srv', to: 'fw', label: 'new connection → :3389', detail: 'Someone on the Internet tries to start a **new** connection to the PC (RDP 3389). No state entry and no rule → **DROPPED** and logged.', tone: 'red' },
        ],
      },
      {
        kind: 'compare',
        columns: [
          { label: 'Stateless', icon: '📋', tone: 'slate' },
          { label: 'Stateful', icon: '🧠', tone: 'blue' },
          { label: 'NGFW', icon: '🚀', tone: 'purple' },
        ],
        rows: [
          { label: 'Checks', values: ['Each packet alone (IP/port)', 'Connections (state table)', 'Connections + apps + users + content'] },
          { label: 'Return traffic', values: ['Must be allowed manually', 'Allowed automatically', 'Allowed automatically'] },
          { label: 'Extras', values: ['—', '—', 'IPS, URL filter, TLS inspection, sandbox'] },
          { label: 'Example', values: ['Router ACL', 'Classic firewall', 'Modern perimeter firewall'] },
        ],
      },
    ],
    bank: `A bank uses firewalls at many points: **Internet edge** (NGFW with IPS), **between DMZ and internal**, **in front of core banking and card systems** (internal segmentation), at **branches**, and **host firewalls** on servers. Firewall rules must follow **least privilege**, have an owner and a change ticket, and be **reviewed regularly** (PCI DSS requires reviews).`,
    remember: [
      'Stateless = per packet, no memory. **Stateful = state table**, return traffic auto-allowed. NGFW = + apps, users, IPS, URL filtering.',
      'Rules: top-down, **first match**, **implicit deny** at the end.',
      'WAF protects web apps (SQLi, XSS); host firewalls protect each server.',
    ],
    check: [
      {
        q: 'What does a stateful firewall use to allow return traffic automatically?',
        options: ['The routing table', 'The state (connection) table', 'The ARP cache', 'DNS records'],
        answer: 1,
        explain: 'It tracks connections in a **state table** and allows replies that match.',
      },
      {
        q: 'Which feature is typical of a next-generation firewall but not a basic stateful firewall?',
        options: ['Blocking by port', 'Application awareness and integrated IPS', 'NAT', 'Default deny'],
        answer: 1,
        explain: 'NGFWs identify **applications and users** and include **IPS**, URL filtering etc.',
      },
    ],
  },
  {
    id: 'acls',
    title: 'Access Control Lists (ACLs)',
    analogy:
      'An ACL is a **guest list at a wedding door**, read from top to bottom. The guard stops at the **first line that matches** your name. If your name is not on the list at all, you are **not allowed in** (the invisible "deny everyone else" line).',
    body: `An **ACL** is an ordered list of **permit/deny** rules on a router, switch or firewall.

Key rules:
1. Checked **top-down**; **first match wins** — the rest is ignored.
2. **Implicit deny any** at the end (invisible). An ACL with only deny lines blocks everything!
3. Applied to an interface **inbound or outbound** (one ACL per interface, per direction, per protocol).
4. Put **specific** lines first, **general** lines last.

Cisco types:
- **Standard ACL** (1–99, 1300–1999): matches **source IP only** → place **close to the destination**.
- **Extended ACL** (100–199, 2000–2699): matches **source, destination, protocol and port** → place **close to the source**.
- Named ACLs are easier to manage.

ACLs use **wildcard masks** (0 = must match, 1 = ignore): \`10.20.5.0 0.0.0.255\` = the whole /24. \`host 10.1.10.50\` = one IP.

\`\`\`
ip access-list extended BRANCH-IN
 10 permit tcp 10.20.5.0 0.0.0.255 host 10.1.10.50 eq 443
 20 permit udp 10.20.5.0 0.0.0.255 host 10.1.20.10 eq 53
 30 deny   ip  10.20.5.0 0.0.0.255 10.1.0.0 0.0.255.255 log
 (implicit deny any)
\`\`\``,
    visuals: [
      {
        kind: 'flow',
        title: 'Packet: 10.20.5.25 → 10.1.10.50, TCP 22 (SSH)',
        steps: [
          { label: 'Line 10', icon: '❓', detail: 'permit tcp … host 10.1.10.50 **eq 443** → the port is **22**, not 443 → **no match**, go to the next line.', tone: 'slate' },
          { label: 'Line 20', icon: '❓', detail: 'permit **udp** … eq 53 → this packet is **TCP** → no match.', tone: 'slate' },
          { label: 'Line 30', icon: '⛔', detail: 'deny ip 10.20.5.0/24 → 10.1.0.0/16 → **match!** The packet is **denied** and logged. Processing **stops** here.', tone: 'red' },
          { label: 'Lesson', icon: '💡', detail: 'Tellers may use the CBS web app (443) and DNS, but not SSH to servers. A packet that matched nothing would hit the **implicit deny**.', tone: 'green' },
        ],
      },
    ],
    bank: `On a branch router, an ACL can allow the **ATM VLAN** to talk **only** to the ATM switch IP and port, and deny everything else. On a switch, an ACL can stop CCTV cameras from reaching anything except the video recorder. Every ACL change goes through **change management**.`,
    remember: [
      'ACLs: **top-down, first match, implicit deny** at the end.',
      '**Standard** = source only → near destination. **Extended** = src, dst, protocol, port → near source.',
      'Wildcard mask: 0 = match, 1 = ignore (0.0.0.255 = /24).',
    ],
    check: [
      {
        q: 'An ACL contains only "deny host 10.1.1.5". What happens to traffic from 10.1.1.9?',
        options: ['It is permitted', 'It is denied by the implicit deny', 'It is logged only', 'The ACL is ignored'],
        answer: 1,
        explain: 'No permit line matches, so the **implicit deny any** blocks it. Always add the permits you need.',
      },
      {
        q: 'Where should an extended ACL usually be placed?',
        options: ['Close to the destination', 'Close to the source', 'On the DNS server', 'Anywhere — it does not matter'],
        answer: 1,
        explain: 'Extended ACLs are specific, so put them **close to the source** to stop unwanted traffic early.',
      },
      {
        q: 'What does the wildcard mask 0.0.0.255 mean with 10.20.5.0?',
        options: ['Only 10.20.5.0', 'Any address 10.20.5.0 – 10.20.5.255', 'Any address', '10.20.0.0/16'],
        answer: 1,
        explain: 'The last octet is "ignore" (255), so it matches the whole **10.20.5.0/24**.',
      },
    ],
  },
  {
    id: 'dmz',
    title: 'DMZ and firewall zones',
    analogy:
      'A bank building has a **public banking hall** (DMZ) where customers can enter, and a **vault area** (internal network) behind strong doors. Customers never walk directly into the vault — staff bring what is needed through controlled windows.',
    body: `A **DMZ (Demilitarised Zone)** is a separate network for servers that **must be reachable from the Internet**: web/Internet banking front-ends, email gateways, reverse proxies, public DNS, VPN gateways.

Firewall zones and trust levels:
- **Internet / outside** — untrusted.
- **DMZ** — semi-trusted. Reachable from the Internet only on needed ports.
- **Internal / inside** — trusted (and further split into zones: users, servers, core banking, cards, management).

Typical rules:
- Internet → DMZ web: **allow 443 only**.
- Internet → internal: **deny**.
- DMZ → internal: **only specific** app server/API ports, never "any".
- Internal → DMZ (admin): only from the management network.

Designs: **three-legged** firewall (one firewall, three interfaces) or **back-to-back** (two firewalls, often from **different vendors** — defence in depth). If a DMZ server is hacked, the attacker still cannot reach the internal network.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Firewall zones: Internet, DMZ, internal',
        width: 360,
        height: 270,
        zones: [
          { label: 'INTERNET (untrusted)', x: 4, y: 4, w: 96, h: 262, tone: 'red' },
          { label: 'DMZ (semi-trusted)', x: 150, y: 4, w: 206, h: 100, tone: 'amber' },
          { label: 'INTERNAL (trusted)', x: 150, y: 160, w: 206, h: 106, tone: 'green' },
        ],
        nodes: [
          { id: 'user', label: 'Customer', icon: 'user', x: 50, y: 70, info: 'A customer using Internet banking.' },
          { id: 'atk', label: 'Attacker', icon: 'user', x: 50, y: 200, info: 'An attacker scanning for open ports.' },
          { id: 'fw', label: 'Firewall', icon: 'firewall', x: 120, y: 135, info: '**Three-legged firewall**: one interface each for Internet, DMZ and internal. Every flow between zones needs an explicit rule.' },
          { id: 'web', label: 'Web server', icon: 'server', x: 210, y: 60, sub: 'Internet banking UI', info: 'Public-facing web front-end. Holds **no customer database** — it calls internal APIs.' },
          { id: 'mail', label: 'Mail gateway', icon: 'server', x: 310, y: 60, info: 'Receives Internet email, scans for spam/malware, then forwards to the internal mail server.' },
          { id: 'app', label: 'App server', icon: 'server', x: 210, y: 215, sub: 'API', info: 'Internal application/API server. Accepts only specific calls from the DMZ web server.' },
          { id: 'db', label: 'Database', icon: 'db', x: 310, y: 215, info: 'Customer data. Reachable **only** from the internal app servers.' },
        ],
        links: [
          { from: 'user', to: 'fw' },
          { from: 'atk', to: 'fw' },
          { from: 'fw', to: 'web' },
          { from: 'fw', to: 'mail' },
          { from: 'fw', to: 'app' },
          { from: 'app', to: 'db' },
        ],
        steps: [
          { text: '✅ **Internet → DMZ web on 443**: allowed. Customers reach the Internet banking front-end.', paths: [['user', 'fw', 'web']], packet: 'HTTPS 443', tone: 'green' },
          { text: '⛔ **Internet → internal database**: no rule → **blocked** and logged.', paths: [['atk', 'fw']], packet: 'DB port', tone: 'red', blocked: true },
          { text: '✅ **DMZ web → internal app server on its API port only** (e.g. 8443). The web server gets the data it needs through the app layer.', paths: [['web', 'fw', 'app']], packet: 'API 8443', tone: 'green' },
          { text: '⛔ **DMZ web → database directly**: blocked. Even if the web server is hacked, the attacker cannot query the database directly.', paths: [['web', 'fw']], packet: 'DB?', tone: 'red', blocked: true },
          { text: '✅ **Internal app → database**: allowed inside the trusted zone (still limited to the DB port and specific servers).', paths: [['app', 'db']], packet: 'SQL', tone: 'green' },
        ],
      },
    ],
    bank: `Internet banking, the bank's public website, email gateways and VPN gateways live in **DMZs**. Core banking, card systems and databases are **never** in the DMZ. Many banks use **two layers of firewalls** from different vendors so one vendor's vulnerability does not expose everything.`,
    remember: [
      'DMZ = zone for **Internet-facing** servers, between Internet and internal network.',
      'Rules: Internet → DMZ only needed ports; Internet → internal **deny**; DMZ → internal only specific ports.',
      'Designs: three-legged or **back-to-back** firewalls (defence in depth).',
    ],
    check: [
      {
        q: 'Which server belongs in a DMZ?',
        options: ['Core banking database', 'Active Directory domain controller', 'Internet banking web front-end', 'HR file server'],
        answer: 2,
        explain: 'Servers that must be reached from the Internet (web front-ends, mail gateways) go in the **DMZ**.',
      },
      {
        q: 'Why should DMZ servers not connect directly to the database?',
        options: ['It is slower', 'If a DMZ server is compromised, the attacker would reach the data directly', 'Databases cannot use TCP', 'DNS would fail'],
        answer: 1,
        explain: 'The DMZ is more exposed. Limiting it protects internal data if it is **compromised**.',
      },
    ],
  },
  {
    id: 'ids-ips',
    title: 'IDS vs IPS',
    analogy:
      '**IDS = a CCTV camera with an alarm**: it watches and alerts the security team, but cannot stop the thief. **IPS = a security guard at the door**: it sees the threat and **blocks** it immediately.',
    body: `**IDS (Intrusion Detection System)**
- Gets a **copy** of traffic (SPAN/mirror port or TAP) — **out of band**.
- **Detects and alerts** only. No impact on traffic if it fails.

**IPS (Intrusion Prevention System)**
- Sits **inline** — traffic passes through it.
- **Detects and blocks** (drops packets, resets connections).
- Risk: a **false positive** blocks good traffic; if it fails, it can stop traffic (fail-open vs fail-closed choice).

Detection methods:
- **Signature-based** — matches known attack patterns (like antivirus). Accurate for known attacks, misses new ones (zero-day).
- **Anomaly/behaviour-based** — learns "normal" and alerts on unusual behaviour. Finds new attacks, more false positives.

**False positive** = alert on good traffic. **False negative** = missing a real attack (worse!).

Today IPS is often built into the **NGFW**. **HIDS/HIPS** run on a host. Alerts go to a **SIEM** and the **SOC** team.`,
    visuals: [
      {
        kind: 'topology',
        title: 'IPS inline, IDS on a mirror port',
        width: 360,
        height: 210,
        nodes: [
          { id: 'inet', label: 'Internet', icon: 'internet', x: 35, y: 60, info: 'Untrusted traffic.' },
          { id: 'fw', label: 'Firewall', icon: 'firewall', x: 115, y: 60, info: 'Filters by rules.' },
          { id: 'ips', label: 'IPS (inline)', icon: 'shield', x: 205, y: 60, info: '**IPS** is in the traffic path. It inspects every packet and **drops** attacks.' },
          { id: 'core', label: 'Core switch', icon: 'switch', x: 300, y: 60, info: 'Has a **SPAN** (mirror) port sending a copy of traffic to the IDS.' },
          { id: 'ids', label: 'IDS (passive)', icon: 'monitor', x: 300, y: 165, info: '**IDS** only sees a **copy** of traffic. It **alerts** the SOC/SIEM but cannot block.' },
          { id: 'siem', label: 'SIEM / SOC', icon: 'user', x: 150, y: 165, info: '**SIEM** collects alerts and logs; the **SOC** team investigates.' },
        ],
        links: [
          { from: 'inet', to: 'fw' },
          { from: 'fw', to: 'ips' },
          { from: 'ips', to: 'core' },
          { from: 'core', to: 'ids', label: 'SPAN copy', style: 'dashed' },
          { from: 'ids', to: 'siem', style: 'dashed' },
        ],
        steps: [
          { text: 'Normal traffic passes the firewall and the **inline IPS** without problems.', paths: [['inet', 'fw', 'ips', 'core']], packet: 'OK' },
          { text: 'An exploit attempt matches an IPS signature → the **IPS drops it** immediately.', paths: [['inet', 'fw', 'ips']], packet: 'exploit', tone: 'red', blocked: true },
          { text: 'The **IDS** receives a **copy** of internal traffic from the SPAN port, sees suspicious behaviour and sends an **alert** to the SIEM. A human must respond.', paths: [['core', 'ids', 'siem']], packet: 'alert', tone: 'amber' },
        ],
      },
      {
        kind: 'compare',
        columns: [
          { label: 'IDS', icon: '📹', tone: 'amber' },
          { label: 'IPS', icon: '🛑', tone: 'red' },
        ],
        rows: [
          { label: 'Position', values: ['Out of band (copy of traffic)', 'Inline (in the path)'] },
          { label: 'Action', values: ['Detect + alert', 'Detect + block'] },
          { label: 'If it fails', values: ['Traffic continues', 'May stop traffic (unless fail-open)'] },
          { label: 'Risk', values: ['Attack not stopped automatically', 'False positive blocks good traffic'] },
        ],
      },
    ],
    bank: `Banks run **IPS** at the Internet edge and between important zones, and send all alerts to a **SIEM** monitored by a **SOC** (24×7). New IPS signatures are often tested in **detect-only mode** first, so a false positive does not block ATM or core banking traffic.`,
    remember: [
      '**IDS** = passive copy, **alert only**. **IPS** = **inline**, can **block**.',
      'Signature-based (known attacks) vs anomaly-based (unusual behaviour, more false positives).',
      'False positive = alert on good traffic; **false negative** = missed attack (worse).',
    ],
    check: [
      {
        q: 'Which device sits inline and can block attacks?',
        options: ['IDS', 'IPS', 'SIEM', 'Syslog server'],
        answer: 1,
        explain: 'An **IPS** is inline and can drop malicious traffic.',
      },
      {
        q: 'An IDS raises an alert for normal, legitimate traffic. This is a…',
        options: ['False negative', 'False positive', 'True positive', 'Zero-day'],
        answer: 1,
        explain: 'A **false positive** is an alert where there is no real attack.',
      },
    ],
  },
  {
    id: 'proxy',
    title: 'Proxy servers (forward and reverse)',
    analogy:
      'A **forward proxy** is like a company **driver** who goes out to shops for staff: shops only see the driver, and the company controls where the driver may go. A **reverse proxy** is a **receptionist** at the front desk who receives all visitors and sends them to the right office inside.',
    body: `A **proxy** makes requests **on behalf of** someone else.

**Forward proxy** (for users going out to the Internet)
- Staff browsers send web requests to the proxy; the proxy fetches the page.
- **URL/category filtering** (block gambling, malware sites), **logging** of who visited what, **malware scanning**, caching, **TLS inspection**.
- Hides internal IPs. Can require user authentication (AD).

**Reverse proxy** (for users coming in to your servers)
- Sits in front of web servers (in the DMZ). Clients only see the proxy.
- **TLS termination**, load balancing, caching, hides backend servers, often includes a **WAF**.

Proxies can be explicit (browser configured, e.g. port 8080/3128) or transparent.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Forward proxy for staff Internet access',
        width: 360,
        height: 180,
        nodes: [
          { id: 'pc', label: 'Staff PC', icon: 'pc', x: 40, y: 90, info: 'Browser configured to use the proxy (often via Group Policy).' },
          { id: 'px', label: 'Web proxy', icon: 'server', x: 140, y: 90, sub: 'filter + log', info: '**Forward proxy**: checks the user (AD), the URL category and scans downloads. Logs everything.' },
          { id: 'fw', label: 'Firewall', icon: 'firewall', x: 230, y: 90, info: 'Only the proxy is allowed to go out on 80/443 — PCs cannot bypass it.' },
          { id: 'ok', label: 'News site', icon: 'globe', x: 320, y: 40, info: 'Allowed category.' },
          { id: 'bad', label: 'Malware site', icon: 'globe', x: 320, y: 145, info: 'Blocked category.' },
        ],
        links: [
          { from: 'pc', to: 'px' },
          { from: 'px', to: 'fw' },
          { from: 'fw', to: 'ok' },
          { from: 'fw', to: 'bad', style: 'dashed' },
        ],
        steps: [
          { text: 'A staff member opens a news site. The **proxy** checks the category (allowed), fetches the page through the firewall and logs the request.', paths: [['pc', 'px', 'fw', 'ok']], packet: 'GET', tone: 'green' },
          { text: 'The user clicks a phishing link to a **known malware site**. The proxy **blocks** it and shows a warning page.', paths: [['pc', 'px']], packet: 'malware URL', tone: 'red', blocked: true },
          { text: 'A PC tries to go to the Internet **directly**, bypassing the proxy. The firewall allows outbound web only from the proxy → **blocked**.', paths: [['pc', 'px', 'fw']], packet: 'direct?', tone: 'red', blocked: true },
        ],
      },
    ],
    bank: `Bank staff Internet access normally goes through a **forward proxy / secure web gateway** with category filtering, malware scanning and logs kept for investigations. Internet banking is published through a **reverse proxy / WAF** in the DMZ, so the real application servers are never directly exposed.`,
    remember: [
      '**Forward proxy** = users → Internet: filtering, logging, malware scanning, hides internal IPs.',
      '**Reverse proxy** = Internet → your servers: TLS termination, load balancing, WAF, hides backends.',
      'Firewall should force web traffic through the proxy.',
    ],
    check: [
      {
        q: 'Which device sits in front of web servers and receives client requests on their behalf?',
        options: ['Forward proxy', 'Reverse proxy', 'DHCP server', 'IDS'],
        answer: 1,
        explain: 'A **reverse proxy** represents the servers to clients (often with TLS termination and WAF).',
      },
      {
        q: 'What is a main purpose of a forward proxy in a bank?',
        options: ['Assign IP addresses', 'Filter and log staff web access', 'Replicate databases', 'Route between VLANs'],
        answer: 1,
        explain: 'It enforces **web filtering**, malware scanning and **logging** for staff Internet use.',
      },
    ],
  },
  {
    id: 'nac',
    title: 'NAC and 802.1X',
    analogy:
      'Before entering the bank\'s staff area, you **tap your ID card** at the door. If your card is valid, the door opens to your floor. Visitors get a **visitor badge** that opens only the lobby. NAC does this for **network ports and Wi-Fi**.',
    body: `**NAC (Network Access Control)** decides **who and what** may connect to the network, and **where** they go.

**802.1X** is the standard for port-based authentication:
- **Supplicant** — the device (PC) asking for access.
- **Authenticator** — the switch or Wi-Fi access point. It blocks the port (except authentication traffic) until approved.
- **Authentication server** — usually **RADIUS** (e.g. Microsoft NPS, Cisco ISE), checking against **Active Directory** or certificates.
- Messages use **EAP** (e.g. EAP-TLS with certificates — strongest).

Results can be dynamic: correct VLAN, ACL, or a **guest / quarantine VLAN** for unknown or unhealthy devices. **Posture checks** can require patches and antivirus.

For devices that cannot do 802.1X (printers, cameras): **MAB** (MAC Authentication Bypass) — weaker, because MACs can be spoofed.`,
    visuals: [
      {
        kind: 'sequence',
        title: '802.1X: a teller PC connects to a switch port',
        actors: [
          { id: 'pc', label: 'PC', icon: 'pc', sub: 'supplicant' },
          { id: 'sw', label: 'Switch', icon: 'switch', sub: 'authenticator' },
          { id: 'rad', label: 'RADIUS', icon: 'server', sub: 'NPS / ISE' },
          { id: 'ad', label: 'AD / CA', icon: 'shield' },
        ],
        steps: [
          { from: 'pc', to: 'sw', label: 'link up (port blocked)', detail: 'The PC is plugged in. The port is **unauthorised**: only EAPOL (authentication) frames pass. No DHCP, no network yet.', tone: 'slate' },
          { from: 'sw', to: 'pc', label: 'EAP: who are you?', detail: 'The switch asks for the identity (EAP-Request/Identity).', tone: 'blue' },
          { from: 'pc', to: 'sw', label: 'EAP identity + cert', detail: 'The PC answers with its identity — best is a **machine certificate** (EAP-TLS).', tone: 'blue' },
          { from: 'sw', to: 'rad', label: 'RADIUS Access-Request', detail: 'The switch relays the EAP data to the RADIUS server inside **RADIUS** (UDP 1812).', tone: 'purple' },
          { from: 'rad', to: 'ad', label: 'check user / cert', detail: 'RADIUS checks the certificate and the computer/user account in **Active Directory** and the policy (e.g. "Branch PCs").', tone: 'purple' },
          { from: 'rad', to: 'sw', label: 'Access-Accept + VLAN 10', detail: 'Policy matched → **Access-Accept**, with the VLAN to use. (An unknown device would get Reject or a **guest/quarantine VLAN**.)', tone: 'green' },
          { from: 'sw', to: 'pc', label: 'port authorised', detail: 'The port opens in VLAN 10. Now the PC does DHCP and works normally. Everything is logged.', tone: 'green' },
        ],
      },
    ],
    bank: `With 802.1X, if someone plugs a **personal laptop** into a branch network socket, it gets **no access** (or only a guest VLAN). Company laptops with valid certificates get the right VLAN automatically. This helps with **PCI DSS** and stops attackers who get physical access to a socket.`,
    remember: [
      'NAC controls **who/what** connects and **where** they go.',
      '802.1X roles: **supplicant** (device), **authenticator** (switch/AP), **authentication server** (RADIUS). Uses EAP.',
      'Unknown/unhealthy devices → reject or **guest/quarantine VLAN**. MAB for devices without 802.1X.',
    ],
    check: [
      {
        q: 'In 802.1X, which role does the switch play?',
        options: ['Supplicant', 'Authenticator', 'Authentication server', 'Certificate authority'],
        answer: 1,
        explain: 'The switch (or AP) is the **authenticator**; the device is the supplicant; RADIUS is the server.',
      },
      {
        q: 'Which protocol does the switch use to talk to the authentication server?',
        options: ['SNMP', 'RADIUS', 'SMTP', 'NTP'],
        answer: 1,
        explain: '802.1X authenticators talk to a **RADIUS** server (UDP 1812).',
      },
    ],
  },
  {
    id: 'load-balancers',
    title: 'Load balancers',
    analogy:
      'At a busy bank branch, a **queue manager** at the door sends each customer to a **free counter**. If one teller goes on a break, the manager stops sending customers there.',
    body: `A **load balancer (LB)** spreads client requests across **several servers** behind one **virtual IP (VIP)**.

Why: **scalability** (add servers), **high availability** (a failed server is removed), **maintenance without downtime**.

Key features:
- **Health checks** — the LB regularly tests each server (ping, TCP port, or HTTP "/health"). Failed servers get no traffic.
- **Algorithms** — **round robin**, **least connections**, weighted, IP hash.
- **Session persistence (sticky sessions)** — keep a user on the same server if the app stores session data locally.
- **L4 LB** — balances by IP/port (fast). **L7 LB** — reads HTTP (URL, headers, cookies) for smarter decisions.
- **SSL/TLS offloading** — the LB decrypts TLS, saving server CPU (and can then inspect with a WAF).

LBs themselves are deployed in **HA pairs** so they are not a single point of failure.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Load balancer with health checks',
        width: 360,
        height: 210,
        nodes: [
          { id: 'u', label: 'Customers', icon: 'user', x: 40, y: 105, info: 'Use the website name, which resolves to the **VIP** of the load balancer.' },
          { id: 'lb', label: 'Load balancer', icon: 'lb', x: 150, y: 105, sub: 'VIP 203.0.113.25', info: 'Holds the **virtual IP**. Sends each new request to a healthy server using the chosen algorithm. Checks health every few seconds.' },
          { id: 'w1', label: 'Web 1', icon: 'server', x: 290, y: 35, info: 'Healthy.' },
          { id: 'w2', label: 'Web 2', icon: 'server', x: 290, y: 105, info: 'Healthy.' },
          { id: 'w3', label: 'Web 3', icon: 'server', x: 290, y: 175, info: 'Fails its health check in step 3.' },
        ],
        links: [
          { from: 'u', to: 'lb' },
          { from: 'lb', to: 'w1' },
          { from: 'lb', to: 'w2' },
          { from: 'lb', to: 'w3' },
        ],
        steps: [
          { text: '**Round robin**: request 1 → Web 1.', paths: [['u', 'lb', 'w1']], packet: 'req 1' },
          { text: 'Request 2 → Web 2, request 3 → Web 3, and so on. The load is shared.', paths: [['u', 'lb', 'w2'], ['u', 'lb', 'w3']], packet: 'req 2,3' },
          { text: 'Web 3 **fails its health check** (HTTP /health returns error). The LB **removes it** from the pool. Customers notice nothing.', paths: [['lb', 'w3']], packet: 'health?', tone: 'red', blocked: true },
          { text: 'New requests go only to Web 1 and Web 2. IT can now repair or patch Web 3 and add it back.', paths: [['u', 'lb', 'w1'], ['u', 'lb', 'w2']], packet: 'req', tone: 'green' },
        ],
      },
    ],
    bank: `Internet banking and mobile banking APIs run on several servers behind a **load balancer pair** (often with WAF). During monthly patching, admins **drain** one server (stop new sessions), patch it, check it, put it back, then do the next — **zero downtime** for customers. As a developer you already know health endpoints (e.g. Spring Boot Actuator) — mention this!`,
    remember: [
      'LB spreads traffic across servers behind a **VIP**; removes failed servers with **health checks**.',
      'Algorithms: round robin, least connections, weighted. **Sticky sessions** when needed.',
      'L4 vs L7; **TLS offload**; deploy LBs as an **HA pair**.',
    ],
    check: [
      {
        q: 'How does a load balancer know a server has failed?',
        options: ['Users send emails', 'Health checks', 'DNS TTL', 'STP BPDUs'],
        answer: 1,
        explain: 'The LB sends regular **health checks** and stops using servers that fail.',
      },
      {
        q: 'Which algorithm sends new requests to the server with the fewest active connections?',
        options: ['Round robin', 'Least connections', 'IP hash', 'Random'],
        answer: 1,
        explain: '**Least connections** picks the least busy server.',
      },
    ],
  },
  {
    id: 'wifi-security',
    title: 'Wi-Fi security',
    analogy:
      'Wi-Fi is like talking in a **public park** — anyone nearby can listen. Encryption (WPA2/WPA3) is like speaking in a **secret language** that only people with the right key understand.',
    body: `Wi-Fi signals go through walls, so **strong encryption and authentication** are essential.

| Standard | Encryption | Status |
|---|---|---|
| **WEP** | RC4 | **Broken** — never use |
| **WPA** | TKIP | Weak, deprecated |
| **WPA2** | **AES-CCMP** | Good, widely used |
| **WPA3** | AES + **SAE** | Best — protects against offline password guessing |

**Personal (PSK)** = one shared password for everyone — OK at home, **bad for companies** (when a staff member leaves, the password is still known).
**Enterprise (802.1X/RADIUS)** = each user/device logs in with their own credentials or certificate — **use this in a bank**.

Other good practices:
- **Separate guest Wi-Fi** (own VLAN, Internet only, client isolation, no access to internal).
- Detect **rogue access points** and **evil twin** APs (fake APs with the same name) — wireless IPS.
- Disable WPS; manage APs centrally with a **wireless controller**.`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'WPA2/3-Personal', icon: '🔑', tone: 'amber' },
          { label: 'WPA2/3-Enterprise', icon: '🪪', tone: 'green' },
          { label: 'Guest Wi-Fi', icon: '☕', tone: 'slate' },
        ],
        rows: [
          { label: 'Login', values: ['One shared password', 'Own username/certificate via RADIUS', 'Portal / voucher'] },
          { label: 'Staff leaves', values: ['Must change password for all', 'Just disable their account', 'N/A'] },
          { label: 'Network', values: ['Internal (risky)', 'Correct VLAN per user/role', 'Separate VLAN, Internet only'] },
          { label: 'Bank use', values: ['Avoid', '✅ Staff Wi-Fi', '✅ Customers / visitors'] },
        ],
      },
    ],
    bank: `If a branch offers Wi-Fi to customers, it must be **completely separate** from the bank network (separate VLAN or even separate Internet line, client isolation). Staff Wi-Fi uses **WPA2/WPA3-Enterprise** with 802.1X and company certificates. Wireless scanning looks for **rogue APs** that someone may connect to a branch switch.`,
    remember: [
      'WEP broken, WPA weak, **WPA2 (AES)** good, **WPA3 (SAE)** best.',
      'Companies use **Enterprise (802.1X/RADIUS)**, not a shared PSK.',
      '**Guest Wi-Fi isolated** from internal; detect rogue/evil twin APs.',
    ],
    check: [
      {
        q: 'Which Wi-Fi security option is best for bank staff?',
        options: ['WEP', 'WPA2-Personal with one password', 'WPA2/WPA3-Enterprise with 802.1X', 'Open network with MAC filtering'],
        answer: 2,
        explain: '**Enterprise** gives each user/device its own credentials via RADIUS.',
      },
      {
        q: 'What is an "evil twin" attack?',
        options: ['Two switches in a loop', 'A fake access point with the same name as the real one', 'A duplicate IP address', 'A cloned hard disk'],
        answer: 1,
        explain: 'An **evil twin** is a rogue AP pretending to be the real network to steal credentials.',
      },
    ],
  },
];
