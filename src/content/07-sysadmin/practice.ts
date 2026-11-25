import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'What is a domain controller?', options: ['A router for the domain', 'A server that holds Active Directory and authenticates users', 'A DNS-only server', 'A backup server'], answer: 1, explain: 'A **DC** runs AD DS, stores the directory and handles authentication.' },
  { q: 'Why should there be at least two domain controllers?', options: ['To double the speed of DNS', 'For redundancy — if one fails, logins still work', 'Because licences require it', 'To store more users'], answer: 1, explain: 'Multiple DCs replicate AD and provide **redundancy**.' },
  { q: 'Active Directory clients find domain controllers using…', options: ['DHCP options', 'DNS SRV records', 'ARP broadcasts', 'NetFlow'], answer: 1, explain: 'AD relies on **DNS SRV records**.' },
  { q: 'Which FSMO role is the default time source of the domain?', options: ['RID Master', 'Schema Master', 'PDC Emulator', 'Infrastructure Master'], answer: 2, explain: 'The **PDC Emulator** is the authoritative time source (and handles password changes/lockouts priority).' },
  { q: 'What does AGDLP describe?', options: ['A backup strategy', 'Accounts → Global groups → Domain Local groups → Permissions', 'A RAID level', 'A patching cycle'], answer: 1, explain: '**AGDLP** is Microsoft\'s recommended group nesting for permissions.' },
  { q: 'Which GPO wins if a domain GPO and an OU GPO conflict (no Enforced)?', options: ['Domain GPO', 'OU GPO (applied last)', 'Local policy', 'Neither'], answer: 1, explain: 'Processing is LSDOU; the **OU** GPO applies last and wins.' },
  { q: 'Which command forces a Group Policy refresh?', options: ['gpresult /r', 'gpupdate /force', 'secpol.msc', 'netsh reset'], answer: 1, explain: '**gpupdate /force** re-applies all policies.' },
  { q: 'Which Linux command shows running processes?', options: ['ps aux', 'df -h', 'chmod', 'ip a'], answer: 0, explain: '**ps aux** lists processes (top/htop for live view).' },
  { q: 'What permission does chmod 755 give to "others"?', options: ['rwx', 'r-x', 'r--', '---'], answer: 1, explain: '7 owner rwx, 5 group r-x, **5 others r-x**.' },
  { q: 'NTFS allows a group Modify, but the user is explicitly denied Write. Result?', options: ['User can write', 'User cannot write — explicit Deny overrides Allow', 'User has Full Control', 'Depends on the share only'], answer: 1, explain: 'An **explicit Deny** takes precedence over Allow.' },
  { q: 'Which is a Type 2 hypervisor?', options: ['Hyper-V', 'ESXi', 'KVM', 'VirtualBox'], answer: 3, explain: '**VirtualBox** runs on top of a host OS.' },
  { q: 'What is the usable capacity of four 1 TB disks in RAID 5?', options: ['1 TB', '2 TB', '3 TB', '4 TB'], answer: 2, explain: '(n − 1) × size = 3 × 1 TB = **3 TB**.' },
  { q: 'RAID 6 can survive how many simultaneous disk failures?', options: ['0', '1', '2', '3'], answer: 2, explain: 'RAID 6 has **double parity** → survives 2 failed disks.' },
  { q: 'Microsoft releases regular security updates on…', options: ['The first Monday', 'Patch Tuesday — the second Tuesday of each month', 'Every Friday', 'Only once a year'], answer: 1, explain: '**Patch Tuesday** = second Tuesday of the month.' },
];

export const flashcards: Flashcard[] = [
  { front: 'AD DS', back: '**Active Directory Domain Services**: central directory of users, computers, groups; authentication via domain controllers.', tag: 'acronym' },
  { front: 'Forest / domain / OU', back: '**Forest** = top security boundary. **Domain** = admin unit (bank.local). **OU** = folder for objects, used for GPOs and delegation.', tag: 'definition' },
  { front: 'Kerberos', back: 'Default AD authentication (TCP/UDP 88). Ticket-based (TGT, service tickets). Needs time within 5 minutes.', tag: 'definition' },
  { front: 'FSMO roles', back: 'Forest: **Schema Master**, **Domain Naming Master**. Domain: **RID Master**, **PDC Emulator**, **Infrastructure Master**.', tag: 'fact' },
  { front: 'GPO processing', back: '**LSDOU**: Local → Site → Domain → OU. Last wins. Enforced / Block inheritance modify it.', tag: 'definition' },
  { front: 'gpupdate / gpresult', back: '`gpupdate /force` re-applies policy. `gpresult /r` shows applied GPOs.', tag: 'command' },
  { front: 'Linux permission numbers', back: 'r = 4, w = 2, x = 1. 755 = rwxr-xr-x · 644 = rw-r--r-- · 600 = rw-------', tag: 'fact' },
  { front: 'NTFS + share permissions', back: 'Over the network, the **most restrictive** of the two applies. Explicit Deny beats Allow.', tag: 'definition' },
  { front: 'systemctl', back: '`systemctl status|start|stop|restart|enable|disable <service>` — manage systemd services. Logs: `journalctl -u`.', tag: 'command' },
  { front: 'Event Viewer logs', back: '**System** (OS/drivers/services), **Application** (apps), **Security** (logons, audit).', tag: 'fact' },
  { front: 'Type 1 vs Type 2 hypervisor', back: '**Type 1** bare-metal: ESXi, Hyper-V, KVM. **Type 2** hosted: VirtualBox, VMware Workstation.', tag: 'definition' },
  { front: 'VM vs container', back: '**VM**: full OS on a hypervisor, strong isolation. **Container**: shares host kernel, lightweight, fast (Docker, Kubernetes).', tag: 'definition' },
  { front: 'RAID summary', back: '0 stripe (no safety) · 1 mirror · 5 parity (min 3) · 6 double parity (min 4) · 10 mirror+stripe (min 4).', tag: 'fact' },
  { front: 'RAID is not…', back: '…a **backup**. It does not protect against deletion, corruption, ransomware, theft or fire.', tag: 'fact' },
  { front: 'Patch process', back: 'Inventory → Assess (CVSS) → Test → Approve (CAB + rollback) → Deploy (phased) → Verify/report.', tag: 'definition' },
  { front: 'WSUS', back: '**Windows Server Update Services**: central approval and distribution of Microsoft updates inside the network.', tag: 'acronym' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'What is Active Directory and what are its main components?',
    answer: `Active Directory Domain Services is Microsoft's **central directory** for users, computers and groups, used for **authentication and authorisation** across the organisation.

Main components: **domain controllers** (servers that store the AD database and authenticate logins — at least two for redundancy, replicating with each other), the logical structure of **forest, domains and OUs**, **users, computers and groups**, and **Group Policy** for central configuration. It uses **Kerberos** for authentication and depends heavily on **DNS** (SRV records) and correct **time** (NTP).`,
  },
  {
    type: 'technical',
    q: 'What is Group Policy? Give examples of how a bank would use it.',
    answer: `Group Policy lets admins **centrally push settings** to computers and users in Active Directory. GPOs are linked to sites, domains or OUs and processed in the order Local, Site, Domain, OU — the last one wins unless a GPO is enforced.

Bank examples: password and account lockout policy, **screen lock after inactivity**, **blocking USB storage**, enabling BitLocker and Windows Firewall, proxy settings, mapped drives and printers, restricting software with AppLocker, and showing a legal notice at logon. I would test new GPOs on a pilot OU first, and use \`gpresult /r\` and \`gpupdate /force\` for troubleshooting.`,
  },
  {
    type: 'technical',
    q: 'Explain the common RAID levels.',
    answer: `- **RAID 0** — striping across disks; fast, full capacity, but **no fault tolerance**.
- **RAID 1** — mirroring; 50% capacity, survives one disk failure. Good for OS disks.
- **RAID 5** — striping with distributed parity; minimum 3 disks, capacity n−1, survives one failure, slower writes and risky rebuilds on large disks.
- **RAID 6** — double parity; survives two failures.
- **RAID 10** — mirrored pairs that are striped; minimum 4 disks, 50% capacity, fast and safe — best for **databases**.

And I always mention: **RAID is not a backup** — it doesn't protect against deletion, corruption or ransomware.`,
  },
  {
    type: 'technical',
    q: 'How would you manage patching in a bank environment?',
    answer: `I would follow a controlled process: keep an **inventory** of systems; monitor vendor advisories and vulnerability scans, prioritising by **CVSS** and whether a vulnerability is actively exploited; **test** patches in a UAT environment; get approval through **change management** with a rollback plan (snapshot or backup); **deploy in phases** in maintenance windows — for clusters, one node at a time so there's no downtime; then **verify** with compliance reports and rescans.

Tools would be WSUS/SCCM or Intune for Windows and package managers or Ansible for Linux. Critical, exploited vulnerabilities go through an **emergency change**. Systems that cannot be patched get compensating controls like isolation and extra monitoring.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between a virtual machine and a container?',
    answer: `A **virtual machine** runs a full guest operating system on a **hypervisor** like VMware ESXi or Hyper-V. It has strong isolation and can run different OSes, but it is heavier.

A **container** packages an application with its libraries but **shares the host OS kernel**, so it is lightweight and starts in seconds — Docker is the common tool, and Kubernetes orchestrates many containers.

In my development work I used Docker to package Spring Boot and Node.js services and deploy them through CI/CD, so I understand images, ports, volumes and networking — which helps me in an administration role too.`,
    tips: ['Always link to your real Docker/AWS experience — it is your strongest bridge.'],
  },
  {
    type: 'scenario',
    q: 'A user says they cannot log in to their PC — "account locked". What do you do?',
    answer: `1. **Verify the user's identity** using the bank's procedure (don't unlock just because someone calls).
2. Check in AD (dsa.msc or \`Get-ADUser -Properties LockedOut\`) and **unlock** the account; reset the password only if needed, forcing a change at next logon.
3. Find **why** it locked: an old password saved on a phone, mapped drive or service; or **possible attack** if there are many failures from unknown sources — check the Security event log / DC logs (event 4740 shows the source computer).
4. If it keeps locking, fix the source (remove saved credentials).
5. Log everything in the ticket.`,
  },
  {
    type: 'scenario',
    q: 'A Linux application server has stopped responding. How do you investigate?',
    answer: `1. Can I reach it? Ping and SSH. If not → check the hypervisor console, network, or whether it is down.
2. Once logged in: \`uptime\` (load), \`top\` (CPU/memory hogs), \`free -h\` (memory/swap), **\`df -h\`** (a full disk is very common — often logs).
3. \`systemctl status <app>\` — is the service running or crash-looping? \`journalctl -u <app>\` and the app logs for errors.
4. Check network ports with \`ss -tulnp\` and test the app locally with \`curl\`.
5. Take the right action through the incident process — free disk space, restart the service, or escalate to the app team — then find the root cause (e.g. set up log rotation and disk alerts).`,
  },
  {
    type: 'technical',
    q: 'Explain the difference between NTFS and share permissions.',
    answer: `**Share permissions** (Full Control, Change, Read) apply only when a folder is accessed **over the network**. **NTFS permissions** (Full Control, Modify, Read & Execute, Read, Write…) apply both **locally and over the network**, and are inherited from parent folders.

When both apply, the **most restrictive** wins. Also, an explicit **Deny overrides Allow**. Best practice is to keep share permissions simple and control access with NTFS, always granting permissions to **AD groups**, not individual users, following least privilege.`,
  },
];
