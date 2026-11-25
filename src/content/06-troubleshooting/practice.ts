import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'What is the most important question to ask at the start of most outages?', options: ['What is your password?', 'What changed recently?', 'Which browser do you use?', 'When did you buy the PC?'], answer: 1, explain: 'Many outages follow a **change**.' },
  { q: 'In the bottom-up approach, what do you check first?', options: ['Application logs', 'DNS', 'Physical layer: cables, power, link lights', 'Firewall rules'], answer: 2, explain: 'Bottom-up starts at **Layer 1**.' },
  { q: 'A PC has IP 169.254.10.5. Which layer/service should you focus on?', options: ['DNS', 'DHCP / switch port / VLAN', 'Application server', 'SMTP'], answer: 1, explain: 'APIPA = no DHCP reply → check **DHCP, cable, port, VLAN, relay**.' },
  { q: 'Which ping result indicates a routing loop?', options: ['Request timed out', 'Destination host unreachable', 'TTL expired in transit', 'Reply from …'], answer: 2, explain: '**TTL expired in transit** = packet looped until TTL reached zero.' },
  { q: 'Which ping result usually means a LOCAL problem on the PC?', options: ['General failure', 'Reply from 10.1.10.50', 'TTL expired in transit', 'Request timed out'], answer: 0, explain: '**General failure / transmit failed** points to the local NIC, IP or firewall.' },
  { q: 'Which Windows command continuously pings until stopped?', options: ['ping -c', 'ping -t', 'ping -n 4', 'ping -l'], answer: 1, explain: '**ping -t** (Ctrl+C to stop). On Linux ping is continuous by default; -c sets a count.' },
  { q: 'Which Windows tool combines traceroute with packet-loss statistics per hop?', options: ['pathping', 'netstat', 'nbtstat', 'arp'], answer: 0, explain: '**pathping** traces the path and measures loss at each hop.' },
  { q: 'Which command releases and renews a DHCP address on Windows?', options: ['ipconfig /flushdns', 'ipconfig /release then ipconfig /renew', 'arp -d', 'netsh reset'], answer: 1, explain: '**/release** then **/renew**.' },
  { q: 'Which Linux command shows listening ports and processes?', options: ['ip route', 'ss -tulnp', 'dig', 'arp -a'], answer: 1, explain: '**ss -tulnp** (TCP, UDP, listening, numeric, process).' },
  { q: 'How do you find which process is using port 443 on Windows?', options: ['netstat -ano | findstr :443, then check the PID', 'ipconfig /all', 'tracert 443', 'nslookup 443'], answer: 0, explain: '**netstat -ano** shows the PID; match it in Task Manager or tasklist.' },
  { q: 'What does "NXDOMAIN" from nslookup mean?', options: ['DNS server is down', 'The name does not exist in DNS', 'The IP is wrong', 'The firewall blocks port 53'], answer: 1, explain: '**NXDOMAIN** = non-existent domain/record.' },
  { q: 'Which command can help detect an IP address conflict on the local network?', options: ['arp -a', 'tracert', 'nslookup', 'route print'], answer: 0, explain: '**arp -a** shows IP→MAC mappings; a changing MAC for one IP suggests a conflict.' },
  { q: 'Which port and protocol do SNMP traps use?', options: ['UDP 161', 'UDP 162', 'TCP 514', 'UDP 123'], answer: 1, explain: 'Traps → **UDP 162**; polling → UDP 161.' },
  { q: 'Why should SNMPv1/v2c be avoided?', options: ['They are too fast', 'Community strings are sent in clear text with no encryption', 'They only work on Linux', 'They use TCP'], answer: 1, explain: 'v1/v2c have no encryption; use **SNMPv3**.' },
  { q: 'Syslog severity 3 is…', options: ['Emergency', 'Error', 'Warning', 'Debug'], answer: 1, explain: '0 Emergency, 1 Alert, 2 Critical, **3 Error**, 4 Warning, 5 Notice, 6 Info, 7 Debug.' },
  { q: 'Which step comes right after implementing a fix?', options: ['Document', 'Verify full system functionality', 'Establish a theory', 'Close the ticket without checking'], answer: 1, explain: 'Implement → **Verify** → Document.' },
  { q: 'Only one branch is slow; all others are fine. What do you suspect first?', options: ['Core banking database', 'That branch\'s WAN link or local devices (maybe running on backup link)', 'DNS for the whole bank', 'The Internet banking site'], answer: 1, explain: 'Problem limited to one site → look at **that site**: its WAN link, router, LAN.' },
];

export const flashcards: Flashcard[] = [
  { front: '7 troubleshooting steps', back: 'Identify → Theory → Test → Plan → Implement → Verify → Document.', tag: 'definition' },
  { front: 'Bottom-up vs top-down', back: '**Bottom-up**: start at L1 (cables) and go up. **Top-down**: start at the app and go down. **Divide & conquer**: start in the middle.', tag: 'definition' },
  { front: 'Ping ladder', back: '127.0.0.1 → own IP → gateway → remote IP → remote name.', tag: 'command' },
  { front: '"Request timed out"', back: 'No reply: host down, firewall blocking ICMP, or no return route.', tag: 'fact' },
  { front: '"Destination host unreachable"', back: 'No ARP reply on the local subnet, or a router has no route to the destination.', tag: 'fact' },
  { front: '"TTL expired in transit"', back: 'Routing loop.', tag: 'fact' },
  { front: 'ipconfig /all', back: 'Shows IP, mask, gateway, **DNS servers**, MAC, DHCP server, lease times.', tag: 'command' },
  { front: 'ipconfig /flushdns', back: 'Clears the Windows DNS resolver cache.', tag: 'command' },
  { front: 'tracert vs traceroute', back: '**tracert** (Windows) uses ICMP. **traceroute** (Linux) uses UDP by default. Both use increasing TTL.', tag: 'command' },
  { front: 'nslookup name server', back: 'Query a specific DNS server, e.g. `nslookup cbs.bank.local 10.1.20.11`. Linux: `dig @server name`.', tag: 'command' },
  { front: 'netstat -ano', back: 'Windows: all connections and listening ports with **PID**. Linux equivalent: `ss -tulnp`.', tag: 'command' },
  { front: 'Test-NetConnection', back: 'PowerShell: `Test-NetConnection host -Port 443` → TcpTestSucceeded True/False. Linux: `nc -zv host 443`.', tag: 'command' },
  { front: 'arp -a / arp -d', back: 'Show / clear the ARP cache (IP → MAC). Linux: `ip neigh`.', tag: 'command' },
  { front: 'Linux network commands', back: '`ip a` addresses · `ip route` routes · `ip link` interfaces · `ss -tulnp` ports · `dig` DNS · `traceroute` path.', tag: 'command' },
  { front: 'Cisco show commands', back: '`show ip interface brief` · `show interfaces` · `show vlan brief` · `show mac address-table` · `show ip route` · `show running-config` · `show log`', tag: 'command' },
  { front: 'SNMP ports & versions', back: 'Poll UDP 161, traps UDP 162. v1/v2c community strings (clear text). **v3** = auth + encryption.', tag: 'fact' },
  { front: 'Syslog severity levels', back: '0 Emergency · 1 Alert · 2 Critical · 3 Error · 4 Warning · 5 Notice · 6 Informational · 7 Debug\n\n"**E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**ce cream **D**aily"', tag: 'fact' },
  { front: 'NTP', back: '**Network Time Protocol**, UDP 123. Synced clocks for logs, Kerberos/AD, certificates, transactions.', tag: 'acronym' },
  { front: 'NetFlow', back: 'Exports traffic flow records (who talks to whom, how much) for analysis and capacity planning.', tag: 'definition' },
];

export const interview: InterviewQA[] = [
  {
    type: 'scenario',
    q: 'A branch calls and says "the system is down". What do you do?',
    answer: `1. **Gather facts and log a ticket**: which branch, which system (core banking only? everything?), since when, the exact error, how many users, and whether anything changed (power cut, new equipment).
2. **Check the scope** using the monitoring system: is it one PC, the whole branch, or many branches?
3. **One PC** → local checks: cable, \`ipconfig /all\`, ping ladder, the application.
4. **Whole branch** → WAN links (primary and backup), branch router/firewall, power/UPS, switch. If the provider link is down, raise a ticket with the provider and confirm the backup link is working.
5. **Many branches** → it's a **central issue** (data centre network, firewall, core banking servers, DNS or provider). I would **escalate immediately** as a major incident.
6. Arrange a **workaround** if possible (backup link, DR, manual procedure).
7. **Communicate** regular updates to the branch, service desk and management.
8. After the fix, **verify** with the branch, **document** the cause and solution, and do a root-cause analysis for major incidents.`,
    tips: ['Say "first I would check the scope" early — it shows structured thinking.', 'Mention customers waiting at the counter: urgency + communication.', 'As a junior, it is OK to say you would escalate to senior engineers — show you know when.'],
  },
  {
    type: 'technical',
    q: 'Describe your troubleshooting methodology.',
    answer: `I follow a structured approach: **identify** the problem (symptoms, scope, what changed), form a **theory** of the most likely cause, **test** it, **plan** the fix with change approval if it affects production, **implement** it or escalate, **verify** that everything works with the user, and **document** it in the ticket and knowledge base.

To find the faulty layer I usually go **bottom-up** using the OSI model — physical, data link, network, transport, application — or divide and conquer by pinging the gateway first. The question "what changed?" often finds the answer fastest.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between "Request timed out" and "Destination host unreachable" in ping?',
    answer: `**Request timed out** means the ping was sent but **no reply came back** in time — the host may be down, a firewall may be blocking ICMP, or the return path is missing.

**Destination host unreachable** means the packet could not even be delivered: if the message comes from my own PC, it usually means ARP failed for a host on the local subnet; if it comes from a router's IP, that router has **no route** to the destination.

Also: "TTL expired in transit" means a routing loop, and "General failure" means a local problem on the PC.`,
  },
  {
    type: 'scenario',
    q: 'A user can open websites but cannot access a shared folder on a file server. How do you troubleshoot?',
    answer: `The network generally works, so I focus on the path to the server and the service:

1. Ping the file server by **name and IP** — DNS OK? Reachable?
2. \`Test-NetConnection fileserver -Port 445\` — is **SMB** reachable, or blocked by a firewall/ACL?
3. Check if other users can access the share — if not, check the **server** (is the Server service running, disk space, event logs).
4. If only this user: check **share and NTFS permissions** and their **AD group membership**; maybe they need to log off/on to get a new group token; check the account isn't locked.
5. Check the mapped drive path is correct, and clear cached credentials (Credential Manager).
6. Fix, verify, document.`,
  },
  {
    type: 'technical',
    q: 'What is SNMP and how is it used for monitoring?',
    answer: `SNMP lets a central **monitoring system (NMS)** collect information from network devices and servers. The NMS **polls** devices on **UDP 161** for values like interface status, bandwidth, CPU and memory, organised in the **MIB** by OIDs. Devices also send **traps** on **UDP 162** when something important happens, like an interface going down, so the team is alerted immediately.

SNMP v1 and v2c use community strings in clear text, so in a bank we should use **SNMPv3**, which adds authentication and encryption. Together with **syslog** for logs and **NTP** for accurate time, it gives full visibility.`,
  },
  {
    type: 'technical',
    q: 'Which commands do you use most for network troubleshooting?',
    answer: `On Windows: \`ipconfig /all\` (IP, gateway, DNS), \`ping\` and \`tracert\`/\`pathping\` (reachability and path), \`nslookup\` (DNS), \`netstat -ano\` (connections and listening ports), \`arp -a\` (IP-to-MAC), and PowerShell **\`Test-NetConnection -Port\`** to test a specific service port.

On Linux: \`ip a\`, \`ip route\`, \`ss -tulnp\`, \`dig\`, \`traceroute\`, \`curl -v\` and \`nc -zv\`.

On Cisco devices: \`show ip interface brief\`, \`show interfaces\`, \`show vlan brief\`, \`show mac address-table\`, \`show ip route\` and \`show log\`. And Wireshark/tcpdump when I need to see the actual packets.`,
    tips: ['Mention you used Linux/Docker commands as a developer (e.g. checking container ports, curl to health endpoints).'],
  },
  {
    type: 'scenario',
    q: 'Users at one branch say the core banking system is very slow. Others are fine. What do you check?',
    answer: `Since only one branch is affected, I focus on **that branch's path**:

1. Check monitoring: is the branch on its **backup link** (e.g. 4G) because the primary failed? What is the **bandwidth utilisation** of the link?
2. Run \`ping -t\` to the CBS server for latency, jitter and loss, and \`tracert\`/\`pathping\` to see where delay starts.
3. Look for something using the bandwidth — large downloads, Windows updates, a backup, a looping device (check the switch for errors or a broadcast storm).
4. Check router/interface errors (CRC, drops) — maybe a bad cable or duplex issue.
5. If the provider link is degraded, raise a ticket with the provider with test results.
6. Use **QoS** to protect core banking traffic, and schedule big transfers after hours.`,
  },
  {
    type: 'technical',
    q: 'Why is NTP important in a bank?',
    answer: `NTP keeps all servers and network devices on the **same accurate time**. This matters because:
- **Logs** from different systems must line up during incident investigations and audits.
- **Active Directory / Kerberos** authentication fails if clocks differ by more than 5 minutes (default).
- **Transactions** have timestamps; certificates have validity times; scheduled jobs and backups depend on time.
Banks usually have internal NTP servers synced to reliable sources, and all devices sync to them.`,
  },
];
