import { LucideIcon } from 'lucide-react';

export type TransactionType = 'IN' | 'OUT' | 'TRANSFER' | 'LAUNDRY_SEND' | 'LAUNDRY_RECEIVE';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  responsible: string;
  timestamp: Date;
  description: string;
  category: string;
}

export interface InventoryState {
  clean: number;
  gym: number;
  dirty: number;
  laundry: number;
}

export interface AlertThresholds {
  clean: number;
  dirty: number;
  laundry: number;
}
