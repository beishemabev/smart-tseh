"use client";

import { Clock, Factory, User, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import BatchesSkeleton from './BatchesSkeleton';

export default function ActiveBatches() {
  const store = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !store.isHydrated) {
    return <BatchesSkeleton />;
  }

  // Получаем 5 последних операций (сортировка по дате создания по убыванию)
  const recentEntries = [...store.workEntries]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  if (recentEntries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-2xl p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
          <Factory className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Пока нет записей</h3>
        <p className="mt-1 text-sm text-gray-500">Добавьте выполненные операции на вкладке "Учет".</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden">
      <ul className="divide-y divide-gray-100 dark:divide-slate-700">
        {recentEntries.map((entry) => {
          const user = store.users.find(u => u.id === entry.userId);
          const task = store.taskTypes.find(t => t.id === entry.taskId);
          
          const time = new Date(entry.createdAt).toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });

          return (
            <li key={entry.id} className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 w-full flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {task?.name || 'Неизвестная операция'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <User className="w-3.5 h-3.5" />
                      <span>{user?.name || 'Удаленный сотрудник'}</span>
                      <span className="text-gray-300 dark:text-slate-600">&bull;</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{time}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {entry.quantity} шт
                  </div>
                  <div className="text-sm text-emerald-600 font-medium whitespace-nowrap mt-1">
                    +{entry.total.toLocaleString('ru-RU')} с
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
