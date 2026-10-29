# 04 · Поверхня API

Назви ендпойнтів не вигадані для атласу — вони **дослівно** зашиті в
`GarageOSMobile/src/api/*.ts` першим аргументом `request()`. Це готова
специфікація для `GarageOSWeb`.

Це стосується й чотирьох шляхів входу: вони якийсь час існували лише на
сервері, але тепер оголошені і в `src/api/auth.ts`. Подробиці — в розділі
«Вхід».

## Контракт

| Метод і шлях | Вхід | Відповідь | Помилки | Джерело |
|--------------|------|-----------|---------|---------|
| `GET /client-vehicles` | — | `ClientVehicle[]` | — | `client-vehicles.ts` |
| `GET /client-vehicles/{id}` | `id` у шляху | `ClientVehicleDetail` | `404` «Авто не знайдено» | `client-vehicles.ts` |
| `POST /client-vehicles` | `CreateClientVehicleInput` | `ClientVehicle` | — (валідація TO-BE) | `client-vehicles.ts` |
| `PUT /client-vehicles/{id}/status` | `id` у шляху, `UpdateClientVehicleStatusInput` | `ClientVehicle` | `404` «Авто не знайдено», `403` не майстер | `client-vehicles.ts` |
| `POST /client-vehicles/{id}/pay` | `id` у шляху, тіла немає | `ClientVehicleDetail` | `404` «Авто не знайдено», `403` не майстер | `client-vehicles.ts` |
| `POST /client-vehicles/{id}/photo` | `id` у шляху, `multipart/form-data`, поле `file` | `ClientVehicle` | `400` «Не вдалося прочитати зображення», `404` «Авто не знайдено», `403` не майстер | `client-vehicles.ts` |
| `DELETE /client-vehicles/{id}/photo` | `id` у шляху | `ClientVehicle` | `404` «Авто не знайдено», `403` не майстер | `client-vehicles.ts` |
| `GET /client-vehicles/{id}/photo/{photoId}` | два id у шляху, `size` = `full` \| `thumb` | `image/webp` | `404` «Фото не знайдено», `403` не майстер | `client-vehicles.ts` |
| `GET /orders` | `includeLines` (bool, типово `false`) | `Order[]` | — | `orders.ts` |
| `GET /orders/{id}` | `id` у шляху | `OrderDetail` | `404` «Наряд не знайдено», `404` «Авто наряду не знайдено» | `orders.ts` |
| `POST /orders` | `CreateOrderInput` | `Order` | `404` «Авто не знайдено», `403` не майстер | `orders.ts` |
| `PUT /orders/{id}` | `id` у шляху, `UpdateOrderInput` — лише скарга | `Order` | `404` «Наряд не знайдено», `403` не майстер | `orders.ts` |
| `DELETE /orders/{id}` | `id` у шляху | `204`, тіла немає | `404` «Наряд не знайдено», `403` не майстер | `orders.ts` |
| `POST /orders/{id}/pay` | `id` у шляху, тіла немає | `OrderDetail` | `404` «Наряд не знайдено», `404` «Авто наряду не знайдено», `403` не майстер | `orders.ts` |
| `POST /orders/{id}/photos` | `id` у шляху, `multipart/form-data`, поле `file` | `OrderPhoto` | `400` «Не вдалося прочитати зображення», `404` «Наряд не знайдено», `403` не майстер | `orders.ts` |
| `DELETE /orders/{id}/photos/{photoId}` | два `id` у шляху | `204`, тіла немає | `404` «Фото не знайдено», `403` не майстер | `orders.ts` |
| `GET /orders/{id}/photos/{photoId}` | два `id` у шляху, `size` = `full` \| `thumb` | `image/webp` | `404` «Фото не знайдено», `403` не майстер | `orders.ts` |
| `POST /orders/{id}/works` | `id` у шляху, `OrderWorkInput` | `OrderWork` | `404` «Наряд не знайдено», `403` не майстер | `orders.ts` |
| `PUT /orders/{id}/works/{workId}` | два `id` у шляху, `OrderWorkInput` | `OrderWork` | `404` «Роботу не знайдено», `403` не майстер | `orders.ts` |
| `DELETE /orders/{id}/works/{workId}` | два `id` у шляху | `204`, тіла немає | `404` «Роботу не знайдено», `403` не майстер | `orders.ts` |
| `POST /orders/{id}/parts` | `id` у шляху, `OrderPartInput` | `OrderPart` | `404` «Наряд не знайдено», `403` не майстер | `orders.ts` |
| `PUT /orders/{id}/parts/{partId}` | два `id` у шляху, `OrderPartInput` | `OrderPart` | `404` «Деталь не знайдено», `403` не майстер | `orders.ts` |
| `DELETE /orders/{id}/parts/{partId}` | два `id` у шляху | `204`, тіла немає | `404` «Деталь не знайдено», `403` не майстер | `orders.ts` |
| `GET /finance?period=` | `week` \| `month` \| `year` | `FinanceOverview` | — | `finance.ts` |
| `GET /my-vehicles` | `includeLog` (bool, типово `false`) | `MyVehicle[]` | `401` без токена | `vehicles.ts` |
| `GET /my-vehicles/{id}` | `id` у шляху, `includeLog` (bool, типово `false`) | `MyVehicle` | `404` «Техніку не знайдено», `401` без токена | `vehicles.ts` |
| `POST /my-vehicles` | `CreateMyVehicleInput` | `MyVehicle` | `401` без токена (валідація TO-BE) | `vehicles.ts` |
| `PUT /my-vehicles/{id}` | `id` у шляху, `UpdateMyVehicleInput` | `MyVehicle` | `404` «Техніку не знайдено», `401` без токена | `vehicles.ts` |
| `DELETE /my-vehicles/{id}` | `id` у шляху | `204`, тіла немає | `404` «Техніку не знайдено», `401` без токена | `vehicles.ts` |
| `POST /my-vehicles/{id}/photo` | `id` у шляху, `multipart/form-data`, поле `file` | `MyVehicle` | `400` «Не вдалося прочитати зображення», `404` «Техніку не знайдено», `401` без токена | `vehicles.ts` |
| `DELETE /my-vehicles/{id}/photo` | `id` у шляху | `MyVehicle` | `404` «Техніку не знайдено», `401` без токена | `vehicles.ts` |
| `GET /my-vehicles/{id}/photo/{photoId}` | два id у шляху, `size` = `full` \| `thumb` | `image/webp` | `404` «Фото не знайдено», `401` без токена | `vehicles.ts` |
| `POST /my-vehicles/{id}/log` | `id` у шляху, `CreateLogEntryInput` | `LogEntry` | `404` «Техніку не знайдено», `401` без токена | `vehicles.ts` |
| `PUT /my-vehicles/{id}/log/{entryId}` | два `id` у шляху, `UpdateLogEntryInput` | `LogEntry` | `404` «Запис не знайдено», `401` без токена | `vehicles.ts` |
| `DELETE /my-vehicles/{id}/log/{entryId}` | два `id` у шляху | `204`, тіла немає | `404` «Запис не знайдено», `401` без токена | `vehicles.ts` |

Тридцять п'ять ендпойнтів, з них двадцять п'ять мутуючих. `id` — ціле число, не GUID. Поза цією
таблицею — п'ять ендпойнтів входу, див. «Вхід» нижче.

Побічний ефект, якого не видно в стовпці «Віддає»: `POST /orders` переводить
авто наряду в `in_work` ([ADR-0032](adr/0032-new-order-puts-the-car-in-work.md)),
а `POST /client-vehicles/{id}/pay` і `POST /orders/{id}/pay` — у `ready`
([ADR-0025](adr/0025-settle-order-in-one-action.md)). Обидва кінці візиту
рухають стан самі; у відповіді `POST /orders` авто немає, клієнт перечитує його
з кешу, який і так скидається.

## Доступ

**Увесь контракт під токеном.** Без `Authorization: Bearer` жоден із тридцяти п'яти
ендпойнтів не відповідає — лише `401`. Правила ті, що оголосив
[ADR-0007](adr/0007-telegram-sign-in.md), успадкувавши їх з
[ADR-0005](adr/0005-authentication.md), і тепер вони **діють**, а не плануються:

| Ендпойнти | Кому | Як перевіряється |
|-----------|------|------------------|
| двадцять чотири `/client-vehicles*`, `/orders*`, `/finance` | лише майстер — один акаунт, за `Telegram:OwnerId` | `[Authorize(AuthPolicies.Master)]`, claim `master=true` |
| одинадцять `/my-vehicles*` | лише власник техніки | `[Authorize]`, `userId` з claim `sub` |

`GET /my-vehicles` **залежить від суб'єкта**: той самий запит із двома різними
токенами віддає різні списки.

**Чужому акаунту сервіс віддає `403`, а не `401`.** Токен дійсний, бракує саме
права — і це різні відповіді: `401` означає «увійди», `403` — «увійшов не той».
Майстер один, бо `Telegram:OwnerId` — одне число
([ADR-0022](adr/0022-order-crud-and-service-authorization.md)).

## Вхід

П'ять ендпойнтів: чотири за [ADR-0007](adr/0007-telegram-sign-in.md) і
`GET /auth/bot` за [ADR-0009](adr/0009-bot-username-from-server.md).

| Метод і шлях | Вхід | Відповідь | Помилки | Джерело |
|--------------|------|-----------|---------|---------|
| `POST /auth/request-code` | `{ phone }` | `202`, тіла немає | `404` «Код не прийде на цей номер…», `429` «Новий код можна запросити через N с.» | `auth.ts` |
| `POST /auth/verify` | `{ phone, code }` | `Session` | `401` «Код неправильний або вже не діє», `404` як вище | `auth.ts` |
| `POST /auth/refresh` | `{ refreshToken }` | `Session` | `401` «Сесія завершена» | `auth.ts` |
| `POST /auth/sign-out` | — (Bearer) | `204` | `401` без токена | `auth.ts` |
| `GET /auth/bot` | — | `BotInfo` | — | `auth.ts` |

`202` на видачу коду, а не `200`: сесії ще немає, повернулася лише обіцянка, що
код пішов у чат. `Session` несе `accessToken`, `refreshToken`, `expiresIn`
(секунди, не дата — клієнту потрібен відлік, а не момент), `master` і профіль.

`GET /auth/bot` віддає нік бота з `Telegram:BotUsername`, щоб клієнт не
тримав власної копії: розходження двох копій одного разу вже відправило
користувача в чужого бота ([ADR-0009](adr/0009-bot-username-from-server.md)).
Він неавтентифікований, бо потрібен раніше за сесію, і **поза лімітом
частоти** — нічого не видає й читає один рядок конфігу.

**Перші три неавтентифіковані за побудовою** — саме вони й видають токен. Тому
ліміт частоти тут не зручність, а частина механізму, і він **подвійний**:

- **за IP** — штатний `AddRateLimiter`, 10 запитів за хвилину на адресу;
- **за номером** — пауза між видачами коду на один номер, у `AuthService`, бо
  тіло запиту middleware читати нічим. Без неї чужий Telegram засипається
  кодами з різних адрес.

Ендпойнта «відкрити вхід» немає свідомо: номер сам вказує, кому належить код,
тож попередньо відкривати сесію нічим не потрібно.

Окремо від цих чотирьох стоїть приймач апдейтів бота. Зараз його немає взагалі:
long polling сам ходить по апдейти, і HTTP-поверхні в нього нуль. У продакшні
це буде вебхук із обов'язковою перевіркою заголовка
`X-Telegram-Bot-Api-Secret-Token`, і він **не** частина клієнтського
контракту, бо клієнт до нього не звертається.

> **Порушення [ADR-0002](adr/0002-client-contract-source-of-truth.md)
> закрите.** Форми (`Session`, `UserProfile`, `RequestCodeInput`,
> `VerifyCodeInput`) від початку оголошені в
> `GarageOSMobile/src/types/domain.ts`, як правило й вимагає, а **шляхи**
> деякий час існували тільки на сервері. Тепер `src/api/auth.ts` оголошує ті
> самі чотири шляхи й **справді їх викликає** по HTTP
> ([ADR-0008](adr/0008-mobile-http-transport.md)), тож контракт повний з обох
> боків і перевіряється запуском, а не читанням.

## Конвенції

**Множина в шляху, kebab-case.** `/client-vehicles`, `/orders`, `/my-vehicles`.
Зверни увагу: саме `/my-vehicles`, хоч ключ кешу в `src/queries/keys.ts` —
`vehicles`. Шлях первинний. Авто клієнта — `client-vehicles`, бо `vehicles`
вже означало б власну техніку ([ADR-0014](adr/0014-client-vehicle-rename.md)).

**Вкладена колекція — сегментом після власника.** Таких гілок три:
`/my-vehicles/{id}/log`, `/orders/{id}/works` і `/orders/{id}/parts`. Сегмент
зветься так само, як поле в батьківському типі — `log`, `works`, `parts`, — бо
контракт клієнта первинний ([ADR-0002](adr/0002-client-contract-source-of-truth.md)).
Журнал в однині, бо це журнал, а не список журналів
([ADR-0020](adr/0020-create-log-entry.md)).

**Вкладений елемент отримує власний шлях тоді, коли його стає що міняти.**
Так сталося із записом журналу ([ADR-0021](adr/0021-edit-and-delete-in-my-garage.md))
і так само — з рядком наряду: поки рядки лише читалися, вони були значеннями
без `id`; щойно їх знадобилося правити поодинці, `id` з'явився в контракті
([ADR-0024](adr/0024-order-lines-get-identity.md)).

**Одне поле — власний під-ресурс, якщо воно міняється саме по собі.**
`PUT /client-vehicles/{id}/status` міняє лише стан авто, не чіпаючи решти
картки. Це не `PATCH`: тіло несе **весь** під-ресурс, тож відсутність ключа
й далі означає «невідомо», а не «не чіпай»
([ADR-0023](adr/0023-vehicle-status-is-set-by-hand.md)).

**Без префікса й версії.** У контракті немає ні `/api`, ні `/v1`. Додати їх
можна лише разом із правкою `src/api/*` — зміна контракту, не деталь сервера.
HTTP-клієнт з'явився, і рішення ухвалене: **не додаємо**
([ADR-0008](adr/0008-mobile-http-transport.md)).

**Адресу сервера клієнт не зашиває.** `EXPO_PUBLIC_API_URL`, якщо задана;
інакше хост береться з адреси Metro (`Constants.expoConfig.hostUri`) і до нього
додається порт `5101`. Тому телефон у тій самій Wi-Fi працює без
налаштування, а release-білд обов'язково отримує змінну. Деталі й альтернативи
— [ADR-0008](adr/0008-mobile-http-transport.md).

**Фільтр — query-параметром.** `period` передається як `?period=week`, а не
сегментом шляху.

**Вкладене — на запит.** `?includeLog=` і `?includeLines=` вмикають вкладені
колекції; типово вони порожні
([ADR-0018](adr/0018-include-flags-for-nested-collections.md)). Прапорця немає
там, де без вкладеного екран не працює: `GET /orders/{id}` і наряди всередині
`GET /client-vehicles/{id}` завжди приходять із рядками.

**Деталізація — вкладеним об'єктом.** `GET /client-vehicles/{id}` не віддає
плоске авто, а `{ vehicle, orders, sameOwnerCount }`. Сервер мусить склеювати
це сам.

**Помилки — з текстом українською.** `ApiError` на клієнті несе `message`,
`endpoint` і `status`; екрани показують `message` користувачеві через
`src/components/ui/query-state.tsx`. Тому формулювання на сервері мусять бути
придатними для показу, а не технічними.

## Композиція на клієнті

Двох речей у списку ендпойнтів немає **свідомо**:

- **дошки робіт** — `useWorkBoard` будує її з `GET /client-vehicles` +
  `GET /orders` у `useMemo`;
- **окремого запиту за нарядами авто** — вони приходять усередині
  `ClientVehicleDetail`.

Причина: обидва екрани все одно тримають свіжі списки авто й нарядів у кеші
react-query, і окремий ендпойнт створив би третє джерело істини про той самий
стан. Коли (і якщо) дошка стане важкою — з'явиться `GET /work-board`; до того
додавати його не треба.

## Кеш і ключі

`src/queries/keys.ts` задає ключі, від яких залежить інвалідація на сервері
нічого не вимагає, але яку варто розуміти:

```
clientVehicles       ['client-vehicles']           clientVehicle(id) ['client-vehicles', id]
orders(includeLines) ['orders', {includeLines}]    order(id)         ['orders', id]
ordersAll            ['orders']
finance(period)      ['finance', period]           financeAll        ['finance']
vehicles(includeLog) ['vehicles', {includeLog}]    vehicle(id, log)  ['vehicles', id, {includeLog}]
```

Прапорець `include*` входить у ключ: інакше відповідь без вкладеної колекції
дісталася б екрану, який її показує
([ADR-0018](adr/0018-include-flags-for-nested-collections.md)). `ordersAll` і
`financeAll` — префікси для інвалідації.

`POST /client-vehicles` змінює стан, що впливає на `client-vehicles`, `orders`
**і** `finance` (борги, кількість візитів). Інвалідація цих трьох ключів —
відповідальність клієнта після мутації.

Те саме стосується оплати: `POST /orders/{id}/pay` і
`POST /client-vehicles/{id}/pay` рухають рядки, борг, стан авто й `earned` у
грошах водночас ([ADR-0025](adr/0025-settle-order-in-one-action.md)), тож
скидають ті самі ключі — одним хелпером `invalidateOrderWorld`, спільним на
обидва екрани.

## Чого в контракті ще немає

Ці операції потрібні для робочого продукту, але **ще не оголошені** —
додавати їх треба спершу в `src/api/*`, потім на сервер:

- редагування та видалення авто клієнта;
- часткова оплата: `pay` закриває наряд цілком
  ([ADR-0025](adr/0025-settle-order-in-one-action.md)), а оплата частини суми
  одного рядка невиражна взагалі ([ADR-0016](adr/0016-order-line-payment.md));
- вибір одиниці пробігу у формі «нове авто»
  ([ADR-0015](adr/0015-mileage-unit.md)).

→ Далі: [05 · Поперечні аспекти](05-cross-cutting.md)
