import type { ReactNode } from 'react';
import { Link } from '../lib/router';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/60 ${className}`}>{children}</div>;
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${className}`}>
      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function PageHeader({ title, back, sub, right }: { title: ReactNode; back?: string; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4">
      {back && (
        <Link to={back} className="mb-1 inline-block text-[13px] font-semibold text-indigo-600 dark:text-indigo-400">
          ← Back
        </Link>
      )}
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-[22px] leading-tight font-extrabold text-slate-900 dark:text-white">{title}</h1>
        {right}
      </div>
      {sub && <p className="mt-1 text-[14px] text-slate-600 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

export function Btn({
  children, onClick, variant = 'primary', className = '', disabled, type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'soft' | 'danger' | 'success';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const v = {
    primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400',
    ghost: 'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800',
    soft: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-200',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-all active:scale-[0.97] disabled:opacity-40 ${v} ${className}`}>
      {children}
    </button>
  );
}

export function LinkBtn({ to, children, variant = 'primary', className = '' }: { to: string; children: ReactNode; variant?: 'primary' | 'ghost' | 'soft'; className?: string }) {
  const v = {
    primary: 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500',
    ghost: 'border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200',
    soft: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200',
  }[variant];
  return (
    <Link to={to} className={`inline-flex items-center justify-center gap-1 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-all active:scale-[0.97] ${v} ${className}`}>
      {children}
    </Link>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-[14px] text-slate-500 dark:border-slate-700">{children}</div>;
}
