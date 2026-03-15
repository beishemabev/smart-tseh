'use client';

import * as React from 'react';
import { Plus, Users } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { User } from '@/types';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmployeeList } from '@/components/features/employees/EmployeeList';
import { EmployeeForm } from '@/components/features/employees/EmployeeForm';
import { AdvanceForm } from '@/components/features/employees/AdvanceForm';

export default function EmployeesPage() {
  const isHydrated = useStoreHydration();
  const { users, addUser, updateUser, deleteUser, addAdvance } = useAppStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | undefined>(undefined);
  
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = React.useState(false);
  const [advanceUser, setAdvanceUser] = React.useState<User | undefined>(undefined);

  if (!isHydrated) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Вы уверены, что хотите удалить сотрудника "${user.name}"? Это действие нельзя отменить.`)) {
      deleteUser(user.id);
    }
  };

  const handleSubmit = (userData: User) => {
    if (editingUser) {
      updateUser(userData.id, userData);
    } else {
      addUser(userData);
    }
    setIsModalOpen(false);
  };

  const handleOpenAdvance = (user: User) => {
    setAdvanceUser(user);
    setIsAdvanceModalOpen(true);
  };

  const handleAdvanceSubmit = (advance: any) => {
    addAdvance(advance);
    setIsAdvanceModalOpen(false);
  };

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-8 pb-32 sm:pb-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            Сотрудники
          </h1>
          <p className="hidden sm:block text-sm font-medium text-slate-500 mt-1">
            Управление персоналом цеха
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="hidden sm:flex rounded-xl font-semibold shadow-blue-500/20 active:scale-95">
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      <EmployeeList 
        users={users} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
        onAddAdvance={handleOpenAdvance}
      />

      {/* Floating Action Button for Mobile */}
      <div className="fixed sm:hidden bottom-6 right-6 z-40">
        <Button 
          size="icon" 
          className="rounded-full shadow-lg h-14 w-14" 
          onClick={handleOpenAdd}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Редактировать профиль' : 'Новый сотрудник'}
      >
        <EmployeeForm 
          initialData={editingUser} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>

      <Modal
        isOpen={isAdvanceModalOpen}
        onClose={() => setIsAdvanceModalOpen(false)}
        title={advanceUser ? `Выдать аванс: ${advanceUser.name}` : 'Выдать аванс'}
      >
        {advanceUser && (
          <AdvanceForm
            userId={advanceUser.id}
            onSubmit={handleAdvanceSubmit}
            onCancel={() => setIsAdvanceModalOpen(false)}
          />
        )}
      </Modal>
    </main>
  );
}
