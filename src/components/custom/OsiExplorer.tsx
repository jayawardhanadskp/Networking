import { useState } from 'react';
import { osiLayers, tcpipLayers } from '../../content/visual-data/osi';

export function OsiExplorer() {
  const [sel, setSel] = useState(4);
  const layer = osiLayers.find((l) => l.n === sel)!;
  const tcpip = tcpipLayers.find((t) => t.covers.includes(sel))!;
  const rowH = 38;

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex-[3]">
          <div className="mb-1 text-center text-[11px] font-bold tracking-wide text-slate-500 uppercase">OSI (7 layers)</div>
          <div className="space-y-1">
            {osiLayers.map((l) => (
              <button
                type="button"
                key={l.n}
                onClick={() => setSel(l.n)}
                style={{ height: rowH, background: sel === l.n ? l.color : `${l.color}26`, borderColor: l.color }}
                className={`flex w-full items-center gap-2 rounded-lg border-l-4 px-2 text-left text-[13px] font-semibold transition-all ${sel === l.n ? 'scale-[1.02] text-white shadow-md' : 'text-slate-800 dark:text-slate-100'}`}
              >
                <span className="w-4 text-center font-mono">{l.n}</span>
                <span className="flex-1 truncate">{l.name}</span>
                <span className="text-[10px] font-medium opacity-80">{l.pdu.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-[2]">
          <div className="mb-1 text-center text-[11px] font-bold tracking-wide text-slate-500 uppercase">TCP/IP (4)</div>
          <div className="space-y-1">
            {tcpipLayers.map((t) => {
              const on = t.covers.includes(sel);
              return (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => setSel(t.covers[0])}
                  style={{ height: rowH * t.covers.length + 4 * (t.covers.length - 1), background: on ? t.color : `${t.color}1f`, borderColor: t.color }}
                  className={`flex w-full items-center justify-center rounded-lg border-2 border-dashed px-1 text-center text-[12.5px] font-semibold leading-tight transition-all ${on ? 'border-solid text-white shadow-md' : 'text-slate-800 dark:text-slate-100'}`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border-2 p-3 text-[14px] leading-relaxed" style={{ borderColor: layer.color }}>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <h4 className="text-base font-bold" style={{ color: layer.color }}>Layer {layer.n}: {layer.name}</h4>
          <span className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white" style={{ background: layer.color }}>PDU: {layer.pdu}</span>
        </div>
        <p className="mb-2 italic text-slate-600 dark:text-slate-300">🏠 {layer.analogy}</p>
        <p className="mb-2"><strong>Job:</strong> {layer.job}</p>
        <div className="mb-2">
          <strong>Protocols:</strong>
          <div className="mt-1 flex flex-wrap gap-1">
            {layer.protocols.map((p) => <span key={p} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[12px] dark:bg-slate-700">{p}</span>)}
          </div>
        </div>
        <div className="mb-2">
          <strong>Devices:</strong>
          <div className="mt-1 flex flex-wrap gap-1">
            {layer.devices.map((p) => <span key={p} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[12px] dark:bg-slate-700">{p}</span>)}
          </div>
        </div>
        <p className="rounded-lg bg-emerald-50 p-2 text-[13px] dark:bg-emerald-500/10">🏦 {layer.bank}</p>
        <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">In TCP/IP this is the <strong>{tcpip.name}</strong> layer. {tcpip.note}</p>
      </div>
      <p className="mt-2 text-center text-[12px] text-slate-500">Mnemonic 7→1: <strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing</p>
    </div>
  );
}
