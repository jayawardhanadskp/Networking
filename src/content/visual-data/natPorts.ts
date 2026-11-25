/** NAT/PAT animation data. Uses documentation IP ranges (RFC 5737) for public addresses. */
export const natPublicIp = '198.51.100.7';
export const natServer = '203.0.113.80:443';

export const natHosts = [
  { id: 'A', ip: '10.20.5.10' },
  { id: 'B', ip: '10.20.5.11' },
  { id: 'C', ip: '10.20.5.12' },
];

export interface NatRow {
  inside: string;
  global: string;
  outside: string;
}

export interface NatStep {
  text: string;
  host?: string; // A/B/C
  direction?: 'out' | 'in';
  before?: string; // packet before translation
  after?: string; // packet after translation
  addRow?: NatRow;
  highlightRow?: number;
}

export const natSteps: NatStep[] = [
  {
    text: 'Three branch PCs have **private IPs** (10.x.x.x). Private IPs cannot travel on the Internet. The router has only **one public IP**: 198.51.100.7. Press Next.',
  },
  {
    host: 'A', direction: 'out',
    before: 'src 10.20.5.10:50001 → dst 203.0.113.80:443',
    after: 'src 198.51.100.7:50001 → dst 203.0.113.80:443',
    addRow: { inside: '10.20.5.10:50001', global: '198.51.100.7:50001', outside: '203.0.113.80:443' },
    text: 'PC A sends a packet. The router **replaces the source IP** with its public IP and writes the mapping in the NAT table.',
  },
  {
    host: 'B', direction: 'out',
    before: 'src 10.20.5.11:50001 → dst 203.0.113.80:443',
    after: 'src 198.51.100.7:50002 → dst 203.0.113.80:443',
    addRow: { inside: '10.20.5.11:50001', global: '198.51.100.7:50002', outside: '203.0.113.80:443' },
    text: 'PC B uses the **same source port 50001**. That public port is already used, so the router changes the port to 50002. This is **PAT** (Port Address Translation): many PCs share one IP, the port number keeps them apart.',
  },
  {
    host: 'C', direction: 'out',
    before: 'src 10.20.5.12:51000 → dst 203.0.113.80:443',
    after: 'src 198.51.100.7:51000 → dst 203.0.113.80:443',
    addRow: { inside: '10.20.5.12:51000', global: '198.51.100.7:51000', outside: '203.0.113.80:443' },
    text: 'PC C also goes out. Now three PCs share one public IP.',
  },
  {
    host: 'B', direction: 'in',
    before: 'src 203.0.113.80:443 → dst 198.51.100.7:50002',
    after: 'src 203.0.113.80:443 → dst 10.20.5.11:50001',
    highlightRow: 1,
    text: 'A reply comes back to **198.51.100.7:50002**. The router looks in the NAT table, finds row 2 and sends it to **PC B (10.20.5.11:50001)**.',
  },
  {
    text: 'If a packet arrives from the Internet with **no matching row**, the router drops it (unless you configure static NAT / port forwarding). This is why NAT also hides internal hosts. Types: **Static NAT** = 1 private ↔ 1 public (e.g. a web server in the DMZ). **Dynamic NAT** = private IPs use a pool of public IPs. **PAT / NAT overload** = many private ↔ one public, using ports.',
  },
];

/** Port grid data (well-known ports). `must` = most common in interviews. */
export interface PortInfo {
  port: string;
  proto: 'TCP' | 'UDP' | 'TCP/UDP';
  name: string;
  use: string;
  must?: boolean;
}

export const ports: PortInfo[] = [
  { port: '20/21', proto: 'TCP', name: 'FTP', use: 'File transfer (21 = control, 20 = data in active mode). Not encrypted.', must: true },
  { port: '22', proto: 'TCP', name: 'SSH / SFTP / SCP', use: 'Secure remote login to servers and network devices; secure file copy.', must: true },
  { port: '23', proto: 'TCP', name: 'Telnet', use: 'Old remote login. Clear text — do not use in a bank.', must: true },
  { port: '25', proto: 'TCP', name: 'SMTP', use: 'Sending email between mail servers.', must: true },
  { port: '53', proto: 'TCP/UDP', name: 'DNS', use: 'Name lookup on UDP; TCP for zone transfers and large replies.', must: true },
  { port: '67/68', proto: 'UDP', name: 'DHCP', use: 'Server listens on 67, client on 68. Automatic IP configuration.', must: true },
  { port: '69', proto: 'UDP', name: 'TFTP', use: 'Simple file transfer, used to back up/load switch and router configs or IP phone firmware.' },
  { port: '80', proto: 'TCP', name: 'HTTP', use: 'Web traffic, not encrypted.', must: true },
  { port: '88', proto: 'TCP/UDP', name: 'Kerberos', use: 'Active Directory authentication.' },
  { port: '110', proto: 'TCP', name: 'POP3', use: 'Download email from a mailbox.' },
  { port: '123', proto: 'UDP', name: 'NTP', use: 'Time sync. Correct time is vital for logs, Kerberos and transactions.', must: true },
  { port: '143', proto: 'TCP', name: 'IMAP', use: 'Read email kept on the server.' },
  { port: '161/162', proto: 'UDP', name: 'SNMP', use: '161 = polling devices, 162 = traps (alerts) to the monitoring server.', must: true },
  { port: '389', proto: 'TCP/UDP', name: 'LDAP', use: 'Directory queries (Active Directory).' },
  { port: '443', proto: 'TCP', name: 'HTTPS', use: 'Web traffic encrypted with TLS. Also used by SSL VPNs.', must: true },
  { port: '445', proto: 'TCP', name: 'SMB', use: 'Windows file sharing. Should never be open to the Internet (WannaCry).', must: true },
  { port: '465/587', proto: 'TCP', name: 'SMTP (secure / submission)', use: 'Email clients sending mail with TLS.' },
  { port: '500', proto: 'UDP', name: 'IKE (IPsec)', use: 'Builds IPsec VPN tunnels (key exchange).', must: true },
  { port: '514', proto: 'UDP', name: 'Syslog', use: 'Devices send log messages to a central log server / SIEM.', must: true },
  { port: '636', proto: 'TCP', name: 'LDAPS', use: 'LDAP over TLS.' },
  { port: '1433', proto: 'TCP', name: 'MS SQL Server', use: 'Microsoft SQL Server database.' },
  { port: '1521', proto: 'TCP', name: 'Oracle DB', use: 'Oracle database listener.' },
  { port: '1812/1813', proto: 'UDP', name: 'RADIUS', use: 'Authentication (1812) and accounting (1813) for VPN, Wi-Fi, 802.1X.' },
  { port: '3306', proto: 'TCP', name: 'MySQL', use: 'MySQL / MariaDB database.', must: true },
  { port: '3389', proto: 'TCP', name: 'RDP', use: 'Windows Remote Desktop. Never expose directly to the Internet.', must: true },
  { port: '4500', proto: 'UDP', name: 'IPsec NAT-T', use: 'IPsec when a NAT device is in the path.' },
  { port: '5432', proto: 'TCP', name: 'PostgreSQL', use: 'PostgreSQL database.' },
  { port: '6379', proto: 'TCP', name: 'Redis', use: 'Redis in-memory data store (you know this one!).' },
  { port: '8080', proto: 'TCP', name: 'HTTP alternate', use: 'Proxies and app servers like Tomcat / Spring Boot dev.' },
  { port: '49', proto: 'TCP', name: 'TACACS+', use: 'Admin login and command authorisation for network devices.' },
];
