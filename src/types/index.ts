// Core Types for SmartTseh

export type Role = 'seamstress' | 'manager' | 'owner';

export interface User {
  id: string; // uuid
  name: string;
  role: Role;
  phone?: string;
  createdAt: number; // timestamp
}

export interface TaskType {
  id: string; // uuid
  name: string; // e.g., "Футболка базовая", "Толстовка"
  pricePerUnit: number; // Piece-rate price
  createdAt: number;
}

export interface WorkEntry {
  id: string; // uuid
  date: string; // YYYY-MM-DD format for easy daily filtering
  userId: string;
  taskId: string;
  quantity: number;
  priceAtTheTime: number; // Snapshot of the price to prevent historical changes
  total: number; // quantity * priceAtTheTime
  createdAt: number; // timestamp
}

export interface Advance {
  id: string; // uuid
  date: string; // YYYY-MM-DD format
  userId: string;
  amount: number;
  reason?: string;
  createdAt: number; // timestamp
}
