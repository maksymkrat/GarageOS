# GarageOSWeb

ASP.NET Core 10, чотири проєкти. Розкладку й причини див.
[ADR-0006](../docs/atlas/adr/0006-backend-layering.md).

```
GarageOS.Domain/    Models/ Enums/                     нуль залежностей
GarageOS.DAL/       Entities/ Context/ Configurations/ Repositories/ Migrations/
GarageOS.Services/  Dtos/ Mapping/ Abstractions/ Exceptions/
GarageOS.Api/       Controllers/ Infrastructure/
```

Залежності: `DAL → Domain`, `Services → DAL + Domain`, `Api → усі три`.
Посилання в інший бік не додавати.

## Три форми даних

Одна сутність живе в трьох виглядах, і це навмисно:

| Де | Що | Для чого |
|----|----|----------|
| `DAL/Entities` | `CarEntity` | як лежить у таблиці |
| `Domain/Models` | `Car` | як влаштовано в домені |
| `Services/Dtos` | `CarDto` | як чекає клієнт |

Мапінги — `Services/Mapping/EntityMapper` і `DtoMapper`. Додаючи поле, пройди
всі чотири файли плюс конфігурацію.

## Правила

1. **DTO міняються лише разом із контрактом клієнта.** Форми в `Services/Dtos`
   дослівно повторюють `GarageOSMobile/src/types/domain.ts` і `src/api/*.ts`.
   Першим змінюється клієнт ([ADR-0002](../docs/atlas/adr/0002-client-contract-source-of-truth.md)),
   і це один коміт на обидві сторони.
2. **Формат віддає `ContractFormat`, не контролер.** Дати `dd.MM.yyyy`, статуси
   `in_work`, телефон у десять цифр. Нове перетворення — туди ж.
3. **Репозиторії не зберігають.** Вони тільки `Add`; `SaveChangesAsync` кличе
   сервіс через `IUnitOfWork`, щоб операція лягла однією транзакцією.
4. **Поля аудиту не чіпати руками** — їх проставляє `GarageDbContext`.
5. **Міграції комітяться.** Генерувати:
   `dotnet ef migrations add Name --project GarageOS.DAL --startup-project GarageOS.Api`
6. **`NotFoundException` з українським текстом** — він іде користувачу на екран
   як є. Обробляє `NotFoundExceptionHandler`, віддаючи `ProblemDetails`.

## Чого тут ще немає

Авторизації. Усі дев'ять ендпойнтів відкриті, `MyVehicleService` віддає техніку
всіх користувачів. Рішення зафіксоване в
[ADR-0005](../docs/atlas/adr/0005-authentication.md), коду немає. Не писати
так, ніби вона вже є.
