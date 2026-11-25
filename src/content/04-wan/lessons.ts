import type { Section } from '../types';
import { bankTopology } from '../shared/bankTopology';

export const sections: Section[] = [
  {
    id: 'wan-links',
    title: 'WAN basics and link types',
    analogy:
      'A **LAN** is the roads **inside** your housing scheme. A **WAN** is the **highway network between towns**. You can rent a **private road** just for you (leased line), share a **toll highway** with lanes for your company (MPLS), or use the **public roads** with an armoured car (Internet + VPN).',
    body: `A **WAN (Wide Area Network)** connects sites over long distances — usually using a **telecom provider's** network. A bank's WAN connects the head office, data centre, DR site, hundreds of branches and ATMs.

Main link types:
- **Leased line** — a **dedicated point-to-point** circuit between two sites. Fixed, symmetric bandwidth, guaranteed SLA, private — but **expensive** and only connects two points. (Old units: E1 = 2.048 Mbps, T1 = 1.544 Mbps; today mostly fibre Ethernet.)
- **MPLS VPN** — the provider's private network carries traffic between **all your sites** (any-to-any), with QoS and SLA.
- **Internet broadband / fibre** — cheap and fast, but **shared and not private** → must use a **VPN (IPsec)**.
- **4G / 5G (LTE)** — quick to deploy, great as **backup** or for off-site ATMs (often with a private APN + VPN).
- **Satellite (VSAT)** — for very remote places; high latency.

Important WAN terms: **bandwidth**, **latency** (delay), **jitter** (variation in delay), **packet loss**, **SLA** (availability %, repair time).`,
    visuals: [
      {
        kind: 'compare',
        title: 'WAN link types',
        columns: [
          { label: 'Leased line', icon: '🛣️', tone: 'blue' },
          { label: 'MPLS', icon: '🏷️', tone: 'purple' },
          { label: 'Internet + VPN', icon: '🌍', tone: 'green' },
          { label: '4G/5G', icon: '📶', tone: 'amber' },
        ],
        rows: [
          { label: 'Private?', values: ['Yes, dedicated', 'Yes, provider VPN', 'No → needs IPsec', 'No → needs VPN/APN'] },
          { label: 'Cost', values: ['High', 'Medium–high', 'Low', 'Low–medium'] },
          { label: 'Quality / SLA', values: ['Guaranteed', 'Guaranteed + QoS', 'Best effort', 'Variable'] },
          { label: 'Typical bank use', values: ['DC ↔ DR link', 'Main branch WAN', 'Backup / SD-WAN', 'Backup, off-site ATMs'] },
        ],
      },
    ],
    bank: `A typical bank branch has **two WAN connections from two different providers**: for example MPLS (primary) and 4G or fibre Internet with IPsec (backup). The **DC and DR site** are often linked with high-capacity dedicated fibre or leased lines for replication.`,
    remember: [
      'WAN = connects distant sites through a provider. Leased line = dedicated point-to-point; MPLS = provider private any-to-any network.',
      'Internet and 4G are cheap but **not private** → use **IPsec VPN**.',
      'Key WAN metrics: bandwidth, **latency, jitter, packet loss**, SLA.',
    ],
    check: [
      {
        q: 'What is the main disadvantage of a leased line?',
        options: ['It is not private', 'It is expensive and only connects two points', 'It has no bandwidth guarantee', 'It needs Wi-Fi'],
        answer: 1,
        explain: 'Leased lines are private and reliable but **costly** and **point-to-point** only.',
      },
      {
        q: 'Which link would you choose as a cheap, quick backup for a branch?',
        options: ['A second leased line', '4G/LTE with VPN', 'Satellite only', 'A longer Ethernet cable'],
        answer: 1,
        explain: '**4G/LTE (with VPN or private APN)** is quick to deploy and cheap — ideal as backup.',
      },
    ],
  },
  {
    id: 'mpls',
    title: 'MPLS',
    analogy:
      'At a big sorting centre, parcels get a **coloured sticker** (label) on entry. Workers inside do not open the parcel or read the address — they just look at the sticker and push it onto the right conveyor. Very fast. The sticker is removed at the exit.',
    body: `**MPLS (Multiprotocol Label Switching)** is a technique used **inside a provider's network**. Instead of reading the IP header at every router, routers forward using a short **label** (sometimes called "Layer 2.5", between L2 and L3).

Router roles:
- **CE (Customer Edge)** — your router at the branch/DC.
- **PE (Provider Edge)** — the provider's edge router: **pushes** a label when traffic enters and **pops** it when it leaves.
- **P (Provider core)** — **swaps** labels and forwards quickly.

**MPLS L3VPN** (what banks buy): each customer gets its own routing table (**VRF**) inside the provider network, so customers are separated even if they use the same private IPs.

Why banks use MPLS:
- **Any-to-any** connectivity between all sites.
- **QoS** classes (voice, core banking, best effort) and **SLAs**.
- Private (separated from Internet traffic).

⚠️ MPLS separates traffic but does **not encrypt** it by itself. Many banks add **IPsec/encryption** on top for sensitive data.`,
    visuals: [
      {
        kind: 'topology',
        title: 'A packet across the provider\'s MPLS network',
        width: 360,
        height: 200,
        zones: [{ label: 'Provider MPLS network', x: 70, y: 40, w: 220, h: 150, tone: 'purple' }],
        nodes: [
          { id: 'ce1', label: 'Branch CE', icon: 'router', x: 30, y: 115, info: '**Customer Edge** router at the branch. It sends normal IP packets to the provider.' },
          { id: 'pe1', label: 'PE1', icon: 'router', x: 110, y: 115, info: '**Provider Edge**: looks up the customer\'s **VRF** and **pushes** a label.' },
          { id: 'p1', label: 'P', icon: 'router', x: 180, y: 75, info: '**Provider core** router: only looks at the label and **swaps** it. Very fast.' },
          { id: 'p2', label: 'P', icon: 'router', x: 180, y: 160, info: 'Another core router (alternative path).' },
          { id: 'pe2', label: 'PE2', icon: 'router', x: 250, y: 115, info: '**Provider Edge** on the DC side: **pops** the label and delivers the IP packet to the customer.' },
          { id: 'ce2', label: 'DC CE', icon: 'router', x: 330, y: 115, info: 'Customer Edge router at the data centre.' },
        ],
        links: [
          { from: 'ce1', to: 'pe1' },
          { from: 'pe1', to: 'p1' },
          { from: 'pe1', to: 'p2' },
          { from: 'p1', to: 'pe2' },
          { from: 'p2', to: 'pe2' },
          { from: 'ce2', to: 'pe2' },
        ],
        steps: [
          { text: 'The branch CE sends a normal IP packet (10.20.5.25 → 10.1.10.50) to PE1.', paths: [['ce1', 'pe1']], packet: 'IP' },
          { text: 'PE1 finds the bank\'s **VRF**, **pushes a label** (e.g. 300) and sends it into the core.', paths: [['pe1', 'p1']], packet: 'label 300', tone: 'purple' },
          { text: 'The P router does not read the IP header — it **swaps** label 300 → 410 and forwards.', paths: [['p1', 'pe2']], packet: 'label 410', tone: 'purple' },
          { text: 'PE2 **pops** the label and sends the original IP packet to the DC CE router. Other customers on the same provider never see this traffic (separate VRFs).', paths: [['pe2', 'ce2']], packet: 'IP', tone: 'green' },
        ],
      },
    ],
    bank: `A bank buys an **MPLS L3VPN** from a telecom provider to connect all branches to the DC and DR. The provider guarantees, for example, 99.9% availability and gives **QoS classes**: real-time (voice), critical (core banking, ATM), and best effort (email, updates).`,
    remember: [
      'MPLS forwards by **labels**; CE = customer, **PE pushes/pops**, **P swaps**.',
      'MPLS L3VPN uses **VRFs** to separate customers; gives any-to-any, QoS, SLA.',
      'MPLS is **private but not encrypted** by default.',
    ],
    check: [
      {
        q: 'Which router adds (pushes) the MPLS label?',
        options: ['CE router', 'PE router', 'P router', 'The PC'],
        answer: 1,
        explain: 'The **Provider Edge** pushes the label at ingress and pops it at egress.',
      },
      {
        q: 'Does MPLS encrypt traffic by default?',
        options: ['Yes, with AES', 'No — it separates traffic but does not encrypt it', 'Only voice traffic', 'Only on weekends'],
        answer: 1,
        explain: 'MPLS keeps customers separate but **does not encrypt**. Add IPsec if encryption is required.',
      },
    ],
  },
  {
    id: 'ipsec',
    title: 'Site-to-site VPN and IPsec',
    analogy:
      'You must send money between two branches using **public roads**. You put it in a **locked armoured box** (encryption), with a **seal** that shows if anyone opened it (integrity), and only the two branch managers have the **keys** (authentication).',
    body: `A **site-to-site VPN** connects two **networks** (e.g. a branch and the DC) over the Internet, through an encrypted **tunnel** between two firewalls/routers. Users do not need any software.

**IPsec** is the standard suite used:
- **IKE** (Internet Key Exchange, UDP **500**; **4500** with NAT-T) — authenticates the peers (pre-shared key or **certificates**) and creates keys.
  - **Phase 1**: secure management channel (IKE SA).
  - **Phase 2**: IPsec SAs for the actual traffic.
- **ESP** (IP protocol **50**) — **encryption + integrity** (+ authentication). Used almost always.
- **AH** (IP protocol **51**) — integrity only, no encryption, does not work through NAT. Rarely used.

Modes:
- **Tunnel mode** — encrypts the **whole original packet** and adds a new IP header (site-to-site).
- **Transport mode** — encrypts only the payload (host-to-host).

IPsec gives **confidentiality** (AES), **integrity** (SHA-2), **authentication** and **anti-replay**.`,
    visuals: [{ kind: 'custom', id: 'vpnTunnel' }],
    bank: `A branch's **backup link** is plain Internet or 4G. The branch firewall builds an **IPsec tunnel** to the DC firewall, so even on the public Internet the teller traffic is encrypted. Off-site ATMs on 4G use the same idea. If a tunnel is down, check: **Phase 1** (keys, peer IP, IKE version, proposals) then **Phase 2** (matching subnets/"interesting traffic", proposals).`,
    remember: [
      'IPsec = **IKE** (UDP 500/4500) + **ESP** (protocol 50, encryption) / AH (51, integrity only).',
      'IKE **Phase 1** = secure channel; **Phase 2** = IPsec SAs for data.',
      'Site-to-site uses **tunnel mode**: whole packet encrypted + new IP header.',
    ],
    check: [
      {
        q: 'Which IPsec protocol provides encryption?',
        options: ['AH', 'ESP', 'IKE', 'GRE'],
        answer: 1,
        explain: '**ESP** provides encryption and integrity. AH only gives integrity.',
      },
      {
        q: 'Which port does IKE use?',
        options: ['TCP 443', 'UDP 500', 'TCP 22', 'UDP 1812'],
        answer: 1,
        explain: 'IKE uses **UDP 500** (and UDP 4500 for NAT traversal).',
      },
      {
        q: 'In tunnel mode, what is encrypted?',
        options: ['Only the TCP header', 'Only the data', 'The entire original IP packet', 'Nothing'],
        answer: 2,
        explain: 'Tunnel mode encrypts the **whole original packet** and adds a new outer IP header.',
      },
    ],
  },
  {
    id: 'ssl-vpn',
    title: 'Remote access and SSL VPN',
    analogy:
      'Site-to-site VPN is a **private tunnel between two buildings**. Remote-access VPN is a **personal security escort** for one employee working from home: the escort checks your ID (MFA) and walks you only to the rooms you are allowed to enter.',
    body: `**Remote-access VPN** connects **one user's device** to the company network (work from home, IT support at night, vendors).

**SSL/TLS VPN**
- Uses **TLS over TCP 443** — passes through almost any firewall or hotel Wi-Fi.
- **Clientless** (browser portal for web apps) or **full client** (e.g. a VPN app giving a full tunnel).
- Can also use IPsec (IKEv2) clients.

Good security for bank remote access:
- **MFA** (password + OTP/app) — always.
- **Posture check / NAC**: is the laptop company-owned, patched, antivirus running?
- **Least privilege**: give access only to needed systems (per group policies).
- **Full tunnel** (not split tunnelling) so all traffic is inspected.
- Session timeouts and **logging** of every connection.`,
    visuals: [
      {
        kind: 'sequence',
        title: 'An IT admin connects from home',
        actors: [
          { id: 'u', label: 'Laptop', icon: 'laptop', sub: 'home Wi-Fi' },
          { id: 'gw', label: 'VPN gateway', icon: 'firewall', sub: 'TCP 443' },
          { id: 'id', label: 'AD + MFA', icon: 'shield', sub: 'RADIUS/LDAP' },
          { id: 'srv', label: 'Internal app', icon: 'server' },
        ],
        steps: [
          { from: 'u', to: 'gw', label: 'TLS handshake :443', detail: 'The VPN client connects to the gateway on **TCP 443** and checks the gateway\'s **certificate** (so it is not a fake server).', tone: 'blue' },
          { from: 'u', to: 'gw', label: 'username + password', detail: 'The user logs in inside the encrypted TLS session.', tone: 'indigo' },
          { from: 'gw', to: 'id', label: 'verify + MFA', detail: 'The gateway checks the credentials with **Active Directory** (via RADIUS/LDAP) and triggers **MFA** (OTP or push).', tone: 'purple' },
          { from: 'id', to: 'gw', label: 'OK · group = IT-Admins', detail: 'MFA succeeds. The user\'s **group** decides what they may access.', tone: 'green' },
          { from: 'gw', to: 'u', label: 'tunnel up + posture OK', detail: 'The gateway checks the **device posture** (company laptop, patched, AV on), gives the laptop a VPN IP and builds the tunnel.', tone: 'green' },
          { from: 'u', to: 'srv', label: 'only allowed apps', detail: 'The admin reaches only the systems allowed for IT-Admins. Everything is **logged**.', tone: 'teal' },
        ],
      },
      {
        kind: 'compare',
        columns: [
          { label: 'IPsec VPN', icon: '🔒', tone: 'purple' },
          { label: 'SSL/TLS VPN', icon: '🌐', tone: 'green' },
        ],
        rows: [
          { label: 'Main use', values: ['Site-to-site (network to network)', 'Remote users'] },
          { label: 'Layer', values: ['Layer 3 (IP)', 'Uses TLS (above L4)'] },
          { label: 'Ports', values: ['UDP 500/4500, ESP (50)', 'TCP 443'] },
          { label: 'Client', values: ['Built into firewalls/routers', 'Browser or VPN app'] },
          { label: 'Firewall-friendly', values: ['Sometimes blocked', 'Almost always works'] },
        ],
      },
    ],
    bank: `A bank allows remote access only for approved staff and vendors, using **MFA**, company-managed laptops, and access limited by role. Vendor access is often **time-limited** and monitored (privileged access management). A stolen password alone is not enough to connect.`,
    remember: [
      'Remote-access VPN = one user ↔ network. SSL VPN uses **TLS on TCP 443**.',
      'Bank must-haves: **MFA**, posture check, least privilege, full tunnel, logging.',
      'IPsec = mostly site-to-site; SSL VPN = mostly remote users.',
    ],
    check: [
      {
        q: 'Why does an SSL VPN work from almost any hotel or home network?',
        options: ['It uses UDP 500', 'It uses TCP 443, which is almost never blocked', 'It does not need the Internet', 'It uses Telnet'],
        answer: 1,
        explain: 'SSL VPN uses **TCP 443** (same as HTTPS), which is open almost everywhere.',
      },
      {
        q: 'Which control is MOST important to add to a bank\'s remote access VPN?',
        options: ['A longer timeout', 'Multi-factor authentication', 'Split tunnelling', 'Allowing personal devices'],
        answer: 1,
        explain: '**MFA** stops attackers who have stolen a password.',
      },
    ],
  },
  {
    id: 'sd-wan',
    title: 'SD-WAN basics',
    analogy:
      'A smart taxi app that watches **all roads in real time**: it sends urgent passengers (core banking) on the **fastest reliable road**, normal passengers (web browsing) on the **cheap road**, and changes route instantly when there is a traffic jam.',
    body: `**SD-WAN (Software-Defined WAN)** builds a smart **overlay** on top of several links (MPLS, broadband, 4G) and manages them from a **central controller**.

Key features:
- **Uses all links at once** (active-active), not just primary + idle backup.
- **Application-aware routing** — recognises apps and sends each one on the best link based on policy.
- **Measures link quality** continuously (latency, jitter, packet loss) and moves traffic **automatically** when a link degrades.
- **Encrypted overlay** (IPsec tunnels) over every link.
- **Central management** and **zero-touch provisioning** — a new branch device configures itself from the controller.

Benefits: lower cost (more broadband, less MPLS), better performance, faster deployment of new branches, better visibility.`,
    visuals: [
      {
        kind: 'topology',
        title: 'SD-WAN at a branch',
        width: 360,
        height: 230,
        nodes: [
          { id: 'br', label: 'Branch SD-WAN edge', icon: 'router', x: 50, y: 120, info: 'The branch SD-WAN device. It measures every link and applies policies from the controller.' },
          { id: 'mpls', label: 'MPLS', icon: 'cloud', x: 180, y: 45, info: 'Reliable, QoS, more expensive.' },
          { id: 'inet', label: 'Broadband', icon: 'internet', x: 180, y: 120, info: 'Cheap and fast, best effort. Protected with IPsec overlay.' },
          { id: 'lte', label: '4G', icon: 'phone', x: 180, y: 195, info: 'Backup / extra capacity.' },
          { id: 'dc', label: 'Data centre', icon: 'server', x: 310, y: 80, info: 'Core banking and internal apps.' },
          { id: 'saas', label: 'Cloud / SaaS', icon: 'cloud', x: 310, y: 175, info: 'E.g. email or collaboration SaaS — can go directly to the Internet (with security controls) to save MPLS bandwidth.' },
          { id: 'ctl', label: 'Controller', icon: 'monitor', x: 50, y: 30, info: '**Central controller / orchestrator**: pushes policies, shows link health, zero-touch provisioning for new branches.' },
        ],
        links: [
          { from: 'br', to: 'mpls', tone: 'purple' },
          { from: 'br', to: 'inet', style: 'tunnel' },
          { from: 'br', to: 'lte', style: 'tunnel', tone: 'amber' },
          { from: 'mpls', to: 'dc' },
          { from: 'inet', to: 'dc' },
          { from: 'inet', to: 'saas' },
          { from: 'lte', to: 'dc' },
          { from: 'ctl', to: 'br', style: 'dashed', label: 'policy' },
        ],
        steps: [
          { text: 'Policy: **core banking** traffic prefers **MPLS** (lowest jitter and loss).', paths: [['br', 'mpls', 'dc']], packet: 'CBS', tone: 'purple' },
          { text: '**Cloud/SaaS** traffic goes out directly over **broadband** (inside security policy), saving MPLS bandwidth.', paths: [['br', 'inet', 'saas']], packet: 'SaaS', tone: 'green' },
          { text: 'MPLS shows high packet loss. SD-WAN **automatically** moves core banking to the **broadband IPsec tunnel** within seconds — no manual change.', paths: [['br', 'inet', 'dc']], packet: 'CBS', tone: 'amber' },
          { text: 'Broadband also fails → traffic uses **4G**. Tellers keep working.', paths: [['br', 'lte', 'dc']], packet: 'CBS', tone: 'red' },
        ],
      },
    ],
    bank: `Many banks are moving branches to **SD-WAN** to combine MPLS with cheaper links, get automatic failover and see application performance per branch. For an interview, know the **idea**: central control, app-aware routing, multiple links, encryption, automatic failover.`,
    remember: [
      'SD-WAN = overlay across many links (MPLS, broadband, 4G) with a **central controller**.',
      '**App-aware routing** + continuous link quality checks → automatic failover.',
      'Benefits: cost, performance, fast branch deployment (zero-touch), visibility.',
    ],
    check: [
      {
        q: 'What is a key feature of SD-WAN?',
        options: ['It only works with leased lines', 'Application-aware routing across multiple links', 'It replaces DNS', 'It needs no encryption'],
        answer: 1,
        explain: 'SD-WAN chooses the best link **per application**, based on live quality measurements.',
      },
      {
        q: 'What does "zero-touch provisioning" mean?',
        options: ['The device cannot be configured', 'A new device downloads its configuration automatically from the controller', 'No cables are needed', 'Users cannot touch the device'],
        answer: 1,
        explain: 'The edge device is plugged in and pulls its config from the **central controller**.',
      },
    ],
  },
  {
    id: 'branch-atm',
    title: 'How branches and ATMs connect to the head office',
    analogy:
      'Think of the **data centre as the heart** and the WAN as **blood vessels**. Every branch and ATM is a part of the body that must stay connected to the heart — with a second vessel in case one is blocked.',
    body: `**Branch** (typical, generic design):
- **Router/firewall** (or SD-WAN device) with **two WAN links** from different providers.
- **Access switch** with VLANs: staff, voice, CCTV, ATM, management.
- Traffic to the DC: core banking (HTTPS/app protocol), email, AD/DNS, printing, monitoring.
- Usually **no direct Internet** for tellers — Internet goes through the DC's proxy/firewall, or tightly controlled.

**ATM**:
- On-site ATMs (in a branch) use the branch network in a **separate VLAN**.
- Off-site ATMs (shopping malls, fuel stations) often use **4G with a private APN** and/or **IPsec VPN**, sometimes with a backup link.
- ATMs talk **only to the ATM switch/host** in the DC (card transactions, ISO 8583). Strong encryption, PCI DSS rules, PIN encryption in the hardware (EPP/HSM).

**Data centre side**: WAN routers, firewalls, core switches, ATM switch, core banking — with the **DR site** connected too, so branches can fail over.`,
    visuals: [bankTopology],
    bank: `If an interviewer asks "How would you connect a new branch?", answer: two WAN links from different providers (MPLS + 4G/broadband with IPsec), a branch router/firewall, a switch with standard VLANs, IP plan from the template, routing to both DC and DR, monitoring (SNMP/syslog), and security (no unused ports, port security, NAC).`,
    remember: [
      'Branch = router/firewall + switch with VLANs + **two WAN links** from different providers.',
      'ATMs are isolated (own VLAN/VPN) and talk only to the **ATM switch** in the DC.',
      'All sites also connect to the **DR site** for failover.',
    ],
    check: [
      {
        q: 'How is an off-site ATM (e.g. in a shopping mall) commonly connected?',
        options: ['Through the mall\'s public Wi-Fi without encryption', '4G with a private APN and/or IPsec VPN to the bank', 'Bluetooth to the nearest branch', 'Directly to the Internet with no firewall'],
        answer: 1,
        explain: 'Off-site ATMs often use **4G/private APN + VPN**, encrypted, talking only to the ATM switch.',
      },
      {
        q: 'Why does a branch have two WAN links from different providers?',
        options: ['To double the number of IP addresses', 'Redundancy: if one provider fails, the branch stays online', 'Because MPLS needs two cables', 'For Wi-Fi'],
        answer: 1,
        explain: 'Different providers avoid a **single point of failure**.',
      },
    ],
  },
  {
    id: 'redundancy',
    title: 'WAN redundancy and high availability',
    analogy:
      'Hospitals have **two power supplies and a generator**. If one fails, the lights stay on. Good networks remove every **single point of failure** the same way.',
    body: `**High availability (HA)** = removing **single points of failure (SPOF)**.

Redundancy options:
- **Dual links** from **different providers** with **diverse physical paths** (not the same trench or exchange!).
- **Dual devices** — two routers/firewalls (HSRP/VRRP, firewall HA clusters).
- **Dual data centres** — primary DC + **DR site**.
- **Dual power** (two PSUs, UPS, generator).

How failover is detected:
- **Dynamic routing** (OSPF/BGP) withdraws routes when a link dies.
- **IP SLA tracking** — the router pings the DC; if it fails, it removes the primary route and a **floating static** takes over.
- **BFD** (Bidirectional Forwarding Detection) — detects failures in milliseconds.

Designs:
- **Active-passive** — backup only used on failure (simple).
- **Active-active** — both links/devices used together (better use, more complex).

Availability math: 99.9% = ~8.8 hours down per year; 99.99% = ~53 minutes per year.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Branch failover: link, then data centre',
        width: 360,
        height: 230,
        nodes: [
          { id: 'br', label: 'Branch router', icon: 'router', x: 45, y: 115, info: 'Two WAN interfaces. Uses IP SLA tracking / routing to detect failures.' },
          { id: 'mpls', label: 'MPLS (ISP A)', icon: 'cloud', x: 165, y: 50, info: 'Primary link from provider A.' },
          { id: 'lte', label: '4G + IPsec (ISP B)', icon: 'cloud', x: 165, y: 185, info: 'Backup from provider B — different company, different physical path.' },
          { id: 'dc', label: 'Primary DC', icon: 'server', x: 310, y: 50, info: 'Normal location of core banking.' },
          { id: 'dr', label: 'DR site', icon: 'server', x: 310, y: 185, info: 'Takes over if the primary data centre fails.' },
        ],
        links: [
          { from: 'br', to: 'mpls', tone: 'purple' },
          { from: 'br', to: 'lte', style: 'tunnel', tone: 'amber' },
          { from: 'mpls', to: 'dc' },
          { from: 'mpls', to: 'dr', style: 'dashed' },
          { from: 'lte', to: 'dc', style: 'dashed' },
          { from: 'lte', to: 'dr', style: 'dashed' },
        ],
        steps: [
          { text: 'Normal: branch → **MPLS** → primary DC.', paths: [['br', 'mpls', 'dc']], packet: 'CBS' },
          { text: 'The MPLS link fails (fibre cut). **IP SLA/routing** detects it and traffic moves to the **4G IPsec** backup automatically.', paths: [['br', 'lte', 'dc']], packet: 'CBS', tone: 'amber' },
          { text: 'Later, the **primary DC** has a major outage. The bank invokes **DR**: routing now points to the DR site, and branches continue working through whichever link is up.', paths: [['br', 'mpls', 'dr']], packet: 'CBS', tone: 'purple' },
        ],
      },
    ],
    bank: `A real risk: a bank orders "two links" from two providers, but both cables run through the **same street trench** — one excavator cuts both. Good design asks providers for **path diversity**. Also **test failover regularly** (e.g. unplug the primary link in a maintenance window) — a backup that was never tested is not a backup.`,
    remember: [
      'HA = remove **single points of failure**: dual links (different providers, diverse paths), dual devices, dual DCs, dual power.',
      'Failover detection: dynamic routing, **IP SLA + floating static**, BFD.',
      '**Test failover regularly.** 99.9% ≈ 8.8 h/year down; 99.99% ≈ 53 min/year.',
    ],
    check: [
      {
        q: 'What is a single point of failure (SPOF)?',
        options: ['A device that is backed up twice', 'A component whose failure stops the whole service', 'A type of VPN', 'An unused switch port'],
        answer: 1,
        explain: 'A **SPOF** is one component that, if it fails, takes the service down. HA design removes them.',
      },
      {
        q: 'Which feature lets a router remove its primary route when pings to the DC fail, so a backup route is used?',
        options: ['STP', 'IP SLA tracking', 'DHCP snooping', 'Port security'],
        answer: 1,
        explain: '**IP SLA** probes the path; when it fails, the tracked route is removed and a floating static takes over.',
      },
    ],
  },
  {
    id: 'qos',
    title: 'QoS: giving priority to important traffic',
    analogy:
      'On a busy road, **ambulances get priority**, buses get their own lane, and normal cars wait. QoS does this for packets when a WAN link is full.',
    body: `When a WAN link is congested, **QoS (Quality of Service)** decides which traffic goes first.

1. **Classify** — identify the traffic (by port, IP, application).
2. **Mark** — set a priority value: **DSCP** in the IP header (e.g. **EF = 46 for voice**, AF classes for business apps) or **CoS** (3 bits in the 802.1Q tag).
3. **Queue** — put traffic into queues; voice gets a **priority (low-latency) queue**.
4. **Police / shape** — limit low-priority traffic (drop or delay the excess).

Voice and video need **low latency (< 150 ms one way), low jitter (< 30 ms) and low loss (< 1%)**.

QoS **does not create bandwidth** — it only manages it during congestion. If links are always full, you need more bandwidth.`,
    visuals: [
      {
        kind: 'flow',
        title: 'QoS on the branch WAN router',
        steps: [
          { label: 'Classify', icon: '🔍', detail: 'Voice (RTP), core banking (to 10.1.10.0/24:443), ATM traffic, and "everything else" (Windows updates, browsing).', tone: 'blue' },
          { label: 'Mark', icon: '🏷️', detail: 'Voice → **DSCP EF (46)**; core banking/ATM → **AF31/AF41**; the rest → best effort (0).', tone: 'purple' },
          { label: 'Queue', icon: '🚦', detail: 'Voice goes into the **priority queue** (always first, with a limit). Business apps get guaranteed bandwidth. Best effort uses what is left.', tone: 'green' },
          { label: 'Shape / police', icon: '✂️', detail: 'Shape to the real link speed and limit bulk traffic (updates) so they cannot fill the link during business hours.', tone: 'amber' },
        ],
      },
    ],
    bank: `At 10 a.m. a branch link is full because PCs are downloading Windows updates. Without QoS, teller transactions and phone calls suffer. With QoS, **core banking and voice are protected** and updates slow down. Even better: schedule updates **after hours** or use a local update cache (WSUS).`,
    remember: [
      'QoS steps: **classify → mark (DSCP/CoS) → queue → police/shape**.',
      'Voice = **DSCP EF 46**, priority queue; needs low latency, jitter and loss.',
      'QoS manages congestion; it does **not** add bandwidth.',
    ],
    check: [
      {
        q: 'Which DSCP value is normally used for voice traffic?',
        options: ['0 (best effort)', 'EF (46)', 'CS1 (8)', 'AF11 (10)'],
        answer: 1,
        explain: 'Voice is marked **Expedited Forwarding (EF, 46)** and put in a priority queue.',
      },
      {
        q: 'What does QoS NOT do?',
        options: ['Prioritise voice', 'Add more bandwidth to a link', 'Mark packets', 'Queue traffic'],
        answer: 1,
        explain: 'QoS only **manages** existing bandwidth during congestion.',
      },
    ],
  },
];
