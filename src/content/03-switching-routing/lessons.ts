import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'mac-learning',
    title: 'How a switch learns: the MAC address table',
    analogy:
      'A new receptionist does not know where anyone sits. When a letter arrives for an unknown person, she **asks every desk** (flood). Each time someone sends a letter, she notes **"Nimal sits at desk 1"**. Soon she delivers directly.',
    body: `A switch builds a **MAC address table** (CAM table): *MAC address → port*. Four actions:

1. **Learn** — read the **source MAC** of every frame and record which port it came from.
2. **Flood** — if the **destination MAC is unknown** (or broadcast), send the frame out of **all ports** except the incoming one.
3. **Forward** — if the destination is known, send it **only** out of that port.
4. **Filter** — if the destination is on the same port it came from, drop it.

Entries **age out** (Cisco default **300 seconds**) if not seen again.

Security features on access ports:
- **Port security** — limit the number of MACs, or allow only specific MACs; shut down the port on violation.
- **MAC flooding attack** — an attacker fills the table with fake MACs so the switch floods everything (like a hub). Port security stops it.

Commands (Cisco): \`show mac address-table\`, \`show interfaces status\`.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Learn → flood → forward',
        width: 360,
        height: 220,
        nodes: [
          { id: 'sw', label: 'Switch', icon: 'switch', x: 180, y: 110, info: 'MAC table starts empty after a reboot.' },
          { id: 'a', label: 'PC A', icon: 'pc', x: 50, y: 40, sub: 'port 1 · MAC AAAA', info: 'Connected to port Gi0/1.' },
          { id: 'b', label: 'PC B', icon: 'pc', x: 310, y: 40, sub: 'port 2 · MAC BBBB', info: 'Connected to port Gi0/2.' },
          { id: 'c', label: 'PC C', icon: 'pc', x: 50, y: 180, sub: 'port 3 · MAC CCCC', info: 'Connected to port Gi0/3.' },
          { id: 'd', label: 'Printer', icon: 'printer', x: 310, y: 180, sub: 'port 4 · MAC DDDD', info: 'Connected to port Gi0/4.' },
        ],
        links: [
          { from: 'sw', to: 'a', label: 'Gi0/1' },
          { from: 'sw', to: 'b', label: 'Gi0/2' },
          { from: 'sw', to: 'c', label: 'Gi0/3' },
          { from: 'sw', to: 'd', label: 'Gi0/4' },
        ],
        steps: [
          { text: 'PC A sends a frame to PC B. The switch **learns** "AAAA → Gi0/1". It does **not know** BBBB yet, so it **floods** the frame to all other ports.\n\nMAC table: AAAA → Gi0/1', paths: [['a', 'sw', 'b'], ['a', 'sw', 'c'], ['a', 'sw', 'd']], packet: 'to BBBB?', tone: 'amber' },
          { text: 'PC B replies to A. The switch **learns** "BBBB → Gi0/2". It already knows AAAA, so it **forwards** only to Gi0/1.\n\nMAC table: AAAA → Gi0/1, BBBB → Gi0/2', paths: [['b', 'sw', 'a']], packet: 'to AAAA', tone: 'green' },
          { text: 'Now A → B goes **only** to Gi0/2. PC C and the printer do not see it. This is why switches are faster and more secure than hubs.', paths: [['a', 'sw', 'b']], packet: 'to BBBB' },
          { text: 'If PC B is silent for **300 seconds**, its entry **ages out**, and the next frame to BBBB is flooded again.', highlight: ['sw'] },
        ],
      },
    ],
    bank: `Branch access switches use **port security** so only the known PC or ATM can use a port — if someone plugs a personal laptop into a teller's network socket, the port shuts down (err-disabled) and IT gets an alert. Unused ports are **shut down** and put in an unused VLAN.`,
    remember: [
      'Switch actions: **learn** (source MAC), **flood** (unknown/broadcast), **forward** (known), **filter**.',
      'MAC table entries age out (default **300 s**).',
      '**Port security** limits MACs per port and defends against MAC flooding.',
    ],
    check: [
      {
        q: 'What does a switch do with a frame whose destination MAC is not in its table?',
        options: ['Drops it', 'Floods it out of all ports except the incoming one', 'Sends it to the router', 'Sends an ARP request'],
        answer: 1,
        explain: 'Unknown unicast frames are **flooded** to all other ports in the VLAN.',
      },
      {
        q: 'Which MAC address does a switch learn from a frame?',
        options: ['The destination MAC', 'The source MAC', 'The gateway MAC', 'The broadcast MAC'],
        answer: 1,
        explain: 'The switch learns the **source MAC** and the port it arrived on.',
      },
    ],
  },
  {
    id: 'vlans',
    title: 'VLANs: many networks on one switch',
    analogy:
      'One office building, but each department has its **own locked floor**. People on the Finance floor cannot walk into the IT floor without passing **security at the lift** (the router/firewall). VLANs create these "floors" inside one switch.',
    body: `A **VLAN (Virtual LAN)** splits one physical switch into several **logical networks**.

- Each VLAN = **one broadcast domain** = usually **one IP subnet**.
- Devices in different VLANs **cannot talk directly** — they need a **router or L3 switch** (inter-VLAN routing), where you can apply **ACLs/firewall rules**.
- VLAN IDs: 1–4094. **VLAN 1** is the default — best practice is **not** to use it for users.

**Access port** = belongs to **one** VLAN (connects a PC, printer, ATM).
**Trunk port** = carries **many** VLANs between switches/routers (tagged with 802.1Q).

Benefits: **security** (isolate ATMs, CCTV, guests), **smaller broadcast domains**, **flexibility** (move a user to another VLAN without re-cabling), and **QoS** for voice.

Commands: \`show vlan brief\`, \`switchport mode access\`, \`switchport access vlan 10\`.`,
    visuals: [{ kind: 'custom', id: 'vlanSwitch' }],
    bank: `A branch switch might have VLAN 10 for staff PCs, VLAN 20 for IP phones, VLAN 30 for CCTV, VLAN 40 for the ATM and VLAN 99 for device management. If a CCTV camera is hacked, the attacker is stuck in VLAN 30 and cannot reach teller PCs or the ATM, because the firewall only allows the camera to talk to the video recorder.`,
    remember: [
      'One VLAN = one broadcast domain = one subnet. Different VLANs need a **router/L3 switch** to talk.',
      '**Access port** = one VLAN; **trunk** = many VLANs (802.1Q tags).',
      'VLANs give **security, smaller broadcasts and flexibility**. Do not use VLAN 1 for users.',
    ],
    check: [
      {
        q: 'Two PCs are in VLAN 10 and VLAN 20 on the same switch. How can they communicate?',
        options: ['Directly through the switch', 'Only through a router or Layer 3 switch', 'By using the same MAC', 'They can never communicate'],
        answer: 1,
        explain: 'Different VLANs are different networks, so **inter-VLAN routing** (router or L3 switch) is needed.',
      },
      {
        q: 'What type of switch port carries traffic for many VLANs?',
        options: ['Access port', 'Trunk port', 'Console port', 'Span port'],
        answer: 1,
        explain: 'A **trunk** port carries multiple VLANs using 802.1Q tags.',
      },
    ],
  },
  {
    id: 'trunking',
    title: 'Trunks and 802.1Q tagging',
    analogy:
      'A trunk is a **shared bus** between two buildings. Each passenger wears a **coloured badge** (the VLAN tag) so at the other end they go to the correct floor.',
    body: `When frames from many VLANs share one link, the switch adds a **4-byte 802.1Q tag** inside the Ethernet frame. The tag contains the **VLAN ID (12 bits → 4094 VLANs)** and a **priority (CoS, 3 bits)** for QoS.

- The tag is added when the frame enters the trunk and **removed** before it goes out of an access port. PCs never see tags.
- **Native VLAN** = the one VLAN that travels **untagged** on a trunk (default VLAN 1). Both ends must match.
- Allow only needed VLANs on a trunk: \`switchport trunk allowed vlan 10,20,30\`.

**Security best practices** (prevent **VLAN hopping**):
- Disable auto-negotiation (DTP): \`switchport nonegotiate\`; set ports explicitly to access or trunk.
- Change the native VLAN to an unused VLAN; do not put users in it.
- Shut down unused ports.

Command: \`show interfaces trunk\`.`,
    visuals: [
      {
        kind: 'fields',
        title: 'Ethernet frame with an 802.1Q tag',
        rows: [
          {
            label: 'Normal frame on an access port',
            fields: [
              { text: 'Dest MAC', tone: 'amber', w: 2 },
              { text: 'Src MAC', tone: 'amber', w: 2 },
              { text: 'Type', tone: 'slate', w: 1 },
              { text: 'Data', tone: 'purple', w: 4 },
              { text: 'FCS', tone: 'amber', w: 1 },
            ],
          },
          {
            label: 'Same frame on a trunk (tag inserted)',
            fields: [
              { text: 'Dest MAC', tone: 'amber', w: 2 },
              { text: 'Src MAC', tone: 'amber', w: 2 },
              { text: '802.1Q', sub: 'VLAN 20 · PRI', tone: 'red', w: 2 },
              { text: 'Type', tone: 'slate', w: 1 },
              { text: 'Data', tone: 'purple', w: 3 },
              { text: 'FCS', sub: 'new', tone: 'amber', w: 1 },
            ],
          },
        ],
        note: 'The tag is 4 bytes: TPID 0x8100 + priority (3 bits) + VLAN ID (12 bits). The FCS is recalculated.',
      },
      {
        kind: 'topology',
        title: 'Access ports and a trunk between two switches',
        width: 360,
        height: 190,
        nodes: [
          { id: 's1', label: 'Floor 1 switch', icon: 'switch', x: 100, y: 95, info: 'Access switch on floor 1.' },
          { id: 's2', label: 'Floor 2 switch', icon: 'switch', x: 260, y: 95, info: 'Access switch on floor 2.' },
          { id: 'a', label: 'Finance PC', icon: 'pc', x: 40, y: 30, sub: 'VLAN 10', info: 'Access port in VLAN 10 — sends normal untagged frames.' },
          { id: 'b', label: 'IP phone', icon: 'phone', x: 40, y: 165, sub: 'VLAN 20', info: 'Access port in VLAN 20 (voice).' },
          { id: 'c', label: 'Finance PC', icon: 'pc', x: 320, y: 30, sub: 'VLAN 10', info: 'Same VLAN on another switch — reachable through the trunk without routing.' },
          { id: 'd', label: 'IP phone', icon: 'phone', x: 320, y: 165, sub: 'VLAN 20', info: 'VLAN 20 on floor 2.' },
        ],
        links: [
          { from: 's1', to: 's2', label: 'trunk 802.1Q', style: 'trunk' },
          { from: 'a', to: 's1' },
          { from: 'b', to: 's1' },
          { from: 'c', to: 's2' },
          { from: 'd', to: 's2' },
        ],
        steps: [
          { text: 'Finance PC (VLAN 10) sends to the Finance PC on floor 2. Floor 1 switch **adds tag VLAN 10** on the trunk; floor 2 switch **removes it** and delivers to the VLAN 10 port.', paths: [['a', 's1', 's2', 'c']], packet: 'tag 10' },
          { text: 'The IP phone traffic is tagged **VLAN 20** on the same cable, and only reaches VLAN 20 ports.', paths: [['b', 's1', 's2', 'd']], packet: 'tag 20', tone: 'purple' },
        ],
      },
    ],
    bank: `In a head office, each floor switch has an **uplink trunk** to the distribution/core switches carrying only the VLANs that floor needs (e.g. 10, 20, 99). The native VLAN is changed to an unused VLAN, and DTP is disabled to stop **VLAN hopping** attacks.`,
    remember: [
      '**802.1Q** adds a 4-byte tag with a 12-bit VLAN ID on trunks.',
      '**Native VLAN** = untagged on the trunk; must match at both ends; change it from VLAN 1.',
      'Prevent VLAN hopping: disable DTP, prune allowed VLANs, unused native VLAN.',
    ],
    check: [
      {
        q: 'What is the native VLAN on an 802.1Q trunk?',
        options: ['The VLAN with the highest ID', 'The VLAN whose frames are sent untagged', 'The management VLAN', 'The voice VLAN'],
        answer: 1,
        explain: 'The **native VLAN** is carried **untagged** on a trunk. By default it is VLAN 1.',
      },
      {
        q: 'How many bits are used for the VLAN ID in an 802.1Q tag?',
        options: ['8', '10', '12', '16'],
        answer: 2,
        explain: '**12 bits** → up to 4096 values (1–4094 usable).',
      },
    ],
  },
  {
    id: 'stp',
    title: 'Spanning Tree Protocol (STP)',
    analogy:
      'Three roads connect three towns in a triangle. If every road is open and a rumour (broadcast) starts, it **goes round and round forever**. STP puts a **"road closed" sign** on one road, but keeps it ready to reopen if another road breaks.',
    body: `We connect switches with **extra links for redundancy**. But Layer 2 frames have **no TTL**, so a loop causes a **broadcast storm**, MAC table instability and duplicate frames — the network stops.

**STP (802.1D)** prevents loops by **blocking** some ports:
1. Elect a **root bridge** — the switch with the **lowest Bridge ID** (priority, default 32768, + MAC address).
2. Each other switch picks a **root port** — its best (lowest cost) path to the root.
3. Each link gets a **designated port**.
4. All other ports are **blocked**. If a link fails, a blocked port starts **forwarding**.

Switches exchange **BPDUs** (every 2 seconds).
- Classic STP is slow (~30–50 s). **RSTP (802.1w)** converges in **seconds** — use it.
- **PortFast** on PC ports (skip waiting), **BPDU Guard** shuts a PortFast port if a switch is plugged in.
- Set the root bridge **manually** (lower priority on the core switch) — do not let a random old switch become root.`,
    visuals: [
      {
        kind: 'topology',
        title: 'A loop, and how STP fixes it',
        width: 360,
        height: 250,
        nodes: [
          { id: 's1', label: 'Core SW1', icon: 'switch', x: 180, y: 40, sub: 'ROOT (priority 4096)', info: '**Root bridge**: lowest bridge ID (we set priority 4096). All its ports are designated (forwarding).' },
          { id: 's2', label: 'SW2', icon: 'switch', x: 70, y: 150, sub: 'priority 32768', info: 'Its **root port** is the link to SW1 (lowest cost).' },
          { id: 's3', label: 'SW3', icon: 'switch', x: 290, y: 150, sub: 'priority 32768', info: 'Root port to SW1. Its port towards SW2 is **blocked** (it has the higher bridge ID on that link).' },
          { id: 'a', label: 'PC A', icon: 'pc', x: 70, y: 220, info: 'Connected to SW2 (PortFast port).' },
          { id: 'b', label: 'PC B', icon: 'pc', x: 290, y: 220, info: 'Connected to SW3.' },
        ],
        links: [
          { from: 's1', to: 's2' },
          { from: 's1', to: 's3' },
          { from: 's2', to: 's3', label: 'BLOCKED by STP', style: 'dashed', tone: 'red' },
          { from: 's2', to: 'a' },
          { from: 's3', to: 'b' },
        ],
        steps: [
          { text: '**Without STP**: PC A sends a broadcast. It goes SW2 → SW1 → SW3 → SW2 → SW1 … **forever**, in both directions. Within seconds the links are full: a **broadcast storm**.', paths: [['a', 's2', 's1', 's3', 's2', 's1']], packet: 'storm!', tone: 'red' },
          { text: 'STP elects the **root bridge**: SW1 has the lowest bridge ID (priority 4096).', highlight: ['s1'], tone: 'green' },
          { text: 'SW3 **blocks** its port towards SW2. Now there is **one loop-free path**: PC A → SW2 → SW1 → SW3 → PC B.', paths: [['a', 's2', 's1', 's3', 'b']], packet: 'frame' },
          { text: 'The SW1–SW2 link fails. SW3 stops receiving BPDUs through that path, and the **blocked port moves to forwarding**. Traffic now uses SW2 → SW3. (RSTP: a few seconds.)', paths: [['a', 's2', 's3', 'b']], packet: 'backup path', tone: 'amber' },
        ],
      },
    ],
    bank: `Data centres and head offices connect access switches to **two** core switches for redundancy. STP (usually **Rapid PVST+** or MST) blocks the extra path. A common outage cause: someone connects a cable between two wall sockets and creates a loop — **BPDU Guard** and **storm control** prevent that.`,
    remember: [
      'STP prevents **Layer 2 loops / broadcast storms** by blocking redundant ports.',
      '**Root bridge = lowest bridge ID** (priority + MAC). Set it manually on the core.',
      'Use **RSTP** (fast), **PortFast + BPDU Guard** on edge ports.',
    ],
    check: [
      {
        q: 'How is the STP root bridge chosen?',
        options: ['Highest MAC address', 'Lowest bridge ID (priority + MAC)', 'The switch with most ports', 'The first switch powered on'],
        answer: 1,
        explain: 'The switch with the **lowest bridge ID** wins. Bridge ID = priority (default 32768) + MAC.',
      },
      {
        q: 'What problem does STP prevent?',
        options: ['IP address conflicts', 'Layer 2 loops and broadcast storms', 'Routing loops between OSPF areas', 'DNS failures'],
        answer: 1,
        explain: 'Ethernet frames have no TTL, so loops cause **broadcast storms**. STP blocks redundant paths.',
      },
      {
        q: 'Which feature shuts down an access port if a switch (sending BPDUs) is connected to it?',
        options: ['PortFast', 'BPDU Guard', 'Root Guard', 'Port mirroring'],
        answer: 1,
        explain: '**BPDU Guard** err-disables a PortFast port that receives a BPDU.',
      },
    ],
  },
  {
    id: 'inter-vlan',
    title: 'Inter-VLAN routing',
    analogy:
      'To go from the Finance floor to the IT floor, you must take the **lift with a security guard**. Inter-VLAN routing is that lift — and it is the perfect place to check permissions (ACLs).',
    body: `VLANs are separate networks, so traffic between them must be **routed**. Each VLAN's **default gateway** is an IP on the router/L3 switch for that VLAN.

**1. Router-on-a-stick**
- One router interface, connected to the switch with a **trunk**.
- One **sub-interface per VLAN** (e.g. G0/0.10 = 10.20.10.1, G0/0.20 = 10.20.20.1) with \`encapsulation dot1Q 10\`.
- Cheap and simple, but the single link can be a bottleneck. Good for **small branches**.

**2. Layer 3 switch with SVIs**
- An **SVI** (Switched Virtual Interface) per VLAN: \`interface vlan 10\` → \`ip address 10.1.10.1 255.255.255.0\`, plus \`ip routing\`.
- Routing happens in hardware → **very fast**. Used in **head office and data centre cores**.

Traffic between sensitive VLANs is often sent through a **firewall** instead, for stronger control.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Router-on-a-stick in a branch',
        width: 360,
        height: 230,
        nodes: [
          { id: 'r', label: 'Branch router', icon: 'router', x: 180, y: 40, sub: 'G0/0.10 · G0/0.20', info: 'Two **sub-interfaces** on one physical port: G0/0.10 = 10.20.10.1 (gateway for VLAN 10), G0/0.20 = 10.20.20.1 (gateway for VLAN 20).' },
          { id: 'sw', label: 'Switch', icon: 'switch', x: 180, y: 125, info: 'Access ports for the PCs, and one **trunk** port to the router.' },
          { id: 'pc', label: 'Teller PC', icon: 'pc', x: 70, y: 200, sub: 'VLAN 10 · 10.20.10.25', info: 'Gateway = 10.20.10.1.' },
          { id: 'prn', label: 'Printer', icon: 'printer', x: 290, y: 200, sub: 'VLAN 20 · 10.20.20.40', info: 'Gateway = 10.20.20.1.' },
        ],
        links: [
          { from: 'r', to: 'sw', label: 'trunk (10, 20)', style: 'trunk' },
          { from: 'sw', to: 'pc' },
          { from: 'sw', to: 'prn' },
        ],
        steps: [
          { text: 'The teller PC (VLAN 10) prints to a printer in VLAN 20. Different subnet → send to the **gateway 10.20.10.1**. The frame goes up the trunk tagged **VLAN 10**.', paths: [['pc', 'sw', 'r']], packet: 'tag 10' },
          { text: 'The router **routes** from sub-interface .10 to .20 (an ACL can check it here) and sends it back down the **same trunk**, tagged **VLAN 20**, to the printer. Traffic goes up and down one link — that is the "stick".', paths: [['r', 'sw', 'prn']], packet: 'tag 20', tone: 'purple' },
        ],
      },
    ],
    bank: `In a small branch, the branch router often does router-on-a-stick for the staff, voice, CCTV and ATM VLANs, with **ACLs** so CCTV and ATM VLANs can only reach their own servers. In the data centre, a pair of **L3 core switches** with SVIs routes between server VLANs at wire speed, and a **firewall** controls traffic into sensitive zones.`,
    remember: [
      'VLANs need **routing** to talk: router-on-a-stick (sub-interfaces + trunk) or **L3 switch with SVIs**.',
      'Each VLAN\'s gateway is the sub-interface / SVI IP.',
      'L3 switch = fast (hardware), for cores. Router-on-a-stick = simple, for small sites.',
    ],
    check: [
      {
        q: 'In router-on-a-stick, what connects the router to the switch?',
        options: ['An access port in VLAN 1', 'A trunk link with sub-interfaces on the router', 'A serial cable', 'A console cable'],
        answer: 1,
        explain: 'A single **trunk** link, with one router **sub-interface per VLAN** (encapsulation dot1Q).',
      },
      {
        q: 'What is an SVI?',
        options: ['A physical router port', 'A virtual Layer 3 interface for a VLAN on a switch', 'A type of VPN', 'A spanning tree port role'],
        answer: 1,
        explain: 'A **Switched Virtual Interface** (interface vlan X) gives a VLAN an IP/gateway on an L3 switch.',
      },
    ],
  },
  {
    id: 'routing-table',
    title: 'Routing tables: how a router chooses',
    analogy:
      'A post office has a **sorting table**: "Letters for Colombo 03 → bag 5. Letters for Colombo → bag 2. Anything else → main hub." It always uses the **most specific** match first.',
    body: `A router forwards packets using its **routing table**. Each route has: **destination network/prefix**, **next hop** (or exit interface), **source** (how it was learned), **administrative distance** and **metric**.

Example (\`show ip route\`):
| Code | Network | Via | [AD/metric] |
|---|---|---|---|
| C | 10.20.5.0/24 | directly connected, G0/1 | — |
| S* | 0.0.0.0/0 | 10.255.0.1 | [1/0] |
| O | 10.1.0.0/16 | 10.255.0.5 | [110/20] |
| O | 10.1.10.0/24 | 10.255.0.9 | [110/30] |

**How the router chooses:**
1. **Longest prefix match** — the most specific route wins (a /24 beats a /16 beats /0).
2. If the same prefix is learned from different sources → lowest **administrative distance** (trust).
3. Same source → lowest **metric** (e.g. OSPF cost). Equal → load balance (ECMP).

No match and no default route → packet **dropped** (ICMP unreachable).`,
    visuals: [
      {
        kind: 'flow',
        title: 'Packet to 10.1.10.50 — which route?',
        steps: [
          { label: 'Check matches', icon: '🔍', detail: '10.1.10.50 matches **0.0.0.0/0**, **10.1.0.0/16** and **10.1.10.0/24**.', tone: 'slate' },
          { label: 'Longest prefix', icon: '📏', detail: '/24 is the longest (most specific) → use **10.1.10.0/24 via 10.255.0.9**, even though its metric (30) is higher than the /16 (20). Prefix length is checked first!', tone: 'green' },
          { label: 'Tie on prefix?', icon: '⚖', detail: 'If two sources (e.g. static and OSPF) give the **same prefix**, the lower **AD** wins: static (1) beats OSPF (110).', tone: 'amber' },
          { label: 'Tie on source?', icon: '📊', detail: 'Same protocol and prefix → lowest **metric**. Equal metrics → **ECMP** load sharing.', tone: 'blue' },
          { label: 'Forward', icon: '➜', detail: 'Decrease TTL, rebuild the L2 frame for the next hop (ARP for 10.255.0.9 if needed) and send it out.', tone: 'purple' },
        ],
      },
    ],
    bank: `A branch router usually has: its **connected** LAN/VLAN subnets, a **default route** (or specific routes) towards the data centre over the primary MPLS link, and a **floating static route** (higher AD) over the backup 4G/VPN link that is only used if the primary route disappears.`,
    remember: [
      'Route choice order: **longest prefix match → lowest AD → lowest metric**.',
      '**0.0.0.0/0 = default route** (gateway of last resort).',
      'Route codes: C connected, S static, O OSPF, B BGP, D EIGRP.',
    ],
    check: [
      {
        q: 'A router has routes 10.0.0.0/8 (OSPF), 10.1.0.0/16 (static) and 10.1.1.0/24 (OSPF). Which is used for 10.1.1.20?',
        options: ['10.0.0.0/8', '10.1.0.0/16 because static has lower AD', '10.1.1.0/24', 'The default route'],
        answer: 2,
        explain: '**Longest prefix match** is checked first: /24 is the most specific. AD only matters for identical prefixes.',
      },
      {
        q: 'What happens to a packet if no route matches and there is no default route?',
        options: ['It is flooded', 'It is dropped', 'It is sent back to the source', 'It is broadcast'],
        answer: 1,
        explain: 'The router **drops** it (and may send ICMP Destination Unreachable).',
      },
    ],
  },
  {
    id: 'static-dynamic',
    title: 'Static vs dynamic routing',
    analogy:
      '**Static route** = written directions on paper: simple, but if a road is closed, the paper does not know. **Dynamic routing** = Google Maps: routers talk to each other and **find a new way automatically**.',
    body: `**Static routes** are typed by the admin: \`ip route 10.1.0.0 255.255.0.0 10.255.0.5\`.
- ✅ Simple, no CPU/bandwidth overhead, predictable, secure.
- ❌ Do not adapt to failures; hard to manage in big networks.
- **Default static route**: \`ip route 0.0.0.0 0.0.0.0 <next-hop>\`.
- **Floating static route**: a static route with a **higher AD** (e.g. 250) used only as **backup**.

**Dynamic routing protocols** share routes automatically and react to failures.
- **IGP** (inside one organisation): **OSPF** (link-state, open standard), **EIGRP** (Cisco, advanced distance-vector), RIP (old, max 15 hops).
- **EGP** (between organisations/ISPs): **BGP**.

**Administrative distance (AD)** — lower = more trusted:
| Source | AD |
|---|---|
| Connected | 0 |
| Static | 1 |
| eBGP | 20 |
| EIGRP (internal) | 90 |
| OSPF | 110 |
| RIP | 120 |
| iBGP | 200 |`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'Static', icon: '📝', tone: 'blue' },
          { label: 'Dynamic', icon: '🗺️', tone: 'green' },
        ],
        rows: [
          { label: 'Setup', values: ['Manual on each router', 'Routers learn from each other'] },
          { label: 'On failure', values: ['No change (unless floating backup)', 'Finds a new path automatically'] },
          { label: 'Overhead', values: ['None', 'CPU, memory, some bandwidth'] },
          { label: 'Scale', values: ['Small / stub networks', 'Medium to very large'] },
          { label: 'Examples', values: ['Default route at a branch', 'OSPF in DC/HO, BGP to ISPs'] },
        ],
      },
    ],
    bank: `A typical design: **OSPF** (or EIGRP) inside the data centre, head office and WAN core so failures are handled automatically; **BGP** with the MPLS provider and Internet providers; and simple **static default routes** at very small sites, with a **floating static** route over the backup link.`,
    remember: [
      'Static = manual, simple, no failover (use floating static for backup). Dynamic = automatic, scales, adapts.',
      'AD: connected 0, static 1, eBGP 20, EIGRP 90, **OSPF 110**, RIP 120, iBGP 200.',
      'IGPs: OSPF, EIGRP, RIP. EGP: **BGP**.',
    ],
    check: [
      {
        q: 'What is the administrative distance of OSPF?',
        options: ['90', '100', '110', '120'],
        answer: 2,
        explain: 'OSPF AD = **110**. EIGRP = 90, RIP = 120.',
      },
      {
        q: 'What is a floating static route?',
        options: ['A route that changes every minute', 'A static route with a higher AD used as backup', 'A route learned from BGP', 'A route to a loopback'],
        answer: 1,
        explain: 'Giving a static route a **higher AD** than the primary route makes it a **backup** that is only used if the primary disappears.',
      },
    ],
  },
  {
    id: 'ospf',
    title: 'OSPF basics',
    analogy:
      'Every router gets **the same full map** of the city (link-state database) and runs a GPS calculation (**Dijkstra**) to find the shortest path to everywhere. When a road closes, the news is shared and everyone recalculates.',
    body: `**OSPF (Open Shortest Path First)** is an open-standard **link-state** IGP.

- Routers find neighbours with **Hello** packets (multicast **224.0.0.5**; hello 10 s, dead 40 s on Ethernet).
- They exchange **LSAs** to build an identical **link-state database (LSDB)**, then run **SPF (Dijkstra)** to calculate best paths.
- **Metric = cost** = reference bandwidth ÷ interface bandwidth (default reference 100 Mbps → FastEthernet cost 1). Raise the reference on modern networks.
- **Areas**: **Area 0 = backbone**; all other areas must connect to Area 0. Areas keep the LSDB small. ABR = router between areas.
- On Ethernet segments, a **DR/BDR** is elected to reduce updates (DR multicast 224.0.0.6).
- Fast convergence, classless (VLSM), supports authentication and summarisation. AD **110**. Runs directly on IP (protocol 89).

Neighbour states: Down → Init → **2-Way** → ExStart → Exchange → Loading → **Full**.
Neighbours must match: **area, hello/dead timers, subnet/mask, authentication**, MTU.`,
    visuals: [
      {
        kind: 'sequence',
        title: 'Two OSPF routers become neighbours',
        actors: [
          { id: 'r1', label: 'DC router R1', icon: 'router', sub: 'RID 1.1.1.1' },
          { id: 'r2', label: 'WAN router R2', icon: 'router', sub: 'RID 2.2.2.2' },
        ],
        steps: [
          { from: 'r1', to: 'r2', label: 'Hello (224.0.0.5)', detail: 'R1 sends **Hello** every 10 s with its router ID, area, timers and the neighbours it has seen. State: **Init** on R2.', tone: 'blue' },
          { from: 'r2', to: 'r1', label: 'Hello (I see 1.1.1.1)', detail: 'R2 replies and lists R1 as seen. Both see each other → **2-Way**. Parameters (area, timers, subnet, auth) must match or they stop here.', tone: 'blue' },
          { from: 'r1', to: 'r2', label: 'DBD (summary of LSDB)', detail: '**ExStart/Exchange**: they send **Database Description** packets — a list of the LSAs each one has.', tone: 'purple' },
          { from: 'r2', to: 'r1', label: 'LSR (send me these)', detail: '**Loading**: each asks for the LSAs it is missing with **Link-State Requests**.', tone: 'amber' },
          { from: 'r1', to: 'r2', label: 'LSU (full LSAs)', detail: '**Link-State Updates** carry the full LSAs. The receiver confirms with LSAck.', tone: 'amber' },
          { from: 'r2', to: 'r2', label: 'Full → run SPF', detail: 'Databases are identical → **Full** adjacency. Each router runs **Dijkstra (SPF)** and installs the best routes (code **O**) into the routing table.', tone: 'green' },
        ],
      },
    ],
    bank: `OSPF is a common choice inside a bank's data centre and between DC, DR and head office, because it is an open standard (works with different vendors) and **converges fast** when a link fails. If two routers are "stuck in ExStart/2-Way" or not neighbours, check **area, timers, mask, authentication and MTU**: \`show ip ospf neighbor\`.`,
    remember: [
      'OSPF = **link-state**, open standard, **Dijkstra/SPF**, metric = **cost** (bandwidth-based), AD 110.',
      '**Area 0 = backbone**; Hellos to 224.0.0.5; DR/BDR on multi-access networks.',
      'Neighbours need matching **area, timers, subnet, authentication, MTU**.',
    ],
    check: [
      {
        q: 'Which algorithm does OSPF use to calculate the best path?',
        options: ['Bellman-Ford', 'Dijkstra (SPF)', 'DUAL', 'Path vector'],
        answer: 1,
        explain: 'OSPF runs **Dijkstra\'s Shortest Path First** algorithm on its link-state database.',
      },
      {
        q: 'What is OSPF\'s metric based on?',
        options: ['Hop count', 'Cost (derived from bandwidth)', 'Delay and load', 'AS path length'],
        answer: 1,
        explain: 'OSPF cost = reference bandwidth / interface bandwidth.',
      },
      {
        q: 'Which OSPF area must all other areas connect to?',
        options: ['Area 1', 'Area 0 (backbone)', 'Area 10', 'Any area'],
        answer: 1,
        explain: '**Area 0** is the backbone.',
      },
    ],
  },
  {
    id: 'bgp',
    title: 'BGP basics',
    analogy:
      'OSPF is the map **inside one company**. **BGP is the agreement between countries**: each country (autonomous system) tells its neighbours "you can reach these cities through me", and each one chooses routes based on **policy**, not just distance.',
    body: `**BGP (Border Gateway Protocol)** is the routing protocol **of the Internet**. It connects **Autonomous Systems (AS)** — networks under one administration (an ISP, a big company), each with an **AS number**.

- **Path-vector** protocol: each route carries the **AS-PATH** (list of ASes it passed) → prevents loops.
- Runs over **TCP port 179**; neighbours ("peers") are configured manually.
- **eBGP** = between different ASes (AD **20**). **iBGP** = inside one AS (AD **200**).
- Chooses paths by **attributes/policy** (weight, local preference, AS-path length, MED…), not just speed.
- Slow to converge but extremely scalable (the full Internet table is ~1 million IPv4 routes).

Where you meet BGP in an enterprise:
- **Multihoming** — connecting to **two ISPs** with your own public prefix and AS number, for Internet redundancy.
- **MPLS VPNs** — the provider often runs BGP with each customer site.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Bank multihomed to two ISPs (example ASNs)',
        width: 360,
        height: 220,
        nodes: [
          { id: 'bank', label: 'Bank edge router', icon: 'router', x: 180, y: 185, sub: 'AS 64500 · 203.0.113.0/24', info: 'The bank\'s Internet edge. It **advertises its public prefix** (203.0.113.0/24, where Internet banking lives) to both ISPs over **eBGP**.' },
          { id: 'ispa', label: 'ISP A', icon: 'cloud', x: 70, y: 100, sub: 'AS 64501', info: 'First Internet provider. eBGP peer on TCP 179.' },
          { id: 'ispb', label: 'ISP B', icon: 'cloud', x: 290, y: 100, sub: 'AS 64502', info: 'Second provider for redundancy.' },
          { id: 'net', label: 'Internet users', icon: 'globe', x: 180, y: 30, info: 'Customers using Internet banking.' },
        ],
        links: [
          { from: 'bank', to: 'ispa', label: 'eBGP' },
          { from: 'bank', to: 'ispb', label: 'eBGP' },
          { from: 'ispa', to: 'net' },
          { from: 'ispb', to: 'net' },
        ],
        steps: [
          { text: 'The bank advertises **203.0.113.0/24** to both ISPs. Each ISP tells the rest of the Internet: "reach it through me" (AS-PATH 64501 64500 or 64502 64500).', highlight: ['bank', 'ispa', 'ispb'] },
          { text: 'Customers reach Internet banking through **ISP A** (the preferred path by policy).', paths: [['net', 'ispa', 'bank']], packet: 'HTTPS' },
          { text: 'ISP A\'s link fails. The BGP session goes down, ISP A **withdraws** the route, and the Internet now reaches the bank through **ISP B**. Internet banking stays online.', paths: [['net', 'ispb', 'bank']], packet: 'HTTPS', tone: 'amber' },
        ],
      },
    ],
    bank: `A bank that offers Internet and mobile banking often connects to **two Internet providers** and uses **BGP** so its public services stay reachable if one ISP fails. You do not need to configure BGP as a junior, but you should know **what it is, TCP 179, AS numbers, eBGP vs iBGP** and why banks use it.`,
    remember: [
      'BGP = **path-vector** EGP, the routing protocol of the Internet, **TCP 179**.',
      'Connects **Autonomous Systems**; **eBGP AD 20**, **iBGP AD 200**; chooses paths by policy/attributes (AS-PATH…).',
      'Enterprise use: **multihoming to two ISPs**, MPLS provider connections.',
    ],
    check: [
      {
        q: 'Which port does BGP use?',
        options: ['UDP 179', 'TCP 179', 'TCP 89', 'UDP 520'],
        answer: 1,
        explain: 'BGP peers connect over **TCP 179**.',
      },
      {
        q: 'Why would a bank run BGP with two ISPs?',
        options: ['To get faster Wi-Fi', 'For Internet redundancy (multihoming) of its public services', 'To replace OSPF inside the LAN', 'To assign IPs to PCs'],
        answer: 1,
        explain: '**Multihoming** with BGP keeps public services (e.g. Internet banking) reachable if one ISP fails.',
      },
    ],
  },
  {
    id: 'fhrp',
    title: 'HSRP and VRRP: a gateway that never dies',
    analogy:
      'A bank branch has **one public phone number**, but two receptionists. If the main receptionist goes home sick, the second one **picks up the same number**. Callers never notice.',
    body: `PCs have **one default gateway**. If that router fails, everyone loses access. **First Hop Redundancy Protocols (FHRP)** let two (or more) routers share a **virtual IP** (and virtual MAC) that PCs use as their gateway.

**HSRP** (Hot Standby Router Protocol) — **Cisco proprietary**
- One **Active** router forwards, one **Standby** waits.
- Highest **priority** becomes active (default 100); **preempt** lets it take back the role when it returns.
- Hello 3 s, hold 10 s (defaults).

**VRRP** (Virtual Router Redundancy Protocol) — **open standard**
- **Master** and **Backup** roles; default priority 100.
- Works across vendors.

**GLBP** (Cisco) adds **load balancing** across routers.

When the standby takes over, it sends a **gratuitous ARP** so switches learn the virtual MAC's new location.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Two routers, one virtual gateway (10.1.20.1)',
        width: 360,
        height: 270,
        nodes: [
          { id: 'wan', label: 'WAN / core', icon: 'cloud', x: 180, y: 35, info: 'Rest of the network.' },
          { id: 'r1', label: 'R1 — Active', icon: 'router', x: 85, y: 115, sub: 'prio 110 · .2', info: 'Real IP 10.1.20.2, priority 110 → **Active**. Owns the virtual IP **10.1.20.1** and virtual MAC.' },
          { id: 'r2', label: 'R2 — Standby', icon: 'router', x: 275, y: 115, sub: 'prio 100 · .3', info: 'Real IP 10.1.20.3, priority 100 → **Standby**. Listens to R1\'s hellos.' },
          { id: 'sw', label: 'Switch', icon: 'switch', x: 180, y: 185, info: 'Access switch for the VLAN.' },
          { id: 'p1', label: 'PC', icon: 'pc', x: 100, y: 245, sub: 'GW 10.1.20.1', info: 'Default gateway = **virtual IP** 10.1.20.1 — not R1 or R2 directly.' },
          { id: 'p2', label: 'PC', icon: 'pc', x: 260, y: 245, sub: 'GW 10.1.20.1', info: 'Same virtual gateway.' },
        ],
        links: [
          { from: 'wan', to: 'r1' },
          { from: 'wan', to: 'r2' },
          { from: 'r1', to: 'sw' },
          { from: 'r2', to: 'sw' },
          { from: 'r1', to: 'r2', label: 'hellos', style: 'dashed' },
          { from: 'sw', to: 'p1' },
          { from: 'sw', to: 'p2' },
        ],
        steps: [
          { text: 'Normal: PCs send to the **virtual gateway 10.1.20.1**. R1 is **Active** (higher priority) and forwards the traffic.', paths: [['p1', 'sw', 'r1', 'wan']], packet: 'to GW .1' },
          { text: 'R1 loses power. R2 stops hearing R1\'s hellos; after the **hold time (10 s)** R2 decides R1 is dead.', highlight: ['r2'], tone: 'red' },
          { text: 'R2 becomes **Active**, takes over the virtual IP and MAC, and sends a **gratuitous ARP**. PCs keep the same gateway — **no change needed on any PC**.', paths: [['p1', 'sw', 'r2', 'wan'], ['p2', 'sw', 'r2', 'wan']], packet: 'still GW .1', tone: 'green' },
          { text: 'When R1 returns, with **preempt** configured it takes back the Active role (priority 110 > 100).', highlight: ['r1'] },
        ],
      },
    ],
    bank: `In the data centre and head office, critical VLANs use **HSRP or VRRP** on a pair of core switches/routers, so a single router failure or maintenance reboot does not stop tellers, ATMs or core banking. During planned maintenance, you can lower the priority to move traffic gracefully.`,
    remember: [
      'FHRP gives PCs a **virtual gateway IP** shared by two routers.',
      '**HSRP** = Cisco, Active/Standby, hello 3 s / hold 10 s. **VRRP** = open standard, Master/Backup. GLBP = load balancing.',
      'Highest priority wins (default 100); **preempt** to take back the role; gratuitous ARP on failover.',
    ],
    check: [
      {
        q: 'Which first hop redundancy protocol is an open standard?',
        options: ['HSRP', 'GLBP', 'VRRP', 'EIGRP'],
        answer: 2,
        explain: '**VRRP** is an IETF standard. HSRP and GLBP are Cisco proprietary.',
      },
      {
        q: 'What do PCs use as their default gateway when HSRP is configured?',
        options: ['The active router\'s real IP', 'The virtual IP', 'The standby router\'s IP', 'The DNS server'],
        answer: 1,
        explain: 'PCs point to the **virtual IP**, so failover is invisible to them.',
      },
    ],
  },
];
