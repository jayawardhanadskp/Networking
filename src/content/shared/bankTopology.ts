import type { TopologySpec } from '../types';

/**
 * Generic bank network (illustration only — NOT any real bank's design).
 * Reused by several modules.
 */
export const bankTopology: TopologySpec = {
  kind: 'topology',
  title: 'A typical bank network (generic example)',
  width: 360,
  height: 450,
  hint: 'Tap any device to see what it does. Press Next to follow traffic.',
  zones: [
    { label: 'Internet', x: 4, y: 4, w: 120, h: 80, tone: 'red' },
    { label: 'DMZ', x: 130, y: 4, w: 226, h: 80, tone: 'amber' },
    { label: 'Primary data centre', x: 4, y: 92, w: 230, h: 215, tone: 'green' },
    { label: 'DR site', x: 240, y: 92, w: 116, h: 215, tone: 'purple' },
    { label: 'Branches & ATMs', x: 4, y: 315, w: 352, h: 131, tone: 'blue' },
  ],
  nodes: [
    { id: 'inet', label: 'Internet', icon: 'internet', x: 40, y: 45, info: 'The public Internet: customers using Internet/mobile banking, and attackers too. Everything from here is **untrusted**.' },
    { id: 'web', label: 'Web / API', icon: 'server', x: 200, y: 45, sub: 'Internet banking', info: '**DMZ servers**: Internet banking web servers, API gateway, email relay. Reachable from the Internet only on specific ports (e.g. 443), behind a WAF and load balancer. They never hold the core database.' },
    { id: 'lb', label: 'LB / WAF', icon: 'lb', x: 300, y: 45, info: '**Load balancer + Web Application Firewall**: spreads traffic over several web servers, terminates TLS, and blocks web attacks (SQL injection, XSS).' },
    { id: 'efw', label: 'Edge FW', icon: 'firewall', x: 125, y: 135, sub: 'perimeter', info: '**Perimeter (edge) firewall**: separates Internet, DMZ and internal network. Rules like: Internet → DMZ web 443 allowed; Internet → internal denied. Often a next-generation firewall with IPS.' },
    { id: 'core', label: 'Core switch', icon: 'switch', x: 125, y: 200, sub: 'L3', info: '**Core / L3 switches** (usually a redundant pair): very fast routing between data centre VLANs and to the WAN.' },
    { id: 'cbs', label: 'Core banking', icon: 'server', x: 45, y: 200, sub: 'app servers', info: '**Core banking system (CBS)** application servers: accounts, deposits, loans, transactions. The heart of the bank — in the most protected internal zone.' },
    { id: 'db', label: 'Database', icon: 'db', x: 45, y: 270, info: '**Database servers** (clustered). Only the application servers may connect, on the DB port. Backed up and replicated to the DR site.' },
    { id: 'atmsw', label: 'ATM switch', icon: 'card', x: 200, y: 200, sub: 'card system', info: '**ATM switch / card management**: receives ATM and card transactions (ISO 8583), checks with the core system, and connects to card networks / LankaPay.' },
    { id: 'dr', label: 'DR servers', icon: 'server', x: 300, y: 135, sub: 'replica', info: '**Disaster recovery site**: a copy of critical systems in another location. Data is **replicated** from the primary DC so the bank can continue if the main DC fails.' },
    { id: 'drdb', label: 'DR database', icon: 'db', x: 300, y: 270, info: 'Replica database kept in sync (synchronous or asynchronous replication) — decides the **RPO**.' },
    { id: 'wan', label: 'MPLS / VPN', icon: 'cloud', x: 180, y: 350, sub: 'WAN', info: '**WAN**: an MPLS network from a telecom provider (primary), plus a backup link such as 4G/Internet with an **IPsec VPN**. Connects all branches and ATMs to the data centres.' },
    { id: 'br1', label: 'Branch A', icon: 'building', x: 45, y: 405, info: '**Branch**: router + firewall, switch with VLANs (staff, voice, CCTV, ATM). Two WAN links for redundancy.' },
    { id: 'br2', label: 'Branch B', icon: 'building', x: 130, y: 405, info: 'Another branch, same standard design — makes support easy.' },
    { id: 'atm', label: 'ATM', icon: 'atm', x: 230, y: 405, info: '**ATM**: in its own VLAN/subnet, traffic encrypted, talks only to the ATM switch. Some off-site ATMs connect over 4G with VPN.' },
    { id: 'ho', label: 'Head office', icon: 'bank', x: 315, y: 405, info: '**Head office**: management and back-office staff, many VLANs per department, connected to the DC by high-speed links.' },
  ],
  links: [
    { from: 'inet', to: 'efw' },
    { from: 'efw', to: 'web' },
    { from: 'web', to: 'lb' },
    { from: 'efw', to: 'core' },
    { from: 'core', to: 'cbs' },
    { from: 'cbs', to: 'db' },
    { from: 'core', to: 'atmsw' },
    { from: 'core', to: 'dr', label: 'DC–DR link', style: 'dashed', tone: 'purple' },
    { from: 'dr', to: 'drdb' },
    { from: 'db', to: 'drdb', label: 'replication', style: 'dashed', tone: 'purple' },
    { from: 'core', to: 'wan' },
    { from: 'wan', to: 'br1' },
    { from: 'wan', to: 'br2' },
    { from: 'wan', to: 'atm', style: 'tunnel' },
    { from: 'wan', to: 'ho' },
  ],
  steps: [
    { text: '**Teller transaction**: a teller in Branch A posts a deposit. Traffic goes over the **WAN** to the data centre core switch, then to the **core banking** app servers, which write to the database.', paths: [['br1', 'wan', 'core', 'cbs', 'db']], packet: 'deposit' },
    { text: '**ATM withdrawal**: the ATM sends an encrypted ISO 8583 message over the WAN/VPN to the **ATM switch**, which asks the core banking system to approve it.', paths: [['atm', 'wan', 'core', 'atmsw']], packet: 'ISO 8583', tone: 'teal' },
    { text: '**Internet banking**: a customer on the Internet reaches the **DMZ web servers** through the edge firewall and WAF on port 443. The web tier calls internal APIs — the customer never touches the database directly.', paths: [['inet', 'efw', 'web', 'lb']], packet: 'HTTPS', tone: 'amber' },
    { text: '**Attack blocked**: someone on the Internet tries to connect straight to the core banking database. The **edge firewall** has no rule for it → **dropped and logged**.', paths: [['inet', 'efw']], packet: 'DB port?', tone: 'red', blocked: true },
    { text: '**Replication**: the primary database continuously copies changes to the **DR database**. If the primary DC fails, the bank switches to the DR site.', paths: [['db', 'drdb']], packet: 'replica', tone: 'purple' },
  ],
};
