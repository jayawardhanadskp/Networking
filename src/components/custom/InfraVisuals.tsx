import { useState } from 'react';
import {
  backupDays, backupModes, drSites, raidLevels, rpoOptions, rtoOptions, switchPorts, vlans, vpnSteps,
  type BackupMode,
} from '../../content/visual-data/infraData';
import { toneBg, toneHex, toneSolid } from '../tone';
import { DeviceIcon } from '../visuals/DeviceIcon';
import { StepBadge, StepControls } from '../visuals/StepControls';
import { inline } from '../Md';

/* ================= VLANs on one switch ================= */
export function VlanSwitch() {
  const [sel, setSel] = useState<number | null>(null);
  const [bcast, setBcast] = useState(false);
  const active = bcast ? 10 : sel;
  const v = vlans.find((x) => x.id === active);

  return (
    <div>
      <div className="rounded-xl bg-slate-800 p-2.5 shadow-inner dark:bg-slate-950">
        <div className="mb-1.5 flex justify-between text-[10px] font-semibold text-slate-400">
          <span>Branch access switch</span>
          <span>24-port (12 shown)</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
          {switchPorts.map((vlan, i) => {
            const info = vlans.find((x) => x.id === vlan);
            const trunk = vlan === -1;
            const on = active === null || vlan === active || (trunk && active !== null);
            const isSource = bcast && i === 0;
            return (
              <button
                type="button"
                key={i}
                onClick={() => { setBcast(false); setSel(trunk || vlan === 0 ? null : vlan); }}
                className={`relative flex h-12 flex-col items-center justify-center rounded-md border-2 text-[10px] font-bold transition-all ${on ? 'opacity-100' : 'opacity-20'} ${isSource ? 'ring-4 ring-white' : ''}`}
                style={{
                  borderColor: info ? toneHex[info.tone] : trunk ? '#e2e8f0' : '#475569',
                  background: trunk
                    ? `repeating-linear-gradient(135deg, ${toneHex.blue} 0 5px, ${toneHex.purple} 5px 10px, ${toneHex.amber} 10px 15px, ${toneHex.red} 15px 20px, ${toneHex.teal} 20px 25px)`
                    : info ? `${toneHex[info.tone]}cc` : '#1e293b',
                  color: 'white',
                }}
              >
                <span>{i + 1}</span>
                <span className="text-[8.5px] font-semibold">{trunk ? 'TRUNK' : vlan === 0 ? 'off' : `V${vlan}`}</span>
                {bcast && on && !isSource && <span className="absolute -top-1.5 -right-1 text-[11px]">📢</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {vlans.map((x) => (
          <button
            type="button"
            key={x.id}
            onClick={() => { setBcast(false); setSel(sel === x.id ? null : x.id); }}
            className={`rounded-full border px-2.5 py-1 text-[12px] font-semibold ${active === x.id ? toneSolid[x.tone] : toneBg[x.tone]}`}
          >
            VLAN {x.id} · {x.name}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => { setBcast(!bcast); setSel(null); }}
        className="mt-2 w-full rounded-xl bg-indigo-600 px-3 py-2 text-[13px] font-semibold text-white dark:bg-indigo-500"
      >
        {bcast ? 'Reset' : '📢 Send a broadcast from port 1 (VLAN 10)'}
      </button>
      <div className="mt-2 min-h-14 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[14px] leading-relaxed dark:border-indigo-500/30 dark:bg-indigo-500/10">
        {bcast ? (
          <>The broadcast reaches <strong>only VLAN 10 ports (1–4)</strong> and the <strong>trunk</strong> (tagged as VLAN 10). Voice, CCTV and ATM ports never see it. <strong>One VLAN = one broadcast domain.</strong></>
        ) : v ? (
          <><strong>VLAN {v.id} – {v.name}:</strong> {v.note} To talk to another VLAN, traffic must go through a <strong>router / L3 switch</strong> (and firewall rules).</>
        ) : (
          <>Tap a VLAN or a port. Port <strong>12</strong> is a <strong>trunk</strong> (802.1Q) carrying all VLANs to the router. Port <strong>11</strong> is unused and <strong>shut down</strong> — good security practice.</>
        )}
      </div>
    </div>
  );
}

/* ================= Site-to-site VPN ================= */
export function VpnTunnel() {
  const [step, setStep] = useState(0);
  const s = vpnSteps[step];
  const pos: Record<string, number> = { branchLan: 30, branchFw: 95, internet: 180, hqFw: 265, hqLan: 330, tunnel: 180 };
  const x = pos[s.at];
  const tunnelUp = step >= 2;

  return (
    <div>
      <svg viewBox="0 0 360 150" className="w-full">
        <rect x={4} y={20} width={120} height={110} rx={10} fill={`${toneHex.blue}14`} stroke={`${toneHex.blue}88`} strokeDasharray="5 4" />
        <text x={12} y={34} fontSize={10} fontWeight={700} fill={toneHex.blue}>Branch</text>
        <rect x={236} y={20} width={120} height={110} rx={10} fill={`${toneHex.green}14`} stroke={`${toneHex.green}88`} strokeDasharray="5 4" />
        <text x={244} y={34} fontSize={10} fontWeight={700} fill={toneHex.green}>Head office DC</text>
        <g transform="translate(180,30)">
          <DeviceIcon icon="internet" size={0.8} />
          <text y={24} fontSize={9} textAnchor="middle" className="fill-slate-500">Internet</text>
        </g>
        {/* tunnel pipe */}
        <rect x={95} y={73} width={170} height={18} rx={9} fill={tunnelUp ? `${toneHex.green}33` : 'transparent'} stroke={tunnelUp ? toneHex.green : '#94a3b8'} strokeDasharray={tunnelUp ? undefined : '4 4'} strokeWidth={1.5} />
        {tunnelUp && <text x={180} y={104} fontSize={8.5} textAnchor="middle" fill={toneHex.green} fontWeight={700}>🔒 IPsec tunnel (ESP)</text>}
        <line x1={30} y1={82} x2={95} y2={82} className="stroke-slate-400" strokeWidth={2} />
        <line x1={265} y1={82} x2={330} y2={82} className="stroke-slate-400" strokeWidth={2} />
        <g transform="translate(30,82)"><DeviceIcon icon="pc" size={0.75} /></g>
        <text x={30} y={112} fontSize={8} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300">10.20.5.25</text>
        <g transform="translate(95,82)"><DeviceIcon icon="firewall" size={0.75} active={s.at === 'branchFw'} tone={toneHex.green} /></g>
        <text x={95} y={112} fontSize={8} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300">198.51.100.7</text>
        <g transform="translate(265,82)"><DeviceIcon icon="firewall" size={0.75} active={s.at === 'hqFw'} tone={toneHex.green} /></g>
        <text x={265} y={112} fontSize={8} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300">203.0.113.10</text>
        <g transform="translate(330,82)"><DeviceIcon icon="server" size={0.75} /></g>
        <text x={330} y={112} fontSize={8} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300">10.1.10.50</text>
        {s.packet === 'ike' && (
          <circle key={step} r={6} cy={82} fill={toneHex.purple} stroke="white" strokeWidth={2}>
            <animate attributeName="cx" values="95;265;95" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
        {(s.packet === 'inner' || s.packet === 'encrypted') && (
          <circle key={step} cx={x} cy={82} r={7} fill={s.packet === 'encrypted' ? toneHex.green : toneHex.blue} stroke="white" strokeWidth={2} />
        )}
      </svg>

      <div className="mt-1 flex min-h-[54px] gap-0.5 overflow-hidden rounded-lg text-center text-[10.5px] font-bold text-white">
        {s.packet === 'none' && <div className="flex flex-1 items-center justify-center bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-200">No traffic yet</div>}
        {s.packet === 'ike' && <div className="pkt-in flex flex-1 items-center justify-center" style={{ background: toneHex.purple }}>IKE negotiation · UDP 500</div>}
        {s.packet === 'inner' && (
          <>
            <div className="pkt-in flex flex-[2] flex-col items-center justify-center" style={{ background: toneHex.green }}>IP header<span className="text-[9px] font-medium">10.20.5.25 → 10.1.10.50</span></div>
            <div className="pkt-in flex flex-1 items-center justify-center" style={{ background: toneHex.blue }}>TCP</div>
            <div className="pkt-in flex flex-[2] items-center justify-center" style={{ background: toneHex.purple }}>Data</div>
          </>
        )}
        {s.packet === 'encrypted' && (
          <>
            <div className="pkt-in flex flex-[2] flex-col items-center justify-center" style={{ background: toneHex.amber }}>New IP header<span className="text-[9px] font-medium">198.51.100.7 → 203.0.113.10</span></div>
            <div className="pkt-in flex flex-1 items-center justify-center" style={{ background: toneHex.teal }}>ESP</div>
            <div className="pkt-in flex flex-[4] flex-col items-center justify-center bg-slate-600">🔒 encrypted original packet<span className="text-[9px] font-medium opacity-80">x8#kQ2…(IP + TCP + data)</span></div>
          </>
        )}
      </div>

      <div className="mt-2 min-h-16 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[14px] leading-relaxed dark:border-indigo-500/30 dark:bg-indigo-500/10">
        <StepBadge step={step} total={vpnSteps.length} />
        <strong>{s.title}. </strong>{inline(s.text)}
      </div>
      <StepControls step={step} total={vpnSteps.length} setStep={setStep} />
    </div>
  );
}

/* ================= RAID ================= */
export function Raid() {
  const [li, setLi] = useState(2);
  const [failed, setFailed] = useState<number[]>([]);
  const r = raidLevels[li];
  const ok = r.survives(failed);
  const toggle = (d: number) => setFailed((f) => (f.includes(d) ? f.filter((x) => x !== d) : [...f, d]));

  return (
    <div>
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-200 p-1 text-[13px] font-bold dark:bg-slate-800">
        {raidLevels.map((x, i) => (
          <button type="button" key={x.level} onClick={() => { setLi(i); setFailed([]); }} className={`rounded-lg py-1.5 ${li === i ? 'bg-white shadow dark:bg-slate-950' : 'text-slate-500'}`}>
            RAID {x.level}
          </button>
        ))}
      </div>
      <div className="mt-2 text-center text-[13px] font-semibold">RAID {r.level} — {r.name}</div>
      <div className="mt-2 flex justify-center gap-2">
        {r.disks.map((blocks, d) => {
          const dead = failed.includes(d);
          const pairIdx = r.pairs?.findIndex((p) => p.includes(d));
          return (
            <button type="button" key={d} onClick={() => toggle(d)} className="flex w-[70px] flex-col items-center">
              {r.pairs && <div className="mb-0.5 text-[9.5px] font-semibold text-slate-500">mirror {pairIdx! + 1}</div>}
              <div className={`w-full rounded-xl border-2 p-1.5 transition-all ${dead ? 'border-rose-500 bg-rose-100 dark:bg-rose-500/20' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'}`}>
                <div className="mb-1 text-center text-[16px]">{dead ? '💥' : '💽'}</div>
                {blocks.map((b, i) => (
                  <div
                    key={i}
                    className={`mb-1 rounded py-1 text-center font-mono text-[11.5px] font-bold ${dead ? 'bg-slate-300 text-slate-500 line-through dark:bg-slate-700' : b.endsWith('p') ? 'bg-amber-400 text-amber-950' : b.startsWith('A') ? 'bg-blue-500 text-white' : b.startsWith('B') ? 'bg-emerald-500 text-white' : 'bg-violet-500 text-white'}`}
                  >
                    {b}
                  </div>
                ))}
              </div>
              <div className="mt-0.5 text-[10.5px] font-semibold">Disk {d + 1}</div>
            </button>
          );
        })}
      </div>
      <p className="mt-1 text-center text-[11.5px] text-slate-500">👆 Tap disks to make them fail. {r.level === '5' && <span>Yellow = parity.</span>}</p>
      <div className={`mt-2 rounded-xl p-2.5 text-center text-[14px] font-bold ${ok ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200'}`}>
        {failed.length === 0 ? '✅ All disks healthy' : ok ? `✅ Data still safe with ${failed.length} failed disk${failed.length > 1 ? 's' : ''} — replace and rebuild!` : '❌ Array failed — data lost. Restore from backup!'}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 text-[12.5px]">
        {[['Minimum disks', String(r.min)], ['Usable capacity', r.capacity], ['Fault tolerance', r.tolerance], ['Performance', r.performance]].map(([k, val]) => (
          <div key={k} className="rounded-lg bg-slate-100 px-2 py-1.5 dark:bg-slate-800">
            <div className="text-[10.5px] text-slate-500">{k}</div>
            <div className="font-semibold leading-snug">{val}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[13px]">🏦 {inline(r.use)}</p>
    </div>
  );
}

/* ================= Backup timeline ================= */
export function BackupTimeline() {
  const [mode, setMode] = useState<BackupMode>('incremental');
  const [restoreDay, setRestoreDay] = useState(5);
  const m = backupModes[mode];
  const size = (d: number) => (mode === 'full' || d === 0 ? 100 : mode === 'incremental' ? 12 : 12 * d);
  const needed = (d: number) => {
    if (d > restoreDay) return false;
    if (mode === 'full') return d === restoreDay;
    if (mode === 'incremental') return true;
    return d === 0 || d === restoreDay;
  };
  const count = backupDays.filter((_, d) => needed(d)).length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-200 p-1 text-[12.5px] font-bold dark:bg-slate-800">
        {(Object.keys(backupModes) as BackupMode[]).map((k) => (
          <button type="button" key={k} onClick={() => setMode(k)} className={`rounded-lg py-1.5 ${mode === k ? 'bg-white shadow dark:bg-slate-950' : 'text-slate-500'}`}>{backupModes[k].label}</button>
        ))}
      </div>
      <p className="mt-2 text-[13.5px]">{inline(m.desc)}</p>
      <div className="mt-3 flex h-36 items-end gap-1.5">
        {backupDays.map((day, d) => {
          const full = mode === 'full' || d === 0;
          const need = needed(d);
          return (
            <button type="button" key={day} onClick={() => setRestoreDay(d)} className="flex h-full flex-1 flex-col items-center justify-end">
              <span className="mb-0.5 text-[9.5px] font-semibold text-slate-500">{full ? 'FULL' : mode === 'incremental' ? 'INC' : 'DIFF'}</span>
              <div
                className={`w-full rounded-t-md transition-all duration-500 ${need ? 'ring-2 ring-rose-500 ring-offset-1 dark:ring-offset-slate-900' : ''}`}
                style={{ height: `${size(d) * 0.95}px`, background: full ? toneHex.blue : toneHex[m.tone] }}
              />
              <span className={`mt-1 text-[11px] font-bold ${d === restoreDay ? 'text-rose-600' : ''}`}>{day}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-[13.5px] dark:border-rose-500/30 dark:bg-rose-500/10">
        💥 Server crashes on <strong>{backupDays[restoreDay]}</strong> night (tap a day to change). To restore you need <strong>{count} backup set{count > 1 ? 's' : ''}</strong>:{' '}
        {backupDays.filter((_, d) => needed(d)).join(' + ')} (red outline).
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 text-[12.5px]">
        <div className="rounded-lg bg-slate-100 px-2 py-1.5 dark:bg-slate-800"><div className="text-[10.5px] text-slate-500">Backup time / storage</div><div className="font-semibold">{m.backupSpeed}</div></div>
        <div className="rounded-lg bg-slate-100 px-2 py-1.5 dark:bg-slate-800"><div className="text-[10.5px] text-slate-500">Restore</div><div className="font-semibold">{inline(m.restore)}</div></div>
      </div>
    </div>
  );
}

/* ================= DR sites ================= */
export function DrSites() {
  const Meter = ({ n, tone }: { n: number; tone: string }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-2 flex-1 rounded-sm" style={{ background: i <= n ? tone : '#cbd5e133' }} />)}
    </div>
  );
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {drSites.map((s) => (
        <div key={s.name} className={`rounded-xl border p-3 ${toneBg[s.tone]}`}>
          <div className="text-[15px] font-extrabold">{s.icon} {s.name}</div>
          <p className="mt-1 text-[12.5px] leading-snug">{inline(s.what)}</p>
          <div className="mt-2 space-y-1.5 text-[11.5px]">
            <div><div className="font-semibold">💰 Cost</div><Meter n={s.cost} tone={toneHex[s.tone]} /></div>
            <div><div className="font-semibold">⚡ Readiness</div><Meter n={s.ready} tone={toneHex[s.tone]} /></div>
            <div><span className="font-semibold">⏱ RTO:</span> {s.rto}</div>
            <div><span className="font-semibold">💾 Data:</span> {s.data}</div>
          </div>
        </div>
      ))}
      <p className="text-[12.5px] text-slate-600 sm:col-span-3 dark:text-slate-400">
        Faster recovery = higher cost. Banks keep <strong>critical systems</strong> (core banking, ATM switch, payments) on a <strong>hot or warm</strong> DR site; less critical systems may use cheaper options. Cloud DR (DRaaS) is another option.
      </p>
    </div>
  );
}

/* ================= RPO / RTO ================= */
export function RpoRto() {
  const [ri, setRi] = useState(1);
  const [ti, setTi] = useState(1);
  const rpo = rpoOptions[ri].hours;
  const rto = rtoOptions[ti].hours;
  const fmt = (h: number) => (h === 0 ? '≈ 0' : h < 1 ? `${Math.round(h * 60)} min` : h >= 48 ? `${h / 24} days` : `${h} h`);
  const total = 24 + 72;
  const pct = (h: number) => (h / total) * 100;
  const disaster = pct(24);

  return (
    <div>
      <div className="relative mt-6 mb-10 h-3 rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="absolute top-0 h-3 rounded-l-full bg-rose-400 transition-all" style={{ left: `${disaster - pct(rpo)}%`, width: `${pct(rpo)}%` }} />
        <div className="absolute top-0 h-3 rounded-r-full bg-amber-400 transition-all" style={{ left: `${disaster}%`, width: `${pct(rto)}%` }} />
        <div className="absolute -top-6 -translate-x-1/2 text-center text-[11px] font-bold text-rose-600" style={{ left: `${disaster}%` }}>💥 Disaster</div>
        <div className="absolute top-0 h-3 w-0.5 bg-rose-600" style={{ left: `${disaster}%` }} />
        <div className="absolute top-4 -translate-x-full pr-1 text-right text-[11px] font-semibold text-rose-600" style={{ left: `${disaster}%` }}>◀ RPO {fmt(rpo)}<br /><span className="font-normal">data lost</span></div>
        <div className="absolute top-4 pl-1 text-[11px] font-semibold text-amber-600" style={{ left: `${disaster}%` }}>RTO {fmt(rto)} ▶<br /><span className="font-normal">downtime</span></div>
      </div>
      <div className="space-y-2 text-[12.5px]">
        <div>
          <div className="mb-1 font-semibold">How often is data copied? (sets RPO)</div>
          <div className="flex flex-wrap gap-1">
            {rpoOptions.map((o, i) => <button type="button" key={o.label} onClick={() => setRi(i)} className={`rounded-full px-2.5 py-1 font-semibold ${ri === i ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{o.label}</button>)}
          </div>
        </div>
        <div>
          <div className="mb-1 font-semibold">How ready is the DR site? (sets RTO)</div>
          <div className="flex flex-wrap gap-1">
            {rtoOptions.map((o, i) => <button type="button" key={o.label} onClick={() => setTi(i)} className={`rounded-full px-2.5 py-1 font-semibold ${ti === i ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{o.label}</button>)}
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[13.5px] leading-relaxed dark:border-indigo-500/30 dark:bg-indigo-500/10">
        <strong>RPO (Recovery Point Objective)</strong> = how much data you can afford to lose, measured <strong>backwards</strong> from the disaster. <strong>RTO (Recovery Time Objective)</strong> = how long until the service is back, measured <strong>forwards</strong>. Here: worst case <strong>{fmt(rpo)}</strong> of transactions lost and <strong>{fmt(rto)}</strong> of downtime.
      </div>
    </div>
  );
}
