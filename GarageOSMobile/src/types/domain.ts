export type ClientVehicleStatus = 'in_work' | 'waiting_part' | 'ready' | 'has_debt';

export type MileageUnit = 'km' | 'hours';

export type PaymentStatus = 'unpaid' | 'paid';

export type PhotoSize = 'full' | 'thumb';

export interface ClientVehicle {
  id: number;
  plate: string;

  // Free text, the same three values as `MyVehicle.kind`. It picks which
  // catalogue of makes the form offers, and tells a bike from a car on a card
  // where both are a plate and a model (ADR-0029).
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

  // Opaque id of the car's current photo, absent when it has none. It doubles
  // as the cache key: a replacement gets a new id, so the URL changes with the
  // picture and a cached one can never go stale.
  photoId?: string;
}

// Lines are addressable: `id` is what makes editing one of them a request of
// its own instead of a rewrite of the whole order.
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

// Only an id: the bytes come from their own endpoint, and the uuid that names
// the file on disk never leaves the server.
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

export interface ReminderItem {
  id: number;
  clientVehicleId: number;
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

  // Same meaning as on ClientVehicle: the id of the current photo, absent when
  // there is none, and the cache key for its URL.
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

// A new order may arrive with its lines in one go; afterwards each line is
// edited through its own endpoint, so the order PUT carries only the complaint.
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
