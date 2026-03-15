'use client';

import * as React from 'react';
import { User, Role } from '@/types';
import { generateId } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface EmployeeFormProps {
  initialData?: User;
  onSubmit: (data: User) => void;
  onCancel: () => void;
}

export function EmployeeForm({ initialData, onSubmit, onCancel }: EmployeeFormProps) {
  const [name, setName] = React.useState(initialData?.name || '');
  const [role, setRole] = React.useState<Role>(initialData?.role || 'seamstress');
  const [phone, setPhone] = React.useState(initialData?.phone || '');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Имя обязательно для заполнения');
      return;
    }

    const userData: User = {
      id: initialData?.id || generateId(),
      name: name.trim(),
      role,
      phone: phone.trim() || undefined,
      createdAt: initialData?.createdAt || Date.now(),
    };

    onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Имя сотрудника"
        placeholder="Например, Анна Иванова"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError('');
        }}
        error={error}
        autoFocus
        className="h-12 bg-slate-50/50"
      />

      <div className="w-full">
        <label htmlFor="role-select" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          Специализация / Роль
        </label>
        <select
          id="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all shadow-sm hover:border-slate-300 font-medium cursor-pointer"
        >
          <option value="seamstress">Швея</option>
          <option value="manager">Менеджер</option>
          <option value="owner">Владелец</option>
        </select>
      </div>

      <Input
        label="Номер телефона (необязательно)"
        placeholder="+7 (999) 000-00-00"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="h-12 bg-slate-50/50"
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
