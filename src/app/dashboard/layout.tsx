import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white select-none">
            Швейкальк
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">Владелец</span>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
              А
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 pb-safe sm:hidden transition-colors">
        <div className="flex justify-around items-center h-16">
          <div className="flex flex-col items-center justify-center w-full h-full text-blue-600">
            <span className="text-xs font-medium mt-1">Главная</span>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <span className="text-xs font-medium mt-1">Партии</span>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <span className="text-xs font-medium mt-1">Отчеты</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
