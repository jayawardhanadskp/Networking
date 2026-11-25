import { useMemo, useState } from 'react';
import { calculate, ipToInt } from '../../lib/subnet';

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

/** Shows the 32 bits split into network (blue) and host (green) parts. */
export function SubnetBits({ initialIp = '192.168.10.77', initialPrefix = 26 }: { initialIp?: string; initialPrefix?: number }) {
  const [ip, setIp] = useState(initialIp);
  const [prefix, setPrefix] = useState(initialPrefix);
  const result = useMemo(() => {
    try {
      ipToInt(ip);
      return calculate(ip, prefix);
    } catch {
      return null;
    }
  }, [ip, prefix]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex-1 text-[12px] font-semibold">
          IP address
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            inputMode="decimal"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-mono text-[14px] dark:border-slate-600 dark:bg-slate-900"
          />
        </label>
        <label className="w-24 text-[12px] font-semibold">
          Prefix: /{prefix}
          <input type="range" min={8} max={32} value={prefix} onChange={(e) => setPrefix(Number(e.target.value))} className="mt-2 w-full accent-indigo-600" />
        </label>
      </div>
      {!result ? (
        <p className="mt-2 text-sm text-rose-600">Type a valid IPv4 address, like 192.168.10.77</p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((o) => (
              <div key={o}>
                <div className="mb-0.5 text-center font-mono text-[13px] font-bold">{result.ip.split('.')[o]}</div>
                <div className="grid grid-cols-8 gap-px">
                  {result.bits.ip.slice(o * 8, o * 8 + 8).split('').map((b, i) => {
                    const idx = o * 8 + i;
                    const net = idx < prefix;
                    return (
                      <div
                        key={i}
                        className={`flex h-6 items-center justify-center rounded-sm font-mono text-[11px] font-bold text-white transition-colors ${net ? 'bg-blue-500' : 'bg-emerald-500'}`}
                      >
                        {b}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-px grid grid-cols-8 gap-px">
                  {result.bits.mask.slice(o * 8, o * 8 + 8).split('').map((b, i) => (
                    <div key={i} className="flex h-4 items-center justify-center rounded-sm bg-slate-200 font-mono text-[9.5px] dark:bg-slate-700">{b}</div>
                  ))}
                </div>
                <div className="mt-0.5 text-center font-mono text-[11px] text-slate-500">{result.mask.split('.')[o]}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[12px]">
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-blue-500" /> Network bits ({prefix})</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Host bits ({32 - prefix})</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-slate-300 dark:bg-slate-600" /> Mask</span>
          </div>
          <div className="mt-2 grid grid-cols-8 gap-px text-center font-mono text-[10px] text-slate-500">
            {BIT_VALUES.map((v) => <div key={v} className="rounded-sm bg-slate-100 py-0.5 dark:bg-slate-800">{v}</div>)}
          </div>
          <p className="mt-0.5 text-center text-[11px] text-slate-500">Bit values inside one octet (add the 1s to get the decimal number)</p>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-[12.5px]">
            {[
              ['Network', result.network],
              ['Broadcast', result.broadcast],
              ['First host', result.firstHost],
              ['Last host', result.lastHost],
              ['Mask', result.mask],
              ['Usable hosts', result.usableHosts.toLocaleString('en-US')],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-slate-100 px-2 py-1.5 dark:bg-slate-800">
                <div className="text-[10.5px] text-slate-500">{k}</div>
                <div className="font-mono font-semibold">{v}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-slate-600 dark:text-slate-400">
            👉 Move the slider: each step to the right <strong>halves</strong> the subnet size. Network address = all host bits <strong>0</strong>. Broadcast = all host bits <strong>1</strong>.
          </p>
        </>
      )}
    </div>
  );
}
