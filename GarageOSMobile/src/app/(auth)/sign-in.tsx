import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  AuthButton,
  AuthHint,
  AuthLead,
  AuthRings,
  AuthTitle,
} from '@/components/auth/auth-button';
import { BrandRow } from '@/components/auth/brand-row';
import { ChatIcon, PhoneFrameIcon, ShieldCheckIcon, TelegramIcon } from '@/components/icons';
import { Screen } from '@/components/ui/screen';
import { useBotInfo } from '@/queries/use-auth';
import { colors, onInk, radius, spacing } from '@/theme/tokens';

const STEPS = [
  { icon: <ChatIcon />, text: 'Відкриється чат із ботом «Гараж»' },
  { icon: <ShieldCheckIcon />, text: 'Бот пришле шість цифр — введіть їх тут' },
];

export default function SignInScreen() {
  const router = useRouter();
  const bot = useBotInfo();

  async function openBot() {
    if (!bot.data) return;

    try {
      await Linking.openURL(`https://t.me/${bot.data.username}`);
    } catch {
    }
  }

  return (
    <Screen background={colors.ink} style={styles.screen}>
      <AuthRings />

      <View style={styles.brand}>
        <BrandRow />
      </View>

      <View style={styles.heading}>
        <AuthTitle first="Вхід без" accent="пароля" />
        <AuthLead>Telegram підтвердить ваш номер — ні пошти, ні паролю не потрібно</AuthLead>
      </View>

      <View style={styles.steps}>
        {STEPS.map((step) => (
          <View key={step.text} style={styles.step}>
            <View style={styles.stepIcon}>{step.icon}</View>
            <Text style={styles.stepText}>{step.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <AuthButton
          label="Ввести номер телефону"
          icon={<PhoneFrameIcon color={colors.ink} />}
          onPress={() => router.push('/phone')}
        />
        <AuthButton
          label="Активувати бот для входу"
          variant="ghost"
          icon={<TelegramIcon />}
          disabled={!bot.data}
          busy={bot.isPending}
          onPress={openBot}
        />
        <AuthHint center>
          {bot.isError
            ? 'Не вдалося дізнатися адресу бота — перевірте, чи запущений сервер'
            : 'Вперше? Відкриється бот — натисніть «Start»'}
        </AuthHint>
      </View>

      <View style={styles.footer}>
        <AuthHint center>Немає Telegram? Майстер веде вашу картку й без акаунта</AuthHint>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    overflow: 'hidden',
  },
  brand: {
    marginTop: spacing.lg,
  },
  heading: {
    marginTop: 48,
  },
  steps: {
    marginTop: spacing.xxxl,
    gap: 14,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: onInk.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: onInk.body,
  },
  actions: {
    marginTop: 40,
    gap: spacing.md,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
});
