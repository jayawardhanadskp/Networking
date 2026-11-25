import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'What is the default aging time for MAC address table entries on Cisco switches?', options: ['30 seconds', '120 seconds', '300 seconds', '4 hours'], answer: 2, explain: 'Default MAC aging time = **300 seconds** (5 minutes). (4 hours is the Cisco ARP cache default.)' },
  { q: 'Which attack fills the switch MAC table so it floods all traffic?', options: ['ARP spoofing', 'MAC flooding', 'VLAN hopping', 'DNS poisoning'], answer: 1, explain: '**MAC flooding** overflows the CAM table. **Port security** prevents it.' },
  { q: 'Each VLAN is normally…', options: ['A collision domain', 'A separate broadcast domain and IP subnet', 'A routing protocol area', 'A physical switch'], answer: 1, explain: 'One VLAN = **one broadcast domain** = usually **one subnet**.' },
  { q: 'Which IEEE standard defines VLAN tagging on trunks?', options: ['802.1X', '802.1Q', '802.3af', '802.11ac'], answer: 1, explain: '**802.1Q** = VLAN tagging. 802.1X = port authentication, 802.3af = PoE, 802.11 = Wi-Fi.' },
  { q: 'Which is a good practice to prevent VLAN hopping?', options: ['Use VLAN 1 for all users', 'Enable DTP everywhere', 'Disable DTP and change the native VLAN to an unused VLAN', 'Allow all VLANs on every trunk'], answer: 2, explain: 'Set ports manually (no DTP), use an **unused native VLAN**, and prune trunk VLANs.' },
  { q: 'What is the default STP bridge priority?', options: ['0', '4096', '32768', '65535'], answer: 2, explain: 'Default priority = **32768**. Lower is better; set the core switch lower (e.g. 4096).' },
  { q: 'Which version of STP converges in a few seconds?', options: ['802.1D', 'RSTP (802.1w)', 'CDP', 'VTP'], answer: 1, explain: '**Rapid STP (802.1w)** converges much faster than classic 802.1D.' },
  { q: 'What does PortFast do?', options: ['Increases port speed to 10 Gbps', 'Lets an edge port skip STP listening/learning and forward immediately', 'Blocks BPDUs', 'Creates a trunk'], answer: 1, explain: '**PortFast** is for ports connected to end devices so they come up immediately.' },
  { q: 'In router-on-a-stick, what command sets the VLAN on a sub-interface?', options: ['switchport access vlan 10', 'encapsulation dot1Q 10', 'vlan 10', 'ip helper-address 10'], answer: 1, explain: 'On the sub-interface: **encapsulation dot1Q 10**, then an IP address.' },
  { q: 'What is the first thing a router checks when choosing between routes?', options: ['Administrative distance', 'Metric', 'Longest prefix match', 'Interface speed'], answer: 2, explain: '**Longest prefix match** first; AD and metric only break ties between identical prefixes.' },
  { q: 'Which has the lowest (most trusted) administrative distance?', options: ['OSPF', 'Static route', 'RIP', 'EIGRP'], answer: 1, explain: 'Static = **1** (connected = 0). EIGRP 90, OSPF 110, RIP 120.' },
  { q: 'What is the AD of eBGP?', options: ['20', '90', '110', '200'], answer: 0, explain: 'eBGP = **20**, iBGP = 200.' },
  { q: 'What type of routing protocol is OSPF?', options: ['Distance vector', 'Link state', 'Path vector', 'Static'], answer: 1, explain: 'OSPF is **link-state**. BGP is path-vector, RIP is distance-vector.' },
  { q: 'Which multicast address do all OSPF routers listen on?', options: ['224.0.0.5', '224.0.0.6', '224.0.0.9', '224.0.0.10'], answer: 0, explain: '**224.0.0.5** = all OSPF routers. 224.0.0.6 = DR/BDR. (.9 = RIPv2, .10 = EIGRP.)' },
  { q: 'Two OSPF routers will not become neighbours. Which mismatch can cause this?', options: ['Different hostnames', 'Different hello/dead timers or area IDs', 'Different router models', 'Different IOS passwords'], answer: 1, explain: 'Area, **timers**, subnet/mask, authentication and MTU must match.' },
  { q: 'BGP is described as a…', options: ['Link-state IGP', 'Distance-vector IGP', 'Path-vector EGP', 'First hop redundancy protocol'], answer: 2, explain: 'BGP is a **path-vector exterior gateway protocol** using the AS-PATH.' },
  { q: 'In HSRP, which router forwards traffic for the virtual IP?', options: ['The standby router', 'The active router', 'Both equally', 'The router with lowest priority'], answer: 1, explain: 'The **Active** router forwards; the Standby takes over if the Active fails.' },
  { q: 'What does preempt do in HSRP/VRRP?', options: ['Stops all hellos', 'Lets a higher-priority router take back the active role when it comes back', 'Encrypts traffic', 'Disables the virtual MAC'], answer: 1, explain: 'With **preempt**, the higher-priority router reclaims the Active/Master role.' },
];

export const flashcards: Flashcard[] = [
  { front: 'Switch: 4 actions', back: '**Learn** source MAC · **Flood** unknown/broadcast · **Forward** known · **Filter** same port.', tag: 'definition' },
  { front: 'Port security', back: 'Limits which/how many MACs can use a switch port; violation → shutdown/restrict/protect. Stops MAC flooding and rogue devices.', tag: 'definition' },
  { front: 'VLAN', back: '**Virtual LAN**: logical network on a switch; one VLAN = one broadcast domain = one subnet. IDs 1–4094.', tag: 'acronym' },
  { front: 'Access vs trunk port', back: '**Access**: one VLAN, untagged (PCs, printers). **Trunk**: many VLANs, 802.1Q tagged (switch-switch, switch-router).', tag: 'definition' },
  { front: '802.1Q', back: 'VLAN tagging standard: 4-byte tag, **12-bit VLAN ID**, 3-bit priority (CoS).', tag: 'acronym' },
  { front: 'Native VLAN', back: 'The VLAN sent **untagged** on a trunk (default 1). Must match both ends; change to an unused VLAN.', tag: 'definition' },
  { front: 'STP', back: '**Spanning Tree Protocol** (802.1D): blocks redundant L2 paths to prevent loops/broadcast storms. RSTP = 802.1w (fast).', tag: 'acronym' },
  { front: 'Root bridge', back: 'Switch with the **lowest bridge ID** (priority 32768 default + MAC). All its ports forward.', tag: 'definition' },
  { front: 'PortFast & BPDU Guard', back: '**PortFast**: edge port forwards immediately. **BPDU Guard**: err-disables that port if a BPDU (switch) appears.', tag: 'definition' },
  { front: 'SVI', back: '**Switched Virtual Interface** (interface vlan X): Layer 3 gateway for a VLAN on an L3 switch.', tag: 'acronym' },
  { front: 'Router-on-a-stick', back: 'Inter-VLAN routing with one router port as a trunk and one **sub-interface per VLAN** (encapsulation dot1Q).', tag: 'definition' },
  { front: 'Route selection order', back: '1. **Longest prefix match** 2. Lowest **AD** 3. Lowest **metric** (equal → ECMP).', tag: 'definition' },
  { front: 'Administrative distances', back: 'Connected 0 · Static 1 · eBGP 20 · EIGRP 90 · OSPF 110 · RIP 120 · iBGP 200', tag: 'fact' },
  { front: 'Floating static route', back: 'Static route with a **higher AD** than the primary route → used only as backup.', tag: 'definition' },
  { front: 'OSPF key facts', back: 'Link-state, Dijkstra/SPF, metric = cost (bandwidth), AD 110, Area 0 backbone, hellos 224.0.0.5, IP protocol 89.', tag: 'fact' },
  { front: 'OSPF neighbour states', back: 'Down → Init → 2-Way → ExStart → Exchange → Loading → **Full**.', tag: 'fact' },
  { front: 'BGP key facts', back: 'Path-vector EGP, **TCP 179**, AS numbers, AS-PATH for loop prevention, eBGP AD 20 / iBGP 200.', tag: 'fact' },
  { front: 'HSRP vs VRRP', back: '**HSRP**: Cisco, Active/Standby, hello 3 s / hold 10 s. **VRRP**: open standard, Master/Backup. Both: virtual IP, priority 100 default.', tag: 'definition' },
  { front: 'FHRP', back: '**First Hop Redundancy Protocol**: HSRP, VRRP, GLBP — redundant default gateway.', tag: 'acronym' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'What is a VLAN and why do we use it?',
    answer: `A VLAN is a **logical network inside a switch** — it splits one physical switch into several separate broadcast domains. Each VLAN is usually its own IP subnet, and devices in different VLANs need a **router or Layer 3 switch** to communicate.

We use VLANs for:
- **Security** — isolate sensitive devices like ATMs, CCTV or servers, and control traffic between VLANs with ACLs/firewalls.
- **Performance** — smaller broadcast domains.
- **Flexibility** — move users between networks without re-cabling.
- **QoS** — e.g. a separate voice VLAN.

Ports are either **access** (one VLAN) or **trunk** (many VLANs with 802.1Q tags).`,
  },
  {
    type: 'technical',
    q: 'What is STP and why is it needed?',
    answer: `We add redundant links between switches, but Ethernet frames have **no TTL**, so a loop would cause a **broadcast storm** and bring the network down.

**Spanning Tree Protocol** prevents loops by electing a **root bridge** (lowest bridge ID), choosing the best path to it, and **blocking** the redundant ports. If an active link fails, a blocked port starts forwarding, so we keep redundancy without loops.

Best practices: use **Rapid STP**, set the root bridge manually on the core switch, and enable **PortFast with BPDU Guard** on user ports.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between static and dynamic routing? When would you use each?',
    answer: `**Static routes** are configured manually. They are simple, secure and use no resources, but they **don't adapt** to failures. I would use them for small or stub sites (like a branch default route) and as **floating static** backup routes.

**Dynamic routing protocols** like OSPF, EIGRP and BGP let routers **share routes automatically** and find new paths when links fail. They scale to large networks. I would use OSPF inside the data centre and WAN core, and BGP with ISPs or the MPLS provider.`,
  },
  {
    type: 'technical',
    q: 'Explain OSPF in simple terms.',
    answer: `OSPF is an open-standard **link-state** routing protocol. Routers discover neighbours with Hello packets, exchange **LSAs** so that every router in an area has the **same map** of the network, and then each router runs **Dijkstra's SPF algorithm** to find the shortest path. The metric is **cost**, based on bandwidth.

It uses **areas** to scale — Area 0 is the backbone. It converges quickly, supports VLSM and authentication, and its AD is 110. If neighbours don't form, I check that the area, timers, subnet, authentication and MTU match.`,
  },
  {
    type: 'technical',
    q: 'What is BGP and where is it used?',
    answer: `BGP is the **routing protocol of the Internet**. It is a **path-vector** protocol that exchanges routes between **autonomous systems** — networks with their own AS number, like ISPs. It runs over **TCP 179**, uses the AS-PATH to avoid loops, and chooses paths based on **policy attributes**, not only distance.

In an enterprise like a bank, BGP is used for **multihoming** — connecting to two Internet providers so Internet banking stays online if one fails — and often for connections with the **MPLS WAN provider**.`,
  },
  {
    type: 'technical',
    q: 'What is HSRP / VRRP and why is it important?',
    answer: `PCs have only one default gateway. If that router fails, users lose connectivity. **HSRP** (Cisco) and **VRRP** (open standard) let two routers share a **virtual IP address** that the PCs use as gateway. One router is **active/master** and forwards traffic; the other is **standby/backup**. If the active router fails, the standby takes over the virtual IP within seconds, and the PCs don't need any change.

In a bank, this protects critical VLANs in the data centre and head office from a single router failure or a maintenance reboot.`,
  },
  {
    type: 'technical',
    q: 'How does a router decide which route to use?',
    answer: `First, **longest prefix match** — the most specific route wins, for example a /24 beats a /16 even if the /16 has a better metric. If the same prefix is learned from different sources, the lowest **administrative distance** wins (connected 0, static 1, OSPF 110…). If it is the same protocol, the lowest **metric** wins, and equal metrics can be load-balanced. If nothing matches and there is no default route, the packet is dropped.`,
  },
  {
    type: 'scenario',
    q: 'Users in VLAN 10 can reach each other but cannot reach the printer in VLAN 20. What do you check?',
    answer: `Same-VLAN traffic works, so the switch and access ports are fine. The problem is **inter-VLAN routing**:

1. Check the PCs' **default gateway** (ipconfig) — is it correct for VLAN 10?
2. Can the PC ping its gateway? Can it ping the VLAN 20 gateway?
3. On the router/L3 switch: are the **sub-interfaces or SVIs up** (\`show ip interface brief\`)? Is \`ip routing\` enabled on the L3 switch?
4. Is the **trunk** carrying VLAN 20 (\`show interfaces trunk\` — allowed VLANs)?
5. Is there an **ACL or firewall rule** blocking VLAN 10 → VLAN 20 printer ports (9100/515/631)?
6. Check the printer's own IP, mask and gateway.`,
  },
  {
    type: 'scenario',
    q: 'Suddenly the whole head office network becomes extremely slow and switch CPU and link lights go crazy. What could it be?',
    answer: `That sounds like a **Layer 2 loop / broadcast storm** — for example someone connected two wall ports together, or connected a small unmanaged switch that created a loop, and STP is missing or misconfigured.

Steps:
1. Check switch logs for **MAC flapping**, STP topology changes or err-disabled ports.
2. Look at interface counters for very high broadcast traffic (\`show interfaces\`).
3. Find and **disconnect the looped port**; check the root bridge is the expected core switch.
4. Prevent it: **RSTP**, **BPDU Guard on PortFast ports**, **storm control**, and shut unused ports.
5. Write a post-incident report.`,
  },
];
