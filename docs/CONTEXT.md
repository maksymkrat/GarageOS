# Контекст GarageOS

Один вхід у проєкт: те, що потрібно знати до першої правки, в одному читанні.
Файл **не заміняє** [атлас](atlas/README.md) — він тримає те, що потрібно майже
завжди, і каже, куди йти за подробицями. Правила роботи — у кореневому
[AGENTS.md](../AGENTS.md), тут вони не дублюються.

Стан: 2026-10-28. Обидва яруси працюють наживо, мобілка ходить до API по HTTP.

## Куди йти за подробицями

| Питання | Файл | ~KB |
|---|---|---|
| Повний перелік 41 ендпойнта, коди помилок | [atlas/04-api-surface.md](atlas/04-api-surface.md) | 20 |
| Поля сутностей, ER-схема, read-моделі | [atlas/03-data-model.md](atlas/03-data-model.md) | 18 |
| Вхід, помилки, конфіг, секрети, логування | [atlas/05-cross-cutting.md](atlas/05-cross-cutting.md) | 20 |
| Межі системи, актори, сценарії, якісні атрибути | [atlas/00-overview.md](atlas/00-overview.md) | 9 |
| Домени й їхні залежності | [atlas/02-domains.md](atlas/02-domains.md) | 6 |
| Укр/англ відповідність термінів | [atlas/07-glossary.md](atlas/07-glossary.md) | 8 |
| **Чому** так, а не інакше | [atlas/adr/](atlas/adr/README.md) — 29 ADR | 5–36 кожен |
| Правила ярусу перед правкою коду | `GarageOSMobile/AGENTS.md`, `GarageOSWeb/AGENTS.md` | 1 / 10 |

Правило економії: спершу цей файл; атласну сторінку відкривай, коли правиш саме
той бік (модель, ендпойнт, вхід), а ADR — коли збираєшся змінити рішення або не
розумієш, чому код такий дивний.

## Що це за система

Облік обслуговування техніки, два режими на спільному ядрі:

- **сервісний** (`src/app/(service)/`) — інструмент СТО: дошка робіт, картотека
  авто клієнтів, гроші й борги;
- **особистий** (`src/app/personal/`) — свій гараж: власна техніка з журналом
  обслуговування.

Один привілейований акаунт — майстер, за `Telegram:OwnerId` у конфігу, а не
колонкою в таблиці. Ролей немає. Поза межами свідомо: бухгалтерія, зарплати,
склад запчастин, телематика, запис на час.

## Карта репозиторію

```
GarageOSMobile/          Expo SDK 58, RN 0.88, React 19.3, TS 6, expo-router, react-query 5
  src/types/domain.ts    КОНТРАКТ: усі типи даних (215 рядків)
  src/api/*.ts           КОНТРАКТ: шляхи ендпойнтів рядком у request()
  src/api/client.ts      транспорт: baseUrl, ApiError, токен, upload, тихий refresh
  src/queries/           react-query: хуки, keys.ts, use-work-board.ts (read-model)
  src/app/               екрани (expo-router): (auth) 3, (service) 4, деталі й форми
  src/components/        ui/ — спільні примітиви, forms/ — три форми
  src/lib/               format.ts, order.ts (похідні суми), vehicle-catalog.ts, session.tsx
  src/theme/             tokens.ts (палітра), status.ts (підписи статусів)
GarageOSWeb/             .NET 10, ASP.NET Core, EF Core 10, Postgres 18
  GarageOS.Domain/       Models/ Enums/ — нуль залежностей
  GarageOS.DAL/          Entities/ Configurations/ Context/ Repositories/ Migrations/
  GarageOS.Services/     сервіси, Dtos/ Mapping/ Photos/ Security/ Exceptions/
  GarageOS.Telegram.Bot/ транспорт Telegram, без рішень
  GarageOS.Api/          Controllers/ (5) Infrastructure/ (політики, обробники помилок)
docs/atlas/              атлас + 29 ADR
garage-erd.drawio        рукописна ER-схема (дублює Mermaid в атласі)
garage-login-flow.drawio докладна схема входу (дублює Mermaid в ADR-0007)
```

Залежності сервера односторонні: `DAL → Domain`, `Services → DAL + Domain`,
`Telegram.Bot → Services`, `Api → усі`. Посилань у інший бік не додавати
([ADR-0006](atlas/adr/0006-backend-layering.md)).

## Контракт — джерело істини

`GarageOSMobile/src/types/domain.ts` + `src/api/*.ts` визначають форму даних і
назви шляхів; сервер реалізує оголошене
([ADR-0002](atlas/adr/0002-client-contract-source-of-truth.md)). Зміна
контракту — **один коміт на обидві сторони**, спершу клієнт.

Одна сутність живе в трьох виглядах, і це навмисно:
`DAL/Entities/XEntity` (як у таблиці) → `Domain/Models/X` (як у домені) →
`Services/Dtos/XDto` (як чекає клієнт). Мапери — `Services/Mapping/EntityMapper`
і `DtoMapper`; формати (дати `dd.MM.yyyy`, статуси `in_work`, телефон у 10 цифр)
віддає `ContractFormat`, не контролер. Додаючи поле, пройди всі чотири файли
плюс конфігурацію EF.

## Домени

| Домен | Про що | Залежить від |
|---|---|---|
| **ClientVehicles** | авто клієнта як довготривала картка: номер, власник, телефон, вид, пробіг, статус, борг | — (ядро) |
| **Orders** | візит: скарга, роботи, деталі, фото, оплата рядків | ClientVehicles |
| **Finance** | агрегат за період + боржники | ClientVehicles, Orders |
| **Personal garage** | своя техніка + журнал | — (ізольований) |

`MyVehicle` не має `clientVehicleId` і з картотекою СТО не перетинається: інший
режим, інший власник даних. **Дошка робіт — не домен**, а read-model, який
`src/queries/use-work-board.ts` збирає з `GET /client-vehicles` + `GET /orders`;
серверного ендпойнта для неї немає свідомо.

Межа домену на сервері — трійка «сервіс + репозиторій + контролер» з однаковою
назвою, а не папка.

## Дані

Сутності: `ClientVehicle`, `Order`, `OrderWork`, `OrderPart`, `OrderPhoto`,
`MyVehicle`, `LogEntry`, `Client`, `User`, `Subscription`, `LoginCode` —
11 таблиць, 12 міграцій. `id` — ціле число, не GUID.

Перелічення: `ClientVehicleStatus` (`in_work` / `waiting_part` / `ready` /
`has_debt`), `MileageUnit` (`km` / `hours`), `PaymentStatus` (`unpaid` / `paid`),
`FinancePeriod` (`week` / `month` / `year`), `PhotoSize` (`full` / `thumb`),
`LogEntryKind` (`oil` / `brakes` / `tires` / `filter` / `other`). По дроту йде
код, людині показується український підпис — `STATUS_META` у
`src/theme/status.ts`, `mileageUnitLabel()` у `src/lib/format.ts`. Українського
тексту в базі немає.

**Чого в базі немає навмисно** — усе це похідне:

| Поле | Звідки береться |
|---|---|
| `ClientVehicle.debt` | сума неоплачених рядків нарядів ([ADR-0011](atlas/adr/0011-debt-derived-from-orders.md), [ADR-0016](atlas/adr/0016-order-line-payment.md)) |
| `Order.date`, `Order.daysWaiting` | `CreatedAt` ([ADR-0017](atlas/adr/0017-order-without-own-status-and-date.md)) |
| `LogEntry.date` | `CreatedAt` ([ADR-0013](atlas/adr/0013-log-entry-date-is-created-at.md)) |
| статус наряду | його немає: статус має лише авто ([ADR-0017](atlas/adr/0017-order-without-own-status-and-date.md)) |
| `orderPaid`, `orderEarnings` | рахує `src/lib/order.ts` з рядків |
| `sameOwnerCount` | скільки **інших** авто на тому ж телефоні |
| `FinanceStats.earned/works/parts` | лише рядки зі `paid`; `visits` — наряди за період, незалежно від оплати |

Read-моделі, які сервер мусить склеювати сам: `ClientVehicleDetail`
(`vehicle` + `orders` + `sameOwnerCount`), `OrderDetail` (`order` + `vehicle`),
`FinanceOverview` (`stats` + `debtors` + `totalDebt`).

У рядка деталі **немає кількості**: `sell` і є підсумком рядка. Оплата живе на
рядку, не на наряді. Кожен рядок має свій `id` і свій шлях
([ADR-0024](atlas/adr/0024-order-lines-get-identity.md)).

## API

40 ендпойнтів: 35 контракту + 5 входу. Конвенції:

- множина в шляху, kebab-case, **без** `/api` і `/v1`;
- вкладена колекція — сегментом із назвою поля: `/my-vehicles/{id}/log`,
  `/orders/{id}/works`, `/orders/{id}/parts`;
- одне поле, що міняється саме по собі, — під-ресурс:
  `PUT /client-vehicles/{id}/status`;
- фільтр — query-параметром (`?period=week`);
- вкладене — на запит: `?includeLog=`, `?includeLines=`, і прапорець входить у
  ключ кешу ([ADR-0018](atlas/adr/0018-include-flags-for-nested-collections.md));
  без прапорця завжди з рядками приходять `GET /orders/{id}` і наряди в
  `GET /client-vehicles/{id}`;
- `PUT`, не `PATCH`: тіло несе весь ресурс;
- помилки — **текстом українською**, бо показуються користувачеві як є.

Групи шляхів: `/client-vehicles*` (8), `/orders*` (14), `/finance`,
`/my-vehicles*` (11), `/auth/*` (5). Повна таблиця з кодами — у
[04-api-surface.md](atlas/04-api-surface.md).

**Доступ.** `[Authorize]` стоїть на всіх контролерах контракту. Три сервісні
(`ClientVehicles`, `Orders`, `Finance`) — під
`[Authorize(AuthPolicies.Master)]`: claim `master=true` дістається лише акаунту
з `Telegram:OwnerId`. `MyVehicles` — під звичайним `[Authorize]`, власник із
claim `sub`, тож той самий `GET /my-vehicles` із різними токенами віддає різні
списки. `401` — токена немає або протермінований; `403` — токен дійсний, але
акаунт не майстер. `Telegram:OwnerId = 0` означає, що майстром не стає ніхто й
сервіс мовчить `403`.

**Адреса сервера** не зашита: `EXPO_PUBLIC_API_URL`, якщо задана, інакше хост з
адреси Metro (`Constants.expoConfig.hostUri`) + порт `5101`
([ADR-0008](atlas/adr/0008-mobile-http-transport.md)).

**Ключі кешу** — `src/queries/keys.ts`. Оплата й створення авто рухають авто,
наряди й гроші водночас, тож скидаються разом одним хелпером
`invalidateOrderWorld`.

## Вхід

Вхід за номером, код приходить пушем у чат бота Telegram
([ADR-0007](atlas/adr/0007-telegram-sign-in.md)). Разово — `t.me/<bot>`,
`request_contact`, засвідчений номер. Щоразу — номер у застосунку →
`POST /auth/request-code` → код у чаті → `POST /auth/verify` → пара токенів.
Нік бота віддає `GET /auth/bot`, щоб клієнт не тримав власної копії
([ADR-0009](atlas/adr/0009-bot-username-from-server.md)).

Сесія живе **14 годин від входу й не продовжується**; access-JWT — 15 хвилин,
клієнт на `401` мовчки оновлює пару раз і повторює запит
([ADR-0028](atlas/adr/0028-session-lasts-a-working-day.md)). Refresh — у
`expo-secure-store`, access — у пам'яті. Хеш refresh — одне поле в `users`, тож
вхід на другому пристрої вимикає перший.

Три перевірки, без яких вхід зламаний: `contact.user_id == message.from.id`;
код витрачається **одним** `UPDATE ... WHERE consumed_at IS NULL`; номер
нормалізується однаково на обох шляхах (`ContractFormat.Phone`, 10 цифр).
Введений номер — **ключ пошуку, не заява про особу**.

## Фото

Файл на диску, у базі лише `photo_id uuid`
([ADR-0026](atlas/adr/0026-vehicle-photo-storage.md)). Так для `client_vehicles`,
`my_vehicles` і `order_photos` (окрема таблиця, бо фото наряду багато —
[ADR-0027](atlas/adr/0027-order-photos.md)). Два розміри: `full` до 1024 px,
`thumb` до 320 px. Роздає окремий ендпойнт під токеном.

Порядок запису завжди такий: **файл → рядок → видалення старого файла**. Заміна
не перезаписує файл: новий id, новий URL, інакше закешована копія на телефоні
лишиться старою. Теку складає `FileSystemPhotoStorage` з `PhotoOwner` і `int` —
шлях ніхто не пише рядком. Корінь — `Storage:PhotosRoot`, і він **ніколи** не в
`wwwroot` чи теці публікації. Фото — єдині дані системи, яких немає в дампі
Postgres.

## Інваріанти, які легко зламати

1. **Нормалізація при створенні**: `plate` — `trim().toUpperCase()`; `phone` —
   лише цифри, останні 10; `make`, `model`, `owner` — `trim()`.
2. **Дефолти**: порожня скарга → `'Без опису'`; `mileageUnit` → `km`. `year` і
   `mileage` не підставляються — не передали, значить невідомо
   ([ADR-0012](atlas/adr/0012-optional-fields-and-single-log-note.md)).
3. **Статус при створенні**: `createOrder: true` → `in_work` і наряд зі скаргою
   з `complaint`; інакше `ready`.
4. **Наряд не існує без авто**: `GET /orders/{id}` дає `404` і тоді, коли наряд
   є, а його авто немає.
5. **Дані з запиту не мутуються на місці** — нова версія через мутацію й
   інвалідацію ключа.
6. **Поля аудиту не чіпати руками** — їх проставляє `GarageDbContext`.
7. **Репозиторії не зберігають**: тільки `Add`, а `SaveChangesAsync` кличе
   сервіс через `IUnitOfWork`, щоб операція лягла однією транзакцією.
8. **`required` на скалярах, `= null!` лише на навігаційних** властивостях.
9. **Вкладена колекція може приїхати порожньою навмисно**: `log: []` означає або
   «записів немає», або «не просили».
10. **p95 < 300 ms на читання** — екрани спроєктовані під відгук 180–520 ms.

## Інтерфейс

Тема **темна, одна на весь застосунок**; світлої в макеті немає. Палітра й
відступи — `src/theme/tokens.ts` (`ink #1A1714`, `orange #C97B22`,
`cream #EDE8DF`, `facade #D4C9B8`, `brown #6B4F2A`), нові кольори беруться
звідти, а не з макета напряму. Шрифт — Spline Sans, моноширинний Spline Sans
Mono. Кожен екран із запитом зобов'язаний обробити `pending` / `error` /
`retry` через `src/components/ui/query-state.tsx`.

Два файли Figma, і напрямок у них різний: [макет
Make](https://www.figma.com/make/p9esCh4FHoqYW3fd6NsrGV/Garage) був первинним —
з нього виріс код; [«Екрани
застосунку»](https://www.figma.com/design/Sv2lOuZq5mY7apA41kafIT) зібраний **з
коду**, тож там правиться він, а не код. Макет — джерело форми, не істини про
дані: розійшлося з `domain.ts` — помиляється Figma.

**Змінив екран, спільний компонент або токени — перенеси в «Екрани
застосунку» в тій самій роботі** (правило 8 в [AGENTS.md](../AGENTS.md); що
саме й чим — у `GarageOSMobile/AGENTS.md`). Логіка, запити й рефакторинг
макета не зачіпають.

## Робочий цикл

Metro з Fast Refresh сам доставляє кожне збереження — **перезапускати бандлер
після правки не треба й шкідливо**. Коли перезапуск усе ж стався, телефон
лишається на старому бандлі: `npm run dev` (замість `npm start`)
перезавантажить застосунок, щойно той під'єднається; для вже запущеного Metro
те саме робить `npm run reload`.

Коли стек усе ж треба підняти — скіл `/up`
(`.claude/skills/up/SKILL.md`): Docker → контейнер `garageos-db` → міграції →
`GarageOS.Api` (бот живе в цьому ж процесі, окремо не запускається) → Metro.
Порядок і перевірки готовності там же.

Перевірка без запуску: `npm run lint` і `npx tsc --noEmit` у `GarageOSMobile/`,
`dotnet build` у `GarageOSWeb/`. Міграція:
`dotnet ef migrations add Name --project GarageOS.DAL --startup-project GarageOS.Api`,
і міграції комітяться.

Секрети сервера — в user secrets, три ключі: рядок підключення, `Jwt:Key`,
`Telegram:BotToken`. Читаються **лише в `Development`**; бракує будь-якого —
застосунок падає на старті з підказкою, і це навмисно. Деталі запуску — в
[README](../README.md).

Expo змінився: перед написанням коду клієнта читай версійні доки
https://docs.expo.dev/versions/v58.0.0/.

## Чого ще немає

- **тестів** — ні на клієнті, ні на сервері; найцінніший був би контрактний:
  що відповіді сервера збігаються за формою з `domain.ts`;
- **валідації вхідних даних** на сервері: рік 1066, від'ємна ціна й порожній
  масив рядків проходять; межі тримає лише форма на клієнті;
- **у контракті**: редагування та видалення авто клієнта, часткова оплата, вибір одиниці пробігу у формі «нове авто»;
- **структурованого логування** й кореляційного `X-Request-Id`;
- **таблиці сесій** — поки один хеш refresh у `users`, тобто одна сесія на
  людину.

## Definition of Done

Зміна не закінчена, поки в тому ж коміті не оновлено те, що вона зачіпає:

| Зачепив | Оновлюєш |
|---|---|
| домен, сутність, поле, ендпойнт, проєкт, доступ, конфіг | сторінку [атласу](atlas/README.md#правила-підтримки-атласу) — маршрут там же |
| рішення, що зачіпає межі, контракт, модель чи вибір технології | новий [ADR](atlas/adr/README.md) |
| новий доменний термін | [07-glossary.md](atlas/07-glossary.md) **перед** кодом |
| екран, спільний компонент або токени мобілки | файл Figma «Екрани застосунку» |
| щось із написаного в цьому файлі | цей файл |

Повні формулювання — правила 2, 3, 5 і 8 в [AGENTS.md](../AGENTS.md).

## Про цей файл

Він **похідний**: усе, що тут є, є в атласі, коді або `AGENTS.md`. Тому
розбіжність цього файла з ними — дефект цього файла.

Подробиць сюди не додавати: рівень цього файла — те, що потрібно майже завжди.
Усе інше живе на своїй сторінці атласу й доступне за посиланням.
