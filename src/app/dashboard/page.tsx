import { Suspense } from 'react';
import DashboardMetrics from '@/components/features/dashboard/DashboardMetrics';
import ActiveBatches from '@/components/features/dashboard/ActiveBatches';
import MetricsSkeleton from '@/components/features/dashboard/MetricsSkeleton';
import BatchesSkeleton from '@/components/features/dashboard/BatchesSkeleton';

export const metadata = {
  title: 'Дашборд | Швейкальк',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Сводка за сегодня
        </h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ru-RU', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Метрики (Кредиторка, Выработка) */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      {/* Активные партии (Прогресс-бары) */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Последние операции</h3>
        </div>
        <Suspense fallback={<BatchesSkeleton />}>
          <ActiveBatches />
        </Suspense>
      </div>
    </div>
  );
}
