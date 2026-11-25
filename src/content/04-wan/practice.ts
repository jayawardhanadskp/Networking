import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'What does WAN stand for?', options: ['Wireless Access Network', 'Wide Area Network', 'Web Application Node', 'Wired Access Node'], answer: 1, explain: '**Wide Area Network** — connects sites over long distances.' },
  { q: 'Which WAN option gives a dedicated, private, point-to-point connection with guaranteed bandwidth?', options: ['Broadband Internet', 'Leased line', '4G', 'Public Wi-Fi'], answer: 1, explain: 'A **leased line** is a dedicated circuit between two points.' },
  { q: 'What is the bandwidth of an E1 line?', options: ['1.544 Mbps', '2.048 Mbps', '10 Mbps', '64 kbps'], answer: 1, explain: 'E1 = **2.048 Mbps** (T1 = 1.544 Mbps).' },
  { q: 'In MPLS, which router swaps labels in the provider core?', options: ['CE', 'PE', 'P', 'ABR'], answer: 2, explain: '**P (provider core)** routers swap labels.' },
  { q: 'What keeps different customers separate in an MPLS L3VPN?', options: ['STP', 'VRFs (separate routing tables)', 'NAT', 'DHCP'], answer: 1, explain: 'Each customer has its own **VRF** on the PE routers.' },
  { q: 'Which statement about MPLS is true?', options: ['It always encrypts traffic', 'It provides any-to-any connectivity with QoS but no built-in encryption', 'It only works over Wi-Fi', 'It replaces IP addresses'], answer: 1, explain: 'MPLS separates and prioritises traffic but **does not encrypt** it.' },
  { q: 'Which IP protocol number is ESP?', options: ['6', '17', '50', '51'], answer: 2, explain: 'ESP = **50**, AH = 51, TCP = 6, UDP = 17.' },
  { q: 'Why is AH rarely used?', options: ['It is too fast', 'It provides no encryption and breaks with NAT', 'It uses TCP 443', 'It is only for IPv6'], answer: 1, explain: 'AH gives integrity only (no confidentiality) and is incompatible with NAT.' },
  { q: 'Which port is used for IPsec NAT traversal?', options: ['UDP 500', 'UDP 4500', 'TCP 179', 'TCP 3389'], answer: 1, explain: '**UDP 4500** (NAT-T). IKE starts on UDP 500.' },
  { q: 'What happens in IKE Phase 1?', options: ['User data is encrypted', 'The peers authenticate and build a secure management channel', 'Routes are exchanged', 'IP addresses are assigned by DHCP'], answer: 1, explain: 'Phase 1 = **authenticate peers + create the IKE SA**. Phase 2 = IPsec SAs for data.' },
  { q: 'An SSL VPN usually runs on…', options: ['UDP 500', 'TCP 443', 'TCP 23', 'UDP 161'], answer: 1, explain: 'SSL/TLS VPN uses **TCP 443**.' },
  { q: 'What is split tunnelling?', options: ['All traffic goes through the VPN', 'Only company traffic goes through the VPN; Internet traffic goes directly', 'Using two VPN gateways', 'Encrypting twice'], answer: 1, explain: 'With **split tunnelling**, Internet traffic bypasses the VPN. Banks often prefer **full tunnel** for inspection.' },
  { q: 'Which is a main benefit of SD-WAN?', options: ['It removes the need for any security', 'Application-aware routing and automatic failover across multiple links', 'It only uses leased lines', 'It replaces Active Directory'], answer: 1, explain: 'SD-WAN measures links and routes apps on the best path.' },
  { q: 'Which three values does SD-WAN typically measure to judge link quality?', options: ['CPU, RAM, disk', 'Latency, jitter, packet loss', 'MAC, IP, port', 'TTL, DSCP, VLAN'], answer: 1, explain: '**Latency, jitter and packet loss**.' },
  { q: 'Two "redundant" links from different providers run through the same trench. What is the risk?', options: ['None', 'A single physical event (e.g. a cable cut) can take down both — no path diversity', 'Too much bandwidth', 'IP conflicts'], answer: 1, explain: 'Without **path diversity**, both links share a single point of failure.' },
  { q: 'What is 99.99% availability per year (approximately)?', options: ['8.8 hours downtime', '53 minutes downtime', '5 minutes downtime', '3.6 days downtime'], answer: 1, explain: '99.99% ≈ **52.6 minutes** per year. 99.9% ≈ 8.8 hours.' },
  { q: 'Which DSCP marking is used for voice?', options: ['AF11', 'CS0', 'EF (46)', 'CS6'], answer: 2, explain: 'Voice = **EF (46)**.' },
];

export const flashcards: Flashcard[] = [
  { front: 'Leased line', back: 'Dedicated, private point-to-point circuit with fixed symmetric bandwidth and SLA. Reliable but expensive.', tag: 'definition' },
  { front: 'MPLS', back: '**Multiprotocol Label Switching**: provider forwards by labels; L3VPN gives private any-to-any WAN with QoS. Not encrypted by default.', tag: 'acronym' },
  { front: 'CE / PE / P', back: '**CE** customer edge · **PE** provider edge (push/pop label, VRFs) · **P** provider core (swap label).', tag: 'definition' },
  { front: 'VRF', back: '**Virtual Routing and Forwarding**: separate routing tables on one router — keeps MPLS customers apart.', tag: 'acronym' },
  { front: 'IPsec components', back: '**IKE** (UDP 500/4500) key exchange · **ESP** (proto 50) encryption + integrity · **AH** (proto 51) integrity only.', tag: 'fact' },
  { front: 'IKE Phase 1 vs Phase 2', back: '**Phase 1**: authenticate peers, build IKE SA. **Phase 2**: negotiate IPsec SAs (traffic, encryption) for data.', tag: 'definition' },
  { front: 'Tunnel vs transport mode', back: '**Tunnel**: whole packet encrypted + new IP header (site-to-site). **Transport**: only payload (host-to-host).', tag: 'definition' },
  { front: 'Site-to-site vs remote-access VPN', back: '**Site-to-site**: network ↔ network via firewalls (IPsec). **Remote access**: one user ↔ network (SSL/TLS or IPsec client).', tag: 'definition' },
  { front: 'SSL VPN', back: 'Remote access over **TLS, TCP 443**. Clientless (portal) or full client. Add MFA + posture check.', tag: 'definition' },
  { front: 'Split vs full tunnel', back: '**Split**: only company traffic in VPN. **Full**: all traffic through VPN (better control, banks prefer).', tag: 'definition' },
  { front: 'SD-WAN', back: '**Software-Defined WAN**: overlay over many links, central controller, app-aware routing, link monitoring, auto failover, zero-touch.', tag: 'acronym' },
  { front: 'Latency / jitter / packet loss', back: '**Latency**: delay. **Jitter**: variation of delay. **Loss**: packets dropped. Voice: <150 ms, <30 ms jitter, <1% loss.', tag: 'definition' },
  { front: 'SPOF', back: '**Single Point Of Failure**: one component whose failure stops the service.', tag: 'acronym' },
  { front: 'IP SLA', back: 'Cisco feature that probes a path (e.g. ping DC) and can **track** a route — removes it on failure so a backup takes over.', tag: 'definition' },
  { front: 'BFD', back: '**Bidirectional Forwarding Detection**: very fast (ms) link failure detection for routing protocols.', tag: 'acronym' },
  { front: 'QoS steps', back: 'Classify → Mark (DSCP/CoS) → Queue → Police/Shape. Voice = DSCP EF 46.', tag: 'definition' },
  { front: 'Availability numbers', back: '99.9% ≈ 8.8 h/year down · 99.95% ≈ 4.4 h · 99.99% ≈ 53 min · 99.999% ≈ 5 min.', tag: 'fact' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'What is MPLS and why do banks use it?',
    answer: `MPLS is a provider technology that forwards traffic using **labels** instead of reading the IP header at every hop. The provider edge router pushes a label, core routers swap it, and the egress edge router pops it. With an **MPLS L3VPN**, each customer has its own **VRF**, so the network is private.

Banks use it because it gives **any-to-any connectivity** between all branches, DC and DR, with **QoS classes** and an **SLA** from the provider. One point to remember: MPLS is private but **not encrypted** by default, so sensitive traffic may also be encrypted with IPsec or TLS.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between a site-to-site VPN and an SSL VPN?',
    answer: `A **site-to-site VPN** connects two **networks** — for example a branch and the data centre — through a permanent encrypted tunnel between two firewalls or routers. It usually uses **IPsec** (IKE on UDP 500/4500, ESP for encryption, tunnel mode). Users don't install anything.

An **SSL VPN** is for **remote users**: an individual laptop connects to the company over **TLS on TCP 443**, which works from almost any network. It can be a browser portal or a full VPN client. For a bank, remote access should always have **MFA**, device posture checks and least-privilege access.`,
  },
  {
    type: 'technical',
    q: 'Explain how IPsec works.',
    answer: `IPsec protects IP traffic in two phases:

- **IKE Phase 1** — the two peers authenticate each other with a pre-shared key or certificates and use Diffie-Hellman to create a secure channel (the IKE SA). UDP 500, or 4500 with NAT.
- **IKE Phase 2** — inside that channel they agree on the **IPsec SAs**: which traffic to protect, the encryption (e.g. AES) and the integrity algorithm (e.g. SHA-256).

Then **ESP** encrypts the data. In **tunnel mode**, the whole original packet is encrypted and a new IP header is added. IPsec gives confidentiality, integrity, authentication and anti-replay. When troubleshooting, I check Phase 1 first (peer IP, keys, proposals), then Phase 2 (matching subnets and proposals).`,
  },
  {
    type: 'technical',
    q: 'What is SD-WAN?',
    answer: `SD-WAN is a software-defined overlay that uses **several WAN links at the same time** — for example MPLS, broadband and 4G — managed from a **central controller**. It measures latency, jitter and packet loss on each link and uses **application-aware policies** to send each application on the best path, with **automatic failover** and IPsec encryption on every link. It also supports zero-touch provisioning for new branches. Benefits are lower cost, better performance and easier management.`,
  },
  {
    type: 'scenario',
    q: 'How would you connect a new bank branch to the head office and data centre?',
    answer: `1. **Two WAN links from different providers** with diverse paths — for example MPLS as primary and 4G or fibre broadband with an **IPsec VPN** as backup (or SD-WAN using both).
2. A **branch router/firewall** (or SD-WAN edge), with failover using routing or IP SLA tracking.
3. An **access switch** with the standard VLANs: staff, voice, CCTV, ATM, management — using the branch **IP template** (VLSM).
4. Routing to both the **DC and DR site**.
5. Security: firewall rules (least privilege), port security / NAC, unused ports shut down, no direct Internet for tellers.
6. **Monitoring**: SNMP, syslog, link alerts, and documentation in the CMDB/IPAM.
7. **Test failover** before go-live.`,
    tips: ['Structure your answer: links → devices → LAN/VLANs → security → monitoring → testing.'],
  },
  {
    type: 'scenario',
    q: 'A branch\'s primary WAN link is down. What happens and what do you do?',
    answer: `If the design is correct, the branch should **fail over automatically** to the backup link (4G/broadband IPsec or SD-WAN). Users may notice a short interruption or slower performance.

My actions:
1. **Confirm** from the monitoring system (NMS alert, interface down, IP SLA status) and check the backup is carrying traffic.
2. Check the **branch router**: interface status, errors, logs (\`show interface\`, \`show log\`). Check if it is a power issue at the branch.
3. If the provider side is down → **raise a ticket with the provider** with circuit ID, time and tests done; follow up on the SLA.
4. Inform the branch and service desk; monitor backup bandwidth — maybe limit non-critical traffic.
5. When restored, verify traffic returns to the primary, close the incident and record the root cause.`,
  },
  {
    type: 'scenario',
    q: 'An off-site ATM is offline. How would you troubleshoot from the network side?',
    answer: `1. Check **monitoring**: is the ATM's router/4G modem reachable? When did it go down? Are other ATMs affected (scope)?
2. If **many ATMs** are down → look centrally: ATM switch, DC firewall, VPN concentrator, provider/APN issue.
3. If **only one**: check the 4G router — signal, SIM/APN, power at the site (a site visit or call to the location may be needed). Check the **IPsec tunnel** status on the head-end.
4. Check firewall logs for drops between the ATM IP and the ATM switch.
5. Work with the **ATM/card team** — the network may be fine and the problem could be the ATM application or hardware.
6. Escalate to the provider or ATM vendor as needed and keep the incident ticket updated.`,
  },
  {
    type: 'technical',
    q: 'What is QoS and when do you need it?',
    answer: `QoS manages bandwidth when a link is **congested**. Traffic is **classified**, **marked** (DSCP — for example EF 46 for voice), placed in **queues** with different priorities, and low-priority traffic can be **policed or shaped**. Voice gets a low-latency priority queue, business applications like core banking get guaranteed bandwidth, and bulk traffic gets what is left.

It is needed mainly on **WAN links**, which are slower than the LAN. QoS does not add bandwidth — if links are always full, we need to upgrade.`,
  },
];
