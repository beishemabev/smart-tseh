'use client';

import * as React from 'react';
import { Cloud, Loader2, LogOut, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function CloudSyncManager() {
  const store = useAppStore();
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!phone || !name) {
      alert('Введите имя и номер телефона');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('state_data')
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') { // not found error
        throw error;
      }

      if (data && data.state_data) {
        store.login(phone, name, data.state_data);
      } else {
        store.login(phone, name);
      }
    } catch (error: any) {
      console.error(error);
      alert('Ошибка при авторизации: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти? Данные на этом устройстве будут удалены (в облаке они останутся).')) {
      store.logout();
    }
  };

  if (store.account) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/40 dark:border-slate-800 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 p-2.5 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">👋 Здравствуйте, {store.account.name}!</h2>
            <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium mt-0.5">✅ Облачная синхронизация активна</p>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Все ваши изменения сохраняются автоматически в фоновом режиме.
        </p>

        <Button 
          onClick={handleLogout} 
          variant="secondary"
          className="w-full sm:w-auto h-12 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border-none transition-all active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти из аккаунта
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/40 dark:border-slate-800 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-6 sm:p-8 space-y-6 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2.5 rounded-2xl">
          <Cloud className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Авторизация</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Войдите, чтобы включить авто-синхронизацию</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <Input
          label="Ваше имя"
          type="text"
          placeholder="Например, Азамат"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-base"
        />
        <Input
          label="Ваш номер телефона (аккаунт)"
          type="tel"
          placeholder="+996 555 123 456"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-base"
        />

        <Button 
          onClick={handleLogin} 
          disabled={isLoading || !phone || !name}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Cloud className="w-4 h-4 mr-2" />}
          Войти и включить синхронизацию
        </Button>
      </div>
    </div>
  );
}
