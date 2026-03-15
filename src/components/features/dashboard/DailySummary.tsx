'use client';

import * as React from 'react';
import { WorkEntry } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Wallet } from 'lucide-react';

interface DailySummaryProps {
  entries: WorkEntry[];
}

export function DailySummary({ entries }: DailySummaryProps) {
  const summary = React.useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.totalItems += entry.quantity;
        acc.totalMoney += entry.total;
        return acc;
      },
      { totalItems: 0, totalMoney: 0 }
    );
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div className="fixed bottom-[6rem] sm:bottom-[7rem] left-4 right-4 sm:relative sm:mt-8 bg-slate-900/95 backdrop-blur-xl text-white rounded-[2rem] border border-slate-800/50 pt-5 pb-5 sm:p-6 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.4)] sm:shadow-lg z-30">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-5 sm:px-0">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-300">Итого за смену</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">{summary.totalItems} изделий</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[26px] leading-none font-bold text-white tracking-tight">
            {formatCurrency(summary.totalMoney)}
          </p>
        </div>
      </div>
    </div>
  );
}
