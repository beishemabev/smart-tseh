import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './db';
import { User, TaskType, WorkEntry, Advance } from '@/types';

interface AppState {
  account: { phone: string; name: string } | null;
  users: User[];
  taskTypes: TaskType[];
  workEntries: WorkEntry[];
  advances: Advance[];
  isHydrated: boolean;
  // Actions
  login: (phone: string, name: string, cloudData?: Partial<AppState>) => void;
  logout: () => void;
  setHydrated: () => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addTaskType: (taskType: TaskType) => void;
  updateTaskType: (taskId: string, updates: Partial<TaskType>) => void;
  deleteTaskType: (taskId: string) => void;
  addEntry: (entry: WorkEntry) => void;
  deleteEntry: (entryId: string) => void;
  addAdvance: (advance: Advance) => void;
  deleteAdvance: (advanceId: string) => void;
  
  // Full DB Replacement (for Import/Export feature)
  restoreDatabase: (data: Partial<AppState>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      account: null,
      users: [],
      taskTypes: [],
      workEntries: [],
      advances: [],
      isHydrated: false,
      
      login: (phone, name, cloudData) => set((state) => ({
        account: { phone, name },
        ...(cloudData?.users && { users: cloudData.users }),
        ...(cloudData?.taskTypes && { taskTypes: cloudData.taskTypes }),
        ...(cloudData?.workEntries && { workEntries: cloudData.workEntries }),
        ...(cloudData?.advances && { advances: cloudData.advances }),
      })),

      logout: () => set({
        account: null,
        users: [],
        taskTypes: [],
        workEntries: [],
        advances: []
      }),
      
      setHydrated: () => set({ isHydrated: true }),
      
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      
      updateUser: (userId, updates) => set((state) => ({
        users: state.users.map(u => u.id === userId ? { ...u, ...updates } : u)
      })),
      
      deleteUser: (userId) => set((state) => ({
        users: state.users.filter(u => u.id !== userId)
      })),
      
      addTaskType: (taskType) => set((state) => ({ taskTypes: [...state.taskTypes, taskType] })),
      
      updateTaskType: (taskId, updates) => set((state) => ({
        taskTypes: state.taskTypes.map(t => t.id === taskId ? { ...t, ...updates } : t)
      })),
      
      deleteTaskType: (taskId) => set((state) => ({
        taskTypes: state.taskTypes.filter(t => t.id !== taskId)
      })),
      
      addEntry: (entry) => set((state) => ({ workEntries: [...state.workEntries, entry] })),
      
      deleteEntry: (entryId) => set((state) => ({
        workEntries: state.workEntries.filter(e => e.id !== entryId)
      })),

      addAdvance: (advance) => set((state) => ({ advances: [...state.advances, advance] })),

      deleteAdvance: (advanceId) => set((state) => ({
        advances: state.advances.filter(a => a.id !== advanceId)
      })),
      
      restoreDatabase: (data) => set((state) => ({
        ...state,
        users: data.users || state.users,
        taskTypes: data.taskTypes || state.taskTypes,
        workEntries: data.workEntries || state.workEntries,
        advances: data.advances || state.advances
      })),
    }),
    {
      name: 'smarttseh-storage', // key in IndexedDB
      storage: createJSONStorage(() => idbStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);

// Add debounce utility and subscription for Auto-sync
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

const syncToCloud = debounce(async (state: AppState) => {
  if (!state.account) return;
  try {
    const { supabase } = await import('./supabase');
    const stateData = {
      users: state.users,
      taskTypes: state.taskTypes,
      workEntries: state.workEntries,
      advances: state.advances,
    };
    await supabase
      .from('workspaces')
      .upsert({ phone: state.account.phone, state_data: stateData }, { onConflict: 'phone' });
  } catch (error) {
    console.error('Auto-sync saved failed:', error);
  }
}, 2000);

useAppStore.subscribe((state, prevState) => {
  if (
    state.account &&
    (state.users !== prevState.users ||
      state.taskTypes !== prevState.taskTypes ||
      state.workEntries !== prevState.workEntries ||
      state.advances !== prevState.advances ||
      state.account !== prevState.account)
  ) {
    syncToCloud(state);
  }
});
