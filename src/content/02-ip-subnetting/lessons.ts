import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'ipv4-binary',
    title: 'IPv4 addresses and binary',
    analogy:
      'An IP address is like a **house address with 4 parts**: Province . District . Street . House number. Computers write each part in **binary** (only 0 and 1), like a row of 8 light switches that are ON or OFF.',
    body: `An **IPv4 address** is **32 bits**, written as **4 octets** (8 bits each) in decimal: \`192.168.10.77\`. Each octet is **0–255**.

Each bit in an octet has a value: **128 64 32 16 8 4 2 1**. Add the values of the bits that are 1:
- \`11000000\` = 128 + 64 = **192**
- \`10101000\` = 128 + 32 + 8 = **168**
- \`01001101\` = 64 + 8 + 4 + 1 = **77**

**Decimal → binary** (subtract method): start at 128. If the number is ≥ the bit value, write **1** and subtract; otherwise write **0**. Move to the next bit.

You do not need to be fast at binary — but you must understand it, because **subnet masks are just 1s followed by 0s**.`,
    visuals: [
      {
        kind: 'fields',
        title: '192.168.10.77 in binary',
        rows: [
          {
            label: 'Bit values in every octet',
            fields: [128, 64, 32, 16, 8, 4, 2, 1].map((v) => ({ text: String(v), tone: 'slate' as const })),
          },
          {
            label: 'The four octets',
            fields: [
              { text: '192', sub: '11000000', tone: 'blue' },
              { text: '168', sub: '10101000', tone: 'blue' },
              { text: '10', sub: '00001010', tone: 'blue' },
              { text: '77', sub: '01001101', tone: 'green' },
            ],
          },
        ],
        note: '4 octets × 8 bits = **32 bits**. The maximum per octet is 11111111 = **255**.',
      },
      {
        kind: 'flow',
        title: 'Convert 77 to binary (subtract method)',
        steps: [
          { label: '128?', icon: '0', detail: '77 is less than 128 → write **0**.', tone: 'slate' },
          { label: '64?', icon: '1', detail: '77 ≥ 64 → write **1**. 77 − 64 = **13** left.', tone: 'green' },
          { label: '32?', icon: '0', detail: '13 < 32 → **0**.', tone: 'slate' },
          { label: '16?', icon: '0', detail: '13 < 16 → **0**.', tone: 'slate' },
          { label: '8?', icon: '1', detail: '13 ≥ 8 → **1**. 13 − 8 = **5** left.', tone: 'green' },
          { label: '4?', icon: '1', detail: '5 ≥ 4 → **1**. 5 − 4 = **1** left.', tone: 'green' },
          { label: '2?', icon: '0', detail: '1 < 2 → **0**.', tone: 'slate' },
          { label: '1?', icon: '1', detail: '1 ≥ 1 → **1**. Done! 77 = **01001101**.', tone: 'green' },
        ],
      },
    ],
    bank: `Banks normally use the private range **10.0.0.0/8** inside, because it is very large. For example (illustration only): data centre servers in 10.1.x.x, DR site in 10.2.x.x, branches in 10.20.x.x. A clear, logical plan makes firewall rules, routing and troubleshooting much easier.`,
    remember: [
      'IPv4 = **32 bits = 4 octets**, each 0–255.',
      'Bit values: **128 64 32 16 8 4 2 1** (sum = 255).',
      'Masks are continuous 1s then 0s — binary helps you see the network and host parts.',
    ],
    check: [
      {
        q: 'What is 11100000 in decimal?',
        options: ['192', '224', '240', '248'],
        answer: 1,
        explain: '128 + 64 + 32 = **224**.',
      },
      {
        q: 'How many bits are in an IPv4 address?',
        options: ['16', '32', '48', '128'],
        answer: 1,
        explain: 'IPv4 = **32 bits** (4 × 8).',
      },
    ],
  },
  {
    id: 'classes',
    title: 'IPv4 address classes',
    analogy:
      'In the past, addresses were sold in **fixed packet sizes**: a huge box (Class A), a medium box (Class B) and a small box (Class C). Today we cut exactly the size we need (CIDR), but interviewers still ask about the boxes.',
    body: `Classful addressing is **old** (replaced by CIDR in 1993), but you should know it. The class is decided by the **first octet**:

| Class | First octet | First bits | Default mask | Hosts per network |
|---|---|---|---|---|
| **A** | 1 – 126 | 0 | /8 (255.0.0.0) | 16,777,214 |
| **B** | 128 – 191 | 10 | /16 (255.255.0.0) | 65,534 |
| **C** | 192 – 223 | 110 | /24 (255.255.255.0) | 254 |
| **D** | 224 – 239 | 1110 | — multicast | — |
| **E** | 240 – 255 | 1111 | — experimental | — |

**127.x.x.x** is reserved for **loopback** (127.0.0.1 = "this computer"), so Class A usable networks are 1–126. 0.x.x.x is also special.`,
    visuals: [
      {
        kind: 'fields',
        title: 'Classes by first octet (0 – 255)',
        rows: [
          {
            label: 'First octet range (box width = share of the address space)',
            fields: [
              { text: 'A', sub: '0–127', tone: 'blue', w: 8 },
              { text: 'B', sub: '128–191', tone: 'green', w: 4 },
              { text: 'C', sub: '192–223', tone: 'amber', w: 2 },
              { text: 'D', sub: 'multicast', tone: 'purple', w: 1 },
              { text: 'E', sub: '240+', tone: 'slate', w: 1 },
            ],
          },
          {
            label: 'Default network / host split',
            fields: [
              { text: 'A: N.H.H.H', sub: '/8', tone: 'blue' },
              { text: 'B: N.N.H.H', sub: '/16', tone: 'green' },
              { text: 'C: N.N.N.H', sub: '/24', tone: 'amber' },
            ],
          },
        ],
        note: 'Class A is half of all IPv4 addresses! That waste is why **CIDR** replaced classes.',
      },
    ],
    bank: `You may see old documents or legacy systems that say "Class C network" for a /24. Modern bank networks use **classless (CIDR) addressing**: a 10.x.x.x network (technically Class A) is cut into many /24, /26, /28 subnets as needed.`,
    remember: [
      'A 1–126 (/8), B 128–191 (/16), C 192–223 (/24), D 224–239 multicast, E 240–255 experimental.',
      '**127.0.0.0/8 = loopback** (127.0.0.1).',
      'Classes are historic; today we use **CIDR** (any prefix length).',
    ],
    check: [
      {
        q: 'Which class does 172.20.5.1 belong to?',
        options: ['Class A', 'Class B', 'Class C', 'Class D'],
        answer: 1,
        explain: 'The first octet 172 is between 128 and 191 → **Class B**.',
      },
      {
        q: 'What is the default subnet mask of a Class C address?',
        options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.252'],
        answer: 2,
        explain: 'Class C default = **/24 = 255.255.255.0**.',
      },
    ],
  },
  {
    id: 'private-special',
    title: 'Private and special addresses',
    analogy:
      '**Private IPs are like office extension numbers** (1001, 1002…): every company can use the same extensions inside, but you cannot dial them from outside. **Public IPs are like full phone numbers**: unique in the whole world.',
    body: `**Private addresses (RFC 1918)** can be used inside any organisation. They are **not routed on the Internet** — NAT is needed to go out.
- **10.0.0.0/8** (10.0.0.0 – 10.255.255.255)
- **172.16.0.0/12** (172.16.0.0 – 172.31.255.255)
- **192.168.0.0/16** (192.168.0.0 – 192.168.255.255)

**Special addresses**
| Address | Meaning |
|---|---|
| **127.0.0.1** (127.0.0.0/8) | Loopback — tests the PC's own TCP/IP stack |
| **169.254.0.0/16** | APIPA / link-local — no DHCP reply |
| **0.0.0.0** | "Any / unknown"; **0.0.0.0/0** = default route |
| **255.255.255.255** | Limited broadcast (local network only) |
| **100.64.0.0/10** | Carrier-grade NAT (used by ISPs) |
| 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 | Documentation/examples |`,
    visuals: [
      {
        kind: 'fields',
        title: 'Address map you must know',
        rows: [
          {
            label: 'Private (RFC 1918) — use inside, NAT to go out',
            fields: [
              { text: '10.0.0.0/8', sub: '16.7 million', tone: 'green' },
              { text: '172.16.0.0/12', sub: '172.16–172.31', tone: 'green' },
              { text: '192.168.0.0/16', sub: 'home / small', tone: 'green' },
            ],
          },
          {
            label: 'Special use',
            fields: [
              { text: '127.0.0.1', sub: 'loopback', tone: 'purple' },
              { text: '169.254.x.x', sub: 'APIPA (no DHCP)', tone: 'red' },
              { text: '0.0.0.0/0', sub: 'default route', tone: 'blue' },
            ],
          },
          {
            label: 'Broadcast',
            fields: [
              { text: '255.255.255.255', sub: 'limited broadcast', tone: 'amber' },
              { text: 'last address of subnet', sub: 'directed broadcast', tone: 'amber' },
            ],
          },
        ],
      },
    ],
    bank: `Bank internal systems (core banking, ATM network, branch PCs) all use **private IPs**. Only the **Internet edge** (Internet banking, email gateway, VPN gateway) uses **public IPs**, through NAT on the edge firewall. If you see 169.254.x.x on a teller PC, DHCP failed. \`ping 127.0.0.1\` tests if TCP/IP on the PC itself works.`,
    remember: [
      'Private: **10/8, 172.16/12 (172.16–172.31), 192.168/16**.',
      '127.0.0.1 loopback · 169.254.x.x APIPA · 0.0.0.0/0 default route · 255.255.255.255 broadcast.',
      'Private IPs need **NAT** to reach the Internet.',
    ],
    check: [
      {
        q: 'Which of these addresses is private?',
        options: ['172.15.1.1', '172.31.200.5', '172.32.0.1', '192.169.1.1'],
        answer: 1,
        explain: '172.16.0.0/12 covers **172.16.0.0 – 172.31.255.255**, so 172.31.200.5 is private.',
      },
      {
        q: 'What does 0.0.0.0/0 mean in a routing table?',
        options: ['Loopback', 'The default route (any destination)', 'A broadcast', 'An APIPA network'],
        answer: 1,
        explain: '**0.0.0.0/0** matches every destination: it is the **default route** ("gateway of last resort").',
      },
    ],
  },
  {
    id: 'masks-cidr',
    title: 'Subnet masks and CIDR',
    analogy:
      'The subnet mask is a **ruler** placed on the address: it shows where the **street name** (network) ends and the **house number** (host) starts. A longer ruler (/26) means a smaller street with fewer houses.',
    body: `A **subnet mask** has **1s for the network part** and **0s for the host part**. The 1s are always continuous.

**CIDR notation** writes the number of 1s: \`/24\` = 24 ones = \`255.255.255.0\`.

Mask octet values (learn these): **128, 192, 224, 240, 248, 252, 254, 255** (1 to 8 ones).

Three key formulas:
- Host bits **h = 32 − prefix**
- **Total addresses = 2^h**
- **Usable hosts = 2^h − 2** (minus the network address and broadcast address)

The **network address** has all host bits = 0. The **broadcast address** has all host bits = 1.

**CIDR** also allows **route summarisation** (supernetting): instead of 256 routes for 10.20.0.0/24 … 10.20.255.0/24, a router can advertise one route **10.20.0.0/16**.`,
    visuals: [
      { kind: 'custom', id: 'subnetBits' },
      {
        kind: 'fields',
        title: 'Mask octet values',
        rows: [
          {
            label: 'Number of 1s in the octet → value',
            fields: [
              { text: '128', sub: '1 bit', tone: 'blue' },
              { text: '192', sub: '2', tone: 'blue' },
              { text: '224', sub: '3', tone: 'blue' },
              { text: '240', sub: '4', tone: 'blue' },
              { text: '248', sub: '5', tone: 'blue' },
              { text: '252', sub: '6', tone: 'blue' },
              { text: '254', sub: '7', tone: 'blue' },
              { text: '255', sub: '8', tone: 'blue' },
            ],
          },
        ],
        note: 'Example: /26 = 8 + 8 + 8 + **2** → 255.255.255.**192**. /20 = 8 + 8 + **4** + 0 → 255.255.**240**.0.',
      },
    ],
    bank: `A branch LAN might be a **/24** (254 hosts). A point-to-point WAN link between two routers only needs 2 addresses → **/30** (or /31). A small ATM VLAN might use a **/29** (6 hosts). Choosing the right size saves addresses and keeps broadcast domains small.`,
    remember: [
      'Usable hosts = **2^(32 − prefix) − 2**. /24 = 254, /25 = 126, /26 = 62, /27 = 30, /28 = 14, /29 = 6, /30 = 2.',
      'Network address = host bits all 0; broadcast = host bits all 1.',
      'CIDR allows any prefix length and **route summarisation**.',
    ],
    check: [
      {
        q: 'What is the subnet mask for /27?',
        options: ['255.255.255.192', '255.255.255.224', '255.255.255.240', '255.255.255.248'],
        answer: 1,
        explain: '/27 = 24 + **3** bits → 128 + 64 + 32 = **224** → 255.255.255.224.',
      },
      {
        q: 'How many usable hosts are in a /28?',
        options: ['16', '14', '30', '6'],
        answer: 1,
        explain: 'Host bits = 4 → 2⁴ = 16 addresses − 2 = **14** usable.',
      },
      {
        q: 'Which single route summarises 10.20.0.0/24 through 10.20.255.0/24?',
        options: ['10.20.0.0/8', '10.20.0.0/16', '10.20.0.0/24', '10.0.0.0/16'],
        answer: 1,
        explain: 'All those networks share the first 16 bits (10.20) → **10.20.0.0/16**.',
      },
    ],
  },
  {
    id: 'magic-number',
    title: 'Subnetting step by step (magic number method)',
    analogy:
      'Think of a **long road divided into equal plots**. The "magic number" is the **plot size**. If each plot is 16 metres, plots start at 0, 16, 32, 48… To find your plot, find the start just below your position.',
    body: `The fastest method for interviews — **no binary needed**:

1. Write the mask from the prefix.
2. Find the **interesting octet** — the one that is not 255 or 0.
3. **Magic number (block size) = 256 − mask value** in that octet.
4. Count up in blocks: 0, block, 2×block … Find the block that contains your IP's octet → that is the **network**.
5. **Broadcast** = next network − 1.
6. **First host** = network + 1, **last host** = broadcast − 1.
7. **Hosts** = 2^(host bits) − 2.

Quick example: **192.168.1.130/26** → mask 255.255.255.192 → block = 256 − 192 = **64** → blocks 0, 64, **128**, 192 → network **.128**, broadcast **.191**, hosts **.129 – .190**, 62 usable.

Use the **Subnet trainer** (🧮 tab) to practise until you can do it in under 1 minute.`,
    visuals: [
      {
        kind: 'flow',
        title: 'Worked example: 172.16.45.200/20',
        steps: [
          { label: 'Mask', icon: '1', detail: '/20 = 8 + 8 + 4 → mask **255.255.240.0**.', tone: 'blue' },
          { label: 'Interesting octet', icon: '2', detail: 'The **3rd octet** (value 240) is not 255 or 0.', tone: 'blue' },
          { label: 'Magic number', icon: '3', detail: '256 − 240 = **16**. Networks go up by 16 in the 3rd octet.', tone: 'purple' },
          { label: 'Find the block', icon: '4', detail: 'Blocks: 0, 16, **32**, 48… The IP\'s 3rd octet is **45** → it is in the block **32–47**. Network = **172.16.32.0**.', tone: 'green' },
          { label: 'Broadcast', icon: '5', detail: 'Next network is 48 → broadcast = 47 in the 3rd octet, 255 in the 4th = **172.16.47.255**.', tone: 'amber' },
          { label: 'Host range', icon: '6', detail: 'First host **172.16.32.1**, last host **172.16.47.254**.', tone: 'teal' },
          { label: 'Host count', icon: '7', detail: 'Host bits = 32 − 20 = 12 → 2¹² − 2 = **4,094** usable hosts.', tone: 'indigo' },
        ],
      },
    ],
    bank: `In an interview they may say: "A teller PC has 10.20.5.77/26. What is its network, and can it talk directly to 10.20.5.130?" → block 64 → network 10.20.5.64, range .65–.126. **.130 is in a different subnet** (10.20.5.128/26), so traffic must go through the **gateway/router**.`,
    remember: [
      '**Magic number = 256 − interesting mask octet.** Networks are multiples of it.',
      'Broadcast = next network − 1. First host = network + 1. Last host = broadcast − 1.',
      'Practise with random questions until it is automatic.',
    ],
    check: [
      {
        q: 'What is the network address of 192.168.1.100/27?',
        options: ['192.168.1.64', '192.168.1.96', '192.168.1.100', '192.168.1.128'],
        answer: 1,
        explain: '/27 → mask .224 → block 32 → blocks 0, 32, 64, **96**, 128. 100 is in 96–127 → network **192.168.1.96**.',
      },
      {
        q: 'What is the broadcast address of 10.10.10.10/29?',
        options: ['10.10.10.15', '10.10.10.7', '10.10.10.16', '10.10.10.255'],
        answer: 0,
        explain: '/29 → block 8 → 8–15 contains 10 → network 10.10.10.8, broadcast **10.10.10.15**.',
      },
      {
        q: 'What is the last usable host in 172.16.45.200/20?',
        options: ['172.16.47.255', '172.16.47.254', '172.16.45.254', '172.16.63.254'],
        answer: 1,
        explain: 'Network 172.16.32.0, broadcast 172.16.47.255 → last host **172.16.47.254**.',
      },
    ],
  },
  {
    id: 'splitting',
    title: 'Splitting a network into subnets',
    analogy:
      'You have one big **land plot** (a /24) and want to build **4 equal houses**. You draw lines to cut it into 4 equal parts. Each extra line you draw (borrowed bit) **doubles** the number of plots and **halves** their size.',
    body: `To make subnets, you **borrow bits from the host part**.

- **Number of subnets = 2^(borrowed bits)**
- **Hosts per subnet = 2^(remaining host bits) − 2**

Example: split **192.168.10.0/24** into **4** subnets:
- 4 = 2² → borrow **2 bits** → new prefix **/26**
- Host bits left = 6 → 2⁶ − 2 = **62 hosts** per subnet
- Block size = 64 → subnets start at .0, .64, .128, .192

| Subnet | Network | Host range | Broadcast |
|---|---|---|---|
| 1 | 192.168.10.0/26 | .1 – .62 | .63 |
| 2 | 192.168.10.64/26 | .65 – .126 | .127 |
| 3 | 192.168.10.128/26 | .129 – .190 | .191 |
| 4 | 192.168.10.192/26 | .193 – .254 | .255 |

Ask yourself: "Do I need **more subnets** (borrow more bits) or **more hosts** (borrow fewer)?"`,
    visuals: [
      {
        kind: 'fields',
        title: 'Borrowing 2 bits: /24 → /26',
        rows: [
          {
            label: '32 bits after borrowing',
            fields: [
              { text: '24 network bits', sub: '192.168.10', tone: 'blue', w: 24 },
              { text: '2', sub: 'subnet', tone: 'purple', w: 3 },
              { text: '6 host bits', sub: '62 hosts', tone: 'green', w: 7 },
            ],
          },
          {
            label: 'The /24 cut into four /26 blocks',
            fields: [
              { text: '.0/26', sub: '.1–.62', tone: 'blue' },
              { text: '.64/26', sub: '.65–.126', tone: 'green' },
              { text: '.128/26', sub: '.129–.190', tone: 'amber' },
              { text: '.192/26', sub: '.193–.254', tone: 'purple' },
            ],
          },
        ],
        note: 'Each extra borrowed bit doubles the subnets and halves the hosts: /25 = 2 × 126, /26 = 4 × 62, /27 = 8 × 30, /28 = 16 × 14.',
      },
    ],
    bank: `The bank's IT team gets **10.20.0.0/16** for branches. With one **/24 per branch**, they borrow 8 bits → 2⁸ = **256 branch subnets**, each with 254 hosts. Branch 5 = 10.20.5.0/24, branch 6 = 10.20.6.0/24, and so on. Easy to remember and to summarise.`,
    remember: [
      'Subnets = **2^borrowed bits**; hosts = **2^host bits − 2**.',
      'More subnets ↔ fewer hosts per subnet.',
      '/24 into 4 → /26 (block 64), into 8 → /27 (block 32).',
    ],
    check: [
      {
        q: 'You split a /24 into 8 equal subnets. What is the new prefix?',
        options: ['/25', '/26', '/27', '/28'],
        answer: 2,
        explain: '8 = 2³ → borrow 3 bits → 24 + 3 = **/27** (30 hosts each).',
      },
      {
        q: 'How many /26 subnets fit in a /24?',
        options: ['2', '4', '8', '64'],
        answer: 1,
        explain: '26 − 24 = 2 bits → 2² = **4** subnets.',
      },
    ],
  },
  {
    id: 'vlsm',
    title: 'VLSM: different sizes for different needs',
    analogy:
      'A clothes shop does not sell only one size. **VLSM gives each department the right "size" of subnet**: a large one for 60 staff PCs, a small one for 4 ATMs — so nothing is wasted.',
    body: `**VLSM (Variable Length Subnet Masking)** = using **different prefix lengths** inside one address block.

Method:
1. List the needs and **sort from largest to smallest**.
2. For each need, choose the smallest subnet that fits (hosts + 2 ≤ 2^h).
3. Give out addresses **in order**, starting with the biggest, so blocks stay aligned.

Example: one branch gets **10.20.5.0/24**:
| VLAN | Need | Prefix | Subnet | Usable range |
|---|---|---|---|---|
| Staff PCs | 60 | /26 (62) | 10.20.5.0/26 | .1 – .62 |
| IP phones | 25 | /27 (30) | 10.20.5.64/27 | .65 – .94 |
| CCTV | 12 | /28 (14) | 10.20.5.96/28 | .97 – .110 |
| ATMs | 4 | /29 (6) | 10.20.5.112/29 | .113 – .118 |
| Management | 5 | /29 (6) | 10.20.5.120/29 | .121 – .126 |
| *Free* | — | /25 | 10.20.5.128/25 | for growth |

VLSM needs a **classless routing protocol** (OSPF, EIGRP, BGP, RIPv2) that sends the mask with each route.`,
    visuals: [
      {
        kind: 'fields',
        title: '10.20.5.0/24 cut with VLSM (box width = size)',
        rows: [
          {
            label: '.0 → .255',
            fields: [
              { text: 'Staff /26', sub: '.0–.63', tone: 'blue', w: 64 },
              { text: 'Voice /27', sub: '.64–.95', tone: 'purple', w: 32 },
              { text: 'CCTV /28', sub: '.96', tone: 'amber', w: 16 },
              { text: 'ATM', sub: '/29', tone: 'red', w: 8 },
              { text: 'Mgmt', sub: '/29', tone: 'teal', w: 8 },
              { text: 'Free /25', sub: '.128–.255', tone: 'slate', w: 128 },
            ],
          },
        ],
      },
      {
        kind: 'flow',
        title: 'VLSM method',
        steps: [
          { label: 'List needs', icon: '📋', detail: 'Staff 60, Voice 25, CCTV 12, ATM 4, Management 5.', tone: 'slate' },
          { label: 'Sort big → small', icon: '↕', detail: 'Always start with the largest subnet so the blocks stay aligned on their boundaries.', tone: 'blue' },
          { label: 'Pick sizes', icon: '📏', detail: '60 → /26 (62). 25 → /27 (30). 12 → /28 (14). 4 and 5 → /29 (6 each).', tone: 'purple' },
          { label: 'Allocate in order', icon: '🧱', detail: '.0/26 → next free is .64 → .64/27 → next .96 → .96/28 → .112/29 → .120/29. The rest (.128/25) is free.', tone: 'green' },
          { label: 'Document', icon: '📝', detail: 'Record each subnet, VLAN ID, gateway (usually first host) in the IP plan (IPAM).', tone: 'teal' },
        ],
      },
    ],
    bank: `With VLSM, every branch can follow the **same template** (staff, voice, CCTV, ATM, management VLANs), which makes support easy: "the ATM VLAN is always .112/29, gateway .113". WAN links between routers use **/30** (or /31) to waste no addresses.`,
    remember: [
      'VLSM = different subnet sizes in one block. **Allocate largest first.**',
      'Needs a **classless routing protocol** (OSPF, EIGRP, BGP, RIPv2).',
      'Point-to-point links: /30 (2 hosts) or /31.',
    ],
    check: [
      {
        q: 'A VLAN needs 25 hosts. What is the smallest subnet that fits?',
        options: ['/26', '/27', '/28', '/29'],
        answer: 1,
        explain: '/27 gives 30 usable hosts; /28 gives only 14. So **/27**.',
      },
      {
        q: 'In VLSM, why do we allocate the largest subnets first?',
        options: ['It is required by DHCP', 'To keep blocks aligned and avoid overlaps/wasted gaps', 'Because routers read them first', 'It makes the broadcast smaller'],
        answer: 1,
        explain: 'Big blocks must start on big boundaries. Allocating big → small keeps everything **aligned with no overlap**.',
      },
    ],
  },
  {
    id: 'ipv6-basics',
    title: 'IPv6 basics: format and shortening',
    analogy:
      'IPv4 is like **8-digit phone numbers** — the world ran out. IPv6 is like giving every grain of sand on Earth its own number: **128 bits**, about 3.4 × 10³⁸ addresses.',
    body: `**IPv6** addresses are **128 bits**, written as **8 groups of 4 hex digits** separated by colons:
\`2001:0db8:acad:0001:0000:0000:0000:0010\`

**Two shortening rules:**
1. Remove **leading zeros** in each group: \`0db8\` → \`db8\`, \`0001\` → \`1\`, \`0010\` → \`10\`.
2. Replace **one** run of all-zero groups with \`::\` (only once per address).

Result: \`2001:db8:acad:1::10\`

**Structure** of a typical global address:
- **Global routing prefix** (/48) — given to the organisation by the ISP/registry
- **Subnet ID** (16 bits) — the organisation's subnets (65,536 of them!)
- **Interface ID** (64 bits) — the host. A normal LAN subnet is always **/64**.

Hosts can configure themselves with **SLAAC** (from router advertisements) or use **DHCPv6**.`,
    visuals: [
      {
        kind: 'fields',
        title: 'Structure of 2001:db8:acad:1::10/64',
        rows: [
          {
            label: '128 bits',
            fields: [
              { text: '2001:db8:acad', sub: 'Global prefix (48 bits)', tone: 'blue', w: 3 },
              { text: ':1', sub: 'Subnet ID (16)', tone: 'purple', w: 1 },
              { text: '::10', sub: 'Interface ID (64 bits)', tone: 'green', w: 4 },
            ],
          },
        ],
        note: '2001:db8::/32 is reserved for documentation, like 192.0.2.0/24 in IPv4.',
      },
      {
        kind: 'flow',
        title: 'Shorten an IPv6 address',
        steps: [
          { label: 'Full', icon: '1', detail: '`2001:0db8:acad:0001:0000:0000:0000:0010`', tone: 'slate' },
          { label: 'Drop leading zeros', icon: '2', detail: '`2001:db8:acad:1:0:0:0:10` — each group keeps at least one digit.', tone: 'blue' },
          { label: 'Use :: once', icon: '3', detail: 'Replace the longest run of zero groups: `2001:db8:acad:1::10`. Using :: twice is **not allowed** (it would be ambiguous).', tone: 'green' },
        ],
      },
    ],
    bank: `Most bank internal networks still run **IPv4**. But Internet-facing services (Internet banking, mobile app APIs) may need **IPv6** as mobile networks move to it. Many organisations run **dual stack** (IPv4 and IPv6 together) at the Internet edge. Saying this shows awareness.`,
    remember: [
      'IPv6 = **128 bits**, 8 groups of hex. Shorten: drop leading zeros, use **:: once**.',
      'Standard LAN subnet = **/64**; the last 64 bits are the interface ID.',
      'Address config: **SLAAC** or **DHCPv6**.',
    ],
    check: [
      {
        q: 'Which is a correct short form of 2001:0db8:0000:0000:0000:0000:0000:0001?',
        options: ['2001:db8::1', '2001:db8:0:1', '2001::db8::1', '21:db8::1'],
        answer: 0,
        explain: 'Remove leading zeros and replace the zero run with :: → **2001:db8::1**. :: may only appear once.',
      },
      {
        q: 'How many bits are in an IPv6 address?',
        options: ['32', '64', '128', '256'],
        answer: 2,
        explain: 'IPv6 = **128 bits**.',
      },
    ],
  },
  {
    id: 'ipv6-types',
    title: 'IPv6 address types and IPv4 vs IPv6',
    analogy:
      'IPv6 has different "number types", like phone numbers: **international numbers** (global unicast), **internal extensions** that only work in the building (link-local), and **group numbers** (multicast).',
    body: `| Type | Prefix | Like IPv4… |
|---|---|---|
| **Global unicast** | 2000::/3 (starts with 2 or 3) | Public address |
| **Link-local** | fe80::/10 | Only on the local link; every interface has one; used by NDP and routing protocols |
| **Unique local** | fc00::/7 (in practice fd00::/8) | Private (10.x) |
| **Multicast** | ff00::/8 | Multicast (replaces broadcast) |
| **Loopback** | ::1 | 127.0.0.1 |
| **Unspecified** | :: | 0.0.0.0 |

Big changes from IPv4:
- **No broadcast** → multicast is used instead.
- **NDP** (Neighbor Discovery, ICMPv6) replaces **ARP**.
- **Simpler fixed 40-byte header**, no header checksum, routers do not fragment.
- No need for NAT (enough addresses), but still use **firewalls**.
- Migration: **dual stack**, **tunnelling**, **NAT64/DNS64**.`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'IPv4', icon: '4️⃣', tone: 'blue' },
          { label: 'IPv6', icon: '6️⃣', tone: 'green' },
        ],
        rows: [
          { label: 'Size', values: ['32 bits (~4.3 billion)', '128 bits (~3.4 × 10³⁸)'] },
          { label: 'Format', values: ['Dotted decimal 10.1.1.1', 'Hex with colons 2001:db8::1'] },
          { label: 'Broadcast', values: ['Yes', 'No — multicast instead'] },
          { label: 'MAC lookup', values: ['ARP', 'NDP (ICMPv6)'] },
          { label: 'Auto config', values: ['DHCP', 'SLAAC or DHCPv6'] },
          { label: 'Header', values: ['20–60 bytes, has checksum', 'Fixed 40 bytes, no checksum'] },
          { label: 'NAT', values: ['Common (PAT)', 'Not needed'] },
        ],
      },
    ],
    bank: `If a bank enables IPv6 on its Internet banking site, the security team must make sure the **firewall, WAF and monitoring** handle IPv6 the same way as IPv4 — otherwise IPv6 becomes an unprotected "side door".`,
    remember: [
      'Global unicast 2000::/3, link-local **fe80::/10**, unique local fd00::/8, multicast ff00::/8, loopback **::1**.',
      'IPv6: **no broadcast**, **NDP replaces ARP**, SLAAC/DHCPv6, fixed 40-byte header.',
      'Transition: dual stack, tunnelling, NAT64.',
    ],
    check: [
      {
        q: 'Which IPv6 address type starts with fe80?',
        options: ['Global unicast', 'Link-local', 'Multicast', 'Unique local'],
        answer: 1,
        explain: '**fe80::/10 = link-local**, valid only on the local link.',
      },
      {
        q: 'In IPv6, which protocol replaces ARP?',
        options: ['DHCPv6', 'NDP (Neighbor Discovery)', 'IGMP', 'RARP'],
        answer: 1,
        explain: '**NDP** (part of ICMPv6) does neighbour/MAC discovery, router discovery and duplicate address detection.',
      },
    ],
  },
];
