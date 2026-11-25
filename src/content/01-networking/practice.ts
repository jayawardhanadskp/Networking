import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  {
    q: 'Which OSI layer is responsible for logical addressing and routing?',
    options: ['Data Link', 'Network', 'Transport', 'Session'],
    answer: 1,
    explain: 'The **Network layer (L3)** handles IP addressing and routing between networks.',
  },
  {
    q: 'Which list shows the PDUs from Layer 4 down to Layer 1?',
    options: ['Packet, Segment, Frame, Bits', 'Segment, Packet, Frame, Bits', 'Frame, Packet, Segment, Bits', 'Segment, Frame, Packet, Bits'],
    answer: 1,
    explain: 'L4 **Segment** → L3 **Packet** → L2 **Frame** → L1 **Bits**.',
  },
  {
    q: 'At which layer does TLS encryption usually fit in the OSI model?',
    options: ['Layer 2', 'Layer 3', 'Layer 6 (Presentation)', 'Layer 1'],
    answer: 2,
    explain: 'Encryption and data formatting belong to the **Presentation layer (6)**. In the TCP/IP model, TLS is part of the Application layer.',
  },
  {
    q: 'A packet travels across three routers. Which addresses change at each hop?',
    options: ['Source and destination IP', 'Source and destination MAC', 'Source and destination port', 'Nothing changes'],
    answer: 1,
    explain: 'Each router builds a **new Layer 2 frame**, so the **MAC addresses change** at every hop. IPs stay the same (unless NAT is used).',
  },
  {
    q: 'What is the main difference between a hub and a switch?',
    options: [
      'A hub routes between networks; a switch does not',
      'A switch forwards frames only to the destination port; a hub repeats to all ports',
      'A hub uses IP addresses; a switch uses ports',
      'There is no difference',
    ],
    answer: 1,
    explain: 'A **switch** learns MACs and forwards intelligently. A **hub** (L1) repeats every signal to every port.',
  },
  {
    q: 'How many broadcast domains does a router with 3 active LAN interfaces create?',
    options: ['1', '2', '3', '0'],
    answer: 2,
    explain: 'Each router interface is a **separate broadcast domain**: 3 interfaces = **3** broadcast domains.',
  },
  {
    q: 'Which protocol provides reliable, ordered delivery?',
    options: ['UDP', 'IP', 'TCP', 'ICMP'],
    answer: 2,
    explain: '**TCP** uses sequence numbers, acknowledgements and retransmissions.',
  },
  {
    q: 'Which of these protocols normally uses UDP?',
    options: ['HTTPS', 'SSH', 'NTP', 'SMTP'],
    answer: 2,
    explain: '**NTP** uses UDP 123. HTTPS, SSH and SMTP use TCP.',
  },
  {
    q: 'What is port 445 used for?',
    options: ['LDAP', 'SMB (Windows file sharing)', 'HTTPS', 'Syslog'],
    answer: 1,
    explain: '**TCP 445 = SMB**. It must never be open to the Internet (WannaCry spread through SMB).',
  },
  {
    q: 'Which port is used by LDAP over TLS (LDAPS)?',
    options: ['389', '443', '636', '993'],
    answer: 2,
    explain: 'LDAP = 389, **LDAPS = 636**.',
  },
  {
    q: 'In DHCP, which message does the client send to accept an offer?',
    options: ['Discover', 'Offer', 'Request', 'Acknowledge'],
    answer: 2,
    explain: 'The client sends a **Request** (broadcast) to accept the offer. The server confirms with ACK.',
  },
  {
    q: 'Which DHCP feature makes sure a printer always gets the same IP?',
    options: ['Scope', 'Exclusion', 'Reservation', 'Lease'],
    answer: 2,
    explain: 'A **reservation** binds an IP to a specific MAC address.',
  },
  {
    q: 'Which DNS record type identifies the mail server for a domain?',
    options: ['A', 'MX', 'CNAME', 'NS'],
    answer: 1,
    explain: '**MX** (Mail Exchanger) records point to mail servers.',
  },
  {
    q: 'Which command clears the DNS cache on Windows?',
    options: ['ipconfig /release', 'ipconfig /flushdns', 'arp -d', 'nslookup /clear'],
    answer: 1,
    explain: '**ipconfig /flushdns** clears the DNS resolver cache.',
  },
  {
    q: 'What does ARP resolve?',
    options: ['Name to IP', 'IP to MAC', 'MAC to name', 'Port to service'],
    answer: 1,
    explain: '**ARP** finds the MAC address for a known IPv4 address on the local network. DNS does name → IP.',
  },
  {
    q: 'A PC needs to reach a server on a different subnet. For which IP does it send an ARP request?',
    options: ['The server\'s IP', 'The DNS server\'s IP', 'The default gateway\'s IP', '255.255.255.255'],
    answer: 2,
    explain: 'Remote traffic goes to the **default gateway**, so the PC needs the gateway\'s MAC.',
  },
  {
    q: 'Which is NOT a private IPv4 range (RFC 1918)?',
    options: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '172.32.0.0/16'],
    answer: 3,
    explain: 'The private 172 range is **172.16.0.0 – 172.31.255.255**. 172.32.x.x is public.',
  },
  {
    q: 'What does PAT use to tell different inside hosts apart when they share one public IP?',
    options: ['MAC addresses', 'VLAN IDs', 'Port numbers', 'TTL values'],
    answer: 2,
    explain: 'PAT maps each inside IP:port to a unique **public port** on the shared public IP.',
  },
  {
    q: 'Which ICMP type is an Echo Request (ping)?',
    options: ['Type 0', 'Type 3', 'Type 8', 'Type 11'],
    answer: 2,
    explain: 'Echo Request = **type 8**, Echo Reply = type 0, Destination Unreachable = 3, Time Exceeded = 11.',
  },
  {
    q: 'What is the IPv4 broadcast MAC address?',
    options: ['00:00:00:00:00:00', 'FF:FF:FF:FF:FF:FF', '01:00:5E:00:00:01', 'AA:AA:AA:AA:AA:AA'],
    answer: 1,
    explain: '**FF:FF:FF:FF:FF:FF** is the Ethernet broadcast address.',
  },
  {
    q: 'A firewall log shows many SYN packets from a branch PC to the server on port 443, but no SYN-ACK. What does this suggest?',
    options: ['DNS failure', 'The server/service is down or the traffic is blocked', 'A duplex mismatch', 'The PC has an APIPA address'],
    answer: 1,
    explain: 'The client is trying to connect, but the handshake never completes: the **service is down, the port is closed, or something is dropping** the traffic.',
  },
];

export const flashcards: Flashcard[] = [
  { front: 'OSI 7 layers (top to bottom)', back: '7 Application, 6 Presentation, 5 Session, 4 Transport, 3 Network, 2 Data Link, 1 Physical.\n\n"**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing"', tag: 'definition' },
  { front: 'TCP/IP model layers', back: 'Application, Transport, Internet, Network Access (Link).', tag: 'definition' },
  { front: 'PDU names', back: 'L4 **Segment** (UDP: datagram), L3 **Packet**, L2 **Frame**, L1 **Bits**. Upper layers: Data.', tag: 'definition' },
  { front: 'Encapsulation', back: 'Adding a header (and trailer) at each layer as data goes **down** the stack at the sender. Decapsulation = removing them going up.', tag: 'definition' },
  { front: 'Port 22', back: '**SSH** (also SFTP/SCP) — TCP. Secure remote login.', tag: 'port' },
  { front: 'Port 23', back: '**Telnet** — TCP. Clear text, do not use.', tag: 'port' },
  { front: 'Port 25', back: '**SMTP** — TCP. Mail server to mail server.', tag: 'port' },
  { front: 'Port 53', back: '**DNS** — UDP for queries, TCP for zone transfers/large replies.', tag: 'port' },
  { front: 'Ports 67 / 68', back: '**DHCP** — UDP. 67 = server, 68 = client.', tag: 'port' },
  { front: 'Port 123', back: '**NTP** — UDP. Time synchronisation.', tag: 'port' },
  { front: 'Ports 161 / 162', back: '**SNMP** — UDP. 161 = polling (get/set), 162 = traps.', tag: 'port' },
  { front: 'Port 443', back: '**HTTPS** — TCP. HTTP over TLS.', tag: 'port' },
  { front: 'Port 445', back: '**SMB** — TCP. Windows file sharing.', tag: 'port' },
  { front: 'Port 514', back: '**Syslog** — UDP. Central logging.', tag: 'port' },
  { front: 'Port 3389', back: '**RDP** — TCP. Windows Remote Desktop.', tag: 'port' },
  { front: 'Port 3306 / 1433 / 1521', back: '**MySQL** 3306, **MS SQL** 1433, **Oracle** 1521.', tag: 'port' },
  { front: 'TCP vs UDP (one line each)', back: '**TCP**: connection-oriented, reliable, ordered, slower.\n\n**UDP**: connectionless, best effort, fast, small header.', tag: 'definition' },
  { front: 'TCP 3-way handshake', back: '**SYN → SYN-ACK → ACK**. Close: FIN/ACK each side. RST = abort.', tag: 'definition' },
  { front: 'DORA', back: 'DHCP: **Discover, Offer, Request, Acknowledge**.', tag: 'acronym' },
  { front: 'APIPA', back: '**Automatic Private IP Addressing**: 169.254.0.0/16. Windows uses it when no DHCP server answers.', tag: 'acronym' },
  { front: 'ARP', back: '**Address Resolution Protocol**: IP → MAC on the local network. Request = broadcast, reply = unicast.', tag: 'acronym' },
  { front: 'DNS record types', back: '**A** IPv4, **AAAA** IPv6, **CNAME** alias, **MX** mail, **PTR** reverse, **NS** name server, **SRV** service.', tag: 'definition' },
  { front: 'NAT vs PAT', back: '**NAT**: translate private ↔ public IP (static 1:1 or dynamic pool).\n\n**PAT / overload**: many private hosts share one public IP using port numbers.', tag: 'definition' },
  { front: 'RFC 1918 private ranges', back: '10.0.0.0/8 · 172.16.0.0/12 (172.16–172.31) · 192.168.0.0/16', tag: 'fact' },
  { front: 'Collision vs broadcast domain', back: '**Collision domain**: split by switch ports (each port = one).\n\n**Broadcast domain**: split by routers and VLANs.', tag: 'definition' },
  { front: 'ICMP types to know', back: '0 Echo Reply · 3 Destination Unreachable · 8 Echo Request · 11 Time Exceeded.', tag: 'fact' },
  { front: 'MAC address structure', back: '48 bits in hex. First 24 bits = **OUI** (vendor), last 24 bits = device-specific.', tag: 'definition' },
  { front: 'Multicast range', back: '224.0.0.0 – 239.255.255.255 (224.0.0.0/4, Class D). OSPF uses 224.0.0.5 and 224.0.0.6.', tag: 'fact' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'Explain the OSI model.',
    answer: `The OSI model splits network communication into **7 layers**, so each layer has one job and we can troubleshoot step by step.

- **L1 Physical** – cables, signals, bits (hub).
- **L2 Data Link** – MAC addresses and frames inside a LAN (switch).
- **L3 Network** – IP addressing and routing (router).
- **L4 Transport** – TCP/UDP, port numbers, reliability.
- **L5 Session, L6 Presentation, L7 Application** – sessions, formatting/encryption (TLS), and app protocols like HTTP and DNS.

In real work I use it for troubleshooting: for example, if a branch cannot reach the core banking app, I check the cable and link (L1), VLAN and switch port (L2), IP and gateway (L3), then the firewall/port (L4), then the application.`,
    tips: ['Give the PDU names if you have time: segment, packet, frame, bits.', 'Always finish with **how you use it** (troubleshooting) — it shows practical thinking.'],
  },
  {
    type: 'technical',
    q: 'What is the difference between TCP and UDP? Give examples.',
    answer: `Both are Layer 4 protocols that use port numbers.

**TCP** is **connection-oriented and reliable**: it uses a 3-way handshake, sequence numbers, acknowledgements and retransmission, so data arrives complete and in order. Examples: HTTPS, SSH, SMTP, database connections — and banking transactions.

**UDP** is **connectionless and best effort**: no handshake and no guarantee, but very low overhead and delay. Examples: DNS queries, DHCP, SNMP, NTP, syslog, and voice/video.

So I choose TCP when accuracy matters, and UDP when speed matters or the app handles loss itself.`,
    tips: ['Mention a bank example: fund transfer = TCP, IP phone call = UDP.'],
  },
  {
    type: 'technical',
    q: 'Explain the TCP three-way handshake.',
    answer: `Before sending data, TCP sets up a connection in three steps:

1. **SYN** – the client sends a SYN with its initial sequence number.
2. **SYN-ACK** – the server replies with its own sequence number and acknowledges the client's (client seq + 1).
3. **ACK** – the client acknowledges the server's sequence number. The connection is established.

Closing uses FIN and ACK from both sides, and RST aborts a connection. In troubleshooting, if I see SYN packets with no SYN-ACK, I suspect the service is down or a firewall is dropping the traffic.`,
  },
  {
    type: 'technical',
    q: 'What happens when you type a website address into the browser and press Enter?',
    answer: `1. **DNS**: the PC checks its cache, then asks the DNS server to change the name into an IP.
2. **ARP**: if the server is in another network, the PC finds the **default gateway's MAC** with ARP.
3. **TCP**: the browser opens a TCP connection to port 443 with the **3-way handshake**.
4. **TLS**: the browser and server do a TLS handshake; the server's certificate is checked and an encrypted session is created.
5. **HTTP**: the browser sends an HTTP GET request; the server returns the page.
6. Along the way: the **switch** forwards by MAC, **routers** forward by IP, **firewalls** check rules, and maybe **NAT** changes the source IP at the Internet edge.`,
    tips: ['This is a favourite question. Practise saying it in about 60–90 seconds.', 'If you are a developer, add one line about the server side: load balancer → app server → database.'],
  },
  {
    type: 'technical',
    q: 'What is DHCP? Explain the DORA process. What happens if the DHCP server is down?',
    answer: `DHCP automatically gives devices their **IP address, subnet mask, default gateway, DNS servers and lease time**. It uses UDP 67 (server) and 68 (client).

DORA: **Discover** (client broadcast), **Offer** (server offers an IP), **Request** (client accepts, broadcast), **Acknowledge** (server confirms the lease).

For branches, the router uses a **DHCP relay** (ip helper-address) to forward requests to a central DHCP server.

If the DHCP server is down: devices that already have a lease keep working until the lease expires (they try to renew at 50%). New devices get no IP — Windows gives itself an **APIPA 169.254.x.x** address and cannot reach the network. That is why banks use DHCP **failover** (two servers) and static IPs/reservations for critical devices.`,
  },
  {
    type: 'technical',
    q: 'What is DNS and how does a DNS lookup work?',
    answer: `DNS changes **names into IP addresses**, like a phone book. It uses UDP 53 (TCP 53 for zone transfers and large answers).

The PC checks its cache, then sends a recursive query to its DNS resolver. If the resolver has no cached answer, it asks a **root server**, which refers it to the **TLD** server (for example .lk), which refers it to the **authoritative** server for the domain. The authoritative server returns the record, and the resolver caches it for the TTL.

Common records: A, AAAA, CNAME, MX, PTR, NS, and SRV (used by Active Directory). I test with \`nslookup\` and clear the client cache with \`ipconfig /flushdns\`.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between a switch and a router?',
    answer: `A **switch** works at **Layer 2**. It connects devices **inside the same network**, learns MAC addresses into its MAC table, and forwards frames only to the right port. It supports VLANs. Each port is its own collision domain.

A **router** works at **Layer 3**. It connects **different networks**, uses IP addresses and a routing table to choose the best path, and stops broadcasts — each interface is its own broadcast domain. It is the default gateway for the LAN.

A **Layer 3 switch** combines both: switching plus fast inter-VLAN routing, common in a data centre core.`,
  },
  {
    type: 'technical',
    q: 'What is ARP and what is ARP spoofing?',
    answer: `ARP finds the **MAC address for a known IP** on the local network. The PC broadcasts "Who has 10.20.5.30?" and the owner replies with its MAC; the result is stored in the ARP cache (\`arp -a\`). For remote destinations, the PC ARPs for the default gateway.

**ARP spoofing** is when an attacker sends fake ARP replies, for example claiming to be the gateway, so traffic flows through the attacker (man-in-the-middle). Defences: **DHCP snooping with Dynamic ARP Inspection** on switches, port security, network segmentation, and encrypted protocols like TLS and SSH.`,
  },
  {
    type: 'technical',
    q: 'What is NAT and why do we use it? What is PAT?',
    answer: `NAT translates **private IP addresses into public ones** (and back) at the network edge. Private ranges (10/8, 172.16/12, 192.168/16) are not routed on the Internet.

- **Static NAT**: one private to one public — used to publish a server, for example an Internet banking web server in the DMZ.
- **Dynamic NAT**: a pool of public addresses.
- **PAT / overload**: many hosts share one public IP, using different **port numbers** to keep sessions apart.

Benefits: saves public IPv4 addresses and hides the internal network. Drawbacks: breaks end-to-end connectivity and complicates some protocols like IPsec (solved with NAT-T on UDP 4500).`,
  },
  {
    type: 'technical',
    q: 'What is the difference between a MAC address and an IP address?',
    answer: `A **MAC address** is a 48-bit **physical address** burned into the network card. It works at **Layer 2**, only inside the local network, and switches use it. The first half is the vendor OUI.

An **IP address** is a **logical address** (32-bit for IPv4) given by an admin or DHCP. It works at **Layer 3**, across networks, and routers use it. It has a network part and a host part defined by the subnet mask.

ARP links them by finding the MAC for an IP. A simple analogy: MAC is like your national ID number; IP is like your home address, which changes when you move.`,
  },
  {
    type: 'scenario',
    q: 'A teller can ping the core banking server by IP, but cannot open the application using its name. What do you check?',
    answer: `Since ping by IP works, Layers 1–3 are fine. The likely problem is **DNS** (or the application/port).

1. Run \`nslookup cbs.bank.local\` — does it return the correct IP? Which DNS server answered?
2. Check the PC's DNS settings with \`ipconfig /all\` — did DHCP give the right DNS servers?
3. Try \`ipconfig /flushdns\` in case of an old cached record. Check the hosts file.
4. Check if other users in the branch have the same problem — if yes, check the DNS server and the DNS record itself.
5. If the name resolves correctly, test the port: \`Test-NetConnection cbs.bank.local -Port 443\` — maybe a firewall rule or the app service is the problem.
6. Document the fix and update the ticket.`,
    tips: ['Show the logic: "ping by IP works, so the network path is OK."', 'Always mention checking if it is **one user or many** — it tells you the scope.'],
  },
  {
    type: 'scenario',
    q: 'A new PC in a branch shows an IP address 169.254.x.x. How do you troubleshoot?',
    answer: `169.254.x.x is **APIPA**: the PC did not get a reply from DHCP.

1. **Physical**: is the cable connected, link light on? Try another port/cable.
2. **Switch port**: is the port up, in the **correct VLAN**, not shut down by port security?
3. Run \`ipconfig /release\` and \`ipconfig /renew\`.
4. Do other PCs in the same VLAN get IPs? If **none** do: check the router's **DHCP relay (ip helper-address)** and the WAN link to the DHCP server, and check the DHCP server/service.
5. On the DHCP server: is the **scope full** (no free addresses) or the scope disabled? Any DHCP snooping blocking it?
6. As a temporary fix for an urgent device, a static IP can be used (then fix the root cause).`,
  },
  {
    type: 'technical',
    q: 'What is the difference between a broadcast domain and a collision domain?',
    answer: `A **collision domain** is a group of devices whose signals can collide. Hubs make one big collision domain; **each switch port** is its own collision domain (and with full duplex, collisions do not happen).

A **broadcast domain** is a group of devices that receive each other's broadcasts (like ARP and DHCP Discover). A switch (one VLAN) is one broadcast domain. **Routers and VLANs split broadcast domains.**

Keeping broadcast domains small improves performance and security — that is why we use VLANs and subnets.`,
  },
];
