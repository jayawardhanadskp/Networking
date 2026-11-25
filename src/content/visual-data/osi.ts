/** Data for the OSI vs TCP/IP explorer. */
export interface OsiLayer {
  n: number;
  name: string;
  job: string;
  analogy: string;
  protocols: string[];
  devices: string[];
  pdu: string;
  bank: string;
  color: string;
}

export const osiLayers: OsiLayer[] = [
  {
    n: 7, name: 'Application', color: '#8b5cf6',
    job: 'Gives network services to applications. It defines how apps talk, for example the format of an HTTP request.',
    analogy: 'What you write in the letter.',
    protocols: ['HTTP / HTTPS', 'DNS', 'DHCP', 'SMTP / IMAP', 'FTP', 'SSH', 'SNMP', 'LDAP'],
    devices: ['End hosts (PC, server)', 'Proxy', 'Web application firewall (WAF)', 'L7 load balancer'],
    pdu: 'Data',
    bank: 'A teller opens the core banking web app in a browser (HTTPS). The ATM sends a transaction message to the ATM switch.',
  },
  {
    n: 6, name: 'Presentation', color: '#a855f7',
    job: 'Formats the data so both sides understand it: encoding (ASCII/UTF-8), compression and encryption.',
    analogy: 'Translating the letter into a language both people read, or sealing it in a secret code.',
    protocols: ['TLS/SSL (encryption, usually placed here)', 'JPEG, PNG', 'ASCII, UTF-8', 'MPEG'],
    devices: ['End hosts'],
    pdu: 'Data',
    bank: 'TLS encrypts the login page and account data, so nobody on the network can read it.',
  },
  {
    n: 5, name: 'Session', color: '#d946ef',
    job: 'Opens, manages and closes sessions (conversations) between two applications.',
    analogy: 'Starting and ending a phone call.',
    protocols: ['NetBIOS', 'RPC', 'SMB sessions', 'SQL sessions'],
    devices: ['End hosts'],
    pdu: 'Data',
    bank: 'Your logged-in session in the core banking system. If it is idle too long, the session times out.',
  },
  {
    n: 4, name: 'Transport', color: '#3b82f6',
    job: 'End-to-end delivery between applications using port numbers. Splits data into segments. TCP adds reliability (ACKs, retransmission, ordering).',
    analogy: 'The room number in a building: it tells which person (app) gets the letter.',
    protocols: ['TCP', 'UDP'],
    devices: ['Stateful firewall', 'L4 load balancer'],
    pdu: 'Segment (TCP) / Datagram (UDP)',
    bank: 'The browser connects to TCP port 443 on the web server. DNS lookups use UDP port 53.',
  },
  {
    n: 3, name: 'Network', color: '#10b981',
    job: 'Logical addressing (IP addresses) and routing: chooses the best path between different networks.',
    analogy: 'The house address and the post office that decides the route.',
    protocols: ['IPv4, IPv6', 'ICMP (ping)', 'OSPF, EIGRP, BGP (routing)', 'IPsec'],
    devices: ['Router', 'Layer 3 switch', 'Firewall (routes and filters)'],
    pdu: 'Packet',
    bank: 'The branch router sends packets for 10.1.0.0/16 (data centre) over the MPLS WAN link.',
  },
  {
    n: 2, name: 'Data Link', color: '#f59e0b',
    job: 'Moves frames inside one local network using MAC addresses. Adds a header and an FCS trailer to detect errors.',
    analogy: 'Delivery inside one office building, using each person\'s staff ID.',
    protocols: ['Ethernet (802.3)', 'Wi-Fi (802.11)', 'ARP (links L3 to L2)', '802.1Q VLAN tags', 'STP', 'PPP'],
    devices: ['Switch', 'Bridge', 'Wireless access point', 'NIC'],
    pdu: 'Frame',
    bank: 'The branch switch forwards a frame from a teller PC to the router port, using the MAC address table.',
  },
  {
    n: 1, name: 'Physical', color: '#f43f5e',
    job: 'Sends raw bits as signals: electrical (copper), light (fibre) or radio (Wi-Fi). Defines cables, connectors, speeds.',
    analogy: 'The road and the delivery van.',
    protocols: ['Ethernet cabling (Cat5e/Cat6 UTP)', 'Fibre optic', 'RJ45', 'Radio (Wi-Fi bands)'],
    devices: ['Hub', 'Repeater', 'Cables and connectors', 'Media converter', 'Modem (signal)'],
    pdu: 'Bits',
    bank: 'A loose patch cable or a cut fibre link at a branch is a Layer 1 problem: always check this first.',
  },
];

/** TCP/IP (4-layer) model mapping to OSI layer numbers. */
export const tcpipLayers = [
  { name: 'Application', covers: [7, 6, 5], color: '#8b5cf6', note: 'Combines OSI 5, 6 and 7. HTTP, DNS, DHCP, SSH, SMTP, TLS.' },
  { name: 'Transport', covers: [4], color: '#3b82f6', note: 'Same as OSI 4. TCP and UDP, port numbers.' },
  { name: 'Internet', covers: [3], color: '#10b981', note: 'Same as OSI 3. IP, ICMP, routing.' },
  { name: 'Network Access (Link)', covers: [2, 1], color: '#f59e0b', note: 'Combines OSI 1 and 2. Ethernet, Wi-Fi, MAC, cables.' },
];
