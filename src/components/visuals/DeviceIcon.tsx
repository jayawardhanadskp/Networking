import type { DeviceIcon as Icon } from '../../content/types';

const G = 'stroke-slate-700 dark:stroke-slate-200';

/** Simple line-art device icons drawn around (0,0), roughly 30×30. */
function Glyph({ icon }: { icon: Icon }) {
  const p = { className: G, fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (icon) {
    case 'pc':
    case 'monitor':
      return <g {...p}><rect x={-11} y={-10} width={22} height={15} rx={2} /><path d="M-4 9h8M0 5v4" /></g>;
    case 'laptop':
      return <g {...p}><rect x={-9} y={-9} width={18} height={12} rx={1.5} /><path d="M-13 7h26l-2 3h-22z" /></g>;
    case 'phone':
      return <g {...p}><rect x={-6} y={-11} width={12} height={22} rx={2.5} /><path d="M-1.5 8h3" /></g>;
    case 'server':
    case 'dns':
      return <g {...p}><rect x={-10} y={-11} width={20} height={6.5} rx={1.5} /><rect x={-10} y={-3.2} width={20} height={6.5} rx={1.5} /><rect x={-10} y={4.6} width={20} height={6.5} rx={1.5} /><path d="M-6 -7.8h.1M-6 0h.1M-6 7.8h.1" strokeWidth={2.6} /></g>;
    case 'db':
    case 'disk':
      return <g {...p}><ellipse cx={0} cy={-8} rx={10} ry={3.5} /><path d="M-10 -8v16c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5v-16M-10 0c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5" /></g>;
    case 'router':
      return <g {...p}><circle r={11} /><path d="M-6 0h12M0 -6v12M3.5 -2.5L6 0l-2.5 2.5M-3.5 -2.5L-6 0l2.5 2.5M-2.5 3.5L0 6l2.5-2.5M-2.5 -3.5L0 -6l2.5 2.5" /></g>;
    case 'switch':
      return <g {...p}><rect x={-13} y={-7} width={26} height={14} rx={2} /><path d="M-7 -2h14l-3 -2.5M7 2h-14l3 2.5" /></g>;
    case 'hub':
      return <g {...p}><rect x={-13} y={-6} width={26} height={12} rx={2} /><path d="M-7 0h.1M-2.5 0h.1M2.5 0h.1M7 0h.1" strokeWidth={2.8} /></g>;
    case 'firewall':
      return <g {...p}><rect x={-12} y={-10} width={24} height={20} rx={1.5} /><path d="M-12 -3.3h24M-12 3.3h24M-4 -10v6.7M5 -3.3v6.6M-4 3.3v6.7" /></g>;
    case 'ap':
      return <g {...p}><rect x={-9} y={3} width={18} height={6} rx={2} /><path d="M-7 -2a10 10 0 0 1 14 0M-4 1a5 5 0 0 1 8 0M-10.5 -5.5a15 15 0 0 1 21 0" /></g>;
    case 'cloud':
    case 'internet':
      return <g {...p}><path d="M-9 8h18a6 6 0 0 0 0-12 8 8 0 0 0-15-2 5.5 5.5 0 0 0-3 14z" /></g>;
    case 'globe':
      return <g {...p}><circle r={11} /><ellipse rx={4.5} ry={11} /><path d="M-11 0h22M-9 -6h18M-9 6h18" /></g>;
    case 'atm':
      return <g {...p}><rect x={-10} y={-12} width={20} height={24} rx={2} /><rect x={-6.5} y={-8.5} width={13} height={8} rx={1} /><path d="M-5 4h10M-5 8h4" /></g>;
    case 'lb':
      return <g {...p}><rect x={-12} y={-8} width={24} height={16} rx={3} /><path d="M-7 0h4l5 -4h4M-3 0l5 4h4M6 -6l2 2-2 2M6 2l2 2-2 2" /></g>;
    case 'printer':
      return <g {...p}><rect x={-11} y={-3} width={22} height={10} rx={2} /><path d="M-6 -3v-7h12v7M-6 4h12v7h-12z" /></g>;
    case 'user':
      return <g {...p}><circle cy={-5} r={5} /><path d="M-10 11a10 10 0 0 1 20 0" /></g>;
    case 'building':
      return <g {...p}><rect x={-10} y={-12} width={20} height={24} rx={1} /><path d="M-5 -7h2M3 -7h2M-5 -1h2M3 -1h2M-5 5h2M3 5h2" strokeWidth={2.4} /></g>;
    case 'bank':
      return <g {...p}><path d="M-12 -4L0 -12l12 8zM-12 11h24M-8 -2v10M-3 -2v10M3 -2v10M8 -2v10" /></g>;
    case 'shield':
      return <g {...p}><path d="M0 -12l10 4v6c0 7-4.5 11-10 14-5.5-3-10-7-10-14v-6z" /><path d="M-4 0l3 3 5-6" /></g>;
    case 'lock':
      return <g {...p}><rect x={-9} y={-2} width={18} height={13} rx={2} /><path d="M-5 -2v-4a5 5 0 0 1 10 0v4M0 3v3" /></g>;
    case 'camera':
      return <g {...p}><path d="M-12 -6l18 -3 2 8-18 3zM6 -1l6 -3v8l-6-2M-6 2v8h-5" /></g>;
    case 'card':
      return <g {...p}><rect x={-12} y={-8} width={24} height={16} rx={2.5} /><path d="M-12 -3h24M-8 4h6" /></g>;
  }
}

export function DeviceIcon({ icon, active = false, tone = '#6366f1', size = 1 }: { icon: Icon; active?: boolean; tone?: string; size?: number }) {
  return (
    <g transform={`scale(${size})`}>
      <rect
        x={-17}
        y={-17}
        width={34}
        height={34}
        rx={9}
        className={active ? '' : 'fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-600'}
        style={active ? { fill: `${tone}22`, stroke: tone, strokeWidth: 2.5 } : { strokeWidth: 1.2 }}
      />
      <Glyph icon={icon} />
    </g>
  );
}

/** Stand-alone small icon for HTML contexts (e.g. sequence diagram headers). */
export function DeviceIconSvg({ icon, className = 'h-9 w-9' }: { icon: Icon; className?: string }) {
  return (
    <svg viewBox="-18 -18 36 36" className={className} aria-hidden>
      <DeviceIcon icon={icon} />
    </svg>
  );
}
