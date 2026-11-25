import { useEffect, useState } from 'react';
import { loadString, saveString } from './storage';

export type ThemeMode = 'light' | 'dark' | 'system';
const KEY = 'nsbprep-theme';

function apply(mode: ThemeMode) {
  const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => loadString(KEY, 'system') as ThemeMode);
  useEffect(() => {
    apply(mode);
    saveString(KEY, mode);
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => apply('system');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [mode]);
  const cycle = () => setMode((m) => (m === 'light' ? 'dark' : m === 'dark' ? 'system' : 'light'));
  return { mode, cycle };
}
