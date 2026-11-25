/** Data for the packet journey (encapsulation / decapsulation) animation. */
export type HeaderPart = 'eth' | 'ip' | 'tcp' | 'tls' | 'data' | 'fcs';

export const journeyNodes = [
  { label: 'Branch PC', sub: '10.20.5.25', icon: 'pc' },
  { label: 'Switch', sub: 'L2', icon: 'switch' },
  { label: 'Branch router', sub: 'gateway .1', icon: 'router' },
  { label: 'MPLS WAN', sub: 'provider', icon: 'cloud' },
  { label: 'DC firewall', sub: 'L3/L4', icon: 'firewall' },
  { label: 'CBS server', sub: '10.1.10.50', icon: 'server' },
] as const;

export const partInfo: Record<HeaderPart, { label: string; color: string }> = {
  eth: { label: 'Ethernet header', color: '#f59e0b' },
  ip: { label: 'IP header', color: '#10b981' },
  tcp: { label: 'TCP header', color: '#3b82f6' },
  tls: { label: 'TLS', color: '#a855f7' },
  data: { label: 'HTTP data', color: '#8b5cf6' },
  fcs: { label: 'FCS', color: '#f59e0b' },
};

export interface JourneyStep {
  at: number; // index in journeyNodes
  /** If set, the packet is moving from `at` to `to`. */
  to?: number;
  layer: string;
  pdu: string;
  title: string;
  text: string;
  parts: HeaderPart[];
  details?: Partial<Record<HeaderPart, string>>;
  bits?: boolean;
}

export const journeySteps: JourneyStep[] = [
  {
    at: 0, layer: 'L7 Application', pdu: 'Data', parts: ['data'],
    title: 'The teller opens the app',
    text: 'The teller types https://cbs.bank.local in the browser. First, DNS changes the name into the IP 10.1.10.50. The browser creates an HTTP GET request.',
    details: { data: 'GET /login HTTP/1.1' },
  },
  {
    at: 0, layer: 'L6/L5 Presentation & Session', pdu: 'Data', parts: ['tls', 'data'],
    title: 'TLS encrypts the data',
    text: 'TLS (HTTPS) encrypts the request so nobody on the network can read it. A session is kept open between browser and server.',
    details: { tls: 'encrypted' },
  },
  {
    at: 0, layer: 'L4 Transport', pdu: 'Segment', parts: ['tcp', 'tls', 'data'],
    title: 'TCP header added → Segment',
    text: 'TCP adds source port 50123 (random high port) and destination port 443 (HTTPS), plus sequence numbers for reliability. The 3-way handshake was already done.',
    details: { tcp: 'src 50123 → dst 443' },
  },
  {
    at: 0, layer: 'L3 Network', pdu: 'Packet', parts: ['ip', 'tcp', 'tls', 'data'],
    title: 'IP header added → Packet',
    text: 'IP adds source IP 10.20.5.25 and destination IP 10.1.10.50, and a TTL. The destination is in a different network, so the PC must send it to its default gateway (the branch router).',
    details: { ip: '10.20.5.25 → 10.1.10.50' },
  },
  {
    at: 0, layer: 'L2 Data Link', pdu: 'Frame', parts: ['eth', 'ip', 'tcp', 'tls', 'data', 'fcs'],
    title: 'Ethernet header + trailer → Frame',
    text: 'The PC uses ARP to find the gateway\'s MAC address. The Ethernet header has source MAC = PC and destination MAC = router (not the server!). The FCS trailer is for error checking.',
    details: { eth: 'PC MAC → Router MAC', fcs: 'CRC' },
  },
  {
    at: 0, to: 1, layer: 'L1 Physical', pdu: 'Bits', parts: ['eth', 'ip', 'tcp', 'tls', 'data', 'fcs'], bits: true,
    title: 'Bits on the cable',
    text: 'The NIC turns the frame into electrical signals (1s and 0s) on the copper cable to the switch.',
  },
  {
    at: 1, to: 2, layer: 'L2 Switch', pdu: 'Frame', parts: ['eth', 'ip', 'tcp', 'tls', 'data', 'fcs'],
    title: 'The switch reads the MAC',
    text: 'The switch only reads the destination MAC address, checks its MAC address table and forwards the frame out of the port that connects to the router. It does not look at IP.',
    details: { eth: 'dst = Router MAC' },
  },
  {
    at: 2, to: 3, layer: 'L3 Router', pdu: 'Packet → new Frame', parts: ['eth', 'ip', 'tcp', 'tls', 'data', 'fcs'],
    title: 'The router routes the packet',
    text: 'The router removes the old frame, reads the destination IP, finds the route 10.1.0.0/16 → WAN in its routing table, reduces TTL by 1 and builds a NEW frame for the WAN link. **IP addresses stay the same; MAC addresses change at every hop.**',
    details: { eth: 'new L2 header (WAN)', ip: '10.20.5.25 → 10.1.10.50' },
  },
  {
    at: 3, to: 4, layer: 'WAN', pdu: 'Packet', parts: ['eth', 'ip', 'tcp', 'tls', 'data', 'fcs'],
    title: 'Across the MPLS WAN',
    text: 'The service provider network carries the packet from the branch to the data centre. It is a private network, and the data is still encrypted by TLS.',
  },
  {
    at: 4, to: 5, layer: 'L3/L4 Firewall', pdu: 'Packet', parts: ['eth', 'ip', 'tcp', 'tls', 'data', 'fcs'],
    title: 'The firewall checks the rule',
    text: 'The stateful firewall checks: source 10.20.0.0/16 → destination 10.1.10.50, TCP port 443? A rule allows it, so it forwards the packet and remembers the connection for the reply.',
    details: { ip: 'src OK', tcp: 'dst 443 allowed' },
  },
  {
    at: 5, layer: 'L1 → L2 (decapsulation)', pdu: 'Frame', parts: ['ip', 'tcp', 'tls', 'data'],
    title: 'Server: remove the frame',
    text: 'The server NIC receives bits and rebuilds the frame. The destination MAC is its own and the FCS is correct, so it removes the Ethernet header and trailer.',
  },
  {
    at: 5, layer: 'L3 (decapsulation)', pdu: 'Packet', parts: ['tcp', 'tls', 'data'],
    title: 'Server: remove the IP header',
    text: 'The destination IP 10.1.10.50 is the server\'s own IP, so it removes the IP header and passes the segment up to TCP.',
  },
  {
    at: 5, layer: 'L4 (decapsulation)', pdu: 'Segment', parts: ['tls', 'data'],
    title: 'Server: port 443 → web service',
    text: 'TCP sees destination port 443 and gives the data to the web server process. TCP sends an ACK back to say "received".',
  },
  {
    at: 5, layer: 'L7 Application', pdu: 'Data', parts: ['data'],
    title: 'The app gets the request',
    text: 'TLS decrypts the data. The web app reads "GET /login" and sends back the login page. The reply travels back the same way with the ports swapped (443 → 50123).',
    details: { data: 'GET /login HTTP/1.1' },
  },
];
