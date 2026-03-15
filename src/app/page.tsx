'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { format, subDays, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays, Share } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { QuickEntryForm } from '@/components/features/dashboard/QuickEntryForm';
import { DailyLog } from '@/components/features/dashboard/DailyLog';
import { DailySummary } from '@/components/features/dashboard/DailySummary';

export default function DashboardPage() {
  const isHydrated = useStoreHydration();
  const { workEntries } = useAppStore();

  const [currentDate, setCurrentDate] = React.useState(new Date());

  if (!isHydrated) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // Format date for state (YYYY-MM-DD)
  const formattedDateString = format(currentDate, 'yyyy-MM-dd');
  
  // Filter entries for the selected day
  const dailyEntries = workEntries.filter(entry => entry.date === formattedDateString);

  // Navigation handlers
  const handlePrevDay = () => setCurrentDate(prev => subDays(prev, 1));
  const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  const displayDate = format(currentDate, 'd MMMM, EEEE', { locale: ru });
  const isToday = format(new Date(), 'yyyy-MM-dd') === formattedDateString;

  // Feature 4: "Daily Factory Summary" for WhatsApp
  const handleShareDailySummary = () => {
    let text = `*Итоги за ${displayDate}* ✨\n\n`;

    if (dailyEntries.length === 0) {
      text += 'Нет записей за сегодня.';
    } else {
      const totalPieces = dailyEntries.reduce((sum, e) => sum + e.quantity, 0);
      const totalCost = dailyEntries.reduce((sum, e) => sum + e.total, 0);

      // Find top seamstress
      const seamstressTotals = dailyEntries.reduce((acc, entry) => {
        if (!acc[entry.userId]) acc[entry.userId] = { pieces: 0, cost: 0, name: '' };
        acc[entry.userId].pieces += entry.quantity;
        acc[entry.userId].cost += entry.total;
        
        // Find name
        if (!acc[entry.userId].name) {
          const u = useAppStore.getState().users.find(u => u.id === entry.userId);
          if (u) acc[entry.userId].name = u.name;
        }
        return acc;
      }, {} as Record<string, { pieces: number; cost: number; name: string; }>);

      const topEarner = Object.values(seamstressTotals).sort((a, b) => b.cost - a.cost)[0];

      text += `⏱ Операций выполнено: ${dailyEntries.length}\n`;
      text += `🧵 Общее количество изделий: ${totalPieces} шт\n`;
      text += `💸 Заработано цехом: ${totalCost} ₽\n\n`;
      
      if (topEarner && topEarner.name) {
        text += `🏆 *Лидер дня:* ${topEarner.name} (${topEarner.pieces} шт / ${topEarner.cost} ₽)\n`;
      }
    }

    const encodedText = encodeURIComponent(text);
    // WhatsApp deep link
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-8 pb-32 sm:pb-8 space-y-8">
      {/* 1. Date Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            Учет выработки
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium hidden sm:block">
            Отмечайте выполненные операции сотрудников
          </p>
          {isToday && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShareDailySummary}
              className="mt-3 bg-green-50 text-green-700 hover:bg-green-100 border-none font-semibold text-xs sm:text-sm pl-2 shadow-sm"
              title="Отправить итоги дня в WhatsApp"
            >
              <Share className="w-4 h-4 mr-2" />
              Отправить итоги дня
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1.5 bg-white/60 backdrop-blur-xl p-1.5 rounded-[1.5rem] border border-white/60 shadow-sm">
          <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-10 w-10 rounded-xl hover:bg-slate-100/50 text-slate-600">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-sm font-semibold w-36 text-center capitalize text-slate-800">
            {isToday ? 'Сегодня' : displayDate}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextDay} 
            className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-600"
            disabled={isToday}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          {!isToday && (
            <div className="hidden sm:block pl-2 border-l border-slate-100">
              <Button variant="secondary" size="sm" onClick={handleToday} className="h-10 rounded-xl text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-none">
                Сегодня
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Quick Entry Form */}
      <section>
        <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
          Быстрый ввод
        </h2>
        <QuickEntryForm selectedDate={formattedDateString} />
      </section>

      {/* 3. Daily Log */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Лента за день
          </h2>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            Записей: {dailyEntries.length}
          </span>
        </div>
        <DailyLog entries={dailyEntries} />
      </section>

      {/* 4. Sticky Daily Summary */}
      <DailySummary entries={dailyEntries} />
    </main>
  );
}
