# GarageOSWeb

ASP.NET Core 10, п'ять проєктів. Розкладку й причини див.
[ADR-0006](../docs/atlas/adr/0006-backend-layering.md).

```
GarageOS.Domain/        Models/ Enums/                     нуль залежностей
GarageOS.DAL/           Entities/ Context/ Configurations/ Repositories/ Migrations/
GarageOS.Services/      Dtos/ Mapping/ Abstractions/ Exceptions/ Security/ Photos/
GarageOS.Telegram.Bot/  транспорт Telegram і більше нічого
GarageOS.Api/           Controllers/ Infrastructure/
```

Залежності: `DAL → Domain`, `Services → DAL + Domain`,
`Telegram.Bot → Services`, `Api → усі`. Посилання в інший бік не додавати.

**У `GarageOS.Telegram.Bot` немає рішень.** Він розбирає апдейти, тримає
тексти чату й надсилає повідомлення; що робити з `/start` і контактом,
вирішує `ITelegramSignInService`, а коди видає й перевіряє `AuthService` —
обидва в `Services`. Інтерфейс `ITelegramNotifier` оголошений у `Services`
саме тому: інакше шар сервісів залежав би від транспорту й не запускався б
без бота.

## Три форми даних

Одна сутність живе в трьох виглядах, і це навмисно:

| Де | Що | Для чого |
|----|----|----------|
| `DAL/Entities` | `ClientVehicleEntity` | як лежить у таблиці |
| `Domain/Models` | `ClientVehicle` | як влаштовано в домені |
| `Services/Dtos` | `ClientVehicleDto` | як чекає клієнт |

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
5. **`required` на скалярах, `= null!` лише на навігаційних.** Колонка
   `NOT NULL` оголошується як `public required string Name { get; set; }` —
   тоді сутність не створити, забувши поле. `= null!` лишається там, де
   значення підставляє EF при `Include`:

   ```csharp
   public required string Plate { get; set; }        // колонка
   public ClientEntity Client { get; set; } = null!; // навігаційна
   ```

   Навігаційні не роблять `required`: інакше `new CarEntity` вимагав би цілий
   об'єкт клієнта там, де на руках лише `ClientId`.
6. **Міграції комітяться.** Генерувати:
   `dotnet ef migrations add Name --project GarageOS.DAL --startup-project GarageOS.Api`
7. **Секрети — в user secrets, не в `appsettings`.** Три ключі: рядок
   підключення, `Jwt:Key` і `Telegram:BotToken`. Усі живуть у сховищі
   користувача (`UserSecretsId` у csproj), бо `appsettings.Development.json`
   комітиться. Якщо бракує будь-якого, застосунок падає на старті з
   підказкою — це навмисно: краще не піднятися, ніж піднятися й не вміти
   впускати людей. Решта конфігу входу — `Jwt:Issuer`, `Telegram:OwnerId`,
   `LoginCode:*` — не секрети й лежать в `appsettings.json`.

   **User secrets читаються лише в `Development`.** Запуск без профілю
   (`--no-launch-profile`) лишає середовище `Production`, сховище не
   підхоплюється, і застосунок падає на тій самій підказці. Або профіль із
   `launchSettings.json`, або явно:

   ```bash
   ASPNETCORE_ENVIRONMENT=Development dotnet run --project GarageOS.Api
   ```

   На проді рядок підключення приходить змінною оточення
   `ConnectionStrings__Garage`, а не зі сховища.
8. **Фото — файл на диску, у базі лише `photo_id`.** Так для **обох**
   ярусів: `client_vehicles` під політикою `Master`, `my_vehicles` під
   звичайним `[Authorize]` з власником із claim `sub`. Писати завжди в такому
   порядку: файл, потім рядок, потім видалення старого файла. Файл, на який
   ніхто не вказує, можна підмести; рядок, що вказує в нікуди, — зламана
   картинка на екрані. Заміна фото **не перезаписує** файл: новий id, новий
   URL, інакше закешована копія на телефоні лишиться старою. Теку складає
   `FileSystemPhotoStorage` з `PhotoOwner` і `int` — ім'я теки ніхто не пише
   рядком. Корінь — `Storage:PhotosRoot`, і він **ніколи** не всередині
   `wwwroot` чи теки публікації ([ADR-0026](../docs/atlas/adr/0026-vehicle-photo-storage.md)).

9. **`NotFoundException` з українським текстом** — він іде користувачу на екран
   як є. Обробляє `NotFoundExceptionHandler`, віддаючи `ProblemDetails`.

## Автентифікація

Вхід за номером і кодом у чаті бота ([ADR-0007](../docs/atlas/adr/0007-telegram-sign-in.md)).
Є: п'ять ендпойнтів `/auth/*` — чотири за ADR-0007 і `GET /auth/bot` за
[ADR-0009](../docs/atlas/adr/0009-bot-username-from-server.md), — видача
access-JWT і непрозорого refresh, `login_codes`, бот на long polling. Три
правила, які легко зламати:

- **Введений номер — ключ пошуку, не заява про особу.** Він знаходить рядок у
  `users` і більше нічого: засвідчив номер `request_contact` у боті. Якщо
  введений номер колись почне щось записувати або зв'язувати `Client`,
  вертається дірка з чужою карткою клієнта.
- **Номер нормалізується `ContractFormat.Phone`** — десять цифр, як усі
  номери в контракті. Telegram віддає `phone_number` без `+` і в довільному
  вигляді, тож без нормалізації збігу не буде, і людина побачить «бот не
  активований» при активованому боті.
- **Код витрачається одним стейтментом.** `ILoginCodeRepository.TryConsumeAsync`
  робить `UPDATE ... WHERE consumed_at IS NULL` і дивиться на кількість
  рядків. Читання плюс запис дали б гонку, у якій два запити отримали б одну
  сесію.

## Доступ розмежований — не зніми його випадково

`[Authorize]` стоїть на **всіх** контролерах контракту. Сервісні три —
`ClientVehicles`, `Orders`, `Finance` — під
`[Authorize(AuthPolicies.Master)]`, тобто вимагають claim `master=true`, який
видається лише акаунту з `Telegram:OwnerId`. `MyVehicles` — під звичайним
`[Authorize]`, бо техніка там своя в кожного, і власник береться з claim `sub`
([ADR-0019](../docs/atlas/adr/0019-create-my-vehicle.md),
[ADR-0022](../docs/atlas/adr/0022-order-crud-and-service-authorization.md)).

`Telegram:OwnerId` у `appsettings.json` — **не секрет, але вимикач**: нуль
означає, що майстром не стане ніхто й увесь сервіс почне віддавати `403`.

## Чого тут ще немає

**Валідації вхідних даних.** Жоден `POST`/`PUT` не перевіряє меж: рік 1066,
від'ємна ціна й порожній масив рядків проходять. Межі тримає лише форма на
клієнті, тож для іншого клієнта їх немає.

**Таблиці сесій.** Хеш refresh лежить одним полем у `users`, тож вхід на
другому пристрої вимикає перший. Для одного майстра це не проблема; з'являться
механіки — знадобиться таблиця сесій
([ADR-0028](../docs/atlas/adr/0028-session-lasts-a-working-day.md)).
