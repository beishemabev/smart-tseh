'use client';

import * as React from 'react';
import { User } from '@/types';
import { Edit2, MoreVertical, Trash2, UserCircle, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

interface EmployeeListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onAddAdvance: (user: User) => void;
}

const roleMap: Record<User['role'], string> = {
  seamstress: 'Швея',
  manager: 'Менеджер',
  owner: 'Владелец',
};

export function EmployeeList({ users, onEdit, onDelete, onAddAdvance }: EmployeeListProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const { workEntries, advances } = useAppStore();

  const getWeeklyBalance = (userId: string) => {
    const now = new Date();
    // Assuming week starts on Monday (1)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const userEntries = workEntries.filter(
      (e) => e.userId === userId && isWithinInterval(parseISO(e.date), { start: weekStart, end: weekEnd })
    );
    const userAdvances = advances.filter(
      (a) => a.userId === userId && isWithinInterval(parseISO(a.date), { start: weekStart, end: weekEnd })
    );

    const totalEarned = userEntries.reduce((sum, entry) => sum + entry.total, 0);
    const totalAdvanced = userAdvances.reduce((sum, adv) => sum + adv.amount, 0);

    return totalEarned - totalAdvanced;
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <UserCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">Нет сотрудников</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          У вас пока нет добавленных сотрудников. Нажмите "Добавить", чтобы начать.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => {
        const balance = getWeeklyBalance(user.id);
        const isPositive = balance > 0;
        
        return (
          <div 
            key={user.id} 
            className="relative flex items-center p-4 sm:p-5 bg-white/70 backdrop-blur-md rounded-[1.5rem] border border-white/50 shadow-sm transition-all hover:shadow-md hover:border-white/80"
          >
            {/* Avatar Placeholder */}
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-lg font-bold text-slate-600 shadow-inner">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-[17px] font-bold text-slate-900 truncate">
                {user.name}
              </h4>
              <div className="flex flex-wrap items-center mt-1.5 gap-2 text-sm text-slate-500 font-medium">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {roleMap[user.role]}
                </span>
                
                {/* Feature 3: Real-time Balance Badge */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  Баланс (нед): {balance} ₽
                </span>

                {user.phone && (
                  <span className="truncate text-slate-400 block w-full sm:w-auto mt-1 sm:mt-0">{user.phone}</span>
                )}
              </div>
            </div>

            {/* Actions - Desktop & Mobile Menu Trigger */}
            <div className="flex-shrink-0 flex items-center">
              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onAddAdvance(user)} title="Выдать аванс" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50">
                  <Banknote className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(user)} title="Редактировать" className="text-gray-500 hover:text-black">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(user)} title="Удалить" className="text-gray-500 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Actions Menu */}
              <div className="sm:hidden relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                >
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </Button>

                {/* Simple dropdown */}
                {activeMenuId === user.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setActiveMenuId(null)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onAddAdvance(user);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 font-medium border-b border-gray-100"
                      >
                        <Banknote className="w-4 h-4 mr-3" /> Выдать аванс
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onEdit(user);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit2 className="w-4 h-4 mr-3" /> Редактировать
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onDelete(user);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        <Trash2 className="w-4 h-4 mr-3" /> Удалить
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
