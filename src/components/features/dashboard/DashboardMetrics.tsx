"use client";

import { TrendingUp, Banknote, Scissors, Clock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useEffect, useState, useMemo } from 'react';
import MetricsSkeleton from './MetricsSkeleton';

export default function DashboardMetrics() {
  const store = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const metrics = useMemo(() => {
    if (!mounted || !store.isHydrated) return null;

    // Кредиторка (Payable Debt) = Все заработанные деньги минус все выданные авансы
    const totalEarned = store.workEntries.reduce((sum, entry) => sum + entry.total, 0);
    const totalPaid = store.advances.reduce((sum, adv) => sum + adv.amount, 0);
    const payableDebt = totalEarned - totalPaid;

    // Сегодняшняя дата
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local time
    
    // Элементы за сегодня
    const todayEntries = store.workEntries.filter(e => e.date === todayStr);
    
    // Выработка за сегодня (сумма в сомах)
    const dailyEarned = todayEntries.reduce((sum, e) => sum + e.total, 0);

    // Сделано операций за сегодня (штуки)
    const operationsCount = todayEntries.reduce((sum, e) => sum + e.quantity, 0);

    // Люди на смене (уникальные работники с записями сегодня)
    const activeWorkersSet = new Set(todayEntries.map(e => e.userId));
    const activeWorkers = activeWorkersSet.size;

    // Всего швей
    const totalWorkers = store.users.filter(u => u.role === 'seamstress').length || store.users.length;

    return {
      payableDebt,
      dailyEarned,
      operationsCount,
      activeWorkers,
      totalWorkers
    };
  }, [mounted, store]);

  if (!metrics) {
    return <MetricsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Кредиторка */}
      <div className="bg-white dark:bg-slate-800 overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 group relative transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Banknote className="w-16 h-16 text-red-600" />
        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-red-50 rounded-xl p-3">
            <Banknote className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Кредиторка по ЗП
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.payableDebt.toLocaleString('ru-RU')} <span className="text-lg text-gray-500 font-normal">с</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Выработка за сегодня */}
      <div className="bg-white dark:bg-slate-800 overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 group relative transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <TrendingUp className="w-16 h-16 text-emerald-600" />
        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-emerald-50 rounded-xl p-3">
            <TrendingUp className="h-6 w-6 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Выработка (заработок)
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.dailyEarned.toLocaleString('ru-RU')} <span className="text-lg text-gray-500 font-normal">с</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Операции */}
      <div className="bg-white dark:bg-slate-800 overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 group relative transition-colors">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Scissors className="w-16 h-16 text-blue-600" />
        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-50 rounded-xl p-3">
            <Scissors className="h-6 w-6 text-blue-600" aria-hidden="true" />
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Сделано операций (шт)
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.operationsCount.toLocaleString('ru-RU')}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Люди на смене */}
      <div className="bg-white dark:bg-slate-800 overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 group relative transition-colors">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Clock className="w-16 h-16 text-purple-600" />
        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-50 rounded-xl p-3">
            <Clock className="h-6 w-6 text-purple-600" aria-hidden="true" />
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Люди на смене
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.activeWorkers}
                </div>
                <span className="ml-2 text-sm text-gray-500">из {metrics.totalWorkers}</span>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
