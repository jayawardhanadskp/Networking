import type { ComponentType } from 'react';
import type { CustomVisualId } from '../../content/types';
import { OsiExplorer } from './OsiExplorer';
import { PacketJourney } from './PacketJourney';
import { NatPat } from './NatPat';
import { SubnetBits } from './SubnetBits';
import { PortGrid } from './PortGrid';
import {
  IntegrationMap, IntegrationTroubleshoot, Idempotency, MessageQueue, MtiDecoder, P2pVsHub, Reconciliation, TlsHandshake,
} from './IntegrationVisuals';
import { BackupTimeline, DrSites, Raid, RpoRto, VlanSwitch, VpnTunnel } from './InfraVisuals';

/** Register custom (hand-built) visuals here. Content refers to them by id. */
export const customVisuals: Record<CustomVisualId, ComponentType> = {
  osi: OsiExplorer,
  packetJourney: PacketJourney,
  natPat: NatPat,
  subnetBits: SubnetBits,
  portGrid: PortGrid,
  vlanSwitch: VlanSwitch,
  vpnTunnel: VpnTunnel,
  raid: Raid,
  backupTimeline: BackupTimeline,
  drSites: DrSites,
  rpoRto: RpoRto,
  integrationMap: IntegrationMap,
  p2pHub: P2pVsHub,
  messageQueue: MessageQueue,
  mtiDecoder: MtiDecoder,
  idempotency: Idempotency,
  reconciliation: Reconciliation,
  tlsHandshake: TlsHandshake,
  integrationTroubleshoot: IntegrationTroubleshoot,
};
