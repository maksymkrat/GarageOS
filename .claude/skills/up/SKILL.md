---
name: up
description: Підняти локальний стек GarageOS у правильному порядку — Docker, Postgres, міграції, API з ботом, Metro. Бери, коли просять запустити/підняти проєкт, застосунок, API, базу чи бота, перевірити зміну наживо, run the app, start the stack.
---

# Запуск стека GarageOS

Порядок жорсткий, бо кожен крок залежить від попереднього:

```
Docker Desktop → контейнер garageos-db → міграції → GarageOS.Api (разом із ботом) → Metro
```

**Бот окремо не запускається.** `GarageOS.Telegram.Bot` живе всередині процесу
API як hosted service на long polling: піднявся API — піднявся бот.

Запускай **лише на прямий запит**. Після звичайної правки коду нічого
перезапускати не треба: Metro сам доставляє збереження, а API перевіряється
`dotnet build`.

## Аргументи

Без аргументів — повний стек. Інакше підіймай лише назване, але з усіма його
залежностями: `db` (Docker + контейнер + міграції), `api` (db + API),
`mobile` (тільки Metro).

## 0. Логи

Кожен фоновий процес пиши у файл у теці scratchpad цієї сесії
(`api.log`, `metro.log`). Коли щось не підніметься, діагноз буде там, а не в
здогадах.

## 1. Docker

```bash
docker version --format '{{.Server.Version}}'
```

Відповів версією — демон працює, крок пропущено. Помилка (`cannot connect to
the Docker daemon` / `error during connect`) — Docker Desktop не запущений:

```powershell
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

Далі чекай готовності **фоновою командою з `until`**, а не `sleep` у
foreground:

```bash
until docker version --format '{{.Server.Version}}' >/dev/null 2>&1; do sleep 2; done
```

Запускай її через Bash із `run_in_background: true` — прийде одне
повідомлення, коли демон відповість. Перший старт Docker Desktop — хвилина й
більше; якщо за 3 хвилини не піднявся, скажи користувачеві й спинись, не
пробуй вдруге.

## 2. Postgres

**Спершу подивись, що на машині вже є** — контейнер із даними може бути
зупинений, і тоді його треба просто запустити, а не створювати другий:

```bash
docker ps -a --format '{{.Names}}\t{{.Image}}\t{{.Status}}'
```

На машині розробника їх **два**, і обидва тримають 5432:

| Контейнер | Том | Що в ньому |
|---|---|---|
| `postgresql` | `pgdata` | **робоча база з даними** — акаунт, клієнти, авто, наряди, журнали |
| `garageos-db` | `garageosweb_garageos-pgdata` | компоузний; схема повна, але **порожня** |

Отже типовий випадок — запустити наявний:

```bash
docker start postgresql
until docker exec postgresql pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
```

Створювати компоузний контейнер (`cd GarageOSWeb && docker compose up -d --wait`,
`--wait` чекає `healthy` сам) має сенс лише тоді, коли потрібен чистий гараж
або `postgresql` зник. **Обидва одночасно не піднімуться** — порт один; перед
запуском другого спини перший.

Перш ніж оголосити базу готовою, глянь, що в ній справді є:

```bash
docker exec <контейнер> psql -U postgres -d garageos -c "select (select count(*) from client_vehicles) vehicles, (select count(*) from orders) orders;"
```

Нуль рядків там, де користувач чекав свої дані, означає, що піднятий не той
контейнер. Зайнятий порт 5432 чимось чужим — не вбивай: скажи користувачеві,
бо рядок підключення в user secrets указує саме на `5432`.

## 3. Міграції

```bash
cd GarageOSWeb && dotnet ef database update --project GarageOS.DAL --startup-project GarageOS.Api
```

Ідемпотентно: немає чого застосовувати — вийде за секунди. Базу `garageos`
створює сама EF, у контейнері її немає. **`migrations add` тут не роби
ніколи** — нова міграція це окрема, свідома робота.

**На базі з даними спершу спитай.** Порожню компоузну базу оновлюй без
церемоній, а запис у робочу — рішення користувача: покажи, чого бракує
(`select migration_id from "__EFMigrationsHistory"` проти файлів у
`GarageOS.DAL/Migrations/`), і скажи, що саме зробить міграція. Додавання
колонки з дефолтом безпечне, але `Drop*` у назві означає втрату даних.

## 4. API з ботом

Спершу перевір, чи він уже працює:

```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:5101/auth/bot
```

`200` — API вже піднятий, другий не запускай (див. «Один API», нижче).
`000` — вільно, запускай у фоні:

```bash
cd GarageOSWeb && dotnet run --project GarageOS.Api
```

Профіль за замовчуванням (`http`) дає `http://localhost:5101` і
`ASPNETCORE_ENVIRONMENT=Development` — обов'язково, бо user secrets читаються
лише в Development.

Готовність — тим самим `/auth/bot`: він неавтентифікований, нічого не змінює й
нічого не надсилає в Telegram, тож це найдешевший чесний пінг. Решта
контракту під токеном і на пінг не годиться.

```bash
until [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:5101/auth/bot)" = "200" ]; do sleep 1; done
```

Теж фоновою командою. Якщо процес помер замість того, щоб відповісти —
читай `api.log`, там буде рівно одна з причин із таблиці нижче.

## 5. Metro

```bash
curl -s http://localhost:8081/status
```

`packager-status:running` — Metro уже працює, нового не підіймай: онови
телефон `npm run reload` (або `npm run reload -- --wait 60`, щоб дочекатися
застосунку).

Інакше — у фоні:

```bash
cd GarageOSMobile && npm run dev
```

Саме `npm run dev`, а не `npm start`: він ще й перезавантажить застосунок,
щойно той під'єднається до свіжого бандлера.

Адресу API телефон визначає сам — хост Metro плюс порт `5101`, тож у тій самій
Wi-Fi нічого задавати не треба. Емулятор чи інша мережа — тоді
`EXPO_PUBLIC_API_URL`.

## Що сказати в кінці

Коротко й з адресами: API `http://localhost:5101`, OpenAPI
`http://localhost:5101/openapi/v1.json` (лише в Development), Metro
`http://localhost:8081` — QR для телефона в `metro.log`. Плюс одним рядком, що
бот працює в процесі API.

## Часті збої

| Симптом | Що це | Що робити |
|---|---|---|
| `Не задано ConnectionStrings:Garage` / `Jwt:Key` / `Telegram:BotToken` і процес упав | бракує user secret; падіння на старті тут навмисне | дай команду `dotnet user-secrets set "<ключ>" "<значення>" --project GarageOS.Api` і не вгадуй значень — рядок підключення є в [README](../../../README.md), токен бота знає лише користувач |
| процес піднявся, але все віддає `403` | `Telegram:OwnerId` нульовий або чужий — майстром не стає ніхто | скажи користувачеві; це вимикач, не секрет |
| `409 Conflict: terminated by other getUpdates request` у `api.log` | працюють **два** процеси API, і обидва тягнуть апдейти бота | лиши один |
| `Npgsql.NpgsqlException: Connection refused` | контейнер ще не `healthy` або не піднятий | повернись на крок 2 |
| `42703: column "..." does not exist` на запиті | база відстає від коду на міграцію | крок 3, але спершу спитай, якщо база з даними |
| екрани показують порожній гараж, хоча дані були | піднятий компоузний контейнер замість `postgresql` | спини його й запусти той, що з томом `pgdata` |
| `address already in use` на 5101 | висить попередній `dotnet run` | знайди й спини його, не запускай другий |
| телефон на старому бандлі | бандлер перезапускався | `npm run reload` |

## Один API

Лише один процес API на машину. Telegram віддає апдейти **одному**
getUpdates: другий процес відбирає їх у першого, і бот починає губити
повідомлення — у логах це `409 Conflict`. Тому крок 4 починається з перевірки,
а не з запуску.

## Зупинка

`dotnet run` і `npm run dev` спиняються зупинкою своїх фонових процесів.
Контейнер лишається працювати — це нормально й дешево; явно треба спинити:

```bash
cd GarageOSWeb && docker compose stop
```

`docker compose down -v` **не** пропонуй без прямого запиту: `-v` зносить том
із базою.
