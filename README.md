# GarageOS

Монорепозиторій GarageOS: мобільний застосунок і бекенд-API в одному дереві.

## Структура

| Шлях | Що це | Стек |
| --- | --- | --- |
| `GarageOSMobile/` | Мобільний застосунок (клієнт + режим сервісу) | Expo, React Native, TypeScript, expo-router |
| `GarageOSWeb/` | Backend API: `Domain`, `DAL`, `Services`, `Api` | .NET 10, ASP.NET Core, EF Core 10, PostgreSQL |
| `docs/atlas/` | Атлас архітектури: межі, домени, модель даних, API, ADR | Markdown + Mermaid |
| `garage-erd.drawio` | Рукописна ER-схема домену, спільна для обох частин | draw.io |
| `AGENTS.md` | Спільні правила для агентів (`CLAUDE.md` -> `@AGENTS.md`) | — |
| `.mcp.json` | MCP-сервери проєкту (drawio, figma) — діють на весь монорепо | — |

## Запуск

### Мобільний застосунок

```bash
cd GarageOSMobile
npm install
npx expo start
```

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

## Конвенції

- Один git-репозиторій на весь проєкт; кожна частина живе у своїй теці та має власні залежності.
- Коміти бажано префіксувати частиною, якої вони стосуються: `mobile:`, `api:`, `repo:`.
