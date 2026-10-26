# Архітектурні рішення (ADR)

ADR фіксує **одне** рішення: контекст, вибір, альтернативи та наслідки.
Сторінки атласу описують стан системи; ADR описує, чому стан саме такий.

## Формат

Файл — `NNNN-короткий-заголовок.md`, нумерація безперервна, записи не
видаляються. Якщо рішення скасоване — статус змінюється на
`Superseded by ADR-NNNN`, текст лишається.

Статуси: `Proposed` (запропоновано, не ухвалено) · `Accepted` (діє) ·
`Superseded` (замінено) · `Rejected` (розглянуто й відкинуто).

## Реєстр

| № | Рішення | Статус |
|---|---------|--------|
| [0001](0001-record-architecture-decisions.md) | Фіксувати архітектурні рішення в ADR | Accepted |
| [0002](0002-client-contract-source-of-truth.md) | Контракт клієнта — джерело істини для API | Accepted |
| [0003](0003-monorepo-layout.md) | Монорепозиторій з `GarageOSMobile` та `GarageOSWeb` | Accepted |
| [0004](0004-persistence.md) | Персистентність: PostgreSQL + EF Core | Accepted |
| [0005](0005-authentication.md) | Автентифікація через Firebase, пошта й пароль | Superseded by [0007](0007-telegram-sign-in.md) |
| [0006](0006-backend-layering.md) | Шарова структура `GarageOSWeb` | Accepted |
| [0007](0007-telegram-sign-in.md) | Вхід за номером із кодом у чаті бота, сесії власні | Accepted |
| [0008](0008-mobile-http-transport.md) | HTTP-транспорт мобілки, адреса API з `hostUri` | Accepted |
| [0009](0009-bot-username-from-server.md) | Нік бота віддає сервер, клієнт його не зашиває | Accepted |
| [0010](0010-user-name-split-no-photo.md) | Ім'я акаунта двома полями, фото профілю не зберігаємо | Accepted |
| [0011](0011-debt-derived-from-orders.md) | Борг авто обчислюється з нарядів, колонки немає | Accepted |
| [0012](0012-optional-fields-and-single-log-note.md) | Рік і пробіг авто опційні, запис журналу — один опис | Accepted |
| [0013](0013-log-entry-date-is-created-at.md) | Дата запису журналу — це `CreatedAt` | Accepted |
| [0014](0014-client-vehicle-rename.md) | Авто клієнта називається `ClientVehicle`, а не `Car` | Accepted |
| [0015](0015-mileage-unit.md) | Пробіг має одиницю виміру, і це перелічення | Accepted |
| [0016](0016-order-line-payment.md) | Рядок наряду — підсумок із власним станом оплати | Accepted |
| [0017](0017-order-without-own-status-and-date.md) | Наряд без власного статусу, дати й лічильника днів | Accepted |
| [0018](0018-include-flags-for-nested-collections.md) | Вкладені колекції віддаються на запит, прапорцем `include*` | Accepted |
| [0019](0019-create-my-vehicle.md) | Додавання особистої техніки, власник — із токена | Accepted |
| [0020](0020-create-log-entry.md) | Запис журналу вкладеним ендпойнтом, одиниця пробігу — з техніки | Accepted |
| [0021](0021-edit-and-delete-in-my-garage.md) | Зміна й видалення в особистому гаражі: `PUT`, не `PATCH` | Accepted |
| [0022](0022-order-crud-and-service-authorization.md) | Наряд створюється, змінюється й видаляється; сервіс закрито політикою `Master` | Accepted |
| [0023](0023-vehicle-status-is-set-by-hand.md) | Стан авто ставить майстер окремим під-ресурсом; `has_debt` підписано «Чекаю оплату» | Accepted |
| [0024](0024-order-lines-get-identity.md) | Рядок наряду отримує `id` і власний шлях; наряд більше не переписується цілком | Accepted |
| [0025](0025-settle-order-in-one-action.md) | Оплата наряду одним дотиком: рядки → `paid`, авто → `ready` | Accepted |
| [0026](0026-vehicle-photo-storage.md) | Фото машини: файл на диску, id у базі, квадрат і два розміри | Accepted |
| [0027](0027-order-photos.md) | Фото наряду — власна таблиця, галерея, id у контракті цілий | Accepted |
| [0028](0028-session-lasts-a-working-day.md) | Сесія живе робочий день: 14 годин від входу, токени — у сховищі пристрою | Accepted |
