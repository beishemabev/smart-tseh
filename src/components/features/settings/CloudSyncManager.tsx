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
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-50 text-green-600 p-2.5 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">👋 Здравствуйте, {store.account.name}!</h2>
            <p className="text-xs sm:text-sm text-green-600 font-medium mt-0.5">✅ Облачная синхронизация активна</p>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 font-medium">
          Все ваши изменения сохраняются автоматически в фоновом режиме.
        </p>

        <Button 
          onClick={handleLogout} 
          variant="secondary"
          className="w-full sm:w-auto h-12 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти из аккаунта
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-2xl">
          <Cloud className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Авторизация</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Войдите, чтобы включить авто-синхронизацию</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <Input
          label="Ваше имя"
          type="text"
          placeholder="Например, Азамат"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 bg-slate-50/50 border-slate-200 text-base"
        />
        <Input
          label="Ваш номер телефона (аккаунт)"
          type="tel"
          placeholder="+996 555 123 456"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12 bg-slate-50/50 border-slate-200 text-base"
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
