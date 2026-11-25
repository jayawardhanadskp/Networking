import type { ComponentType } from 'react';
import type { CustomVisualId, VisualSpec } from '../content/types';
import { Sequence } from './visuals/Sequence';
import { Flow } from './visuals/Flow';
import { Topology } from './visuals/Topology';
import { Compare, Fields } from './visuals/Compare';
import { customVisuals } from './custom';

const kindLabel: Record<VisualSpec['kind'], string> = {
  sequence: '▶ Step-by-step animation',
  flow: '▶ Step-by-step process',
  topology: '🖧 Network diagram',
  compare: '⚖ Comparison',
  fields: '🧩 Diagram',
  custom: '✨ Interactive',
};

const customTitle: Record<CustomVisualId, string> = {
  osi: 'OSI vs TCP/IP — tap a layer',
  packetJourney: 'Packet journey: a branch PC opens the core banking web app',
  natPat: 'NAT / PAT translation table',
  vlanSwitch: 'VLANs on one switch',
  subnetBits: 'Subnetting in binary: network bits vs host bits',
  vpnTunnel: 'Site-to-site IPsec VPN tunnel',
  raid: 'RAID levels',
  backupTimeline: 'Backup types on a weekly timeline',
  drSites: 'Hot vs warm vs cold DR sites',
  rpoRto: 'RPO and RTO on a timeline',
  portGrid: 'Port memory grid — tap to flip',
};

export function Visual({ spec }: { spec: VisualSpec }) {
  const title = spec.kind === 'custom' ? spec.title ?? customTitle[spec.id] : spec.title;
  let body;
  switch (spec.kind) {
    case 'sequence': body = <Sequence spec={spec} />; break;
    case 'flow': body = <Flow spec={spec} />; break;
    case 'topology': body = <Topology spec={spec} />; break;
    case 'compare': body = <Compare spec={spec} />; break;
    case 'fields': body = <Fields spec={spec} />; break;
    case 'custom': {
      const C: ComponentType | undefined = customVisuals[spec.id];
      body = C ? <C /> : <p className="text-sm text-slate-500">Visual “{spec.id}” is coming soon.</p>;
      break;
    }
  }
  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <figcaption className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[14px] font-bold text-slate-900 dark:text-white">{title}</span>
        <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{kindLabel[spec.kind]}</span>
      </figcaption>
      {body}
    </figure>
  );
}
