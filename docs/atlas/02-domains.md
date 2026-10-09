# 02 · Домени

Домени виведені з модулів `GarageOSMobile/src/api/` — саме вони нині визначають
межі. Бекенд має повторити цей поділ, щоб шов транспорту лишився тонким.

```mermaid
flowchart LR
    cars["<b>Cars</b><br/>картотека авто клієнтів<br/><i>src/api/cars.ts</i>"]
    orders["<b>Orders</b><br/>замовлення-наряди<br/><i>src/api/orders.ts</i>"]
    finance["<b>Finance</b><br/>виторг і борги<br/><i>src/api/finance.ts</i>"]
    reminders["<b>Reminders</b><br/>нагадування про ТО<br/><i>src/api/reminders.ts</i>"]
    personal["<b>Personal garage</b><br/>власна техніка<br/><i>src/api/vehicles.ts</i>"]
    board["<i>Work board</i><br/>read-model на клієнті<br/><i>src/queries/use-work-board.ts</i>"]

    orders -->|carId| cars
    finance -->|debt, статуси| cars
    reminders -->|carId| cars
    board --> cars
    board --> orders

    personal:::isolated
    classDef isolated stroke-dasharray: 5 5
```

## Карта доменів

| Домен | Відповідальність | Сутності | Залежить від | Ендпойнти |
|-------|------------------|----------|--------------|-----------|
| **Cars** | авто клієнта як довготривала картка: власник, контакт, пробіг, статус, борг | `Car`, `CreateCarInput`, `CarDetail` | — | `GET /cars`, `GET /cars/{id}`, `POST /cars` |
| **Orders** | конкретний візит: скарга, роботи, деталі, оплата | `Order`, `OrderWork`, `OrderPart`, `OrderDetail` | Cars (`carId`) | `GET /orders`, `GET /orders/{id}` |
| **Finance** | агрегат за період + хто винен гроші | `FinanceStats`, `FinancePeriod`, `FinanceOverview` | Cars (`debt`) | `GET /finance?period=` |
| **Reminders** | що і коли треба обслужити, чи прострочено | `ReminderItem` | Cars | `GET /reminders` |
| **Personal garage** | своя техніка та журнал обслуговування | `MyVehicle`, `LogEntry`, `LogEntryKind` | — (ізольований) | `GET /my-vehicles`, `GET /my-vehicles/{id}` |

## Зв'язки та правила

**Cars — ядро.** Три з п'яти доменів посилаються на авто. `Car.status` типу
`CarStatus` (`in_work` / `waiting_part` / `ready` / `has_debt`) — це стан, який
читає дошка робіт, а `Car.debt` — те, з чого Finance збирає боржників.

**Orders дублює статус.** `Order.status` має той самий тип `CarStatus`, що й
`Car.status`. У моку вони виставляються узгоджено, але **інваріант ніде не
забезпечений**. Це перше, що бекенд мусить вирішити: хто власник статусу —
авто чи наряд. Див. [03-data-model.md](03-data-model.md#відкриті-питання-моделі).

**Personal garage ізольований.** `MyVehicle` не має `carId` і не перетинається
з картотекою СТО: інша сутність, інший режим, свій журнал. Об'єднувати їх не
треба — у них різні власники даних.

**Work board — не домен.** Це read-model, зібраний на клієнті з `Cars` і
`Orders`. Серверного ендпойнта для нього немає свідомо
([04-api-surface.md](04-api-surface.md#композиція-на-клієнті)).

## Проєкція на структуру `GarageOSWeb`

```
GarageOS.Domain/     Models/ (11 моделей) Enums/ (CarStatus, LogEntryKind, FinancePeriod)
GarageOS.DAL/        Entities/ Configurations/ Context/ Repositories/ Migrations/
GarageOS.Services/   CarService, OrderService, FinanceService, ReminderService,
                     MyVehicleService + Dtos/ Mapping/
GarageOS.Api/        Controllers/ (Cars, Orders, Finance, Reminders, MyVehicles)
```

Поділ за шарами, а не за фічами. Межа домену на сервері проходить не папкою, а
трійкою «сервіс + репозиторій + контролер» з однаковою назвою: домен `Cars` —
це `CarService`, `CarRepository` і `CarsController`. Див.
[ADR-0006](adr/0006-backend-layering.md), який скасував попередній намір різати
сервер за фічами.

**Work board** серверного відповідника не має й тут: його збирає клієнт.

→ Далі: [03 · Модель даних](03-data-model.md)
