'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-12 w-full animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl" />;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-white/40 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center gap-3">
        {theme === 'dark' ? (
          <div className="p-2 bg-indigo-500/10 rounded-full">
            <Moon className="w-5 h-5 text-indigo-400" />
          </div>
        ) : (
          <div className="p-2 bg-amber-500/10 rounded-full">
            <Sun className="w-5 h-5 text-amber-500" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Тёмная тема</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {theme === 'dark' ? 'Включена' : 'Выключена'}
          </p>
        </div>
      </div>
      
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-none font-semibold active:scale-95 transition-all"
      >
        {theme === 'dark' ? 'Выключить' : 'Включить'}
      </Button>
    </div>
  );
}
