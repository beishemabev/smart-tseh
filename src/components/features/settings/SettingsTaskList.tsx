'use client';

import * as React from 'react';
import { TaskType } from '@/types';
import { Edit2, MoreVertical, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface SettingsTaskListProps {
  taskTypes: TaskType[];
  onEdit: (task: TaskType) => void;
  onDelete: (task: TaskType) => void;
}

export function SettingsTaskList({ taskTypes, onEdit, onDelete }: SettingsTaskListProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  if (taskTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <Tag className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">Нет операций</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          У вас пока нет добавленных операций. Нажмите "Добавить", чтобы начать.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {taskTypes.map((task) => (
        <div 
          key={task.id} 
          className="relative flex items-center p-4 sm:p-5 bg-white/70 backdrop-blur-md rounded-[1.5rem] border border-white/50 shadow-sm transition-all hover:shadow-md hover:border-white/80 group"
        >
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-[17px] font-bold text-slate-900 truncate">
              {task.name}
            </h4>
            <div className="mt-1.5 text-[15px] font-bold text-emerald-600">
              {formatCurrency(task.pricePerUnit)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center">
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="text-gray-500 hover:text-black">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(task)} className="text-gray-500 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="sm:hidden relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </Button>

              {activeMenuId === task.id && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setActiveMenuId(null)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20 overflow-hidden animate-in fade-in duration-100">
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        onEdit(task);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit2 className="w-4 h-4 mr-3" /> Изменить цену
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        onDelete(task);
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
      ))}
    </div>
  );
}
