namespace GarageOS.Telegram.Bot;

internal static class BotTexts
{
    public const string ShareButton = "Поділитися номером";

    public const string AskPhone =
        """
        Вітаю в <b>GarageOS</b>.

        Щоб увійти в застосунок, підтвердь свій номер — натисни кнопку внизу.
        Пароля не буде: кожен вхід підтверджується кодом у цьому чаті.
        """;

    public const string Activated =
        """
        Готово, номер підтверджено.

        Тепер вертайся в застосунок і введи цей самий номер — код на вхід
        прийде сюди.
        """;

    public const string AlreadyActivated =
        """
        Номер уже підтверджений.

        Вводь його в застосунку — код прийде сюди.
        """;

    public const string ForeignContact =
        """
        Це контакт іншої людини.

        Підтвердити можна лише свій номер — натисни кнопку «Поділитися
        номером», а не надсилай контакт із книги.
        """;

    public const string PhoneTaken =
        """
        Цей номер уже закріплений за іншим акаунтом Telegram.

        Якщо номер твій, напиши майстру — перев'язати його може лише він.
        """;

    public const string CodeMessage =
        """
        Код для входу в <b>GarageOS</b>:

        <code>{0}</code>

        Діє {1} хв. Нікому його не передавай — хто побачить код, той зайде.
        """;

    public const string SignedIn =
        """
        Вхід у <b>GarageOS</b> виконано.

        Якщо це був не ти — відкрий застосунок і увійди знову: новий вхід
        завершує попередню сесію.
        """;
}
