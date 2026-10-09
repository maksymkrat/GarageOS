import type {
  Car,
  FinancePeriod,
  FinanceStats,
  MyVehicle,
  Order,
} from '@/types/domain';

interface ReminderRecord {
  id: number;
  carId: number;
  what: string;
  overdue: boolean;
}

/**
 * In-memory stand-in for the backend. Mutations from the app land here, so the
 * data stays consistent for the lifetime of the session.
 */
interface Store {
  cars: Car[];
  orders: Order[];
  reminders: ReminderRecord[];
  vehicles: MyVehicle[];
  finance: Record<FinancePeriod, FinanceStats>;
}

export const store: Store = {
  cars: [
    {
      id: 1,
      plate: 'АС1234ВС',
      make: 'Volkswagen',
      model: 'Passat B7',
      year: 2018,
      owner: 'Іван Петренко',
      phone: '0501234567',
      status: 'in_work',
      debt: 0,
      mileage: 145200,
      lastVisit: '15.01.2025',
      nextService: '15.04.2025',
    },
    {
      id: 2,
      plate: 'КА5678МН',
      make: 'Toyota',
      model: 'Camry 70',
      year: 2020,
      owner: 'Олег Сидоренко',
      phone: '0671234567',
      status: 'waiting_part',
      debt: 1500,
      mileage: 87300,
      lastVisit: '12.01.2025',
    },
    {
      id: 3,
      plate: 'ВА9012ОР',
      make: 'BMW',
      model: '5 Series F10',
      year: 2019,
      owner: 'Марина Коваль',
      phone: '0931234567',
      status: 'ready',
      debt: 3200,
      mileage: 211000,
      lastVisit: '10.01.2025',
      nextService: '10.03.2025',
    },
    {
      id: 4,
      plate: 'АА1111ВВ',
      make: 'Honda',
      model: 'CR-V IV',
      year: 2017,
      owner: 'Дмитро Бондар',
      phone: '0661234567',
      status: 'in_work',
      debt: 0,
      mileage: 178000,
      lastVisit: '14.01.2025',
    },
    {
      id: 5,
      plate: 'НА7890КМ',
      make: 'Skoda',
      model: 'Octavia A7',
      year: 2016,
      owner: 'Тетяна Мороз',
      phone: '0501111222',
      status: 'waiting_part',
      debt: 0,
      mileage: 195000,
      lastVisit: '11.01.2025',
    },
    {
      id: 6,
      plate: 'ІА0001АА',
      make: 'Renault',
      model: 'Megane IV',
      year: 2019,
      owner: 'Петро Лисенко',
      phone: '0931112233',
      status: 'has_debt',
      debt: 4800,
      mileage: 112000,
      lastVisit: '05.01.2025',
    },
  ],

  orders: [
    {
      id: 1,
      carId: 1,
      date: '15.01.2025',
      description: 'Стукіт з-під капоту, потік антифриз',
      works: [
        { name: 'Заміна ременя ГРМ', price: 1800 },
        { name: 'Заміна помпи', price: 600 },
      ],
      parts: [
        { name: 'Ремінь ГРМ Gates', qty: 1, buy: 1200, sell: 1500 },
        { name: 'Помпа охолоджувача', qty: 1, buy: 800, sell: 1000 },
      ],
      status: 'in_work',
      paid: 2000,
      daysWaiting: 0,
    },
    {
      id: 2,
      carId: 2,
      date: '12.01.2025',
      description: 'Стукіт при повороті',
      works: [{ name: 'Діагностика підвіски', price: 500 }],
      parts: [{ name: 'Стійка стабілізатора', qty: 2, buy: 450, sell: 600 }],
      status: 'waiting_part',
      paid: 0,
      daysWaiting: 3,
    },
    {
      id: 3,
      carId: 3,
      date: '10.01.2025',
      description: 'Планове ТО 210 000 км',
      works: [
        { name: 'Технічне обслуговування', price: 800 },
        { name: 'Заміна гальмівних колодок', price: 400 },
      ],
      parts: [
        { name: 'Мастило 5W-30 5л', qty: 1, buy: 900, sell: 1100 },
        { name: 'Фільтр масляний', qty: 1, buy: 180, sell: 240 },
        { name: 'Колодки передні Brembo', qty: 1, buy: 1400, sell: 1800 },
      ],
      status: 'ready',
      paid: 0,
      daysWaiting: 5,
    },
    {
      id: 4,
      carId: 4,
      date: '14.01.2025',
      description: 'Заміна зчеплення, вібрація при русі',
      works: [{ name: 'Заміна комплекту зчеплення', price: 2200 }],
      parts: [{ name: 'Комплект зчеплення LuK', qty: 1, buy: 4200, sell: 5100 }],
      status: 'in_work',
      paid: 3000,
      daysWaiting: 1,
    },
    {
      id: 5,
      carId: 5,
      date: '11.01.2025',
      description: 'Не запускається холодний двигун',
      works: [{ name: 'Діагностика запалювання', price: 400 }],
      parts: [{ name: 'Свічки NGK (к-т 4 шт)', qty: 1, buy: 480, sell: 640 }],
      status: 'waiting_part',
      paid: 0,
      daysWaiting: 4,
    },
  ],

  reminders: [
    { id: 1, carId: 3, what: 'ТО — прострочено 5 днів', overdue: true },
    { id: 2, carId: 1, what: 'ТО — 15 квітня 2025', overdue: false },
    { id: 3, carId: 4, what: 'ТО — 190 000 км (−12 000 км)', overdue: false },
  ],

  vehicles: [
    {
      id: 1,
      kind: 'Авто',
      name: 'Mazda CX-5',
      year: 2019,
      mileage: 98400,
      unit: 'км',
      due: 'Заміна масла через 600 км',
      log: [
        {
          id: 1,
          date: '02.09.2026',
          mileage: 91400,
          title: 'Масло + масляний фільтр',
          note: 'Mazda Dexelia 0W-20, 4.5 л',
          cost: 2350,
          kind: 'oil',
        },
        {
          id: 2,
          date: '14.06.2026',
          mileage: 88100,
          title: 'Передні колодки',
          note: 'Akebono, диски в нормі',
          cost: 1900,
          kind: 'brakes',
        },
        {
          id: 3,
          date: '20.04.2026',
          mileage: 85900,
          title: 'Сезонна заміна шин',
          note: 'Michelin Primacy 4, 225/65 R17',
          cost: 800,
          kind: 'tires',
        },
        {
          id: 4,
          date: '11.01.2026',
          mileage: 81200,
          title: 'Салонний фільтр',
          cost: 450,
          kind: 'filter',
        },
      ],
    },
    {
      id: 2,
      kind: 'Мото',
      name: 'Honda CB500X',
      year: 2021,
      mileage: 21300,
      unit: 'км',
      log: [
        {
          id: 5,
          date: '28.08.2026',
          mileage: 20900,
          title: 'Ланцюг + зірки',
          note: 'DID 520 VX3',
          cost: 4200,
          kind: 'other',
        },
        {
          id: 6,
          date: '03.05.2026',
          mileage: 18000,
          title: 'Масло двигуна',
          note: 'Motul 7100 10W-40',
          cost: 1300,
          kind: 'oil',
        },
      ],
    },
    {
      id: 3,
      kind: 'Техніка',
      name: 'Husqvarna 128R',
      year: 2022,
      mileage: 64,
      unit: 'мотогод',
      due: 'Свічка — термін минув',
      log: [
        {
          id: 7,
          date: '15.05.2026',
          mileage: 52,
          title: 'Повітряний фільтр',
          cost: 220,
          kind: 'filter',
        },
      ],
    },
  ],

  finance: {
    week: { earned: 11800, works: 7100, parts: 4700, visits: 3 },
    month: { earned: 47200, works: 28400, parts: 18800, visits: 12 },
    year: { earned: 512400, works: 301600, parts: 210800, visits: 143 },
  },
};

export function nextId(rows: { id: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
}
