# GarageOS

Монорепозиторій GarageOS: мобільний застосунок і бекенд-API в одному дереві.

## Структура

| Шлях | Що це | Стек |
| --- | --- | --- |
| `GarageOSMobile/` | Мобільний застосунок (клієнт + режим сервісу) | Expo, React Native, TypeScript, expo-router |
| `GarageOSWeb/` | Backend API для застосунку | .NET, ASP.NET Core (`GarageOS.Api`) |
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
dotnet run --project GarageOS.Api
```

## Конвенції

- Один git-репозиторій на весь проєкт; кожна частина живе у своїй теці та має власні залежності.
- Коміти бажано префіксувати частиною, якої вони стосуються: `mobile:`, `api:`, `repo:`.
