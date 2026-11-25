/** Data for the VLAN, VPN, RAID, backup, DR and RPO/RTO visuals. */
import type { Tone } from '../types';

/* ---------- VLANs on one switch ---------- */
export const vlans: { id: number; name: string; tone: Tone; note: string }[] = [
  { id: 10, name: 'Staff PCs', tone: 'blue', note: 'Teller and officer PCs. Can reach core banking through the firewall.' },
  { id: 20, name: 'Voice', tone: 'purple', note: 'IP phones. QoS gives voice priority.' },
  { id: 30, name: 'CCTV', tone: 'amber', note: 'Cameras and the NVR. Isolated: cameras are often weakly secured.' },
  { id: 40, name: 'ATM', tone: 'red', note: 'ATM only, very strict rules: it may talk only to the ATM switch.' },
  { id: 99, name: 'Management', tone: 'teal', note: 'Switch/router/AP management IPs. Only IT admins can reach it.' },
];

/** Port number → VLAN id. 0 = unused/shutdown, -1 = trunk. */
export const switchPorts: number[] = [10, 10, 10, 10, 20, 20, 30, 30, 40, 99, 0, -1];

/* ---------- Site-to-site VPN ---------- */
export interface VpnStep {
  title: string;
  text: string;
  packet: 'none' | 'inner' | 'encrypted' | 'ike';
  at: 'branchLan' | 'branchFw' | 'internet' | 'hqFw' | 'hqLan' | 'tunnel';
}

export const vpnSteps: VpnStep[] = [
  { at: 'tunnel', packet: 'none', title: 'Two sites, one Internet', text: 'The **branch** (LAN 10.20.5.0/24, firewall public IP 198.51.100.7) and the **head office DC** (LAN 10.1.0.0/16, firewall 203.0.113.10) are connected only by the public Internet. We need a **private, encrypted tunnel**.' },
  { at: 'tunnel', packet: 'ike', title: 'IKE Phase 1', text: 'The two firewalls **authenticate each other** (pre-shared key or certificates) and use Diffie-Hellman to create a secure management channel (the IKE SA). Uses **UDP 500** (UDP 4500 if NAT is in the path).' },
  { at: 'tunnel', packet: 'ike', title: 'IKE Phase 2', text: 'Inside that channel they agree the **IPsec SAs**: which traffic to protect (10.20.5.0/24 ↔ 10.1.0.0/16), encryption (e.g. **AES-256**) and integrity (e.g. **SHA-256**). The tunnel is **up**.' },
  { at: 'branchLan', packet: 'inner', title: 'PC sends a normal packet', text: 'A teller PC sends a normal packet: **src 10.20.5.25 → dst 10.1.10.50**. The PC does not know about the VPN at all.' },
  { at: 'branchFw', packet: 'encrypted', title: 'Encrypt + new header (ESP tunnel mode)', text: 'The branch firewall matches the traffic, **encrypts the whole original packet** with ESP and adds a **new outer IP header**: 198.51.100.7 → 203.0.113.10.' },
  { at: 'internet', packet: 'encrypted', title: 'Across the Internet', text: 'On the Internet, anyone capturing the packet sees only the **public IPs** and **encrypted data**. They cannot read or change it (integrity check would fail).' },
  { at: 'hqFw', packet: 'encrypted', title: 'Check and decrypt', text: 'The HQ firewall checks the **integrity** (was it changed?), **decrypts** it and removes the outer header.' },
  { at: 'hqLan', packet: 'inner', title: 'Original packet delivered', text: 'The original packet (10.20.5.25 → 10.1.10.50) is forwarded to the server, exactly as sent. **Confidentiality, integrity and authentication** — over a cheap Internet link.' },
];

/* ---------- RAID ---------- */
export interface RaidLevel {
  level: string;
  name: string;
  disks: string[][]; // disks[d] = blocks on disk d (top → bottom)
  pairs?: number[][]; // RAID 10 mirror pairs
  min: number;
  capacity: string;
  tolerance: string;
  performance: string;
  use: string;
  survives: (failed: number[]) => boolean;
}

export const raidLevels: RaidLevel[] = [
  {
    level: '0', name: 'Striping',
    disks: [['A1', 'A3', 'A5'], ['A2', 'A4', 'A6']],
    min: 2, capacity: '100% (all disks)', tolerance: 'None — 1 disk fails = all data lost', performance: 'Fastest read and write',
    use: 'Temporary/scratch data, video editing. **Never** for bank data alone.',
    survives: (f) => f.length === 0,
  },
  {
    level: '1', name: 'Mirroring',
    disks: [['A1', 'A2', 'A3'], ['A1', 'A2', 'A3']],
    min: 2, capacity: '50%', tolerance: '1 disk (of the pair)', performance: 'Good read, normal write',
    use: 'Operating system disks of servers (boot drives).',
    survives: (f) => f.length < 2,
  },
  {
    level: '5', name: 'Striping + parity',
    disks: [['A1', 'B1', 'Cp'], ['A2', 'Bp', 'C1'], ['Ap', 'B2', 'C2']],
    min: 3, capacity: '(n − 1) / n, e.g. 67% with 3 disks', tolerance: '1 disk', performance: 'Good read, slower write (parity calculation)',
    use: 'File servers, general storage. Rebuild of large disks is slow and risky.',
    survives: (f) => f.length < 2,
  },
  {
    level: '10', name: 'Mirror + stripe (1+0)',
    disks: [['A1', 'A3', 'A5'], ['A1', 'A3', 'A5'], ['A2', 'A4', 'A6'], ['A2', 'A4', 'A6']],
    pairs: [[0, 1], [2, 3]],
    min: 4, capacity: '50%', tolerance: '1 disk per mirror pair (up to 2 if in different pairs)', performance: 'Very fast read and write',
    use: '**Databases** and transaction systems (e.g. core banking DB) — speed + safety.',
    survives: (f) => !(f.includes(0) && f.includes(1)) && !(f.includes(2) && f.includes(3)),
  },
];

/* ---------- Backup timeline ---------- */
export const backupDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export type BackupMode = 'full' | 'incremental' | 'differential';

export const backupModes: Record<BackupMode, { label: string; desc: string; backupSpeed: string; restore: string; tone: Tone }> = {
  full: { label: 'Full every day', desc: 'Copies **everything** every day.', backupSpeed: 'Slowest, uses most storage', restore: 'Fastest: only 1 backup needed', tone: 'blue' },
  incremental: { label: 'Incremental', desc: 'Sunday full, then each day copies only what changed **since the last backup of any type**.', backupSpeed: 'Fastest, smallest', restore: 'Slowest: last full + **every** incremental since', tone: 'green' },
  differential: { label: 'Differential', desc: 'Sunday full, then each day copies everything changed **since the last FULL**.', backupSpeed: 'Grows each day', restore: 'Medium: last full + **latest** differential only', tone: 'amber' },
};

/* ---------- DR sites ---------- */
export const drSites: { name: string; icon: string; tone: Tone; rto: string; cost: number; ready: number; what: string; data: string }[] = [
  { name: 'Hot site', icon: '🔥', tone: 'red', rto: 'Minutes – a few hours', cost: 5, ready: 5, what: 'Full copy of hardware, software and network, **running all the time**.', data: 'Real-time or near real-time replication' },
  { name: 'Warm site', icon: '🌤️', tone: 'amber', rto: 'Hours – 1–2 days', cost: 3, ready: 3, what: 'Hardware and network are ready, but systems must be started and **data restored or synced**.', data: 'Periodic replication or recent backups' },
  { name: 'Cold site', icon: '❄️', tone: 'blue', rto: 'Days – weeks', cost: 1, ready: 1, what: 'Only a room with **power, cooling and network**. Hardware must be brought and installed.', data: 'Restore from backups (tapes/offsite)' },
];

/* ---------- RPO / RTO ---------- */
export const rpoOptions = [
  { label: 'Daily backup', hours: 24 },
  { label: 'Every 4 hours', hours: 4 },
  { label: 'Every 15 min (log shipping)', hours: 0.25 },
  { label: 'Synchronous replication', hours: 0 },
];

export const rtoOptions = [
  { label: 'Cold site', hours: 72 },
  { label: 'Warm site', hours: 12 },
  { label: 'Hot site', hours: 1 },
];
