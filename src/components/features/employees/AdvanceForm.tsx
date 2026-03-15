import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Advance } from '@/types';
import { generateId } from '@/lib/utils';
import { format } from 'date-fns';

interface AdvanceFormProps {
  userId: string;
  onSubmit: (advance: Advance) => void;
  onCancel: () => void;
}

export function AdvanceForm({ userId, onSubmit, onCancel }: AdvanceFormProps) {
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
  const [reason, setReason] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    onSubmit({
      id: generateId(),
      userId,
      amount: Number(amount),
      date,
      reason: reason.trim() || undefined,
      createdAt: Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Сумма аванса (сом)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Например: 1000"
        required
        min="1"
        autoFocus
      />
      
      <Input
        label="Дата"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      
      <Input
        label="Комментарий (необязательно)"
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="На проезд, на обед..."
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={!amount || Number(amount) <= 0}>
          Выдать аванс
        </Button>
      </div>
    </form>
  );
}
