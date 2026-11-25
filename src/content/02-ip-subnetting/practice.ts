import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  {
    q: 'What is the decimal value of 10101000?',
    options: ['160', '168', '172', '192'],
    answer: 1,
    explain: '128 + 32 + 8 = **168**.',
  },
  {
    q: 'Which class does 200.10.5.1 belong to?',
    options: ['A', 'B', 'C', 'D'],
    answer: 2,
    explain: '192–223 = **Class C**.',
  },
  {
    q: 'Which address is the loopback address?',
    options: ['0.0.0.0', '127.0.0.1', '169.254.0.1', '255.255.255.255'],
    answer: 1,
    explain: '**127.0.0.1** refers to the local machine itself.',
  },
  {
    q: 'Which of these is NOT a private IP address?',
    options: ['10.200.1.1', '192.168.50.5', '172.20.1.1', '172.33.1.1'],
    answer: 3,
    explain: 'Private 172 addresses are 172.16–172.31. **172.33.1.1 is public**.',
  },
  {
    q: 'What is the subnet mask for /21?',
    options: ['255.255.240.0', '255.255.248.0', '255.255.252.0', '255.255.255.248'],
    answer: 1,
    explain: '/21 = 8 + 8 + **5** → 248 → **255.255.248.0**.',
  },
  {
    q: 'How many usable hosts does a /23 provide?',
    options: ['254', '510', '512', '1022'],
    answer: 1,
    explain: 'Host bits = 9 → 2⁹ = 512 − 2 = **510**.',
  },
  {
    q: 'What is the network address of 10.1.1.200/25?',
    options: ['10.1.1.0', '10.1.1.128', '10.1.1.192', '10.1.1.200'],
    answer: 1,
    explain: '/25 → block 128 → 200 is in 128–255 → **10.1.1.128**.',
  },
  {
    q: 'What is the broadcast address of 192.168.5.33/28?',
    options: ['192.168.5.47', '192.168.5.48', '192.168.5.63', '192.168.5.39'],
    answer: 0,
    explain: '/28 → block 16 → 33 is in 32–47 → broadcast **192.168.5.47**.',
  },
  {
    q: 'What is the first usable host in 172.16.8.0/22?',
    options: ['172.16.8.0', '172.16.8.1', '172.16.9.1', '172.16.11.254'],
    answer: 1,
    explain: 'Network 172.16.8.0 (block 4 in the 3rd octet: 8–11) → first host **172.16.8.1**.',
  },
  {
    q: 'A point-to-point WAN link between two routers needs exactly 2 addresses. Which prefix is traditionally used?',
    options: ['/24', '/28', '/29', '/30'],
    answer: 3,
    explain: '**/30** = 4 addresses, 2 usable. (/31 is also allowed on point-to-point links per RFC 3021.)',
  },
  {
    q: 'You need at least 500 hosts in one subnet. What is the smallest subnet?',
    options: ['/22', '/23', '/24', '/25'],
    answer: 1,
    explain: '/24 = 254 (too small), **/23 = 510** (fits).',
  },
  {
    q: 'Which wildcard mask matches /26?',
    options: ['0.0.0.31', '0.0.0.63', '0.0.0.127', '255.255.255.192'],
    answer: 1,
    explain: 'Wildcard = 255 − 192 = **0.0.0.63**.',
  },
  {
    q: 'Do 192.168.1.60/26 and 192.168.1.70/26 belong to the same subnet?',
    options: ['Yes', 'No'],
    answer: 1,
    explain: 'Block 64: .60 is in 0–63, .70 is in 64–127 → **different subnets**, so they need a router to talk.',
  },
  {
    q: 'Which route summarises 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24 and 192.168.3.0/24?',
    options: ['192.168.0.0/16', '192.168.0.0/22', '192.168.0.0/23', '192.168.0.0/24'],
    answer: 1,
    explain: 'Four /24s = 2² → 24 − 2 = **/22** (192.168.0.0 – 192.168.3.255).',
  },
  {
    q: 'What does VLSM allow?',
    options: ['Using different subnet mask lengths in the same network', 'Using only classful masks', 'Using VLANs without a router', 'Translating private to public IPs'],
    answer: 0,
    explain: '**VLSM** = variable-length masks, so each subnet can be the right size.',
  },
  {
    q: 'Which is the correct shortened form of fe80:0000:0000:0000:0204:61ff:fe9d:f156?',
    options: ['fe80::204:61ff:fe9d:f156', 'fe8::204:61ff:fe9d:f156', 'fe80:0:0:204:61ff:fe9d:f156', 'fe80::0204::f156'],
    answer: 0,
    explain: 'Drop leading zeros (0204 → 204) and replace the three zero groups with :: → **fe80::204:61ff:fe9d:f156**.',
  },
  {
    q: 'Which IPv6 prefix is the standard size for a LAN subnet?',
    options: ['/32', '/48', '/64', '/128'],
    answer: 2,
    explain: 'IPv6 LANs use **/64** (64-bit interface ID, needed for SLAAC).',
  },
  {
    q: 'Which statement about IPv6 is true?',
    options: ['It uses ARP', 'It has broadcast addresses', 'It uses NDP and multicast instead of ARP and broadcast', 'Addresses are 64 bits'],
    answer: 2,
    explain: 'IPv6 has **no broadcast**; **NDP** (ICMPv6) replaces ARP.',
  },
];

export const flashcards: Flashcard[] = [
  { front: 'Bit values in an octet', back: '128 · 64 · 32 · 16 · 8 · 4 · 2 · 1', tag: 'fact' },
  { front: 'Mask octet values', back: '128 (1), 192 (2), 224 (3), 240 (4), 248 (5), 252 (6), 254 (7), 255 (8)', tag: 'fact' },
  { front: 'Usable hosts formula', back: '**2^h − 2**, where h = 32 − prefix. (−2 for network and broadcast.)', tag: 'definition' },
  { front: 'Magic number', back: 'Block size = **256 − mask value** in the interesting octet. Networks are multiples of it.', tag: 'definition' },
  { front: '/24, /25, /26 hosts', back: '/24 = 254 · /25 = 126 · /26 = 62', tag: 'fact' },
  { front: '/27, /28, /29, /30 hosts', back: '/27 = 30 · /28 = 14 · /29 = 6 · /30 = 2', tag: 'fact' },
  { front: 'Class A / B / C ranges', back: 'A 1–126 (/8) · B 128–191 (/16) · C 192–223 (/24). D 224–239 multicast, E 240–255.', tag: 'fact' },
  { front: 'Private IP ranges', back: '10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16', tag: 'fact' },
  { front: '127.0.0.1', back: 'Loopback — the local machine. `ping 127.0.0.1` tests the TCP/IP stack.', tag: 'fact' },
  { front: '169.254.0.0/16', back: 'APIPA / link-local — the PC did not get a DHCP address.', tag: 'fact' },
  { front: 'CIDR', back: '**Classless Inter-Domain Routing**: any prefix length (/x) and route summarisation, replacing classes.', tag: 'acronym' },
  { front: 'VLSM', back: '**Variable Length Subnet Masking**: different subnet sizes in one block. Allocate largest first.', tag: 'acronym' },
  { front: 'Wildcard mask', back: 'Inverse of the subnet mask (255.255.255.255 − mask). Used in Cisco ACLs and OSPF. /24 → 0.0.0.255.', tag: 'definition' },
  { front: 'Route summarisation', back: 'Advertising one bigger route instead of many small ones, e.g. 10.20.0.0/16 for all branch /24s. Smaller routing tables, more stability.', tag: 'definition' },
  { front: 'IPv6 shortening rules', back: '1) Drop leading zeros in each group. 2) Replace one run of zero groups with **::** (only once).', tag: 'definition' },
  { front: 'IPv6 address types', back: 'Global unicast 2000::/3 · Link-local fe80::/10 · Unique local fc00::/7 · Multicast ff00::/8 · Loopback ::1', tag: 'fact' },
  { front: 'SLAAC', back: '**Stateless Address Autoconfiguration**: an IPv6 host builds its own address from the router\'s prefix (Router Advertisement).', tag: 'acronym' },
  { front: 'NDP', back: '**Neighbor Discovery Protocol** (ICMPv6): replaces ARP, finds routers, detects duplicate addresses.', tag: 'acronym' },
  { front: 'Network vs broadcast address', back: 'Network = all host bits **0**. Broadcast = all host bits **1**. Neither can be given to a host.', tag: 'definition' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'What is a subnet mask and why do we use subnetting?',
    answer: `A subnet mask shows which part of an IP address is the **network** and which part is the **host**: 1s for network bits, 0s for host bits. For example /24 = 255.255.255.0.

We subnet to:
- **Reduce broadcast traffic** (smaller broadcast domains).
- **Improve security** — we can put departments or device types (ATMs, CCTV, servers) in separate subnets and control traffic between them with firewalls/ACLs.
- **Use addresses efficiently** and make the network easier to manage and troubleshoot.`,
  },
  {
    type: 'technical',
    q: 'How many usable hosts are in a /26 network, and how do you calculate it?',
    answer: `A /26 has 32 − 26 = **6 host bits**. 2⁶ = 64 addresses. Subtract 2 (the network address and the broadcast address) → **62 usable hosts**. The mask is 255.255.255.192 and the block size is 64, so the subnets in the last octet start at 0, 64, 128 and 192.`,
    tips: ['Say the formula out loud: 2 to the power of host bits, minus 2.', 'If they give an IP, quickly give network and broadcast too — it impresses.'],
  },
  {
    type: 'technical',
    q: 'What are the private IP address ranges?',
    answer: `RFC 1918 defines three private ranges that are not routed on the Internet:
- **10.0.0.0/8** (10.0.0.0 – 10.255.255.255)
- **172.16.0.0/12** (172.16.0.0 – 172.31.255.255)
- **192.168.0.0/16** (192.168.0.0 – 192.168.255.255)

Organisations use them internally and use **NAT** at the Internet edge. Large organisations like banks usually use 10.0.0.0/8 because it is the biggest.`,
  },
  {
    type: 'technical',
    q: 'What is CIDR and what is VLSM?',
    answer: `**CIDR (Classless Inter-Domain Routing)** replaced the old Class A/B/C system. It allows **any prefix length** (like /22 or /27) and **route summarisation** — advertising one big route instead of many small ones.

**VLSM (Variable Length Subnet Masking)** uses **different subnet sizes inside one address block**, so each segment gets the size it needs. For example, a branch /24 can be cut into a /26 for staff PCs, a /27 for phones, a /28 for CCTV and a /29 for ATMs. You allocate the largest subnets first. VLSM needs a classless routing protocol like OSPF or BGP.`,
  },
  {
    type: 'technical',
    q: 'What are the main differences between IPv4 and IPv6?',
    answer: `- **Size**: IPv4 is 32 bits (~4.3 billion addresses); IPv6 is **128 bits**, practically unlimited.
- **Format**: IPv4 dotted decimal; IPv6 hexadecimal with colons, which can be shortened with ::.
- **No broadcast** in IPv6 — it uses multicast.
- **NDP replaces ARP**; hosts can auto-configure with **SLAAC** or DHCPv6.
- **Simpler fixed 40-byte header**; no NAT needed.
- Address types: global unicast (2000::/3), link-local (fe80::/10), unique local (fd00::/8), multicast (ff00::/8).

Migration is usually done with **dual stack** — running both at the same time.`,
  },
  {
    type: 'scenario',
    q: 'Design an IP addressing plan for a bank with a head office, a data centre, a DR site and about 300 branches.',
    answer: `I would use the private range **10.0.0.0/8** and a clear, hierarchical plan (example):

- **Data centre**: 10.1.0.0/16 — split by function: servers, databases, management, DMZ (separate subnets/VLANs).
- **DR site**: 10.2.0.0/16 — mirror the DC layout so failover is simple.
- **Head office**: 10.3.0.0/16 — VLANs per department/floor.
- **Branches**: 10.100.0.0/15 — that gives 512 /24 networks, so **one /24 per branch** with room to grow. Inside each branch, use a **VLSM template**: staff /26, voice /27, CCTV /28, ATM /29, management /29.
- **WAN links**: a separate block, e.g. 10.255.0.0/16, cut into /30 or /31.

Benefits: easy to read ("10.100.25.x = branch 25"), **route summarisation** per region, simpler firewall rules (e.g. "all branches = 10.100.0.0/15"), and room for growth. I would document everything in an **IPAM** tool.`,
    tips: ['Use "for example" — do not claim this is NSB\'s real plan.', 'Mention summarisation, security zones and documentation (IPAM).'],
  },
  {
    type: 'scenario',
    q: 'Two PCs on the same switch cannot talk. PC A is 192.168.1.10/24 and PC B is 192.168.1.200/25. What is wrong?',
    answer: `There is a **subnet mask mismatch**.

- PC A (/24) thinks the network is 192.168.1.0 – .255, so it believes PC B is **local**.
- PC B (/25) is in 192.168.1.128/25 (.128 – .255). It sees 192.168.1.10 as **remote**, so it sends replies to its **default gateway** instead of directly — and if that gateway is not in its subnet or not configured, the traffic fails.

Fix: give both PCs the **correct mask** for the VLAN (from DHCP, or correct the static config). This is why we prefer DHCP — it avoids manual mistakes.`,
  },
  {
    type: 'technical',
    q: 'What is the purpose of 127.0.0.1 and 169.254.x.x addresses?',
    answer: `**127.0.0.1** is the **loopback** address — it always means "this computer". \`ping 127.0.0.1\` tests whether the TCP/IP stack on the PC works, without using the network.

**169.254.x.x** is **APIPA / link-local**. Windows gives itself this address when it **cannot reach a DHCP server**. It means the PC has no proper network connection — I would check the cable, switch port/VLAN, DHCP relay and the DHCP server.`,
  },
];
