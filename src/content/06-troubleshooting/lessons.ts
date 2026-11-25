import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'method',
    title: 'A troubleshooting method',
    analogy:
      'A good doctor does not give medicine first. They **ask questions**, **check symptoms**, form a **theory**, **test** it, give **treatment**, **check you are better**, and **write notes** in your file. IT troubleshooting is the same.',
    body: `Interview panels love a **structured approach**. A common model (CompTIA):

1. **Identify the problem** — ask questions: who, what, when, what changed? One user or many? Reproduce it.
2. **Establish a theory** of probable cause (start with the simple/obvious).
3. **Test the theory** — confirmed? If not, new theory or **escalate**.
4. **Plan the fix** — consider impact; get a **change approval** if needed.
5. **Implement** the fix (or escalate).
6. **Verify** full functionality — ask the user; add **preventive** measures.
7. **Document** findings, actions and outcome (ticket / knowledge base).

Approaches to find the faulty layer:
- **Bottom-up** — start at Layer 1 (cables) and move up. Good when you suspect a physical/network fault.
- **Top-down** — start at the application. Good when the network seems fine.
- **Divide and conquer** — start in the middle (e.g. ping the gateway) and go up or down depending on the result.
- **Follow the path** — trace the traffic hop by hop.

Golden question: **"What changed?"** Most outages come after a change.`,
    visuals: [
      {
        kind: 'flow',
        title: 'The 7 troubleshooting steps',
        steps: [
          { label: 'Identify', icon: '❓', detail: 'Gather info: symptoms, error message, time, scope (one user / branch / everyone), **recent changes**.', tone: 'blue' },
          { label: 'Theory', icon: '💭', detail: 'List probable causes; start with the most likely and easiest to check ("Is it plugged in?").', tone: 'purple' },
          { label: 'Test', icon: '🧪', detail: 'Use tools (ping, logs, nslookup…) to confirm or reject the theory. If stuck → escalate.', tone: 'amber' },
          { label: 'Plan', icon: '📝', detail: 'Plan the fix, check the impact and rollback; get **change approval** for production.', tone: 'teal' },
          { label: 'Implement', icon: '🔧', detail: 'Apply the fix (or escalate to the right team/vendor).', tone: 'indigo' },
          { label: 'Verify', icon: '✅', detail: 'Confirm with the user that everything works; add monitoring or prevention.', tone: 'green' },
          { label: 'Document', icon: '📚', detail: 'Update the ticket and knowledge base: cause, fix, lessons learned.', tone: 'slate' },
        ],
      },
    ],
    bank: `In a bank, the "plan" and "implement" steps on production systems usually need an **approved change** (or an **emergency change** during an outage), and communication to the service desk and affected branches. Never "just try things" on a live core banking server.`,
    remember: [
      '7 steps: **Identify → Theory → Test → Plan → Implement → Verify → Document**.',
      'Approaches: **bottom-up**, top-down, divide and conquer, follow the path.',
      'Always ask: **scope** (one or many?) and **what changed?**',
    ],
    check: [
      {
        q: 'What is usually the first step in troubleshooting?',
        options: ['Reboot the server', 'Identify the problem and gather information', 'Replace the cable', 'Document the solution'],
        answer: 1,
        explain: 'Start by **identifying** the problem: symptoms, scope and recent changes.',
      },
      {
        q: 'Which approach starts by testing the middle layer, then moves up or down?',
        options: ['Top-down', 'Bottom-up', 'Divide and conquer', 'Trial and error'],
        answer: 2,
        explain: '**Divide and conquer** starts in the middle (e.g. ping the gateway).',
      },
    ],
  },
  {
    id: 'bottom-up',
    title: 'The bottom-up approach, layer by layer',
    analogy:
      'If a house has no water, first check **the main valve and pipes** (physical), then the **pump** (network), then the **tap** (application). Do not repaint the kitchen first!',
    body: `| Layer | What to check | Tools / commands |
|---|---|---|
| **L1 Physical** | Cable plugged in? Link light? Power? Fibre clean? Interface errors? | Look! \`show interfaces\` (errors, CRC), cable tester |
| **L2 Data Link** | Port up/up? Correct **VLAN**? Port security shut it? Duplex mismatch? MAC learned? | \`show interfaces status\`, \`show vlan brief\`, \`show mac address-table\` |
| **L3 Network** | Correct IP/mask/gateway? DHCP OK? Can you ping the gateway? Route exists? | \`ipconfig /all\`, \`ping\`, \`tracert\`, \`show ip route\` |
| **L4 Transport** | Is the port open/listening? Firewall/ACL blocking? | \`Test-NetConnection -Port\`, \`netstat -ano\`, firewall logs |
| **L7 Application** | DNS works? Service running? Credentials? Certificate valid? App logs? | \`nslookup\`, services, event logs, app logs |

Quick ping ladder from a PC: **127.0.0.1** (TCP/IP stack) → **own IP** (NIC) → **gateway** (LAN) → **remote server IP** (routing/WAN) → **server by name** (DNS).`,
    visuals: [
      {
        kind: 'topology',
        title: 'The ping ladder',
        width: 360,
        height: 190,
        nodes: [
          { id: 'pc', label: 'Teller PC', icon: 'pc', x: 35, y: 100, sub: '10.20.5.25', info: 'Start here.' },
          { id: 'sw', label: 'Switch', icon: 'switch', x: 105, y: 100, info: 'L2 access switch.' },
          { id: 'gw', label: 'Gateway', icon: 'router', x: 175, y: 100, sub: '10.20.5.1', info: 'Branch router.' },
          { id: 'wan', label: 'WAN', icon: 'cloud', x: 245, y: 100, info: 'MPLS / VPN.' },
          { id: 'srv', label: 'CBS server', icon: 'server', x: 320, y: 60, sub: '10.1.10.50', info: 'Target application server.' },
          { id: 'dns', label: 'DNS', icon: 'dns', x: 320, y: 150, sub: '10.1.20.10', info: 'Internal DNS server.' },
        ],
        links: [
          { from: 'pc', to: 'sw' },
          { from: 'sw', to: 'gw' },
          { from: 'gw', to: 'wan' },
          { from: 'wan', to: 'srv' },
          { from: 'wan', to: 'dns' },
        ],
        steps: [
          { text: '`ping 127.0.0.1` — tests the PC\'s own **TCP/IP stack**. Fails → reinstall/repair network stack.', highlight: ['pc'] },
          { text: '`ping 10.20.5.25` (own IP) — tests the **NIC and its IP config**. Check `ipconfig /all`: is it 169.254.x.x?', highlight: ['pc'], tone: 'blue' },
          { text: '`ping 10.20.5.1` (gateway) — tests the **cable, switch port, VLAN and LAN**. Fails → Layer 1/2 problem in the branch.', paths: [['pc', 'sw', 'gw']], packet: 'ping GW', tone: 'amber' },
          { text: '`ping 10.1.10.50` — tests **routing and the WAN** to the data centre. Gateway OK but this fails → WAN/routing/firewall. Use `tracert`.', paths: [['pc', 'sw', 'gw', 'wan', 'srv']], packet: 'ping IP', tone: 'purple' },
          { text: '`ping cbs.bank.local` — tests **DNS**. IP works but name fails → DNS problem (`nslookup`).', paths: [['pc', 'sw', 'gw', 'wan', 'dns']], packet: 'name?', tone: 'green' },
        ],
      },
    ],
    bank: `When a single teller reports a problem, the ping ladder quickly tells you **where** the problem is: PC, branch LAN, WAN, or DC/application. Remember: some servers and firewalls **block ICMP**, so also test the actual service port (e.g. 443).`,
    remember: [
      'Bottom-up: L1 cable/power → L2 port/VLAN → L3 IP/gateway/route → L4 port/firewall → L7 DNS/service/app.',
      'Ping ladder: **127.0.0.1 → own IP → gateway → remote IP → name**.',
      'ICMP may be blocked — also test the **service port**.',
    ],
    check: [
      {
        q: 'A PC can ping its gateway but not the remote server IP. Where is the problem most likely?',
        options: ['The PC\'s network card', 'The cable to the switch', 'Routing / WAN / firewall beyond the gateway', 'DNS'],
        answer: 2,
        explain: 'The LAN works (gateway reachable), so look **beyond the gateway**: WAN, routing or firewall.',
      },
      {
        q: 'Which command tests the local TCP/IP stack only?',
        options: ['ping 8.8.8.8', 'ping 127.0.0.1', 'tracert 10.1.10.50', 'nslookup localhost'],
        answer: 1,
        explain: '**127.0.0.1** is loopback — it never leaves the PC.',
      },
    ],
  },
  {
    id: 'ping-tracert',
    title: 'ping and tracert: reading the results',
    analogy:
      'Reading ping results is like reading **delivery receipts**: "delivered", "no answer", "address does not exist", or "parcel went round in circles".',
    body: `**Useful options**
- Windows: \`ping -t\` (continuous), \`ping -n 50\`, \`ping -l 1400\` (packet size)
- Linux: \`ping -c 4\`
- \`tracert\` (Windows, ICMP) / \`traceroute\` (Linux, UDP by default); \`pathping\` (Windows) = trace + loss per hop.

**What ping messages mean**
| Message | Meaning |
|---|---|
| **Reply from … time=12ms TTL=125** | ✅ Reachable. Time = latency. TTL hints OS & hops (Windows starts 128, Linux 64). |
| **Request timed out** | No reply: host down, **firewall blocking ICMP**, or no return route. |
| **Destination host unreachable** | From your PC: no ARP reply on local subnet. From a router: router has **no route**. |
| **TTL expired in transit** | **Routing loop** (packet bounced until TTL hit 0). |
| **General failure / Transmit failed** | **Local** problem: no IP, NIC disabled, local firewall. |

**Reading tracert**: each line is a hop with 3 times. \`* * *\` = that hop did not reply (it might just block ICMP — only worry if **all following hops** also fail). A big jump in time shows where delay starts.`,
    visuals: [
      {
        kind: 'fields',
        title: 'tracert 10.1.10.50 from a branch (example)',
        rows: [
          { label: 'Hop 1 — branch router', fields: [{ text: '1 ms  1 ms  1 ms', sub: '10.20.5.1', tone: 'green' }] },
          { label: 'Hop 2 — provider PE', fields: [{ text: '9 ms  8 ms  9 ms', sub: '10.255.0.2', tone: 'green' }] },
          { label: 'Hop 3 — provider core', fields: [{ text: '*  *  *', sub: 'no reply (ICMP blocked?)', tone: 'amber' }] },
          { label: 'Hop 4 — DC router', fields: [{ text: '210 ms  198 ms  205 ms', sub: '10.255.0.9 — big delay starts here!', tone: 'red' }] },
          { label: 'Hop 5 — CBS server', fields: [{ text: '207 ms  211 ms  209 ms', sub: '10.1.10.50 — reached', tone: 'red' }] },
        ],
        note: 'Hop 3 not replying is OK because later hops answer. The **delay jumps between hop 2 and hop 4** → check the WAN/provider link to the DC (congestion?).',
      },
    ],
    bank: `"The system is slow at Branch 25." Run \`ping -t 10.1.10.50\` and look for **high or variable time (jitter) and lost replies**. Then \`tracert\` or \`pathping\` to see **which hop** adds the delay. Compare with another branch: if only Branch 25 is slow, suspect its WAN link (maybe it is on the slower 4G backup!).`,
    remember: [
      '"Request timed out" = no reply (down, ICMP blocked, no return route). "Destination host unreachable" = no ARP/route.',
      '"TTL expired in transit" = **routing loop**. "General failure" = **local** PC problem.',
      'In tracert, `* * *` alone is fine if later hops answer; look for where **delay jumps**.',
    ],
    check: [
      {
        q: 'ping shows "TTL expired in transit". What is the likely cause?',
        options: ['DNS failure', 'A routing loop', 'A bad cable on the PC', 'The server is turned off'],
        answer: 1,
        explain: 'The packet kept going around until its TTL reached 0 → **routing loop**.',
      },
      {
        q: 'In tracert, hop 3 shows "* * *" but hops 4 and 5 respond normally. What does this mean?',
        options: ['The path is broken at hop 3', 'Hop 3 probably does not reply to ICMP/traceroute — not a problem', 'DNS is wrong', 'The destination is down'],
        answer: 1,
        explain: 'If later hops answer, traffic passes hop 3 — it just **does not reply** to the probes.',
      },
    ],
  },
  {
    id: 'ipconfig',
    title: 'ipconfig, ifconfig and ip',
    analogy:
      'These commands are your **ID card check**: "What is my address, my street (mask), my nearest post office (gateway), and my phone book (DNS)?"',
    body: `**Windows — ipconfig**
- \`ipconfig\` — IP, mask, gateway
- \`ipconfig /all\` — + MAC, DHCP server, lease, **DNS servers**, hostname
- \`ipconfig /release\` and \`ipconfig /renew\` — get a new DHCP lease
- \`ipconfig /flushdns\` / \`/displaydns\` — DNS cache
- \`route print\` — routing table · PowerShell: \`Get-NetIPConfiguration\`

**Linux**
- \`ip a\` (ip addr) — addresses (\`ifconfig\` is the older command)
- \`ip route\` — routing table / default gateway
- \`ip link\` — interface up/down
- \`cat /etc/resolv.conf\` — DNS servers
- \`nmcli\` — NetworkManager; \`dhclient\` to renew DHCP

What to look for: **169.254.x.x** (no DHCP), **wrong mask**, **missing/wrong gateway**, **wrong DNS**, duplicate IP warnings, interface disabled.`,
    visuals: [
      {
        kind: 'compare',
        title: 'Same job, different OS',
        columns: [
          { label: 'Windows', icon: '🪟', tone: 'blue' },
          { label: 'Linux', icon: '🐧', tone: 'green' },
        ],
        rows: [
          { label: 'Show IP config', values: ['`ipconfig /all`', '`ip a`  (or `ifconfig`)'] },
          { label: 'Routing table', values: ['`route print`', '`ip route`'] },
          { label: 'ARP table', values: ['`arp -a`', '`ip neigh`'] },
          { label: 'Listening ports', values: ['`netstat -ano`', '`ss -tulnp`'] },
          { label: 'DNS lookup', values: ['`nslookup name`', '`dig name`  /  `nslookup`'] },
          { label: 'Trace path', values: ['`tracert`', '`traceroute`  /  `mtr`'] },
          { label: 'Test a port', values: ['`Test-NetConnection host -Port 443`', '`nc -zv host 443`  /  `curl -v`'] },
        ],
      },
    ],
    bank: `A teller PC cannot connect. \`ipconfig /all\` shows IP **10.20.5.57/24**, gateway **10.20.5.1**, DNS **10.1.20.10** — all correct. So the PC config is fine; move on to testing the path (ping the gateway). If you see **169.254.12.7**, focus on DHCP and the switch port/VLAN instead.`,
    remember: [
      '`ipconfig /all` shows IP, mask, gateway, **DNS**, MAC, DHCP server & lease.',
      '`/release` + `/renew` for DHCP; `/flushdns` for DNS cache.',
      'Linux: `ip a`, `ip route`, `ip neigh`, `ss -tulnp`, `/etc/resolv.conf`.',
    ],
    check: [
      {
        q: 'Which Windows command shows the DNS servers configured on the PC?',
        options: ['ipconfig', 'ipconfig /all', 'arp -a', 'netstat -r'],
        answer: 1,
        explain: '**ipconfig /all** shows DNS servers, DHCP server, MAC and lease details.',
      },
      {
        q: 'Which Linux command shows the routing table / default gateway?',
        options: ['ip a', 'ip route', 'ss -tulnp', 'dig'],
        answer: 1,
        explain: '**ip route** shows routes including the default route.',
      },
    ],
  },
  {
    id: 'nslookup',
    title: 'nslookup and dig: testing DNS',
    analogy:
      'If you can\'t reach a friend by name, you check your **phone book**: Is the name there? Is the number correct? Is the phone book itself working?',
    body: `\`nslookup <name>\` asks the configured DNS server and shows **which server answered** and the **IP**.
- \`nslookup cbs.bank.local\` — normal lookup
- \`nslookup cbs.bank.local 10.1.20.11\` — ask a **specific** DNS server (compare two servers)
- \`nslookup 10.1.10.50\` — reverse lookup (PTR)
- \`nslookup -type=mx example.lk\` — other record types
- Linux: \`dig cbs.bank.local\`, \`dig +short\`, \`dig @10.1.20.11 name\`

Interpreting:
- **Correct IP** → DNS is fine; problem is elsewhere (port, app).
- **Non-existent domain (NXDOMAIN)** → record missing or typo.
- **Wrong/old IP** → stale record or cache → \`ipconfig /flushdns\`, check the DNS record/TTL.
- **Request timed out / server failed** → DNS server unreachable or down.
- "Non-authoritative answer" = answer came from a cache (normal).`,
    visuals: [
      {
        kind: 'flow',
        title: 'DNS troubleshooting path',
        steps: [
          { label: 'Ping IP works?', icon: '1', detail: 'If ping by IP works but by name fails → focus on DNS.', tone: 'blue' },
          { label: 'nslookup name', icon: '2', detail: 'Which server answered? What IP? Error (timeout/NXDOMAIN)?', tone: 'purple' },
          { label: 'Check client DNS', icon: '3', detail: '`ipconfig /all` — are the DNS server IPs correct (from DHCP)?', tone: 'amber' },
          { label: 'Flush cache', icon: '4', detail: '`ipconfig /flushdns` — remove a stale cached answer. Check the hosts file too.', tone: 'teal' },
          { label: 'Ask another server', icon: '5', detail: '`nslookup name <2nd DNS>` — if one server is wrong, it is a server/replication issue.', tone: 'indigo' },
          { label: 'Check the record', icon: '6', detail: 'On the DNS server: does the A record exist and point to the correct IP? Recent change? TTL?', tone: 'green' },
        ],
      },
    ],
    bank: `After a server migration, the core banking app moved from 10.1.10.50 to 10.1.10.60. Some branches still go to the old IP → their DNS answers are **cached** (TTL) or a secondary DNS server did not replicate. Fix: correct the record, check AD-integrated DNS replication, flush caches. Lesson: **lower the TTL before a planned migration**.`,
    remember: [
      '`nslookup name [server]` shows who answered and the IP; `dig` on Linux.',
      'NXDOMAIN = name not found; timeout = DNS server unreachable; wrong IP = stale record/cache.',
      'Fix steps: check client DNS settings, `ipconfig /flushdns`, compare servers, check the record.',
    ],
    check: [
      {
        q: 'How do you ask a specific DNS server (10.1.20.11) for a name with nslookup?',
        options: ['nslookup -server name', 'nslookup name 10.1.20.11', 'nslookup /all name', 'ping 10.1.20.11 name'],
        answer: 1,
        explain: '**nslookup <name> <server>** sends the query to that server.',
      },
      {
        q: 'nslookup returns an old IP for a server that was migrated yesterday. What is a likely cause?',
        options: ['Bad cable', 'Cached/stale DNS record (TTL) or replication delay', 'STP loop', 'Wrong VLAN'],
        answer: 1,
        explain: 'Old answers are usually **cached** or a DNS server has not **replicated** the change.',
      },
    ],
  },
  {
    id: 'netstat-ports',
    title: 'netstat, arp and testing ports',
    analogy:
      'Ping tells you the **building** is there. Port tests tell you whether the **office door** (service) is open and whether a **guard** (firewall) is blocking it.',
    body: `**Is the service listening?** (on the server)
- Windows: \`netstat -ano | findstr :443\` → shows LISTENING and the **PID**; match PID in Task Manager / \`tasklist\`.
- Linux: \`ss -tulnp\` (or \`netstat -tulnp\`) → port, state, process.

**Can the client reach the port?**
- PowerShell: \`Test-NetConnection cbs.bank.local -Port 443\` (TcpTestSucceeded True/False)
- Linux: \`nc -zv host 443\`, \`curl -v https://host\`
- (old) \`telnet host 443\`

**netstat states**: LISTENING (waiting), ESTABLISHED (connected), TIME_WAIT (closing), SYN_SENT (trying — **no reply** → firewall/down).

**arp -a** — shows IP → MAC mappings. Use it to find **IP conflicts** (two MACs for one IP over time) or check the gateway MAC. \`arp -d *\` clears the cache.

Also useful: \`tcpdump\` / **Wireshark** to capture packets when everything else looks fine.`,
    visuals: [
      {
        kind: 'flow',
        title: '"I can ping the server but the app does not open"',
        steps: [
          { label: 'Server listening?', icon: '🖥️', detail: 'On the server: `netstat -ano | findstr :443` (or `ss -tulnp`). Not listening → the **service is stopped** or bound to another port.', tone: 'blue' },
          { label: 'Local firewall?', icon: '🧱', detail: 'Server\'s **host firewall** (Windows Defender Firewall / iptables) allows 443?', tone: 'amber' },
          { label: 'Test from client', icon: '💻', detail: '`Test-NetConnection server -Port 443` → False? Something in the path blocks it.', tone: 'purple' },
          { label: 'Network firewall', icon: '🛡️', detail: 'Check firewall/ACL **logs** for drops from the client subnet to server:443. Client stuck in **SYN_SENT** = no reply.', tone: 'red' },
          { label: 'App layer', icon: '📜', detail: 'Port open but error page? Check **certificate**, app logs, database connection, credentials.', tone: 'green' },
        ],
      },
    ],
    bank: `As a developer you already do this: "Is my Spring Boot app listening on 8080?" It is the same skill. In the bank, after a firewall change, branches cannot open an app. \`Test-NetConnection\` from a branch PC shows **TcpTestSucceeded: False** while it works from the DC → the new firewall rule is missing the branch subnet.`,
    remember: [
      'Server listening? `netstat -ano | findstr :PORT` (Windows) / `ss -tulnp` (Linux).',
      'Client reach port? **`Test-NetConnection host -Port N`** / `nc -zv` / `curl -v`.',
      'SYN_SENT stuck = no reply (firewall/down). `arp -a` helps find IP conflicts.',
    ],
    check: [
      {
        q: 'Which PowerShell command tests whether TCP port 443 on a server is reachable?',
        options: ['Get-Process 443', 'Test-NetConnection server -Port 443', 'ipconfig /port 443', 'nslookup server 443'],
        answer: 1,
        explain: '**Test-NetConnection** (tnc) with -Port tests a TCP connection.',
      },
      {
        q: 'A connection shows state SYN_SENT for a long time. What does that suggest?',
        options: ['Connection is working', 'No reply from the server — firewall drop or service down', 'DNS failure', 'The connection is closing normally'],
        answer: 1,
        explain: 'The client sent SYN but never got SYN-ACK.',
      },
    ],
  },
  {
    id: 'snmp-syslog',
    title: 'Monitoring: SNMP, syslog and NTP',
    analogy:
      'A hospital has **monitors beside every bed** that are checked regularly (SNMP polling), plus **alarms** that ring when something is wrong (SNMP traps), and **nurses writing notes** in a diary (syslog). All clocks must show **the same time** (NTP), or the notes make no sense.',
    body: `**SNMP (Simple Network Management Protocol)**
- The **NMS** (monitoring server) **polls** devices (UDP **161**) for CPU, memory, interface status, traffic.
- Devices send **traps** (alerts) to the NMS (UDP **162**), e.g. "interface down".
- Data is organised in the **MIB** with **OIDs**.
- Versions: **v1/v2c** use a "community string" in **clear text** (like a password). **v3** adds **authentication and encryption** → use **SNMPv3**.

**Syslog** (UDP **514**, or TCP/TLS) — devices and servers send **log messages** to a central server/**SIEM**.
Severity levels **0–7**: 0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning, 5 Notice, 6 Informational, 7 Debug. (Lower number = more serious.)

**NTP** (UDP **123**) — keeps all clocks in sync. Without correct time, you cannot correlate logs, Kerberos/AD authentication fails, and certificates/transactions may have problems.

Also: **NetFlow/IPFIX** shows **who talks to whom** and how much (traffic analysis).`,
    visuals: [
      {
        kind: 'topology',
        title: 'Central monitoring in a bank',
        width: 360,
        height: 220,
        nodes: [
          { id: 'nms', label: 'NMS', icon: 'monitor', x: 70, y: 50, sub: 'SNMP monitoring', info: '**Network Monitoring System** (e.g. PRTG, Zabbix, SolarWinds): polls devices, shows dashboards, sends alerts by email/SMS.' },
          { id: 'siem', label: 'Syslog / SIEM', icon: 'server', x: 180, y: 50, info: 'Central log store; the **SIEM** correlates events for security.' },
          { id: 'ntp', label: 'NTP server', icon: 'server', x: 290, y: 50, info: 'All devices sync time here (UDP 123).' },
          { id: 'r', label: 'Branch router', icon: 'router', x: 60, y: 170, info: 'Sends traps and syslog, is polled by the NMS.' },
          { id: 'sw', label: 'Core switch', icon: 'switch', x: 150, y: 170, info: 'Polled for interface usage and errors.' },
          { id: 'fw', label: 'Firewall', icon: 'firewall', x: 230, y: 170, info: 'Sends logs of allowed/denied traffic to the SIEM.' },
          { id: 'srv', label: 'Server', icon: 'server', x: 310, y: 170, info: 'Windows event logs / Linux syslog forwarded centrally.' },
        ],
        links: [
          { from: 'nms', to: 'r', style: 'dashed' },
          { from: 'nms', to: 'sw', style: 'dashed' },
          { from: 'siem', to: 'fw', style: 'dashed' },
          { from: 'siem', to: 'srv', style: 'dashed' },
          { from: 'siem', to: 'r', style: 'dashed' },
          { from: 'ntp', to: 'srv', style: 'dashed' },
          { from: 'ntp', to: 'fw', style: 'dashed' },
        ],
        steps: [
          { text: '**Polling (UDP 161)**: every few minutes the NMS asks the core switch for interface status, CPU and traffic.', paths: [['nms', 'sw']], packet: 'GET', tone: 'blue' },
          { text: '**Trap (UDP 162)**: the branch router\'s WAN interface goes down → it immediately sends a trap. The NMS raises an alarm to the network team.', paths: [['r', 'nms']], packet: 'TRAP!', tone: 'red' },
          { text: '**Syslog (UDP 514)**: the firewall sends "deny" logs to the SIEM; the security team can investigate.', paths: [['fw', 'siem']], packet: 'log', tone: 'amber' },
          { text: '**NTP (UDP 123)**: all devices sync time, so logs from router, firewall and server line up correctly during an investigation.', paths: [['ntp', 'srv'], ['ntp', 'fw']], packet: 'time', tone: 'green' },
        ],
      },
    ],
    bank: `A bank's **NOC** watches dashboards of all branch links, ATMs and DC devices 24×7. A good admin knows the alert **before** the branch calls. Logs are kept for a defined period (regulatory and PCI DSS requirements) and protected from changes.`,
    remember: [
      'SNMP: polling **UDP 161**, traps **UDP 162**; use **SNMPv3** (auth + encryption).',
      'Syslog **UDP 514**; severity **0 Emergency … 7 Debug** (lower = worse).',
      '**NTP (UDP 123)** — correct time is vital for logs, Kerberos and transactions.',
    ],
    check: [
      {
        q: 'Which SNMP version supports authentication and encryption?',
        options: ['v1', 'v2c', 'v3', 'None'],
        answer: 2,
        explain: '**SNMPv3** adds user-based authentication and encryption.',
      },
      {
        q: 'Which syslog severity level is the most serious?',
        options: ['7 – Debug', '4 – Warning', '0 – Emergency', '6 – Informational'],
        answer: 2,
        explain: 'Level **0 (Emergency)** is the most severe; 7 (Debug) is the least.',
      },
      {
        q: 'Why is NTP important for security investigations?',
        options: ['It encrypts logs', 'It makes timestamps consistent across devices so events can be correlated', 'It blocks attacks', 'It assigns IP addresses'],
        answer: 1,
        explain: 'Without synced clocks, you cannot line up events from different systems.',
      },
    ],
  },
  {
    id: 'system-down',
    title: 'Scenario: "A branch says the system is down"',
    analogy:
      'A fire alarm rings. A good fire officer does not panic: they find **where** the fire is, **how big** it is, make people safe, **call for help** if needed, put it out, and later find **why** it started.',
    body: `This is the **most likely scenario question**. Answer with a clear structure:

1. **Stay calm, gather facts** — which branch, which system (core banking? everything? ATM?), since when, **error message**, how many users. Log a **ticket**.
2. **Check scope** — one PC, the whole branch, or **many branches**? Check the **monitoring dashboard** (NMS): is the branch link up? Any DC alerts?
3. **If one PC** — ping ladder, ipconfig, cable, app.
4. **If the whole branch** — WAN links (primary/backup), branch router/firewall, **power**, switch. Ask a staff member to check device lights/power.
5. **If many branches** — central problem: DC network, firewall, core banking servers, DNS, or provider outage → **escalate immediately** (major incident) and inform management.
6. **Workaround** — move to backup link, DR, or manual procedures while fixing.
7. **Communicate** — regular updates to the branch, service desk and managers.
8. **Fix and verify** with the branch; **document**; for major incidents, **root cause analysis** (problem management).`,
    visuals: [
      {
        kind: 'flow',
        title: 'Incident flow: "the system is down at Branch 25"',
        steps: [
          { label: 'Log & gather', icon: '📞', detail: 'Create a ticket. Which system? Error? Since when? How many users? Anything changed (power cut, new device)?', tone: 'blue' },
          { label: 'Check monitoring', icon: '📊', detail: 'NMS: branch router up? WAN links up? Any alarms at the DC? Is it only Branch 25?', tone: 'purple' },
          { label: 'One PC?', icon: '💻', detail: 'Ping ladder, ipconfig, cable, restart the app / PC. Others in the branch fine.', tone: 'slate' },
          { label: 'Whole branch?', icon: '🏢', detail: 'WAN primary & backup, branch router/firewall, power/UPS, switch. Remote checks + branch staff help. Raise provider ticket if link down.', tone: 'amber' },
          { label: 'Many branches?', icon: '🚨', detail: '**Major incident**: DC network, firewall, CBS servers, DNS, provider. Escalate to senior engineers and managers immediately.', tone: 'red' },
          { label: 'Workaround', icon: '🔀', detail: 'Backup link, failover to DR, or temporary manual process — keep customers served.', tone: 'teal' },
          { label: 'Communicate', icon: '📢', detail: 'Regular updates to the branch, service desk and management (even "still working on it").', tone: 'indigo' },
          { label: 'Fix, verify, document', icon: '✅', detail: 'Confirm with the branch, close the ticket with root cause; RCA / problem record for major incidents.', tone: 'green' },
        ],
      },
    ],
    bank: `Example answer opener: *"First I would get the details and log a ticket. Then I would check the scope — is it one PC, the whole branch, or many branches — using our monitoring tools. That tells me where to look…"* Panels like candidates who think about **customers waiting at the counter**, **escalation** and **communication**, not only commands.`,
    remember: [
      'Structure: **gather facts → scope → isolate (PC / branch / many) → workaround → communicate → fix → document/RCA**.',
      'Scope decides everything: one PC = local; one branch = WAN/branch devices/power; many branches = **central/major incident**.',
      'Mention **monitoring, escalation and communication**.',
    ],
    check: [
      {
        q: 'Several branches report the core banking system is down at the same time. What is the best first conclusion?',
        options: ['Each branch has a cable problem', 'It is likely a central issue (DC, core system, firewall, DNS, provider) → treat as a major incident', 'Users need training', 'Restart all branch PCs'],
        answer: 1,
        explain: 'Many sites at once → **central** problem. Escalate as a major incident.',
      },
      {
        q: 'While fixing a long outage, what should you also do?',
        options: ['Stay quiet until it is fixed', 'Give regular updates to the branch, service desk and management', 'Close the ticket early', 'Make unapproved changes everywhere'],
        answer: 1,
        explain: '**Communication** is a key part of incident management.',
      },
    ],
  },
];
