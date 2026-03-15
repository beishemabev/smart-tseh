'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WorkEntry } from '@/types';
import { X } from 'lucide-react';

interface QuickEntryFormProps {
  selectedDate: string; // YYYY-MM-DD
}

export function QuickEntryForm({ selectedDate }: QuickEntryFormProps) {
  const { users, taskTypes, workEntries, addEntry } = useAppStore();
  
  const [selectedUser, setSelectedUser] = React.useState('');
  const [selectedTask, setSelectedTask] = React.useState('');
  const [quantityStr, setQuantityStr] = React.useState('');
  const [error, setError] = React.useState('');

  // Feature 1: Smart Defaults (load from localStorage on mount)
  React.useEffect(() => {
    const savedUser = localStorage.getItem('smarttseh_lastUser');
    const savedTask = localStorage.getItem('smarttseh_lastTask');
    if (savedUser && users.some(u => u.id === savedUser)) setSelectedUser(savedUser);
    if (savedTask && taskTypes.some(t => t.id === savedTask)) setSelectedTask(savedTask);
  }, [users, taskTypes]);

  // Save changes to smart defaults
  React.useEffect(() => {
    if (selectedUser) localStorage.setItem('smarttseh_lastUser', selectedUser);
  }, [selectedUser]);

  React.useEffect(() => {
    if (selectedTask) localStorage.setItem('smarttseh_lastTask', selectedTask);
  }, [selectedTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedTask) {
      setError('Выберите сотрудника и операцию');
      return;
    }

    const qty = parseInt(quantityStr, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Введите корректное количество');
      return;
    }

    const taskType = taskTypes.find(t => t.id === selectedTask);
    if (!taskType) {
      setError('Операция не найдена');
      return;
    }

    // Capture the price at the exact moment of creation
    const priceAtTheTime = taskType.pricePerUnit;

    const newEntry: WorkEntry = {
      id: generateId(),
      date: selectedDate,
      userId: selectedUser,
      taskId: selectedTask,
      quantity: qty,
      priceAtTheTime,
      total: qty * priceAtTheTime, // compute immediately
      createdAt: Date.now(),
    };

    addEntry(newEntry);

    // Reset quantity to allow rapid consecutive entries, keep user/task selected for speed
    setQuantityStr('');
    setError('');
  };

  const handleQuickAdd = (amount: number) => {
    const currentQty = parseInt(quantityStr || '0', 10);
    setQuantityStr((currentQty + amount).toString());
    if (error) setError('');
  };

  const handleClearQty = () => {
    setQuantityStr('');
    if (error) setError('');
  };

  // Feature 5: Auto-Sorting task types
  const sortedTaskTypes = React.useMemo(() => {
    // Find tasks used today
    const tasksUsedToday = new Set(
      workEntries
        .filter(entry => entry.date === selectedDate)
        .map(entry => entry.taskId)
    );

    // Sort: active today first, then alphabetical
    return [...taskTypes].sort((a, b) => {
      const aUsed = tasksUsedToday.has(a.id);
      const bUsed = tasksUsedToday.has(b.id);
      
      if (aUsed && !bUsed) return -1;
      if (!aUsed && bUsed) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [taskTypes, workEntries, selectedDate]);

  if (users.length === 0 || taskTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] text-center">
        <div className="bg-blue-50 p-5 rounded-full mb-5 shadow-sm shadow-blue-100/50">
          <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Добро пожаловать в SmartTseh!</h3>
        <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
          Для начала работы добавьте сотрудников и расценки на швейные операции.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button onClick={() => window.location.href = '/employees'} variant="primary" className="w-full sm:w-auto shadow-blue-500/25">
            Добавить швей
          </Button>
          <Button onClick={() => window.location.href = '/settings'} variant="secondary" className="w-full sm:w-auto bg-slate-50 border-slate-200">
            Настроить прайс
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-6 sm:p-8 space-y-6 transition-all outline-none focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="user-select" className="block text-sm font-semibold text-slate-700 ml-1">Сотрудник</label>
          <select
            id="user-select"
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

        <div className="space-y-1.5">
          <label htmlFor="task-select" className="block text-sm font-semibold text-slate-700 ml-1">Операция</label>
          <select
            id="task-select"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all shadow-sm hover:border-slate-300 cursor-pointer"
          >
            <option value="" disabled>-- Выберите операцию --</option>
            {sortedTaskTypes.map(t => (
              <option key={t.id} value={t.id} className="font-medium">{t.name} ({t.pricePerUnit} ₽)</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-4 items-end pt-1">
          <div className="w-full sm:w-1/3">
            <Input 
              label="Количество (шт)"
              type="number"
              min="1"
              placeholder="0"
              value={quantityStr}
              className="h-12 text-lg font-medium bg-slate-50/50 border-slate-200"
              onChange={(e) => {
                setQuantityStr(e.target.value);
                if (error) setError('');
              }}
            />
          </div>
          <Button type="submit" className="w-full sm:w-2/3 h-12 text-lg font-bold shadow-blue-500/25 active:scale-[0.98]">
            Добавить запись
          </Button>
        </div>
        
        {/* Feature 2: Quick Tap Buttons */}
        <div className="flex gap-2 w-full sm:w-1/3">
          <button
            type="button"
            onClick={() => handleQuickAdd(10)}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all active:scale-95 text-sm"
          >
            +10
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(30)}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all active:scale-95 text-sm"
          >
            +30
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(50)}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all active:scale-95 text-sm"
          >
            +50
          </button>
          <button
            type="button"
            onClick={handleClearQty}
            className="flex-none px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all active:scale-95 flex items-center justify-center"
            title="Сбросить"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 font-medium ml-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>{error}</p>}
    </form>
  );
}
