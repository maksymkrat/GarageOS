# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Dev loop

Metro з Fast Refresh сам доставляє кожне збереження на телефон — перезапускати
бандлер після правки не треба й шкідливо. Коли перезапуск усе ж стався
(змінився `app.json`, нова залежність, впав процес), телефон лишається на
старому бандлі: підніми `npm run dev` замість `npm start` — він перезавантажить
застосунок, щойно той під'єднається. Для вже запущеного Metro те саме робить
`npm run reload`.
