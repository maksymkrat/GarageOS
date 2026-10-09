export type CarStatus = 'in_work' | 'waiting_part' | 'ready' | 'has_debt';

export interface Car {
  id: number;
  plate: string;
  make: string;
  model: string;
  year: number;
  owner: string;
  phone: string;
  status: CarStatus;
  debt: number;
  mileage: number;
  lastVisit: string;
  nextService?: string;
}

export interface OrderWork {
  name: string;
  price: number;
}

export interface OrderPart {
  name: string;
  qty: number;
  buy: number;
  sell: number;
}

export interface Order {
  id: number;
  carId: number;
  date: string;
  description: string;
  works: OrderWork[];
  parts: OrderPart[];
  status: CarStatus;
  paid: number;
  daysWaiting: number;
}

/** Read model for the reminders screen: a due service joined with its car. */
export interface ReminderItem {
  id: number;
  carId: number;
  plate: string;
  owner: string;
  phone: string;
  what: string;
  overdue: boolean;
}

export type FinancePeriod = 'week' | 'month' | 'year';

export interface FinanceStats {
  earned: number;
  works: number;
  parts: number;
  visits: number;
}

export type LogEntryKind = 'oil' | 'brakes' | 'tires' | 'filter' | 'other';

export interface LogEntry {
  id: number;
  date: string;
  mileage: number;
  title: string;
  note?: string;
  cost: number;
  kind: LogEntryKind;
}

/** Personal garage unit — a car, bike or any serviceable machine the user owns. */
export interface MyVehicle {
  id: number;
  kind: string;
  name: string;
  year: number;
  mileage: number;
  unit: string;
  due?: string;
  log: LogEntry[];
}

export interface CreateCarInput {
  plate: string;
  make: string;
  model: string;
  year?: number;
  mileage?: number;
  owner: string;
  phone: string;
  complaint?: string;
  createOrder: boolean;
}
