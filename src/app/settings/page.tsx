'use client';

import * as React from 'react';
import { Settings as SettingsIcon, Plus } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { TaskType } from '@/types';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SettingsTaskForm } from '@/components/features/settings/SettingsTaskForm';
import { SettingsTaskList } from '@/components/features/settings/SettingsTaskList';
import { CloudSyncManager } from '@/components/features/settings/CloudSyncManager';
import { ThemeToggle } from '@/components/features/settings/ThemeToggle';

export default function SettingsPage() {
  const isHydrated = useStoreHydration();
  const { taskTypes, addTaskType, updateTaskType, deleteTaskType } = useAppStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<TaskType | undefined>(undefined);

  if (!isHydrated) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: TaskType) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (task: TaskType) => {
    if (confirm(`Вы уверены, что хотите удалить операцию "${task.name}"?`)) {
      deleteTaskType(task.id);
    }
  };

  const handleSubmit = (taskData: TaskType) => {
    if (editingTask) {
      updateTaskType(taskData.id, taskData);
    } else {
      addTaskType(taskData);
    }
    setIsModalOpen(false);
  };

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-8 pb-32 sm:pb-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
          Настройки
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Каталог операций (расценки) и управление данными устройства
        </p>
      </div>

      {/* Theme Toggle Section */}
      <section>
        <ThemeToggle />
      </section>

      {/* Cloud Sync Section */}
      <section>
        <CloudSyncManager />
      </section>

      {/* Task Types / Prices Catalog */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Каталог операций
          </h2>
          <Button onClick={handleOpenAdd} size="sm" className="hidden sm:flex rounded-xl font-semibold shadow-blue-500/20 active:scale-95">
            <Plus className="w-4 h-4 mr-2" />
            Добавить операцию
          </Button>
        </div>

        <SettingsTaskList 
          taskTypes={taskTypes} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
        />
      </section>

      {/* Floating Action Button for Mobile */}
      <div className="fixed sm:hidden bottom-24 right-5 z-40">
        <Button 
          size="icon" 
          className="rounded-full shadow-lg shadow-blue-500/30 h-14 w-14 active:scale-95 transition-transform" 
          onClick={handleOpenAdd}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Редактировать операцию' : 'Новая швейная операция'}
      >
        <SettingsTaskForm 
          initialData={editingTask} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>

      {/* Footer Version */}
      <div className="pt-8 text-center pb-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Швейкальк v1.0.0. Работает полностью офлайн
        </p>
      </div>
    </main>
  );
}
