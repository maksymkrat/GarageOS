# GarageOS

Монорепозиторій GarageOS: мобільний застосунок і бекенд-API в одному дереві.

## Структура

| Шлях | Що це | Стек |
| --- | --- | --- |
| `GarageOSMobile/` | Мобільний застосунок (клієнт + режим сервісу) | Expo, React Native, TypeScript, expo-router |
| `GarageOSWeb/` | Backend API: `Domain`, `DAL`, `Services`, `Api` | .NET 10, ASP.NET Core, EF Core 10, PostgreSQL |
| `docs/CONTEXT.md` | Стислий контекст проєкту: один вхід перед роботою | Markdown |
| `docs/atlas/` | Атлас архітектури: межі, домени, модель даних, API, ADR | Markdown + Mermaid |
| `garage-erd.drawio` | Рукописна ER-схема домену, спільна для обох частин | draw.io |
| `AGENTS.md` | Спільні правила для агентів (`CLAUDE.md` -> `@AGENTS.md`) | — |
| `.claude/skills/up/` | Скіл запуску стека: Docker -> БД -> міграції -> API з ботом -> Metro | — |
| `.mcp.json` | MCP-сервери проєкту (drawio, figma) — діють на весь монорепо | — |

## Запуск

### Мобільний застосунок

```bash
cd GarageOSMobile
npm install
npm run dev          # = expo start, але ще й перезавантажує телефон, коли той під'єднається
```

Metro з Fast Refresh підхоплює кожне збереження сам. Проблема лише з
**перезапуском** бандлера: телефон лишається на старому бандлі й чекає, доки
його потрясуть. `npm run dev` закриває цю дірку — щойно застосунок
під'єднується до свіжого Metro, йому йде команда перезавантаження.

Якщо Metro вже працює і треба просто оновити телефон:

```bash
npm run reload              # перезавантажити все, що під'єднане зараз
npm run reload -- --wait 60 # зачекати до хвилини, доки застосунок з'явиться
```

Обидва ходять у вебсокет Metro `/message` — той самий канал, яким `expo start`
користується на клавішу `r`. Порт береться з `--port` або `RCT_METRO_PORT`,
типово 8081.

### API

```bash
cd GarageOSWeb
docker compose up -d                      # PostgreSQL 18 на 5432

# Рядок підключення — в user secrets, не в appsettings (один раз на машину):
dotnet user-secrets set "ConnectionStrings:Garage" "Host=localhost;Port=5432;Database=garageos;Username=postgres;Password=pass" --project GarageOS.Api

dotnet ef database update --project GarageOS.DAL --startup-project GarageOS.Api
dotnet run --project GarageOS.Api
```

Потрібен .NET SDK 10 і Docker. Базу `garageos` створює сама EF під час
`database update` — у контейнері її немає. Міграції генеруються без запущеної
БД, застосовуються — лише з нею.

Фото авто лежать **файлами**, не в базі: у розробці це `GarageOSWeb/_data/photos`
(тека створюється сама й закрита `.gitignore`). Налаштовувати нічого не треба;
на проді шлях задається змінною `Storage__PhotosRoot` і мусить вказувати на
змонтований том — інакше застосунок не підніметься
([ADR-0026](docs/atlas/adr/0026-vehicle-photo-storage.md)). Дамп Postgres фото
**не містить** — це окрема річ для бекапу.

User secrets читаються **лише в середовищі Development**. `dotnet run` із
профілем за замовчуванням це забезпечує; якщо запускаєш із
`--no-launch-profile`, задай `ASPNETCORE_ENVIRONMENT=Development` явно.

## Конвенції

- Один git-репозиторій на весь проєкт; кожна частина живе у своїй теці та має власні залежності.
- Коміти бажано префіксувати частиною, якої вони стосуються: `mobile:`, `api:`, `repo:`.
