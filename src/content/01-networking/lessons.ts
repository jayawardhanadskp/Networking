import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'osi-tcpip',
    title: 'How networks talk: OSI and TCP/IP models',
    analogy:
      'Sending a parcel. You write a letter (data), put it in an envelope with a room number (port), add the house address (IP), give it to the courier who uses the street map (MAC / local delivery), and the van drives on the road (cable). Each person does **one job** and does not care about the others.',
    body: `A **network model** splits communication into **layers**. Each layer has one job and talks only to the layer above and below it.

- **OSI model** = 7 layers. A teaching and troubleshooting model.
- **TCP/IP model** = 4 layers. The model the Internet really uses.

Why do interviewers ask this? Because admins use the layers to **troubleshoot**: "Is it a cable (L1)? A VLAN/MAC problem (L2)? An IP/routing problem (L3)? A port/firewall problem (L4)? Or the application (L7)?"

Each layer's data has a name, called the **PDU** (Protocol Data Unit): **Data → Segment → Packet → Frame → Bits**.`,
    visuals: [{ kind: 'custom', id: 'osi' }],
    bank: `When a branch says "the core banking system is slow", you think in layers: cable and link lights (L1), switch port and VLAN (L2), IP address, gateway and route to the data centre (L3), firewall rule for port 443 (L4), and finally the application server itself (L7).`,
    remember: [
      'OSI 7 layers: **Physical, Data Link, Network, Transport, Session, Presentation, Application** ("All People Seem To Need Data Processing" from 7 to 1).',
      'PDUs: **L4 Segment, L3 Packet, L2 Frame, L1 Bits**. Devices: hub L1, switch L2, router L3.',
      'TCP/IP has 4 layers: **Application, Transport, Internet, Network Access**.',
    ],
    check: [
      {
        q: 'At which OSI layer does a router mainly work?',
        options: ['Layer 2 – Data Link', 'Layer 3 – Network', 'Layer 4 – Transport', 'Layer 1 – Physical'],
        answer: 1,
        explain: 'Routers read **IP addresses** and choose paths between networks. That is Layer 3 (Network).',
      },
      {
        q: 'What is the PDU called at the Transport layer (TCP)?',
        options: ['Frame', 'Packet', 'Segment', 'Bits'],
        answer: 2,
        explain: 'Transport layer = **Segment** (for UDP it is often called a datagram). Network = packet, Data Link = frame, Physical = bits.',
      },
      {
        q: 'Which OSI layers does the TCP/IP "Application" layer cover?',
        options: ['Only layer 7', 'Layers 5, 6 and 7', 'Layers 4 to 7', 'Layers 6 and 7'],
        answer: 1,
        explain: 'The TCP/IP Application layer combines OSI **Session (5), Presentation (6) and Application (7)**.',
      },
    ],
  },
  {
    id: 'encapsulation',
    title: 'Encapsulation: the packet journey',
    analogy:
      'Putting a letter into an envelope, then the envelope into a courier bag, then the bag into a box. At the other end, the receiver opens the box, then the bag, then the envelope, and reads the letter.',
    body: `**Encapsulation** = the sender **adds a header** at each layer, going down (L7 → L1).
**Decapsulation** = the receiver **removes the headers**, going up (L1 → L7).

- Transport adds a **TCP/UDP header** (ports) → segment
- Network adds an **IP header** (source and destination IP) → packet
- Data Link adds an **Ethernet header** (MACs) and an **FCS trailer** (error check) → frame
- Physical sends **bits**

Key rule for interviews: **IP addresses stay the same from end to end. MAC addresses change at every router hop.** (NAT is the exception: it changes IPs.)`,
    visuals: [{ kind: 'custom', id: 'packetJourney' }],
    bank: `A teller PC in a branch (10.20.5.25) opens the core banking web app in the data centre (10.1.10.50). The packet goes PC → branch switch → branch router → WAN → data centre firewall → server. The **destination MAC** in the first frame is the **branch router's** MAC, not the server's, because the server is in a different network.`,
    remember: [
      'Encapsulation = add headers going down; decapsulation = remove headers going up.',
      '**IP stays the same end-to-end, MAC changes at every hop** (router rebuilds the frame).',
      'A switch looks only at the MAC (L2); a router looks at the IP (L3); a firewall can look at ports (L4) and more.',
    ],
    check: [
      {
        q: 'A PC sends a packet to a server in another network. What is the destination MAC address in the frame that leaves the PC?',
        options: ['The server\'s MAC address', 'The default gateway (router) MAC address', 'FF:FF:FF:FF:FF:FF', 'The switch\'s MAC address'],
        answer: 1,
        explain: 'For a remote network, the PC sends the frame to its **default gateway**. The router then builds a new frame for the next hop.',
      },
      {
        q: 'Which part of the frame is used to detect errors?',
        options: ['The IP header', 'The TTL', 'The FCS trailer', 'The source port'],
        answer: 2,
        explain: 'The **Frame Check Sequence (FCS)** at the end of an Ethernet frame is a CRC used to detect damaged frames.',
      },
    ],
  },
  {
    id: 'mac-ip',
    title: 'MAC address vs IP address',
    analogy:
      '**MAC address = your NIC (national ID card) number**: it is given at "birth" (burned into the network card) and does not change when you move. **IP address = your house address**: it changes when you move to a new town (network).',
    body: `**MAC address** (physical / hardware address)
- 48 bits, written in hex: \`00:1A:2B:3C:4D:5E\`
- First 24 bits = **OUI** (the vendor, e.g. Cisco, Dell). Last 24 bits = unique for that card.
- Used **inside the local network** (Layer 2) by switches.
- Broadcast MAC: \`FF:FF:FF:FF:FF:FF\`

**IP address** (logical address)
- IPv4 = 32 bits, written in decimal: \`10.20.5.25\`
- Has a **network part** and a **host part** (decided by the subnet mask).
- Used **between networks** (Layer 3) by routers.
- Given by an admin (static) or by DHCP.

**ARP** connects the two: it finds the MAC address for a known IP address.`,
    visuals: [
      {
        kind: 'fields',
        title: 'What is inside each address?',
        rows: [
          {
            label: 'MAC address (48 bits, hex) — Layer 2',
            fields: [
              { text: '00:1A:2B', sub: 'OUI = vendor (24 bits)', tone: 'amber' },
              { text: '3C:4D:5E', sub: 'Card number (24 bits)', tone: 'pink' },
            ],
          },
          {
            label: 'IPv4 address 10.20.5.25 /24 (32 bits) — Layer 3',
            fields: [
              { text: '10.20.5', sub: 'Network part (street)', tone: 'blue', w: 3 },
              { text: '.25', sub: 'Host part (house)', tone: 'green', w: 1 },
            ],
          },
        ],
        note: 'The **subnet mask** (/24 = 255.255.255.0) decides where the network part ends.',
      },
      {
        kind: 'compare',
        title: 'MAC vs IP',
        columns: [
          { label: 'MAC', icon: '🪪', tone: 'amber' },
          { label: 'IP', icon: '🏠', tone: 'blue' },
        ],
        rows: [
          { label: 'Layer', values: ['Layer 2 (Data Link)', 'Layer 3 (Network)'] },
          { label: 'Size', values: ['48 bits (hex)', '32 bits IPv4 / 128 bits IPv6'] },
          { label: 'Given by', values: ['Manufacturer (burned in)', 'Admin or DHCP'] },
          { label: 'Scope', values: ['Local network only', 'End to end, across networks'] },
          { label: 'Used by', values: ['Switches', 'Routers'] },
        ],
      },
    ],
    bank: `Banks often use **MAC addresses for security**: port security on a switch can allow only the known ATM or teller PC MAC on a port, and NAC can check a device before giving it network access. Note: MAC addresses can be **spoofed** (faked), so they are not strong security alone.`,
    remember: [
      'MAC = 48-bit hardware address, Layer 2, local delivery. IP = 32-bit logical address, Layer 3, routing between networks.',
      'First half of a MAC is the **OUI** (vendor ID).',
      '**ARP** maps IP → MAC. Switches use MAC; routers use IP.',
    ],
    check: [
      {
        q: 'How many bits are in a MAC address?',
        options: ['32', '48', '64', '128'],
        answer: 1,
        explain: 'A MAC address is **48 bits** (12 hex digits). IPv4 is 32 bits, IPv6 is 128 bits.',
      },
      {
        q: 'Which device uses MAC addresses to forward traffic?',
        options: ['Router', 'Switch', 'DNS server', 'Firewall only'],
        answer: 1,
        explain: 'A **switch** learns MAC addresses into its MAC address table and forwards frames by MAC.',
      },
    ],
  },
  {
    id: 'devices',
    title: 'Network devices by layer',
    analogy:
      '**Hub** = a person who shouts every letter to everybody in the room. **Switch** = a receptionist who knows each person\'s desk and hands the letter only to them. **Router** = the post office that sends letters to other towns. **Firewall** = the security guard at the gate checking who may enter.',
    body: `| Device | Layer | What it does |
|---|---|---|
| **Hub** | L1 | Repeats bits out of **all** ports. One collision domain. Obsolete. |
| **Switch** | L2 | Learns MACs, forwards frames **only to the right port**. Each port = own collision domain. Supports VLANs. |
| **Router** | L3 | Connects **different networks**, chooses paths with a routing table. Each interface = own broadcast domain. |
| **L3 switch** | L2+L3 | A switch that can also route between VLANs (fast, used in core/distribution). |
| **Firewall** | L3–L7 | Allows or blocks traffic by rules (IP, port, app). Stateful firewalls remember connections. |
| **Access point (AP)** | L2 | Connects Wi-Fi devices to the wired LAN. |

**Collision domain**: devices that can "talk over each other". A switch port stops collisions.
**Broadcast domain**: devices that receive each other's broadcasts. Only a **router** (or VLANs) stops broadcasts.`,
    visuals: [
      {
        kind: 'topology',
        title: 'A typical bank branch LAN',
        width: 360,
        height: 268,
        nodes: [
          { id: 'wan', label: 'WAN / MPLS', icon: 'cloud', x: 315, y: 40, info: 'The provider network that links the branch to the head office and data centre.' },
          { id: 'rtr', label: 'Branch router', icon: 'router', x: 230, y: 40, sub: 'L3', info: '**Router (Layer 3)**: connects the branch LAN (10.20.5.0/24) to the WAN. It is the **default gateway** (10.20.5.1) for branch PCs and uses a routing table to send traffic to the data centre.' },
          { id: 'fw', label: 'Firewall', icon: 'firewall', x: 140, y: 40, sub: 'L3–L7', info: '**Firewall**: checks every connection against rules. Example: tellers may reach the core banking app on TCP 443, but not the Internet directly.' },
          { id: 'sw', label: 'Switch', icon: 'switch', x: 140, y: 135, sub: 'L2', info: '**Switch (Layer 2)**: learns which MAC address is on which port and sends each frame only to the correct port. Supports VLANs (e.g. staff, CCTV, ATM).' },
          { id: 'hub', label: 'Hub', icon: 'hub', x: 40, y: 135, sub: 'L1 (old)', info: '**Hub (Layer 1)**: repeats every bit to every port. Causes collisions and is a security risk (everyone sees all traffic). Not used in modern networks — shown for comparison.' },
          { id: 'pc1', label: 'Teller PC 1', icon: 'pc', x: 40, y: 225, info: 'End device with a NIC (MAC) and an IP from DHCP, e.g. 10.20.5.25.' },
          { id: 'pc2', label: 'Teller PC 2', icon: 'pc', x: 115, y: 225, info: 'Another end device in the same VLAN/subnet.' },
          { id: 'prn', label: 'Printer', icon: 'printer', x: 190, y: 225, info: 'Network printer with a static IP (or DHCP reservation) so it never changes.' },
          { id: 'ap', label: 'Access point', icon: 'ap', x: 265, y: 225, sub: 'L2', info: '**Access point**: a bridge between Wi-Fi and the wired LAN. In a bank, staff Wi-Fi uses WPA2/WPA3-Enterprise, and guest Wi-Fi is fully separated.' },
          { id: 'lap', label: 'Laptop', icon: 'laptop', x: 330, y: 160, info: 'Wi-Fi client connected through the access point.' },
        ],
        links: [
          { from: 'wan', to: 'rtr' },
          { from: 'rtr', to: 'fw' },
          { from: 'fw', to: 'sw' },
          { from: 'sw', to: 'hub', style: 'dashed' },
          { from: 'sw', to: 'pc1' },
          { from: 'sw', to: 'pc2' },
          { from: 'sw', to: 'prn' },
          { from: 'sw', to: 'ap' },
          { from: 'ap', to: 'lap', style: 'wireless' },
        ],
        steps: [
          { text: 'Teller PC 1 prints a document. The **switch** sends the frame only to the printer port. The router and firewall are not involved (same network).', paths: [['pc1', 'sw', 'prn']], packet: 'frame' },
          { text: 'Teller PC 1 opens the core banking app in the data centre. Different network → the frame goes to the **default gateway**. The firewall checks the rule, the router sends it over the WAN.', paths: [['pc1', 'sw', 'fw', 'rtr', 'wan']], packet: 'packet' },
          { text: 'The laptop sends data over **Wi-Fi** to the access point, which bridges it onto the wired LAN.', paths: [['lap', 'ap', 'sw']], packet: 'Wi-Fi' },
        ],
      },
    ],
    bank: `In a branch you usually find: a **router** (WAN link to head office), often a **firewall** (or a router with firewall features), one or more **access switches** (with VLANs for staff PCs, IP phones, CCTV, ATMs), and maybe an **access point**. At the data centre you find **core/L3 switches**, **firewalls**, **load balancers** and servers.`,
    remember: [
      'Hub L1 (repeats to all), switch L2 (MAC), router L3 (IP), firewall L3–L7 (rules).',
      'A switch breaks **collision domains**; a router (or VLAN) breaks **broadcast domains**.',
      'The router interface in the LAN is the **default gateway** for the PCs.',
    ],
    check: [
      {
        q: 'Which device separates broadcast domains?',
        options: ['Hub', 'Switch (one VLAN)', 'Router', 'Repeater'],
        answer: 2,
        explain: 'A **router** does not forward broadcasts, so each router interface is its own broadcast domain. (VLANs also split broadcast domains.)',
      },
      {
        q: 'Why are hubs not used in modern networks?',
        options: ['They are too expensive', 'They send every frame to all ports, causing collisions and security risk', 'They only support IPv6', 'They need a routing table'],
        answer: 1,
        explain: 'A hub repeats everything to every port: one big collision domain and everyone can see everyone\'s traffic.',
      },
      {
        q: 'What does a switch use to decide where to send a frame?',
        options: ['Routing table', 'MAC address table', 'ARP cache', 'DNS cache'],
        answer: 1,
        explain: 'A switch learns source MACs per port into the **MAC address table** (CAM table) and forwards by destination MAC.',
      },
    ],
  },
  {
    id: 'cast-types',
    title: 'Unicast, broadcast and multicast',
    analogy:
      '**Unicast** = a phone call to one person. **Broadcast** = an announcement on the office loudspeaker: everybody hears it. **Multicast** = a WhatsApp group: only members get the message.',
    body: `- **Unicast**: one sender → **one** receiver. Most traffic (web, email, database).
- **Broadcast**: one sender → **all** devices in the local network (broadcast domain). Examples: **ARP request**, **DHCP Discover**. IPv4 broadcast address: \`255.255.255.255\` or the subnet's last address. MAC: \`FF:FF:FF:FF:FF:FF\`.
- **Multicast**: one sender → **a group** that joined. Range **224.0.0.0 – 239.255.255.255** (Class D). Examples: OSPF (224.0.0.5/6), video streaming.
- **Anycast** (mainly IPv6, also DNS): one sender → the **nearest** of many devices with the same address.

Too many broadcasts slow a network ("broadcast storm"). That is why we keep subnets/VLANs small. **IPv6 has no broadcast** — it uses multicast instead.`,
    visuals: [
      {
        kind: 'topology',
        title: 'Who receives the message?',
        width: 360,
        height: 230,
        nodes: [
          { id: 'a', label: 'PC A', icon: 'pc', x: 40, y: 40, sub: 'sender', info: 'The sender in all three examples.' },
          { id: 'b', label: 'PC B', icon: 'pc', x: 135, y: 40, info: 'Normal host.' },
          { id: 'c', label: 'PC C', icon: 'pc', x: 225, y: 40, sub: 'group', info: 'Member of the multicast group.' },
          { id: 'd', label: 'PC D', icon: 'pc', x: 320, y: 40, info: 'Normal host.' },
          { id: 'sw', label: 'Switch', icon: 'switch', x: 180, y: 115, info: 'All PCs are in one VLAN = one broadcast domain.' },
          { id: 'e', label: 'PC E', icon: 'pc', x: 40, y: 190, sub: 'group', info: 'Member of the multicast group.' },
          { id: 'f', label: 'PC F', icon: 'pc', x: 135, y: 190, info: 'Normal host.' },
          { id: 'g', label: 'Server', icon: 'server', x: 225, y: 190, info: 'Unicast destination in step 1.' },
          { id: 'r', label: 'Router', icon: 'router', x: 320, y: 190, info: 'Routers do **not** forward broadcasts to other networks. They are the edge of the broadcast domain.' },
        ],
        links: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'r'].map((id) => ({ from: 'sw', to: id })),
        steps: [
          { text: '**Unicast**: PC A → Server only. One sender, one receiver.', paths: [['a', 'sw', 'g']], packet: 'to Server' },
          { text: '**Broadcast**: PC A sends an ARP request to FF:FF:FF:FF:FF:FF. **Every** device in the VLAN receives it — even the router interface — but the router does not pass it to other networks.', paths: ['b', 'c', 'd', 'e', 'f', 'g', 'r'].map((x) => ['a', 'sw', x]), packet: 'to ALL' },
          { text: '**Multicast**: PC A streams training video to group 239.1.1.1. Only **members** (PC C and PC E) receive it (with IGMP snooping on the switch).', paths: [['a', 'sw', 'c'], ['a', 'sw', 'e']], packet: 'to group', tone: 'purple' },
        ],
      },
    ],
    bank: `A big flat network with hundreds of PCs means lots of broadcasts. Banks split the head office into **VLANs/subnets** (for example Finance, IT, CCTV, Voice) so broadcasts stay small. At a branch, the ATM, CCTV and staff PCs are usually in **separate VLANs**.`,
    remember: [
      'Unicast = one to one; broadcast = one to all (ARP, DHCP Discover); multicast = one to a group (224.0.0.0/4).',
      'Routers stop broadcasts. IPv6 has **no broadcast**.',
      'Broadcast MAC = FF:FF:FF:FF:FF:FF; limited broadcast IP = 255.255.255.255.',
    ],
    check: [
      {
        q: 'Which of these uses broadcast?',
        options: ['An HTTPS request to a web server', 'ARP request', 'An OSPF hello to 224.0.0.5', 'An SSH session'],
        answer: 1,
        explain: 'An **ARP request** is sent to the broadcast MAC FF:FF:FF:FF:FF:FF because the sender does not know the target\'s MAC yet.',
      },
      {
        q: 'What is the IPv4 multicast range?',
        options: ['10.0.0.0 – 10.255.255.255', '127.0.0.0 – 127.255.255.255', '224.0.0.0 – 239.255.255.255', '240.0.0.0 – 255.255.255.255'],
        answer: 2,
        explain: 'Class D, **224.0.0.0/4**, is reserved for multicast.',
      },
    ],
  },
  {
    id: 'tcp-udp',
    title: 'TCP vs UDP',
    analogy:
      '**TCP = registered post**: the post office confirms delivery, re-sends lost letters and keeps them in order. Slower but safe. **UDP = dropping flyers in letter boxes**: fast, no confirmation, some may be lost.',
    body: `Both are **Layer 4 (Transport)** protocols and both use **port numbers**.

**TCP (Transmission Control Protocol)**
- **Connection-oriented**: 3-way handshake before data.
- **Reliable**: sequence numbers, ACKs, re-sends lost segments, keeps order.
- **Flow control** (window size) and congestion control.
- Header 20+ bytes. Used for: HTTP/HTTPS, SSH, FTP, SMTP, database connections, core banking transactions.

**UDP (User Datagram Protocol)**
- **Connectionless**: just send.
- **No guarantee** of delivery or order (the application can handle it).
- Very small header (8 bytes), low delay.
- Used for: **DNS** queries, **DHCP**, **SNMP**, **NTP**, **syslog**, **TFTP**, VoIP and video.`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'TCP', icon: '📦', tone: 'blue' },
          { label: 'UDP', icon: '📨', tone: 'amber' },
        ],
        rows: [
          { label: 'Connection', values: ['Yes — 3-way handshake', 'No — connectionless'] },
          { label: 'Reliable?', values: ['Yes: ACKs, re-send, order', 'No: best effort'] },
          { label: 'Speed', values: ['Slower (more overhead)', 'Faster (less overhead)'] },
          { label: 'Header', values: ['20–60 bytes', '8 bytes'] },
          { label: 'Examples', values: ['HTTPS 443, SSH 22, SMTP 25, MySQL 3306', 'DNS 53, DHCP 67/68, SNMP 161, NTP 123, Syslog 514'] },
          { label: 'Bank use', values: ['Money transfers, CBS web app, DB', 'Monitoring, time sync, voice calls'] },
        ],
      },
    ],
    bank: `A **fund transfer** must never lose data or arrive in the wrong order → TCP. A branch **IP phone call** prefers speed; a lost voice packet is better than a delayed one → UDP (RTP). Network devices send **logs (syslog)** and **SNMP traps** to monitoring on UDP.`,
    remember: [
      'TCP = connection-oriented, reliable, ordered (handshake, ACKs). UDP = connectionless, fast, no guarantee.',
      'DNS uses **UDP 53** for normal queries (TCP 53 for zone transfers / big replies).',
      'Real-time traffic (voice/video) and simple request/response (DNS, DHCP, SNMP, NTP) use UDP.',
    ],
    check: [
      {
        q: 'Which protocol would you use for a voice call where low delay is more important than perfect delivery?',
        options: ['TCP', 'UDP', 'ICMP', 'ARP'],
        answer: 1,
        explain: '**UDP** has low overhead and no re-transmissions, which is better for real-time voice and video.',
      },
      {
        q: 'Which of these runs over UDP?',
        options: ['SSH', 'HTTPS', 'DHCP', 'SMTP'],
        answer: 2,
        explain: '**DHCP** uses UDP ports 67 (server) and 68 (client). SSH, HTTPS and SMTP use TCP.',
      },
    ],
  },
  {
    id: 'handshake',
    title: 'The TCP three-way handshake',
    analogy:
      'A phone call: **"Hello, can you hear me?"** (SYN) — **"Yes, I can hear you. Can you hear me?"** (SYN-ACK) — **"Yes!"** (ACK). Now you can talk.',
    body: `Before TCP sends data, client and server agree to talk and exchange **starting sequence numbers**.

1. **SYN** — client: "I want to connect, my sequence number starts at 1000."
2. **SYN-ACK** — server: "OK. My sequence starts at 5000, and I expect your next byte to be 1001 (ack = 1001)."
3. **ACK** — client: "Got it, I expect 5001." → **Connection ESTABLISHED.**

Closing uses **FIN** and **ACK** from both sides (a **4-way** close). A **RST** (reset) ends a connection immediately — for example when a port is closed or a firewall rejects it.

Troubleshooting idea: if you see SYN but **no SYN-ACK**, the server is down, the port is closed, or a **firewall is dropping** the traffic.`,
    visuals: [
      {
        kind: 'sequence',
        title: 'TCP handshake, data and close',
        actors: [
          { id: 'c', label: 'Teller PC', icon: 'pc', sub: 'client' },
          { id: 's', label: 'CBS server', icon: 'server', sub: 'port 443' },
        ],
        steps: [
          { from: 'c', to: 's', label: 'SYN  seq=1000', detail: '**SYN**: the client asks to open a connection to port 443 and sends its starting sequence number (1000).', tone: 'blue' },
          { from: 's', to: 'c', label: 'SYN-ACK  seq=5000 ack=1001', detail: '**SYN-ACK**: the server agrees, sends its own sequence number (5000) and acknowledges the client\'s SYN (ack = 1000 + 1).', tone: 'purple' },
          { from: 'c', to: 's', label: 'ACK  ack=5001', detail: '**ACK**: the client confirms. The connection is now **ESTABLISHED**. That was the 3-way handshake.', tone: 'green' },
          { from: 'c', to: 's', label: 'DATA seq=1001 (300 bytes)', detail: 'Data flows: the client sends a 300-byte request (TLS-encrypted HTTP).', tone: 'indigo' },
          { from: 's', to: 'c', label: 'ACK  ack=1301', detail: 'The server confirms it received bytes up to 1300 and expects byte **1301** next. If an ACK does not come, TCP re-sends.', tone: 'indigo' },
          { from: 'c', to: 's', label: 'FIN', detail: 'To close, the client sends **FIN** ("I have finished sending").', tone: 'amber' },
          { from: 's', to: 'c', label: 'ACK + FIN', detail: 'The server acknowledges and sends its own **FIN** (these can be sent separately — that is why it is called a 4-way close).', tone: 'amber' },
          { from: 'c', to: 's', label: 'ACK', detail: 'Final **ACK**. The connection is closed. (A **RST** would close it immediately instead.)', tone: 'amber' },
        ],
      },
    ],
    bank: `A teller says "the CBS page keeps loading". In a packet capture (Wireshark) or firewall log you see the PC sending **SYN to 10.1.10.50:443** again and again with **no SYN-ACK**. That points to the server/service being down or a **firewall/ACL blocking** port 443 — not a DNS or cable problem.`,
    remember: [
      'Handshake = **SYN → SYN-ACK → ACK**. Close = FIN/ACK both ways. RST = abort.',
      'Sequence and acknowledgement numbers give TCP its **reliability and ordering**.',
      'SYN with no SYN-ACK → service down, port closed or firewall drop.',
    ],
    check: [
      {
        q: 'What is the correct order of the TCP three-way handshake?',
        options: ['ACK, SYN, SYN-ACK', 'SYN, ACK, SYN-ACK', 'SYN, SYN-ACK, ACK', 'SYN, FIN, ACK'],
        answer: 2,
        explain: '**SYN → SYN-ACK → ACK**.',
      },
      {
        q: 'A client sends SYN with seq=1000. What ack number does the server send in the SYN-ACK?',
        options: ['1000', '1001', '5000', '0'],
        answer: 1,
        explain: 'The ACK number is the **next expected** sequence number: 1000 + 1 = **1001**.',
      },
      {
        q: 'Which TCP flag ends a connection immediately?',
        options: ['FIN', 'RST', 'PSH', 'URG'],
        answer: 1,
        explain: '**RST** (reset) aborts a connection at once. FIN closes it politely.',
      },
    ],
  },
  {
    id: 'ports',
    title: 'Common port numbers',
    analogy:
      'The **IP address is the building** (a server). The **port number is the room** inside the building. Room 443 is the "HTTPS office", room 22 is the "SSH office", room 53 is the "DNS office".',
    body: `A **port** (0–65535) identifies an **application/service** on a host. A connection is identified by **source IP + source port + destination IP + destination port + protocol** (the "5-tuple").

- **Well-known ports**: 0–1023 (HTTP 80, HTTPS 443, SSH 22 …)
- **Registered ports**: 1024–49151 (MySQL 3306, RDP 3389 …)
- **Dynamic / ephemeral ports**: 49152–65535 — clients pick a random one as the **source port**.

Firewalls and ACLs allow or block traffic using ports. **Secure versions** to prefer in a bank: SSH (22) instead of Telnet (23), HTTPS (443) instead of HTTP (80), SFTP instead of FTP, LDAPS (636) instead of LDAP (389), SNMPv3 instead of v1/v2c.`,
    visuals: [{ kind: 'custom', id: 'portGrid' }],
    bank: `A typical data centre firewall rule: **allow branch subnets 10.20.0.0/16 → CBS web servers on TCP 443 only**. Admin access to switches and routers is via **SSH 22** from the IT management VLAN only. **RDP 3389** and **SMB 445** are never open to the Internet.`,
    remember: [
      'Must-know: FTP 20/21, SSH 22, Telnet 23, SMTP 25, DNS 53, DHCP 67/68, HTTP 80, NTP 123, SNMP 161/162, LDAP 389, HTTPS 443, SMB 445, Syslog 514, RDP 3389.',
      'Well-known 0–1023; clients use random high (ephemeral) source ports.',
      'Prefer secure protocols: SSH not Telnet, HTTPS not HTTP, SFTP not FTP.',
    ],
    check: [
      {
        q: 'Which port does SSH use?',
        options: ['21', '22', '23', '25'],
        answer: 1,
        explain: 'SSH = **TCP 22**. FTP = 21, Telnet = 23, SMTP = 25.',
      },
      {
        q: 'Which port is used by Windows Remote Desktop (RDP)?',
        options: ['3306', '1433', '3389', '8080'],
        answer: 2,
        explain: 'RDP = **TCP 3389**. 3306 = MySQL, 1433 = MS SQL, 8080 = HTTP alternate.',
      },
      {
        q: 'SNMP traps (alerts from a device to the monitoring server) use which port?',
        options: ['UDP 161', 'UDP 162', 'TCP 514', 'UDP 123'],
        answer: 1,
        explain: 'SNMP polling uses **UDP 161**; traps are sent to **UDP 162**.',
      },
    ],
  },
  {
    id: 'dhcp',
    title: 'DHCP and the DORA process',
    analogy:
      'A new employee arrives at the bank. HR gives them a **desk number, phone extension and canteen card** automatically. DHCP does the same for a new PC: it gives an **IP address, mask, gateway and DNS server** — for a limited time (the lease).',
    body: `**DHCP (Dynamic Host Configuration Protocol)** gives IP settings automatically. It uses **UDP 67 (server)** and **UDP 68 (client)**.

The 4 steps are **DORA**:
1. **D**iscover — client broadcasts: "Is there a DHCP server?"
2. **O**ffer — server: "You can use 10.20.5.57."
3. **R**equest — client broadcasts: "I accept 10.20.5.57." (broadcast, so other servers know)
4. **A**cknowledge — server: "Confirmed. Lease = 8 days."

DHCP gives: **IP address, subnet mask, default gateway, DNS servers, lease time** (and options like domain name, NTP).
- **Scope** = the range of addresses to give out. **Exclusions** = addresses not to give (e.g. printers). **Reservation** = always give the same IP to one MAC.
- Renewal: the client tries to renew at **50%** of the lease.
- **DHCP relay** (\`ip helper-address\`): broadcasts do not cross routers, so the branch router forwards DHCP messages to a central DHCP server.
- No DHCP reply? Windows gives itself an **APIPA** address **169.254.x.x** → no network access.`,
    visuals: [
      {
        kind: 'sequence',
        title: 'DORA: a new teller PC gets an IP',
        actors: [
          { id: 'pc', label: 'New PC', icon: 'pc', sub: 'no IP yet (0.0.0.0)' },
          { id: 'srv', label: 'DHCP server', icon: 'server', sub: 'UDP 67' },
        ],
        steps: [
          { from: 'pc', to: 'srv', label: '📢 DISCOVER (broadcast)', detail: '**Discover**: the PC has no IP, so it sends from 0.0.0.0 to **255.255.255.255** (broadcast), UDP 68 → 67: "Any DHCP server out there?"', tone: 'blue' },
          { from: 'srv', to: 'pc', label: 'OFFER 10.20.5.57', detail: '**Offer**: the server picks a free address from the scope and offers it with mask 255.255.255.0, gateway 10.20.5.1, DNS servers and a lease time.', tone: 'purple' },
          { from: 'pc', to: 'srv', label: '📢 REQUEST 10.20.5.57', detail: '**Request**: the PC accepts. It is still a **broadcast**, so any other DHCP server knows its offer was not chosen.', tone: 'amber' },
          { from: 'srv', to: 'pc', label: 'ACK (lease 8 days)', detail: '**Acknowledge**: the server confirms and records the lease. The PC now configures 10.20.5.57/24.', tone: 'green' },
          { from: 'pc', to: 'pc', label: 'Use IP · renew at 50%', detail: 'The PC uses the IP. At **50% of the lease** it asks the same server to renew (unicast). If no DHCP server ever answers, Windows uses **169.254.x.x (APIPA)**.', tone: 'teal' },
        ],
      },
    ],
    bank: `Banks usually run **central DHCP servers** in the data centre (often on Windows Server with a failover partner). Each branch router has \`ip helper-address\` pointing to them. **ATMs, printers and servers** use **static IPs or reservations** so their address never changes and firewall rules stay correct.`,
    remember: [
      'DORA = **Discover, Offer, Request, Acknowledge**. UDP 67 server, 68 client.',
      'DHCP gives IP, mask, gateway, DNS, lease. Relay (ip helper-address) lets a central server serve remote branches.',
      '**169.254.x.x** = APIPA = the PC could not reach a DHCP server.',
    ],
    check: [
      {
        q: 'What does DORA stand for?',
        options: ['Detect, Offer, Reply, Accept', 'Discover, Offer, Request, Acknowledge', 'Discover, Open, Request, Assign', 'Deliver, Offer, Receive, ACK'],
        answer: 1,
        explain: '**Discover, Offer, Request, Acknowledge**.',
      },
      {
        q: 'A branch PC shows the IP 169.254.33.10. What is the most likely problem?',
        options: ['DNS server down', 'The PC could not get an address from DHCP', 'Wrong default gateway', 'The firewall blocks HTTPS'],
        answer: 1,
        explain: '169.254.x.x is an **APIPA** address: the PC got **no DHCP reply** (cable/VLAN issue, relay missing, scope full or server down).',
      },
      {
        q: 'How can a central DHCP server in the data centre give IPs to PCs in a branch, if broadcasts do not cross routers?',
        options: ['Using NAT', 'Using a DHCP relay (ip helper-address) on the branch router', 'Using ARP', 'It cannot; every branch needs its own server'],
        answer: 1,
        explain: 'The branch router acts as a **DHCP relay agent**: it turns the broadcast into a unicast to the DHCP server.',
      },
    ],
  },
  {
    id: 'dns',
    title: 'DNS: changing names into IP addresses',
    analogy:
      'DNS is the **phone book (or contacts app)** of the network. You remember the name "Head Office", the phone book gives you the number. People remember **names**; computers need **IP addresses**.',
    body: `**DNS (Domain Name System)** changes a name like \`www.example.lk\` into an IP. It uses **UDP 53** (and **TCP 53** for zone transfers and large replies).

How a lookup works:
1. The PC checks its **cache** (and hosts file). Not found → asks its **DNS resolver** (recursive query).
2. The resolver asks a **root server** → "ask the **.lk** servers".
3. Asks the **TLD server** (.lk) → "ask **example.lk**'s name servers".
4. Asks the **authoritative server** → "the IP is 203.0.113.25".
5. The resolver **caches** the answer for the **TTL** and replies to the PC.

| Record | Meaning |
|---|---|
| **A** | name → IPv4 |
| **AAAA** | name → IPv6 |
| **CNAME** | alias → another name |
| **MX** | mail server for a domain |
| **PTR** | IP → name (reverse lookup) |
| **NS** | name servers for a zone |
| **SRV** | service location (Active Directory uses these) |

Test with \`nslookup\` or \`dig\`. Clear the Windows cache with \`ipconfig /flushdns\`.`,
    visuals: [
      {
        kind: 'sequence',
        title: 'DNS lookup for www.example.lk',
        actors: [
          { id: 'pc', label: 'PC', icon: 'pc' },
          { id: 'res', label: 'Resolver', icon: 'dns', sub: 'local DNS' },
          { id: 'root', label: 'Root', icon: 'globe', sub: '"."' },
          { id: 'tld', label: 'TLD', icon: 'dns', sub: '.lk' },
          { id: 'auth', label: 'Authoritative', icon: 'dns', sub: 'example.lk' },
        ],
        steps: [
          { from: 'pc', to: 'res', label: 'www.example.lk?', detail: 'The PC checked its own cache — not there. It sends a **recursive query** to its configured DNS server (resolver) on **UDP 53**: "Please find the full answer for me."', tone: 'blue' },
          { from: 'res', to: 'root', label: 'www.example.lk?', detail: 'The resolver does not have it cached, so it starts at a **root server**.', tone: 'indigo' },
          { from: 'root', to: 'res', label: 'Ask .lk servers', detail: 'The root does not know the IP, but it **refers** the resolver to the **.lk TLD** servers. (This is an **iterative** query.)', tone: 'purple', dashed: true },
          { from: 'res', to: 'tld', label: 'www.example.lk?', detail: 'The resolver asks a .lk TLD server.', tone: 'indigo' },
          { from: 'tld', to: 'res', label: 'Ask example.lk NS', detail: 'The TLD refers it to the **authoritative name servers** for example.lk.', tone: 'purple', dashed: true },
          { from: 'res', to: 'auth', label: 'www.example.lk?', detail: 'The resolver asks the authoritative server — the one that holds the real record.', tone: 'indigo' },
          { from: 'auth', to: 'res', label: 'A 203.0.113.25 (TTL 3600)', detail: 'The authoritative server answers with the **A record** and a **TTL** (how long it may be cached).', tone: 'green' },
          { from: 'res', to: 'pc', label: '203.0.113.25', detail: 'The resolver **caches** the answer and replies to the PC. Next time, the answer comes straight from cache — much faster.', tone: 'green' },
        ],
      },
    ],
    bank: `Inside a bank, **internal DNS** (often on Active Directory domain controllers) resolves names like \`cbs.bank.local\`. A classic issue: a teller **can ping 10.1.10.50 but cannot open the app by name** → that is a **DNS problem**. Check with \`nslookup cbs.bank.local\` and check which DNS servers the PC got from DHCP.`,
    remember: [
      'DNS = name → IP. **UDP 53** for queries, **TCP 53** for zone transfers / big replies.',
      'Order: cache → resolver → root → TLD → authoritative. Answers are cached for the TTL.',
      'A = IPv4, AAAA = IPv6, CNAME = alias, MX = mail, PTR = reverse.',
    ],
    check: [
      {
        q: 'Which DNS record maps a name to an IPv4 address?',
        options: ['MX', 'PTR', 'A', 'CNAME'],
        answer: 2,
        explain: 'The **A** record maps a name to an IPv4 address (AAAA for IPv6).',
      },
      {
        q: 'A user can ping the server by IP but not by name. What is the most likely problem?',
        options: ['Cable fault', 'DNS', 'Default gateway', 'Switch port down'],
        answer: 1,
        explain: 'If the IP works, the network path is fine. The **name resolution (DNS)** is failing.',
      },
      {
        q: 'Which DNS record is used for reverse lookup (IP → name)?',
        options: ['PTR', 'NS', 'SRV', 'AAAA'],
        answer: 0,
        explain: '**PTR** records are used in reverse lookup zones.',
      },
    ],
  },
  {
    id: 'arp',
    title: 'ARP: finding the MAC address',
    analogy:
      'You know a colleague\'s **name** (IP) but not their **desk** (MAC). You stand up and shout: **"Who is Nimal? Please tell Kasun!"** Only Nimal answers: **"I\'m at desk 5."** You write it in your notebook (ARP cache) so you don\'t shout next time.',
    body: `**ARP (Address Resolution Protocol)** finds the **MAC address for a known IPv4 address** in the local network.

1. The PC checks its **ARP cache**. Not found →
2. **ARP request** (broadcast to FF:FF:FF:FF:FF:FF): "Who has 10.20.5.30? Tell 10.20.5.25."
3. **ARP reply** (unicast) from the owner only: "10.20.5.30 is at 00:1A:2B:3C:4D:5E."
4. The PC saves it in the ARP cache and sends the frame.

Important: if the destination is in **another network**, the PC ARPs for the **default gateway's** MAC, not the remote host's.

- See the cache: \`arp -a\`
- **Gratuitous ARP**: a device announces its own IP/MAC (used after failover, e.g. HSRP, and to detect IP conflicts).
- **ARP spoofing/poisoning**: an attacker sends fake ARP replies to become a "man in the middle". Defence: **Dynamic ARP Inspection (DAI)** with DHCP snooping on switches.
- IPv6 does not use ARP; it uses **NDP** (Neighbor Discovery).`,
    visuals: [
      {
        kind: 'topology',
        title: 'ARP on a branch LAN (10.20.5.0/24)',
        width: 360,
        height: 230,
        nodes: [
          { id: 'a', label: 'PC A', icon: 'pc', x: 45, y: 45, sub: '10.20.5.25', info: 'The sender. It knows the IP it wants (10.20.5.30) but not the MAC.' },
          { id: 'sw', label: 'Switch', icon: 'switch', x: 180, y: 115, info: 'Floods the broadcast ARP request to all ports in the VLAN; forwards the unicast reply only to PC A.' },
          { id: 'b', label: 'PC B', icon: 'pc', x: 315, y: 45, sub: '10.20.5.30', info: 'The owner of 10.20.5.30, MAC 00:1A:2B:3C:4D:5E. Only this PC replies.' },
          { id: 'p', label: 'Printer', icon: 'printer', x: 45, y: 190, sub: '10.20.5.40', info: 'Receives the broadcast but ignores it (not its IP).' },
          { id: 'r', label: 'Gateway', icon: 'router', x: 315, y: 190, sub: '10.20.5.1', info: 'The default gateway. PCs ARP for this MAC when the destination is in another network.' },
        ],
        links: [
          { from: 'a', to: 'sw' },
          { from: 'b', to: 'sw' },
          { from: 'p', to: 'sw' },
          { from: 'r', to: 'sw' },
        ],
        steps: [
          { text: 'PC A wants to send to **10.20.5.30** (same subnet). It checks its **ARP cache** — empty.', highlight: ['a'] },
          { text: '**ARP request (broadcast)**: "Who has 10.20.5.30? Tell 10.20.5.25." Destination MAC FF:FF:FF:FF:FF:FF, so the switch floods it to **all** ports.', paths: [['a', 'sw', 'b'], ['a', 'sw', 'p'], ['a', 'sw', 'r']], packet: 'Who has .30?', tone: 'amber' },
          { text: '**ARP reply (unicast)**: only PC B answers: "10.20.5.30 is at **00:1A:2B:3C:4D:5E**." The printer and router ignore the request.', paths: [['b', 'sw', 'a']], packet: "I'm .30", tone: 'green' },
          { text: 'PC A stores the mapping in its **ARP cache** (see it with `arp -a`) and now sends the real frame directly to PC B.', paths: [['a', 'sw', 'b']], packet: 'data' },
          { text: 'If PC A wants **10.1.10.50** (data centre — a different network), it ARPs for the **gateway 10.20.5.1** instead, and sends the frame to the router.', paths: [['a', 'sw', 'r']], packet: 'to gateway', tone: 'purple' },
        ],
      },
    ],
    bank: `After a **gateway failover** (for example HSRP/VRRP at the data centre), the new active router sends a **gratuitous ARP** so switches and hosts update quickly. On branch switches, **DHCP snooping + Dynamic ARP Inspection** help stop ARP spoofing attacks that could steal teller credentials.`,
    remember: [
      'ARP = IP → MAC. Request is **broadcast**, reply is **unicast**. Cache: `arp -a`.',
      'For a remote destination the PC ARPs for the **default gateway**.',
      'ARP spoofing = MITM attack; defend with DHCP snooping + Dynamic ARP Inspection. IPv6 uses NDP.',
    ],
    check: [
      {
        q: 'An ARP request is sent as…',
        options: ['Unicast', 'Broadcast', 'Multicast', 'Anycast'],
        answer: 1,
        explain: 'The sender does not know the MAC yet, so the request goes to the **broadcast** MAC FF:FF:FF:FF:FF:FF. The reply is unicast.',
      },
      {
        q: 'Which switch feature helps prevent ARP spoofing?',
        options: ['Spanning Tree', 'Dynamic ARP Inspection', 'PoE', 'Trunking'],
        answer: 1,
        explain: '**Dynamic ARP Inspection (DAI)** checks ARP packets against the DHCP snooping table and drops fake ones.',
      },
    ],
  },
  {
    id: 'nat',
    title: 'NAT and PAT',
    analogy:
      'A big office has **one main phone number** (public IP). Inside, every desk has an **extension** (private IP). When you call out, the receptionist (router) connects you and remembers which extension made the call, so the answer comes back to the right desk.',
    body: `**Private IPs** (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are **not routed on the Internet**. **NAT (Network Address Translation)** changes private addresses into public ones at the edge (router/firewall).

- **Static NAT**: 1 private ↔ 1 public, permanent. Used for servers that must be reachable from the Internet (e.g. a web server in the DMZ).
- **Dynamic NAT**: private addresses use a **pool** of public addresses.
- **PAT (Port Address Translation) / NAT overload**: **many** private hosts share **one** public IP. The router uses **port numbers** to keep the connections apart. This is what home and office routers do.

Why NAT? It **saves public IPv4 addresses** and **hides the internal network**. Downsides: it breaks end-to-end connectivity and can complicate some protocols (e.g. IPsec needs NAT-T, UDP 4500).

Cisco terms: **inside local** (private IP of the host), **inside global** (public IP it is translated to), **outside** (the remote host).`,
    visuals: [{ kind: 'custom', id: 'natPat' }],
    bank: `A bank's **Internet edge firewall** uses **PAT** so thousands of staff PCs (through a proxy) share a few public IPs. The **Internet banking web servers** in the DMZ are published with **static NAT** (public IP → private DMZ IP on port 443). Internal systems like the core banking database are **never** NATed to the Internet.`,
    remember: [
      'NAT translates private ↔ public IPs. PAT (overload) = many hosts share one public IP using **ports**.',
      'Static NAT = 1:1 (publish a server). Dynamic NAT = pool. PAT = many:1.',
      'Private ranges: **10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16**.',
    ],
    check: [
      {
        q: 'Many PCs share one public IP address. Which type of NAT is this?',
        options: ['Static NAT', 'Dynamic NAT', 'PAT (NAT overload)', 'Reverse NAT'],
        answer: 2,
        explain: '**PAT / NAT overload** uses different source ports so many inside hosts can share one public IP.',
      },
      {
        q: 'Which NAT type would you use to make a DMZ web server reachable from the Internet at a fixed public IP?',
        options: ['Static NAT', 'PAT', 'Dynamic NAT', 'No NAT is possible'],
        answer: 0,
        explain: '**Static NAT** (1:1) always maps the same public IP to the server, so outside users can reach it.',
      },
    ],
  },
  {
    id: 'icmp',
    title: 'ICMP: ping and traceroute',
    analogy:
      '**Ping** is like calling "Are you there?" and waiting for "Yes!". **Traceroute** is like asking every post office on the way to send you a postcard, so you know the full route and where the letter gets stuck.',
    body: `**ICMP (Internet Control Message Protocol)** is a **Layer 3** helper protocol for **errors and tests**. It has **no ports**.

**ping** sends **Echo Request (type 8)** and receives **Echo Reply (type 0)**. It shows if a host is reachable and the **round-trip time** (latency) and packet loss.

**traceroute / tracert** shows every **hop** (router) on the path:
- It sends packets with **TTL = 1, 2, 3 …**
- Each router reduces TTL by 1. When TTL reaches 0, the router drops the packet and sends back **ICMP Time Exceeded (type 11)** → now you know that hop.
- Windows \`tracert\` uses ICMP echo; Linux \`traceroute\` uses UDP by default.

Other ICMP messages: **Destination Unreachable (type 3)** (e.g. network/host/port unreachable), Redirect (5).

Note: many firewalls **block ping**, so "no reply" does not always mean "down".`,
    visuals: [
      {
        kind: 'sequence',
        title: 'How traceroute discovers each hop',
        actors: [
          { id: 'pc', label: 'Branch PC', icon: 'pc' },
          { id: 'r1', label: 'Branch router', icon: 'router', sub: 'hop 1' },
          { id: 'r2', label: 'WAN router', icon: 'router', sub: 'hop 2' },
          { id: 'srv', label: 'CBS server', icon: 'server', sub: 'hop 3' },
        ],
        steps: [
          { from: 'pc', to: 'r1', label: 'probe TTL=1', detail: 'tracert sends the first probe with **TTL = 1**.', tone: 'blue' },
          { from: 'r1', to: 'pc', label: 'ICMP Time Exceeded', detail: 'The branch router reduces TTL to 0, drops the packet and returns **Time Exceeded (type 11)**. Hop 1 = branch router, with its response time.', tone: 'red' },
          { from: 'pc', to: 'r2', label: 'probe TTL=2', detail: 'Next probe with **TTL = 2**: it passes hop 1 (TTL → 1) and dies at hop 2.', tone: 'blue' },
          { from: 'r2', to: 'pc', label: 'ICMP Time Exceeded', detail: 'The WAN router returns Time Exceeded. Hop 2 found.', tone: 'red' },
          { from: 'pc', to: 'srv', label: 'probe TTL=3', detail: 'TTL = 3 reaches the destination server.', tone: 'blue' },
          { from: 'srv', to: 'pc', label: 'Echo Reply (done)', detail: 'The server answers (**Echo Reply** for Windows tracert). The trace is complete. If the trace stops with `* * *` at some hop, the problem (or a firewall) is around there.', tone: 'green' },
        ],
      },
    ],
    bank: `A branch reports "the system is slow". You run \`ping 10.1.10.50 -t\` to see latency and loss, then \`tracert 10.1.10.50\`. If hop 1 (branch router) is fast but hop 2 (provider) shows high delay or \`* * *\`, the **WAN link/provider** is the likely problem — raise a ticket with the ISP and switch to the backup link if needed.`,
    remember: [
      'ICMP = Layer 3, no ports. Ping = Echo Request **type 8** / Echo Reply **type 0**.',
      'Traceroute uses increasing **TTL** and **Time Exceeded (type 11)** messages to find each hop.',
      'No ping reply ≠ host down — a firewall may block ICMP.',
    ],
    check: [
      {
        q: 'Which ICMP message does traceroute rely on to find each hop?',
        options: ['Echo Reply', 'Time Exceeded', 'Redirect', 'Source Quench'],
        answer: 1,
        explain: 'Each router that drops a packet with TTL 0 sends **ICMP Time Exceeded**, which reveals that hop.',
      },
      {
        q: 'Which port does ping use?',
        options: ['TCP 7', 'UDP 53', 'None — ICMP has no ports', 'TCP 443'],
        answer: 2,
        explain: 'ICMP is a Layer 3 protocol and **does not use port numbers**.',
      },
    ],
  },
];
