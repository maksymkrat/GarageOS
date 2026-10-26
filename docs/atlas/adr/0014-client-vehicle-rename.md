# ADR-0014 · Авто клієнта називається `ClientVehicle`, а не `Car`

**Статус:** Accepted · **Дата:** 2026-10-15 · **Ухвалено:** 2026-10-15

## Контекст

У системі два різні поняття «техніка», і одне з них звалося `Car`:

- `Car` — картка в картотеці СТО: номер, власник, телефон, статус, борг;
- `MyVehicle` — власна техніка в особистому режимі.

Глосарій мусив писати про `MyVehicle` «**Не** те саме, що `Car`» — ознака, що
назви не тримають межу самі. До того ж `Car` вужчий за те, що картотека
насправді тримає: СТО обслуговує й мото, і техніку, у якої пробіг рахується в
мотогодинах ([ADR-0015](0015-mileage-unit.md)), а «car» каже «автомобіль».

Третя дрібниця, яка стала помітною: `CarStatus` використовувався і для авто, і
для наряду, тож назва типу не казала, чий це статус.

## Варіанти

**Лишити `Car`.** Нуль роботи. Межу між двома поняттями далі тримає лише
коментар у глосарії, а назва типу суперечить тому, що в ньому лежить.

**Перейменувати тільки сутність EF.** `ClientVehicleEntity` і таблиця
`client_vehicles`, а домен, DTO, роут і контракт лишаються `Car`. Дешево, але
з'являється третя назва того самого поняття — рівно те, що забороняє правило
«одна назва — одне поняття».

**Перейменувати наскрізь, включно з контрактом.** Одна назва від колонки до
екрана. Ціна — зміна контракту й роута, тобто коміт по обидва боки
([ADR-0002](0002-client-contract-source-of-truth.md)).

## Рішення

**Наскрізь.** `Car` → `ClientVehicle` на всіх ярусах:

| Було | Стало |
|------|-------|
| `CarEntity`, таблиця `cars` | `ClientVehicleEntity`, таблиця `client_vehicles` |
| `Car` (домен), `CarStatus` | `ClientVehicle`, `ClientVehicleStatus` |
| `CarDto`, `CarDetailDto`, `CreateCarRequest` | `ClientVehicleDto`, `ClientVehicleDetailDto`, `CreateClientVehicleRequest` |
| `ICarRepository`, `ICarService` | `IClientVehicleRepository`, `IClientVehicleService` |
| `GET /cars`, `/cars/{id}`, `POST /cars` | `GET /client-vehicles`, `/client-vehicles/{id}`, `POST /client-vehicles` |
| `Car`, `CarDetail`, `CreateCarInput` у контракті | `ClientVehicle`, `ClientVehicleDetail`, `CreateClientVehicleInput` |
| `app/cars/`, `CarCard` | `app/client-vehicles/`, `ClientVehicleCard` |

**Зовнішній ключ — `clientVehicleId`, не `vehicleId`.** `LogEntry.vehicleId`
уже означає `MyVehicle`; коротша назва зіткнула б два поняття знову, тепер уже
в ключах.

**`CarDetail.car` став `ClientVehicleDetail.vehicle`**, а `OrderDetail.car` —
`OrderDetail.vehicle`: усередині відповіді зрозуміло, про яку техніку йдеться,
і довгий префікс там нічого не додає.

**`MyVehicle` назви не змінює.** Воно не було двозначним — двозначним було
`Car`.

**`CarGlyph` лишається `CarGlyph`.** Це ім'я картинки, а не поняття: іконка
малює саме автомобіль.

## Наслідки

**Міграція перейменовує, а не перестворює.** Скафолд EF на перейменовану
сутність дає `DropTable cars` + `CreateTable client_vehicles` і — гірше —
підставляє колонку `days_waiting` на місце `orders.car_id`. Міграція
`20261015055157_ClientVehicleAndLinePayments` написана руками: `RENAME TABLE`,
`RENAME COLUMN`, `RENAME CONSTRAINT`, тож рядки лишаються на місці.

**Ключі кешу react-query змінилися** (`['cars']` → `['client-vehicles']`).
Серверу це нічого не вимагає, але старий кеш у встановленому застосунку не
підхопиться — після оновлення екрани просто перечитають дані.

**Глосарій спростився**: `MyVehicle` більше не потребує заперечення в описі,
бо назви самі кажуть, що це різні речі.
