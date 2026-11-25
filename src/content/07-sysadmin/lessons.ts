import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'active-directory',
    title: 'Windows Server and Active Directory',
    analogy:
      'Active Directory is the bank\'s **HR department + security office** for computers: it keeps the **list of every staff member and PC** (directory), checks ID cards when people log in (authentication), and decides which doors they can open (authorisation).',
    body: `**Windows Server** roles you should know: **AD DS** (Active Directory Domain Services), **DNS**, **DHCP**, **File & Storage**, Print, **Hyper-V**, **WSUS** (updates), IIS (web).

**Active Directory (AD DS)** = a central directory of **users, computers, groups** and policies.
- **Domain Controller (DC)** — server that holds the AD database (NTDS.dit) and authenticates logins. Use **at least two** DCs; they **replicate** (multi-master).
- Structure: **Forest** → **Tree** → **Domain** (e.g. bank.local) → **OUs** (Organisational Units, e.g. Branches/Branch25) → objects.
- **Groups**: *security* (permissions) vs *distribution* (email). Scopes: domain local, global, universal. Best practice **AGDLP**: Accounts → Global groups → Domain Local groups → Permissions.
- Authentication: **Kerberos** (port 88) by default (tickets), NTLM for old systems. Clients find DCs using **DNS SRV records** — **AD depends on DNS**.
- **FSMO roles** (5 special roles): Schema Master, Domain Naming Master (forest-wide); RID Master, PDC Emulator (also the time source), Infrastructure Master (per domain).

Tools: *Active Directory Users and Computers* (dsa.msc), PowerShell (\`Get-ADUser\`, \`Unlock-ADAccount\`).`,
    visuals: [
      {
        kind: 'fields',
        title: 'AD structure (example)',
        rows: [
          { label: 'Forest', fields: [{ text: 'bank.local forest', sub: 'security boundary', tone: 'purple' }] },
          { label: 'Domain', fields: [{ text: 'bank.local', sub: 'DC01, DC02 (replicate)', tone: 'blue' }] },
          {
            label: 'Organisational Units (OUs) — for GPOs and delegation',
            fields: [
              { text: 'Head Office', sub: 'IT, Finance, HR', tone: 'teal' },
              { text: 'Branches', sub: 'Branch01 … Branch300', tone: 'teal' },
              { text: 'Servers', sub: 'App, DB, File', tone: 'teal' },
            ],
          },
          {
            label: 'Objects',
            fields: [
              { text: 'Users', tone: 'green' },
              { text: 'Computers', tone: 'green' },
              { text: 'Groups', tone: 'green' },
              { text: 'Service accounts', tone: 'amber' },
            ],
          },
        ],
      },
      {
        kind: 'sequence',
        title: 'A teller logs in to the domain (Kerberos, simplified)',
        actors: [
          { id: 'pc', label: 'Teller PC', icon: 'pc' },
          { id: 'dns', label: 'DNS', icon: 'dns' },
          { id: 'dc', label: 'Domain controller', icon: 'server', sub: 'KDC' },
          { id: 'fs', label: 'File server', icon: 'server' },
        ],
        steps: [
          { from: 'pc', to: 'dns', label: 'Where is a DC? (SRV)', detail: 'The PC asks DNS for the **SRV record** _ldap._tcp.dc._msdcs.bank.local to find a domain controller. **No DNS = no domain login.**', tone: 'blue' },
          { from: 'pc', to: 'dc', label: 'AS-REQ (user + time)', detail: 'The PC sends an authentication request. Clocks must be within **5 minutes** (NTP!).', tone: 'purple' },
          { from: 'dc', to: 'pc', label: 'TGT (ticket)', detail: 'Password correct → the DC (Key Distribution Centre) issues a **Ticket Granting Ticket**. The password itself never crosses the network.', tone: 'green' },
          { from: 'pc', to: 'dc', label: 'TGS-REQ: file server', detail: 'To open a share, the PC shows its TGT and asks for a **service ticket** for the file server.', tone: 'purple' },
          { from: 'dc', to: 'pc', label: 'service ticket', detail: 'The DC returns a service ticket, including the user\'s **group memberships**.', tone: 'green' },
          { from: 'pc', to: 'fs', label: 'ticket → access', detail: 'The file server checks the ticket and applies **share + NTFS permissions** based on the groups.', tone: 'teal' },
        ],
      },
    ],
    bank: `In a bank, every staff member has **one AD account**. When someone joins, moves branch or **leaves**, IT updates AD (joiner-mover-leaver process). Leavers must be **disabled immediately**. Common daily tasks: **unlock accounts, reset passwords** (after verifying identity), add users to groups, troubleshoot login problems (often **DNS or time** issues).`,
    remember: [
      'AD DS = central directory; **DCs** authenticate (Kerberos, port 88) and replicate. Have ≥ 2 DCs.',
      'Forest → domain → **OUs** → users/computers/groups. **AGDLP** for permissions.',
      '**AD depends on DNS** (SRV records) and **time** (5-minute Kerberos limit).',
    ],
    check: [
      {
        q: 'Which protocol does Active Directory use by default for authentication?',
        options: ['NTLM', 'Kerberos', 'RADIUS', 'LDAPS'],
        answer: 1,
        explain: '**Kerberos** (port 88) is the default; NTLM is a fallback for older systems.',
      },
      {
        q: 'Users suddenly cannot log in to the domain and get time-related errors. What should you check?',
        options: ['Printer drivers', 'Time synchronisation (NTP) between PCs and DCs', 'Screen resolution', 'VLAN tags'],
        answer: 1,
        explain: 'Kerberos fails if clocks differ by more than **5 minutes** by default.',
      },
    ],
  },
  {
    id: 'group-policy',
    title: 'Group Policy',
    analogy:
      'Group Policy is the **company rule book** pushed automatically to every PC: "Lock the screen after 10 minutes", "No USB drives", "This is the wallpaper". IT writes the rule once; thousands of PCs follow it.',
    body: `A **GPO (Group Policy Object)** is a set of settings linked to a **site, domain or OU**.

Two parts:
- **Computer Configuration** — applies at **startup** (e.g. firewall, USB block, software install).
- **User Configuration** — applies at **logon** (e.g. mapped drives, desktop restrictions).

**Processing order: LSDOU** — **L**ocal → **S**ite → **D**omain → **O**U (parent then child). **The last one applied wins** if settings conflict.
- **Enforced** (no override) — a GPO that lower levels cannot override.
- **Block inheritance** — an OU ignores GPOs from above (except Enforced ones).
- **Security filtering** — apply only to certain groups.

Refresh: background every **~90 minutes** (± 30). Commands: \`gpupdate /force\`, \`gpresult /r\` (which GPOs applied?), \`rsop.msc\`.

Bank examples: password & lockout policy, **screen lock**, **USB storage blocked**, BitLocker, Windows Firewall, proxy settings, software restrictions/AppLocker, legal notice at logon.`,
    visuals: [
      {
        kind: 'flow',
        title: 'LSDOU: the order GPOs apply (last wins)',
        steps: [
          { label: 'Local', icon: 'L', detail: 'Local policy on the PC itself (lowest priority).', tone: 'slate' },
          { label: 'Site', icon: 'S', detail: 'GPOs linked to the AD site (e.g. "Colombo HO site").', tone: 'blue' },
          { label: 'Domain', icon: 'D', detail: 'GPOs linked to bank.local — e.g. the **password policy** for domain accounts.', tone: 'purple' },
          { label: 'Parent OU', icon: 'O', detail: 'e.g. OU "Branches": screen lock 10 min, USB blocked.', tone: 'teal' },
          { label: 'Child OU', icon: 'O', detail: 'e.g. OU "Branch25-Tellers": printer mapping, teller desktop. Applied **last** → wins conflicts (unless a higher GPO is **Enforced**).', tone: 'green' },
        ],
      },
    ],
    bank: `A new security rule says "Block USB storage on all branch PCs". You create one GPO, link it to the **Branches OU**, test it first on a **pilot OU**, then roll out. If a PC doesn't get it, run \`gpresult /r\` on that PC and \`gpupdate /force\`. Check the PC is in the right OU and can reach a DC.`,
    remember: [
      'GPO = settings pushed by AD; Computer config (startup) and User config (logon).',
      'Order **LSDOU**, last wins; **Enforced** and **Block inheritance** change this.',
      '`gpupdate /force` to refresh, `gpresult /r` to see what applied.',
    ],
    check: [
      {
        q: 'In which order are GPOs processed?',
        options: ['OU, Domain, Site, Local', 'Local, Site, Domain, OU', 'Domain, Local, OU, Site', 'Random'],
        answer: 1,
        explain: '**LSDOU** — and the last applied (OU) wins conflicts.',
      },
      {
        q: 'Which command shows which GPOs were applied to a user/computer?',
        options: ['gpupdate /force', 'gpresult /r', 'ipconfig /all', 'netstat -ano'],
        answer: 1,
        explain: '**gpresult /r** shows the resultant set of policy.',
      },
    ],
  },
  {
    id: 'linux',
    title: 'Basic Linux commands',
    analogy:
      'Linux commands are like **short orders to a very fast assistant**: "list the files", "show me the last lines of the log", "is the service running?". Learn the 20 most common orders and you can handle most tasks.',
    body: `| Task | Command |
|---|---|
| Where am I / list files | \`pwd\`, \`ls -la\` |
| Move around | \`cd /var/log\` |
| Copy / move / delete | \`cp\`, \`mv\`, \`rm\` (careful with \`rm -rf\`!) |
| Make folder | \`mkdir -p\` |
| Read files | \`cat\`, \`less\`, \`head\`, \`tail -f app.log\` (live) |
| Search text | \`grep -i error app.log\` |
| Find files | \`find / -name "*.conf"\` |
| Disk space | \`df -h\` (disks), \`du -sh *\` (folder sizes) |
| Memory / CPU | \`free -h\`, \`top\` / \`htop\`, \`uptime\` |
| Processes | \`ps aux\`, \`kill PID\` |
| Services | \`systemctl status nginx\` |
| Logs | \`journalctl -u nginx -f\` |
| Network | \`ip a\`, \`ss -tulnp\`, \`curl\` |
| Users | \`whoami\`, \`id\`, \`useradd\`, \`passwd\` |
| Admin rights | \`sudo <command>\` |
| Remote | \`ssh user@host\`, \`scp file host:/path\` |
| Archives | \`tar -czf backup.tar.gz /data\` |
| Scheduled jobs | \`crontab -e\` |`,
    visuals: [
      {
        kind: 'flow',
        title: '"The Linux app server is slow" — quick health check',
        steps: [
          { label: 'uptime', icon: '1', detail: '`uptime` — how long running + **load average** (compare with number of CPUs).', tone: 'blue' },
          { label: 'top', icon: '2', detail: '`top` / `htop` — which process uses CPU or memory?', tone: 'purple' },
          { label: 'free -h', icon: '3', detail: 'Memory and **swap** usage. Heavy swap = not enough RAM.', tone: 'amber' },
          { label: 'df -h', icon: '4', detail: 'Is a disk **100% full**? (Very common: logs fill /var.) Then `du -sh /var/log/*`.', tone: 'red' },
          { label: 'systemctl', icon: '5', detail: '`systemctl status app` — is the service running or restarting?', tone: 'teal' },
          { label: 'logs', icon: '6', detail: '`journalctl -u app --since "1 hour ago"` or `tail -f /var/log/app.log` — look for errors.', tone: 'green' },
        ],
      },
    ],
    bank: `Many bank systems (web servers, middleware, some databases, monitoring tools) run on **Linux** (e.g. RHEL). As a developer you already used Linux on **AWS EC2 and in Docker** — say so! Admin work adds: users and sudo rights, service management, log checks, patching (\`dnf update\` / \`apt upgrade\`), and **never logging in as root directly** (use sudo for accountability).`,
    remember: [
      'Files: `ls -la`, `cd`, `cp`, `mv`, `rm`, `cat`, `tail -f`, `grep`, `find`.',
      'Health: `uptime`, `top`, `free -h`, **`df -h`**, `ps aux`.',
      'Services & logs: `systemctl status/start/stop/enable`, `journalctl -u`. Use **sudo**, not root.',
    ],
    check: [
      {
        q: 'Which command shows disk space usage of mounted file systems in human-readable form?',
        options: ['du -sh', 'df -h', 'free -h', 'ls -la'],
        answer: 1,
        explain: '**df -h** shows each file system\'s size, used and free space.',
      },
      {
        q: 'Which command follows a log file live as new lines are added?',
        options: ['cat app.log', 'head app.log', 'tail -f app.log', 'grep app.log'],
        answer: 2,
        explain: '**tail -f** keeps printing new lines.',
      },
    ],
  },
  {
    id: 'permissions',
    title: 'Permissions: Linux and Windows',
    analogy:
      'Permissions are like **keys** for rooms: some people can **enter and read** (read), some can **change things** (write), some can **use the machines** (execute). Give people **only the keys they need**.',
    body: `**Linux**: each file has an **owner**, a **group**, and **others**, each with **r** (read, 4), **w** (write, 2), **x** (execute, 1).
- \`-rwxr-x---\` = owner rwx (7), group r-x (5), others --- (0) → **750**
- \`chmod 640 file\` → rw-r----- · \`chown appuser:appgroup file\`
- Never use **777** (everyone can change everything).
- Directories: x = can enter; r = can list.

**Windows NTFS permissions**: Full control, Modify, Read & execute, List folder contents, Read, Write. They are **inherited** from parent folders. An explicit **Deny overrides Allow**.

**Share permissions** (Full control, Change, Read) apply only when accessed **over the network**.
When both apply → the **most restrictive** wins. Common practice: share = Everyone/Authenticated Users "Full Control" or "Change", and control access with **NTFS**.

Always give permissions to **groups**, not individual users.`,
    visuals: [
      {
        kind: 'fields',
        title: 'Reading -rwxr-x--- (chmod 750)',
        rows: [
          {
            label: 'ls -l output',
            fields: [
              { text: '-', sub: 'file type', tone: 'slate', w: 1 },
              { text: 'rwx', sub: 'owner = 7', tone: 'blue', w: 2 },
              { text: 'r-x', sub: 'group = 5', tone: 'green', w: 2 },
              { text: '---', sub: 'others = 0', tone: 'red', w: 2 },
            ],
          },
          {
            label: 'Values',
            fields: [
              { text: 'r = 4', tone: 'purple' },
              { text: 'w = 2', tone: 'purple' },
              { text: 'x = 1', tone: 'purple' },
              { text: '4+2+1 = 7', tone: 'amber' },
            ],
          },
        ],
        note: 'Common: **644** files (rw-r--r--), **755** scripts/folders, **600** private keys (rw-------).',
      },
    ],
    bank: `A shared folder "Branch25-Reports": share permission = Authenticated Users: Change; NTFS = group **GG-Branch25-Managers: Modify**, **GG-Branch25-Staff: Read**. When a manager moves branch, you only change their **group membership** in AD. Regular **access reviews** check that leavers and movers no longer have access.`,
    remember: [
      'Linux: owner/group/others, **r=4 w=2 x=1** (750 = rwxr-x---). Never 777.',
      'Windows: NTFS (local + network) and share (network only) → **most restrictive wins**; Deny beats Allow.',
      'Assign permissions to **groups**, follow **least privilege**, review access regularly.',
    ],
    check: [
      {
        q: 'What does chmod 640 give?',
        options: ['rwxr-----', 'rw-r-----', 'rw-rw-r--', 'r--r--r--'],
        answer: 1,
        explain: '6 = rw-, 4 = r--, 0 = --- → **rw-r-----**.',
      },
      {
        q: 'A user has NTFS Modify but share permission Read. What can they do over the network?',
        options: ['Modify', 'Read only', 'Full control', 'Nothing'],
        answer: 1,
        explain: 'Over the network the **most restrictive** of share and NTFS applies → **Read**.',
      },
    ],
  },
  {
    id: 'services',
    title: 'Services, processes and logs',
    analogy:
      'Services are the **staff who work in the background** even when no customer is at the counter (e.g. the security guard, the cleaner). You need to know how to **check if they came to work**, **restart** them, and **read their diary** (logs).',
    body: `A **service** (Windows) / **daemon** (Linux) is a program that runs in the background — web server, database, DNS, antivirus.

**Windows**
- \`services.msc\` or PowerShell \`Get-Service\`, \`Restart-Service Spooler\`.
- Startup types: **Automatic**, Automatic (Delayed Start), **Manual**, **Disabled**.
- Each service runs as an account (Local System, Network Service, or a **service account** — use a **gMSA** where possible, least privilege).
- **Event Viewer** (\`eventvwr.msc\`): **System**, **Application**, **Security** logs.
- Task Manager / \`tasklist\`, \`taskkill /PID\`.

**Linux (systemd)**
- \`systemctl status|start|stop|restart nginx\`
- \`systemctl enable nginx\` (start at boot), \`disable\`
- \`journalctl -u nginx -f\`, files in \`/var/log/\`
- \`ps aux | grep java\`, \`kill\` / \`kill -9\` (last resort)

Before restarting a production service: check **impact**, follow **change/incident process**, and inform users.`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'Windows', icon: '🪟', tone: 'blue' },
          { label: 'Linux (systemd)', icon: '🐧', tone: 'green' },
        ],
        rows: [
          { label: 'List / status', values: ['`Get-Service` / services.msc', '`systemctl status app`'] },
          { label: 'Restart', values: ['`Restart-Service app`', '`sudo systemctl restart app`'] },
          { label: 'Start at boot', values: ['Startup type: Automatic', '`systemctl enable app`'] },
          { label: 'Logs', values: ['Event Viewer (System, Application, Security)', '`journalctl -u app`, /var/log'] },
          { label: 'Processes', values: ['Task Manager, `tasklist`', '`ps aux`, `top`'] },
          { label: 'Kill', values: ['`taskkill /PID 1234 /F`', '`kill 1234` (`-9` last resort)'] },
        ],
      },
    ],
    bank: `Branches cannot print: check the **Print Spooler** service on the print server (\`Get-Service Spooler\`), look in Event Viewer for errors, restart it if needed (it is low impact), and find the root cause (e.g. a bad driver). For a core banking service, you would **not** restart it alone — escalate and follow the incident process.`,
    remember: [
      'Windows: services.msc / `Get-Service`, startup types, **Event Viewer** (System, Application, Security).',
      'Linux: `systemctl status/restart/enable`, `journalctl -u`.',
      'Services run as accounts → least privilege (gMSA). Restarting production = follow the process.',
    ],
    check: [
      {
        q: 'Which Linux command makes a service start automatically at boot?',
        options: ['systemctl start app', 'systemctl enable app', 'systemctl status app', 'journalctl -u app'],
        answer: 1,
        explain: '**enable** sets it to start at boot; start runs it now.',
      },
      {
        q: 'Which Windows log would you check for failed logon attempts?',
        options: ['Application', 'System', 'Security', 'Setup'],
        answer: 2,
        explain: 'Logon events (e.g. 4625 failed logon) are in the **Security** log.',
      },
    ],
  },
  {
    id: 'virtualization',
    title: 'Virtualisation (and containers)',
    analogy:
      'One big **building** (physical server) split into many **flats** (virtual machines). Each flat has its own kitchen and front door (own OS). **Containers** are like **rooms in one shared flat**: they share the kitchen (OS kernel), so they are lighter and start faster.',
    body: `**Virtualisation** runs many **virtual machines (VMs)** on one physical host, using a **hypervisor**.
- **Type 1 (bare-metal)** — runs directly on hardware: **VMware ESXi**, **Microsoft Hyper-V**, **KVM**, Nutanix AHV. Used in data centres.
- **Type 2 (hosted)** — runs on top of an OS: VirtualBox, VMware Workstation. For labs/desktops.

Benefits: better hardware use, fast provisioning, isolation, **snapshots**, **live migration** (vMotion) without downtime, **HA clusters** (VMs restart on another host if one fails), easier DR (replicate VMs).

⚠️ A **snapshot is not a backup** — it lives on the same storage and grows over time. Delete snapshots after changes are confirmed.

**Containers (Docker)** share the host OS kernel and package an app with its libraries. Lighter and faster than VMs; orchestrated with **Kubernetes**. VMs = stronger isolation, different OSes; containers = speed, density, DevOps.`,
    visuals: [
      {
        kind: 'fields',
        title: 'VMs vs containers',
        rows: [
          {
            label: 'Virtual machines (Type 1 hypervisor)',
            fields: [
              { text: 'App A', sub: 'Windows OS', tone: 'blue' },
              { text: 'App B', sub: 'Linux OS', tone: 'blue' },
              { text: 'App C', sub: 'Linux OS', tone: 'blue' },
            ],
          },
          { fields: [{ text: 'Hypervisor (ESXi / Hyper-V / KVM)', tone: 'purple' }] },
          { fields: [{ text: 'Physical server hardware', tone: 'slate' }] },
          {
            label: 'Containers (Docker)',
            fields: [
              { text: 'App A', sub: 'libs', tone: 'green' },
              { text: 'App B', sub: 'libs', tone: 'green' },
              { text: 'App C', sub: 'libs', tone: 'green' },
              { text: 'App D', sub: 'libs', tone: 'green' },
            ],
          },
          { fields: [{ text: 'Container engine (Docker)', tone: 'teal' }] },
          { fields: [{ text: 'Host OS (one shared kernel)', tone: 'amber' }] },
          { fields: [{ text: 'Hardware or VM', tone: 'slate' }] },
        ],
        note: 'Each VM has a **full OS**; containers **share** the host kernel → lighter, start in seconds.',
      },
    ],
    bank: `Most bank servers today are **VMs** on a clustered hypervisor (e.g. VMware or Hyper-V) with shared storage, replicated to the DR site. Before patching a VM, admins often take a **snapshot** for quick rollback — and **delete it** afterwards. Your **Docker** experience is relevant: explain you understand images, ports, volumes and how containers differ from VMs.`,
    remember: [
      'Type 1 hypervisor = bare-metal (ESXi, Hyper-V, KVM); Type 2 = hosted (VirtualBox).',
      'Benefits: consolidation, snapshots, **live migration**, **HA**, easier DR.',
      '**Snapshot ≠ backup**. Containers share the host kernel (lighter); VMs have full OSes.',
    ],
    check: [
      {
        q: 'Which is a Type 1 (bare-metal) hypervisor?',
        options: ['VirtualBox', 'VMware Workstation', 'VMware ESXi', 'Docker Desktop'],
        answer: 2,
        explain: '**ESXi** runs directly on hardware. VirtualBox and Workstation are Type 2.',
      },
      {
        q: 'Why is a VM snapshot not a real backup?',
        options: ['It is too small', 'It depends on the same storage/VM and is meant for short-term rollback', 'It cannot be restored', 'It is encrypted'],
        answer: 1,
        explain: 'Snapshots live with the VM on the same storage; if that storage fails, both are lost.',
      },
    ],
  },
  {
    id: 'raid',
    title: 'RAID levels',
    analogy:
      '**RAID 0** = splitting a book between two people to read faster — if one loses their half, the book is ruined. **RAID 1** = two people each keep a full copy. **RAID 5** = three people with pages plus a "checksum page" to rebuild any one missing part. **RAID 10** = two pairs of photocopies, split between the pairs.',
    body: `**RAID (Redundant Array of Independent Disks)** combines disks for **speed and/or fault tolerance**.

| Level | How | Min disks | Usable | Survives |
|---|---|---|---|---|
| **0** | Striping | 2 | 100% | **0** disks — no redundancy |
| **1** | Mirroring | 2 | 50% | 1 disk |
| **5** | Striping + distributed parity | 3 | (n−1)/n | 1 disk |
| **6** | Striping + double parity | 4 | (n−2)/n | 2 disks |
| **10** | Mirrors, then striped | 4 | 50% | 1 per mirror pair |

- **RAID 10** — best for **databases** (fast writes, good protection).
- **RAID 5** — good capacity, slower writes (parity), long risky rebuilds on big disks → RAID 6 is often preferred for large arrays.
- **Hot spare** — an idle disk that automatically replaces a failed one.

⚠️ **RAID is not a backup!** It does not protect against deletion, corruption, ransomware or fire.`,
    visuals: [{ kind: 'custom', id: 'raid' }],
    bank: `A database server uses **RAID 10** for data and **RAID 1** for the operating system. When the monitoring system reports "disk failed, array degraded", the admin replaces the disk quickly (hot-swap) and watches the **rebuild** — during the rebuild the array is at risk. The database is **still backed up** separately, because RAID cannot undo a deleted table.`,
    remember: [
      'RAID 0 speed/no safety · RAID 1 mirror · **RAID 5** parity (min 3, survives 1) · RAID 6 (survives 2) · **RAID 10** (min 4, best for DBs).',
      'Usable: RAID 1/10 = 50%; RAID 5 = (n−1)/n.',
      '**RAID is not a backup.**',
    ],
    check: [
      {
        q: 'What is the minimum number of disks for RAID 5?',
        options: ['2', '3', '4', '5'],
        answer: 1,
        explain: 'RAID 5 needs at least **3** disks (data + distributed parity).',
      },
      {
        q: 'Which RAID level gives NO fault tolerance?',
        options: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 10'],
        answer: 0,
        explain: '**RAID 0** only stripes; one disk failure loses everything.',
      },
      {
        q: 'Which RAID level is usually recommended for a busy transactional database?',
        options: ['RAID 0', 'RAID 5', 'RAID 10', 'JBOD'],
        answer: 2,
        explain: '**RAID 10** combines speed (striping) with protection (mirroring) and no parity write penalty.',
      },
    ],
  },
  {
    id: 'patching',
    title: 'Patch management',
    analogy:
      'Patches are like **vaccines** for computers. You do not inject the whole bank at once with a new vaccine — you **test on a small group first**, then give it to everyone in a planned way, and keep a record.',
    body: `**Patch management** = keeping OS, applications and firmware updated to fix **security vulnerabilities** and bugs — in a controlled way.

Process:
1. **Inventory** — know all assets and versions (CMDB).
2. **Monitor & assess** — vendor bulletins (e.g. Microsoft Patch Tuesday — 2nd Tuesday of each month), vulnerability scans, **CVSS** severity, is it exploited in the wild?
3. **Test** — in a test/UAT environment, especially for core banking servers.
4. **Approve** — via **change management (CAB)**, with a **rollback plan** (snapshot/backup).
5. **Deploy** — in **phases** (pilot → wider), in **maintenance windows**, using tools: **WSUS**, SCCM/MECM/Intune, Linux repos (\`dnf\`/\`apt\`), Ansible.
6. **Verify & report** — compliance reports, rescan, fix failures.

**Emergency patches** (critical, actively exploited) follow a faster **emergency change** process. Also patch **network devices** (firmware), not only servers. If a system cannot be patched (legacy), use **compensating controls** (isolation, extra monitoring).`,
    visuals: [
      {
        kind: 'flow',
        title: 'Monthly patch cycle',
        cycle: true,
        steps: [
          { label: 'Inventory', icon: '📋', detail: 'Know what you have: servers, PCs, network devices, versions (CMDB/asset tool).', tone: 'slate' },
          { label: 'Assess', icon: '🔎', detail: 'Read vendor advisories (Patch Tuesday), check **CVSS** and whether it is actively exploited. Prioritise critical + Internet-facing.', tone: 'blue' },
          { label: 'Test', icon: '🧪', detail: 'Install on test/UAT systems; check core banking, ATM and branch apps still work.', tone: 'purple' },
          { label: 'Approve', icon: '✅', detail: '**CAB** approves the change with schedule, impact and **rollback plan**.', tone: 'amber' },
          { label: 'Deploy', icon: '🚀', detail: 'Pilot group first, then all; in maintenance windows; clusters node by node (no downtime).', tone: 'teal' },
          { label: 'Verify', icon: '📈', detail: 'Compliance report, vulnerability rescan, fix failed installs, document.', tone: 'green' },
        ],
      },
    ],
    bank: `Regulators and auditors (and PCI DSS) expect **timely patching** — critical security patches usually within a defined short period (e.g. within a month, faster if exploited). Core banking servers are patched in **night/weekend windows**, **one cluster node at a time**, after testing in UAT. Branch PCs get updates from **WSUS** after hours so the WAN is not overloaded.`,
    remember: [
      'Process: **inventory → assess (CVSS) → test → approve (CAB, rollback) → deploy (phased, windows) → verify/report**.',
      'Tools: WSUS, SCCM/Intune, Linux package managers, Ansible. Patch firmware too.',
      'Emergency changes for actively exploited criticals; compensating controls for unpatchable systems.',
    ],
    check: [
      {
        q: 'What should happen BEFORE deploying a patch to production core banking servers?',
        options: ['Nothing, just install it', 'Test it in a test/UAT environment and get change approval with a rollback plan', 'Ask users to restart PCs', 'Disable the firewall'],
        answer: 1,
        explain: '**Test → approve (CAB) → deploy** with a rollback plan.',
      },
      {
        q: 'What is CVSS used for?',
        options: ['Encrypting patches', 'Scoring the severity of vulnerabilities', 'Assigning IP addresses', 'Backing up servers'],
        answer: 1,
        explain: '**CVSS** (Common Vulnerability Scoring System) rates severity from 0 to 10.',
      },
    ],
  },
];
