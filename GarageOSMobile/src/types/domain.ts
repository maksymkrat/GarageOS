export type ClientVehicleStatus = 'in_work' | 'waiting_part' | 'ready' | 'has_debt';

export type MileageUnit = 'km' | 'hours';

export type PaymentStatus = 'unpaid' | 'paid';

export type PhotoSize = 'full' | 'thumb';

export interface ClientVehicle {
  id: number;
  plate: string;

  kind: string;
  make: string;
  model: string;
  year?: number;
  owner: string;
  phone: string;
  status: ClientVehicleStatus;
  debt: number;
  mileage?: number;
  mileageUnit: MileageUnit;
  lastVisit: string;
  nextService?: string;

  photoId?: string;
}

export interface OrderWork {
  id: number;
  description: string;
  price: number;
  paymentStatus: PaymentStatus;
}

export interface OrderPart {
  id: number;
  description: string;
  buy: number;
  sell: number;
  paymentStatus: PaymentStatus;
}

export interface OrderWorkInput {
  description: string;
  price: number;
  paymentStatus: PaymentStatus;
}

export interface OrderPartInput {
  description: string;
  buy: number;
  sell: number;
  paymentStatus: PaymentStatus;
}

export interface OrderPhoto {
  id: number;
}

export interface Order {
  id: number;
  clientVehicleId: number;
  date: string;
  description: string;
  works: OrderWork[];
  parts: OrderPart[];
  daysWaiting: number;
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
  note: string;
  cost: number;
  kind: LogEntryKind;
  mileage?: number;
  mileageUnit: MileageUnit;
}

export interface MyVehicle {
  id: number;
  kind: string;
  name: string;
  year: number;
  mileage: number;
  mileageUnit: MileageUnit;
  log: LogEntry[];

  photoId?: string;
}

export interface CreateClientVehicleInput {
  plate: string;
  kind: string;
  make: string;
  model: string;
  year?: number;
  mileage?: number;
  mileageUnit?: MileageUnit;
  owner: string;
  phone: string;
  complaint?: string;
  createOrder: boolean;
}

export interface CreateMyVehicleInput {
  kind: string;
  name: string;
  year: number;
  mileage: number;
  mileageUnit: MileageUnit;
}

export interface CreateLogEntryInput {
  note: string;
  cost: number;
  kind: LogEntryKind;
  mileage?: number;
}

export interface UpdateClientVehicleStatusInput {
  status: ClientVehicleStatus;
}

export interface CreateOrderInput {
  clientVehicleId: number;
  description: string;
  works: OrderWorkInput[];
  parts: OrderPartInput[];
}

export interface UpdateOrderInput {
  description: string;
}

export interface UpdateMyVehicleInput {
  kind: string;
  name: string;
  year: number;
  mileage: number;
  mileageUnit: MileageUnit;
}

export interface UpdateLogEntryInput {
  note: string;
  cost: number;
  kind: LogEntryKind;
  mileage?: number;
}

export interface UserProfile {
  id: number;

  firstName: string;
  lastName?: string;

  phone: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  master: boolean;
  user: UserProfile;
}

export interface BotInfo {
  username: string;
}

export interface RequestCodeInput {
  phone: string;
}

export interface VerifyCodeInput {
  phone: string;
  code: string;
}
