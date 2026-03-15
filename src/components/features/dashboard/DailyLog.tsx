'use client';

import * as React from 'react';
import { WorkEntry } from '@/types';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DailyLogProps {
  entries: WorkEntry[];
}

export function DailyLog({ entries }: DailyLogProps) {
  const { users, taskTypes, deleteEntry } = useAppStore();

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/40 dark:border-slate-800 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] transition-colors">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">Нет записей</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">За выбранный день еще не было добавлено ни одной операции.</p>
      </div>
    );
  }

  // Sort by createdAt descending (newest first)
  const sortedEntries = [...entries].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-3">
      {sortedEntries.map((entry) => {
        const user = users.find(u => u.id === entry.userId);
        const taskType = taskTypes.find(t => t.id === entry.taskId);
        
        return (
          <div key={entry.id} className="group relative flex items-center justify-between p-4 sm:p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-white/40 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:border-white/80 dark:hover:border-slate-700">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Неизвестный сотрудник'}
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {taskType?.name || 'Удаленная операция'}
                </span>
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {entry.quantity} шт. <span className="text-slate-300 dark:text-slate-600 mx-1">×</span> {formatCurrency(entry.priceAtTheTime)}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {formatCurrency(entry.total)}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  if(confirm('Удалить эту запись?')) deleteEntry(entry.id);
                }} 
                className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 h-10 w-10 rounded-xl transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
