'use client';

import * as React from 'react';
import { TaskType } from '@/types';
import { generateId } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SettingsTaskFormProps {
  initialData?: TaskType;
  onSubmit: (data: TaskType) => void;
  onCancel: () => void;
}

export function SettingsTaskForm({ initialData, onSubmit, onCancel }: SettingsTaskFormProps) {
  const [name, setName] = React.useState(initialData?.name || '');
  const [priceStr, setPriceStr] = React.useState(
    initialData ? initialData.pricePerUnit.toString() : ''
  );
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Название операции обязательно');
      return;
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      setError('Введите корректную расценку (больше 0)');
      return;
    }

    const taskData: TaskType = {
      id: initialData?.id || generateId(),
      name: name.trim(),
      pricePerUnit: price,
      createdAt: initialData?.createdAt || Date.now(),
    };

    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Название операции"
        placeholder="Например, Притачивание молнии"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError('');
        }}
        error={error}
        autoFocus
        className="h-12 bg-slate-50/50"
      />

      <Input
        label="Расценка за 1 единицу"
        placeholder="5.50"
        type="number"
        step="0.01"
        min="0"
        value={priceStr}
        onChange={(e) => {
          setPriceStr(e.target.value);
          if (error) setError('');
        }}
        className="h-12 bg-slate-50/50 font-semibold"
      />

      <div className="pt-5 flex gap-3 sm:justify-end">
        <Button 
          type="button" 
          variant="secondary" 
          className="flex-1 sm:flex-none h-12 rounded-xl text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-slate-900 font-bold" 
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          className="flex-1 sm:flex-none h-12 rounded-xl font-bold shadow-blue-500/25 active:scale-[0.98]"
        >
          {initialData ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </form>
  );
}
