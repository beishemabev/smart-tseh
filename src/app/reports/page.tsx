'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { format, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FileText, Send, Download } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, downloadCSV } from '@/lib/utils';
import { WorkEntry, TaskType } from '@/types';

export default function ReportsPage() {
  const isHydrated = useStoreHydration();
  const { users, taskTypes, workEntries, advances } = useAppStore();

  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [startDate, setStartDate] = React.useState<string>(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = React.useState<string>(
    format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );

  if (!isHydrated) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const user = users.find(u => u.id === selectedUser);

  // Filter entries
  const filteredEntries = workEntries.filter(entry => {
    if (selectedUser && entry.userId !== selectedUser) return false;
    if (startDate && entry.date < startDate) return false;
    if (endDate && entry.date > endDate) return false;
    return true;
  });

  // Filter advances
  const filteredAdvances = advances.filter(adv => {
    if (selectedUser && adv.userId !== selectedUser) return false;
    if (startDate && adv.date < startDate) return false;
    if (endDate && adv.date > endDate) return false;
    return true;
  });

  // Calculate Aggregates
  const totalItems = filteredEntries.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalMoney = filteredEntries.reduce((acc, curr) => acc + curr.total, 0);
  const totalAdvances = filteredAdvances.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPayout = totalMoney - totalAdvances;

  // Group by operations
  const tasksSummary = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.taskId]) {
      acc[entry.taskId] = { quantity: 0, total: 0 };
    }
    acc[entry.taskId].quantity += entry.quantity;
    acc[entry.taskId].total += entry.total;
    return acc;
  }, {} as Record<string, { quantity: number; total: number }>);

  // Map to array for rendering
  const tasksSummaryArray = Object.entries(tasksSummary).map(([taskId, data]) => {
    const taskType = taskTypes.find(t => t.id === taskId);
    return {
      taskId,
      name: taskType?.name || 'Удаленная операция',
      ...data
    };
  });

  const handleWhatsAppExport = () => {
    if (!user) {
      alert('Сначала выберите сотрудника!');
      return;
    }
    if (filteredEntries.length === 0 && filteredAdvances.length === 0) {
      alert('Нет данных за текущий период');
      return;
    }

    const formattedStart = format(parseISO(startDate), 'dd.MM', { locale: ru });
    const formattedEnd = format(parseISO(endDate), 'dd.MM', { locale: ru });

    let message = `*Зарплата: ${user.name}*\n`;
    message += `Период: ${formattedStart} - ${formattedEnd}\n\n`;

    tasksSummaryArray.forEach(task => {
      message += `▪️ ${task.name}: ${task.quantity} шт = ${task.total} с\n`;
    });

    message += `\n*Всего пошито: ${totalItems} шт*\n`;
    message += `Заработано: ${totalMoney} с\n`;
    
    if (totalAdvances > 0) {
      message += `Выдано авансом: ${totalAdvances} с\n`;
    }
    
    message += `*К выдаче на руки: ${totalPayout} с*`;

    const encodedMessage = encodeURIComponent(message);
    
    // Check if phone available
    const phoneInfo = user.phone ? user.phone.replace(/\D/g, '') : '';
    const baseUrl = phoneInfo ? `https://wa.me/${phoneInfo}` : `https://wa.me/`;
    
    window.open(`${baseUrl}?text=${encodedMessage}`, '_blank');
  };

  const handleCsvExport = () => {
    if (!user) return;
    if (filteredEntries.length === 0 && filteredAdvances.length === 0) return;

    const rows: string[][] = [
      ['Дата', 'Тип', 'Описание', 'Количество шт', 'Сумма (сом)']
    ];

    // Add work entries
    filteredEntries.forEach(entry => {
      const task = taskTypes.find(t => t.id === entry.taskId);
      rows.push([
        format(parseISO(entry.date), 'dd.MM.yyyy'),
        'Работа',
        task?.name || 'Удаленная операция',
        entry.quantity.toString(),
        entry.total.toString()
      ]);
    });

    // Add advances
    filteredAdvances.forEach(adv => {
      rows.push([
        format(parseISO(adv.date), 'dd.MM.yyyy'),
        'Аванс',
        adv.reason || 'Аванс',
        '',
        `-${adv.amount}`
      ]);
    });

    // Add total row
    rows.push([]);
    rows.push(['', '', 'ИТОГО К ВЫДАЧЕ:', '', totalPayout.toString()]);

    const filename = `Otchet_${user.name.replace(/\s+/g, '_')}_${format(new Date(), 'dd-MM-yyyy')}.csv`;
    downloadCSV(filename, rows);
  };

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-8 pb-32 sm:pb-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
          Отчеты и Зарплата
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Расчет зарплаты за неделю или произвольный период
        </p>
      </div>

      {/* Filters */}
      <section className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="user-filter" className="block text-sm font-semibold text-slate-700 ml-1">Сотрудник</label>
          <select
            id="user-filter"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all shadow-sm hover:border-slate-300 cursor-pointer"
          >
            <option value="" disabled>-- Выберите швею --</option>
            {users.map(u => (
              <option key={u.id} value={u.id} className="font-medium">{u.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            type="date" 
            label="С этой даты" 
            value={startDate} 
            className="h-12 bg-slate-50/50 border-slate-200"
            onChange={e => setStartDate(e.target.value)} 
          />
          <Input 
            type="date" 
            label="По эту дату" 
            value={endDate} 
            className="h-12 bg-slate-50/50 border-slate-200"
            onChange={e => setEndDate(e.target.value)} 
          />
        </div>
      </section>

      {/* Dashboard & Export */}
      {selectedUser && (
        <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
          <div className="bg-slate-900/90 backdrop-blur-xl text-white rounded-[2rem] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.2)] border border-slate-800">
            <h3 className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">Итого к выплате</h3>
            <div className="text-[32px] sm:text-[40px] font-bold tracking-tight mb-6 leading-none text-white">
              {formatCurrency(totalPayout)}
            </div>

            {totalAdvances > 0 && (
              <div className="flex justify-between items-center bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
                <div>
                  <div className="text-sm font-medium text-slate-300">Заработано: {formatCurrency(totalMoney)}</div>
                  <div className="text-sm text-red-400 mt-0.5">Выдано авансом: -{formatCurrency(totalAdvances)}</div>
                </div>
              </div>
            )}
            
            <div className="border-t border-slate-700/60 pt-5 mt-2">
              <h4 className="text-sm font-semibold mb-3 text-slate-300 flex justify-between">
                <span>Детализация работ</span>
                <span className="text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">{totalItems} шт</span>
              </h4>
              <div className="space-y-3">
                {tasksSummaryArray.map(task => (
                  <div key={task.taskId} className="flex justify-between items-center text-sm group">
                    <span className="text-slate-300 font-medium">
                      {task.name} <span className="text-slate-500 font-normal ml-1">×{task.quantity}</span>
                    </span>
                    <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{formatCurrency(task.total)}</span>
                  </div>
                ))}
                
                {tasksSummaryArray.length === 0 && (
                  <p className="text-slate-500 text-sm py-2 font-medium">Нет работы в выбранном периоде</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={handleWhatsAppExport}
              disabled={filteredEntries.length === 0 && filteredAdvances.length === 0}
              className="w-full bg-[#25D366] hover:bg-[#20BE5C] text-white py-6 h-16 text-[17px] font-bold rounded-2xl shadow-lg shadow-[#25D366]/20 border-none transition-all active:scale-[0.98]"
            >
              <Send className="w-5 h-5 mr-3" />
              В WhatsApp
            </Button>
            
            <Button 
              onClick={handleCsvExport}
              disabled={filteredEntries.length === 0 && filteredAdvances.length === 0}
              variant="secondary"
              className="w-full py-6 h-16 text-[17px] font-bold rounded-2xl border-none transition-all active:scale-[0.98]"
            >
              <Download className="w-5 h-5 mr-3" />
              Скачать в Excel
            </Button>
          </div>
        </section>
      )}

      {/* Missing Seamstress Prompt */}
      {!selectedUser && users.length > 0 && (
        <div className="text-center p-8 text-slate-500 bg-white/40 backdrop-blur-md border-2 border-dashed border-white/80 rounded-[2rem]">
          Выберите сотрудника для расчета зарплаты
        </div>
      )}
    </main>
  );
}
