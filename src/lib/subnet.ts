/**
 * IPv4 subnet calculator + practice question generator.
 * All math uses unsigned 32-bit integers (>>> 0).
 */

export function ipToInt(ip: string): number {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) throw new Error(`Invalid IPv4 address: "${ip}"`);
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) throw new Error(`Invalid IPv4 address: "${ip}"`);
    const v = Number(p);
    if (v > 255) throw new Error(`Octet out of range (0-255): "${p}"`);
    n = n * 256 + v;
  }
  return n >>> 0;
}

export function intToIp(n: number): string {
  n = n >>> 0;
  return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

export function prefixToMask(prefix: number): number {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error(`Invalid prefix: /${prefix}`);
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

/** Returns the prefix length for a valid (contiguous) mask, or null. */
export function maskToPrefix(mask: string | number): number | null {
  let m: number;
  try {
    m = typeof mask === 'number' ? mask >>> 0 : ipToInt(mask);
  } catch {
    return null;
  }
  for (let p = 0; p <= 32; p++) if (prefixToMask(p) === m) return p;
  return null;
}

export function toBinary(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}

export function toDottedBinary(n: number): string {
  const b = toBinary(n);
  return [b.slice(0, 8), b.slice(8, 16), b.slice(16, 24), b.slice(24)].join('.');
}

export type IpClass = 'A' | 'B' | 'C' | 'D (multicast)' | 'E (reserved)';

export function ipClass(ip: number): IpClass {
  const first = ip >>> 24;
  if (first < 128) return 'A';
  if (first < 192) return 'B';
  if (first < 224) return 'C';
  if (first < 240) return 'D (multicast)';
  return 'E (reserved)';
}

/** Describes special ranges (RFC 1918 private, loopback, APIPA, CGNAT...). */
export function addressType(ip: number): string {
  const inRange = (net: string, prefix: number) => ((ip & prefixToMask(prefix)) >>> 0) === ipToInt(net);
  if (inRange('10.0.0.0', 8) || inRange('172.16.0.0', 12) || inRange('192.168.0.0', 16)) return 'Private (RFC 1918)';
  if (inRange('127.0.0.0', 8)) return 'Loopback';
  if (inRange('169.254.0.0', 16)) return 'Link-local / APIPA';
  if (inRange('100.64.0.0', 10)) return 'Carrier-grade NAT (shared)';
  if (inRange('0.0.0.0', 8)) return '"This network" (special)';
  if (inRange('224.0.0.0', 4)) return 'Multicast';
  if (inRange('240.0.0.0', 4)) return 'Reserved';
  return 'Public';
}

export function isPrivate(ip: number): boolean {
  return addressType(ip) === 'Private (RFC 1918)';
}

export interface SubnetResult {
  ip: string;
  prefix: number;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  usableHosts: number;
  ipClass: IpClass;
  addressType: string;
  note?: string;
  bits: { ip: string; mask: string; network: string };
}

export function calculate(ipInput: string | number, prefix: number): SubnetResult {
  const ip = typeof ipInput === 'number' ? ipInput >>> 0 : ipToInt(ipInput);
  const mask = prefixToMask(prefix);
  const wildcard = ~mask >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const total = 2 ** (32 - prefix);
  let first: number, last: number, usable: number;
  let note: string | undefined;
  if (prefix === 32) {
    first = last = network;
    usable = 1;
    note = '/32 is a single host route (often used for loopbacks).';
  } else if (prefix === 31) {
    first = network;
    last = broadcast;
    usable = 2;
    note = '/31 is used on point-to-point links (RFC 3021): no network/broadcast address, both are usable.';
  } else {
    first = network + 1;
    last = broadcast - 1;
    usable = total - 2;
  }
  return {
    ip: intToIp(ip),
    prefix,
    mask: intToIp(mask),
    wildcard: intToIp(wildcard),
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(first),
    lastHost: intToIp(last),
    totalAddresses: total,
    usableHosts: usable,
    ipClass: ipClass(ip),
    addressType: addressType(ip),
    note,
    bits: { ip: toBinary(ip), mask: toBinary(mask), network: toBinary(network) },
  };
}

/**
 * Parses "192.168.1.10/26", "192.168.1.10 255.255.255.192" or "192.168.1.10 /26".
 */
export function parseInput(input: string): { ip: string; prefix: number } {
  const s = input.trim().replace(/\s*\/\s*/, '/');
  let m = s.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
  if (m) {
    ipToInt(m[1]);
    const prefix = Number(m[2]);
    if (prefix > 32) throw new Error('Prefix must be between 0 and 32');
    return { ip: m[1], prefix };
  }
  m = s.match(/^(\d{1,3}(?:\.\d{1,3}){3})\s+(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (m) {
    ipToInt(m[1]);
    const prefix = maskToPrefix(m[2]);
    if (prefix === null) throw new Error(`"${m[2]}" is not a valid subnet mask (1s must be contiguous)`);
    return { ip: m[1], prefix };
  }
  throw new Error('Use the format 192.168.1.10/26 or 192.168.1.10 255.255.255.192');
}

/** Smallest subnet (largest prefix) that gives at least `hosts` usable addresses (classic -2 rule). */
export function prefixForHosts(hosts: number): number {
  if (hosts < 1) throw new Error('Hosts must be at least 1');
  let h = 2;
  while (2 ** h - 2 < hosts) h++;
  if (h > 32) throw new Error('Too many hosts for IPv4');
  return 32 - h;
}

/** Step-by-step "magic number" explanation for network/broadcast/hosts. */
export function explainSteps(ipInput: string, prefix: number): string[] {
  const r = calculate(ipInput, prefix);
  const steps: string[] = [];
  const octets = r.ip.split('.').map(Number);
  const maskOctets = r.mask.split('.').map(Number);
  steps.push(`/${prefix} means the first ${prefix} bits are network bits and the last ${32 - prefix} bits are host bits.`);
  steps.push(`Write the mask: ${prefix} ones = ${toDottedBinary(prefixToMask(prefix))} = **${r.mask}**.`);
  if (prefix === 32 || prefix === 31) {
    steps.push(r.note ?? '');
    return steps;
  }
  if (prefix % 8 === 0) {
    const keep = prefix / 8;
    steps.push(`The mask only has 255s and 0s, so keep the first ${keep} octet(s) and set the rest to 0 for the network address: **${r.network}**.`);
    steps.push(`Set the host octets to 255 for the broadcast: **${r.broadcast}**.`);
  } else {
    const idx = Math.floor(prefix / 8);
    const magic = 256 - maskOctets[idx];
    const ordinal = ['1st', '2nd', '3rd', '4th'][idx];
    steps.push(`The "interesting" octet is the ${ordinal} one (mask value ${maskOctets[idx]}). Block size (magic number) = 256 − ${maskOctets[idx]} = **${magic}**.`);
    const start = Math.floor(octets[idx] / magic) * magic;
    const multiples: number[] = [];
    for (let v = Math.max(0, start - magic); v <= Math.min(256 - magic, start + magic); v += magic) multiples.push(v);
    steps.push(`Subnets go up in steps of ${magic} in that octet: …${multiples.join(', ')}… The IP's ${ordinal} octet is ${octets[idx]}, which falls in the block starting at **${start}** (up to ${start + magic - 1}).`);
    steps.push(`Network address = that block start, host octets after it = 0 → **${r.network}**.`);
    steps.push(`Broadcast = next block (${start + magic}) minus 1 = ${start + magic - 1}, host octets after it = 255 → **${r.broadcast}**.`);
  }
  steps.push(`First host = network + 1 = **${r.firstHost}**. Last host = broadcast − 1 = **${r.lastHost}**.`);
  steps.push(`Usable hosts = 2^${32 - prefix} − 2 = ${r.totalAddresses} − 2 = **${r.usableHosts.toLocaleString('en-US')}**.`);
  steps.push(`Wildcard mask = 255.255.255.255 − mask = **${r.wildcard}** (used in ACLs and OSPF).`);
  return steps;
}

/* ---------------- Practice question generator ---------------- */

export type PracticeKind = 'network' | 'broadcast' | 'firstHost' | 'lastHost' | 'hosts' | 'mask' | 'wildcard' | 'prefixForHosts';

export interface PracticeQuestion {
  kind: PracticeKind;
  question: string;
  answer: string;
  /** Answers that should also be accepted (normalised). */
  accept: string[];
  steps: string[];
  ip?: string;
  prefix?: number;
}

export type Rng = () => number;

/** Small seeded RNG (mulberry32) so tests are reproducible. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

function randomPrivateIp(rng: Rng): string {
  const pick = int(rng, 0, 2);
  if (pick === 0) return `10.${int(rng, 0, 255)}.${int(rng, 0, 255)}.${int(rng, 1, 254)}`;
  if (pick === 1) return `172.${int(rng, 16, 31)}.${int(rng, 0, 255)}.${int(rng, 1, 254)}`;
  return `192.168.${int(rng, 0, 255)}.${int(rng, 1, 254)}`;
}

function randomPrefix(rng: Rng): number {
  // Weighted towards the prefixes most asked in interviews (/24–/30), some /16–/23.
  return rng() < 0.7 ? int(rng, 24, 30) : int(rng, 16, 23);
}

export const ALL_KINDS: PracticeKind[] = ['network', 'broadcast', 'firstHost', 'lastHost', 'hosts', 'mask', 'wildcard', 'prefixForHosts'];

export function generateQuestion(rng: Rng = Math.random, kinds: PracticeKind[] = ALL_KINDS): PracticeQuestion {
  const kind = kinds[int(rng, 0, kinds.length - 1)];
  const ip = randomPrivateIp(rng);
  const prefix = randomPrefix(rng);
  const r = calculate(ip, prefix);
  const cidr = `${ip}/${prefix}`;
  const steps = explainSteps(ip, prefix);
  switch (kind) {
    case 'network':
      return { kind, ip, prefix, question: `What is the **network address** of ${cidr}?`, answer: r.network, accept: [], steps };
    case 'broadcast':
      return { kind, ip, prefix, question: `What is the **broadcast address** of ${cidr}?`, answer: r.broadcast, accept: [], steps };
    case 'firstHost':
      return { kind, ip, prefix, question: `What is the **first usable host** in ${cidr}?`, answer: r.firstHost, accept: [], steps };
    case 'lastHost':
      return { kind, ip, prefix, question: `What is the **last usable host** in ${cidr}?`, answer: r.lastHost, accept: [], steps };
    case 'hosts':
      return {
        kind, prefix,
        question: `How many **usable hosts** are in a /${prefix} subnet?`,
        answer: String(r.usableHosts), accept: [r.usableHosts.toLocaleString('en-US')],
        steps: [
          `Host bits = 32 − ${prefix} = ${32 - prefix}.`,
          `Total addresses = 2^${32 - prefix} = ${r.totalAddresses.toLocaleString('en-US')}.`,
          `Subtract 2 (network + broadcast) → **${r.usableHosts.toLocaleString('en-US')}** usable hosts.`,
        ],
      };
    case 'mask':
      return {
        kind, prefix,
        question: `What is the **dotted-decimal subnet mask** for /${prefix}?`,
        answer: r.mask, accept: [],
        steps: [
          `Write ${prefix} ones followed by ${32 - prefix} zeros: ${toDottedBinary(prefixToMask(prefix))}.`,
          `Convert each octet to decimal (bit values 128 64 32 16 8 4 2 1) → **${r.mask}**.`,
        ],
      };
    case 'wildcard':
      return {
        kind, prefix,
        question: `What is the **wildcard mask** for /${prefix}?`,
        answer: r.wildcard, accept: [],
        steps: [
          `Subnet mask for /${prefix} = ${r.mask}.`,
          `Wildcard = 255.255.255.255 − mask, octet by octet → **${r.wildcard}**.`,
        ],
      };
    case 'prefixForHosts': {
      const need = int(rng, 0, 1) === 0 ? int(rng, 3, 60) : int(rng, 61, 1000);
      const p = prefixForHosts(need);
      const h = 32 - p;
      return {
        kind, prefix: p,
        question: `A branch needs **${need} hosts** in one subnet. What is the smallest subnet (largest prefix) that fits? Answer like /26.`,
        answer: `/${p}`, accept: [String(p), intToIp(prefixToMask(p))],
        steps: [
          `Find the smallest number of host bits h where 2^h − 2 ≥ ${need}.`,
          `2^${h - 1} − 2 = ${2 ** (h - 1) - 2} (too small), 2^${h} − 2 = ${2 ** h - 2} (fits).`,
          `Host bits = ${h}, so prefix = 32 − ${h} = **/${p}** (mask ${intToIp(prefixToMask(p))}).`,
        ],
      };
    }
  }
}

export function normaliseAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '');
}

export function checkAnswer(q: PracticeQuestion, input: string): boolean {
  const n = normaliseAnswer(input);
  if (!n) return false;
  return [q.answer, ...q.accept].some((a) => normaliseAnswer(a) === n);
}
