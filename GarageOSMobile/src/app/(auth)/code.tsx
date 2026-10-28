import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
} from 'react-native';

import {
  AuthButton,
  AuthHint,
  AuthLead,
  AuthLink,
  AuthTitle,
} from '@/components/auth/auth-button';
import { BrandRow } from '@/components/auth/brand-row';
import { AlertCircleIcon, ChevronLeftIcon, ClockIcon, TelegramIcon } from '@/components/icons';
import { Screen } from '@/components/ui/screen';
import { CODE_LENGTH, CODE_TTL_MS } from '@/api/auth';
import { useSession } from '@/lib/session';
import { useRequestCode, useVerifyCode } from '@/queries/use-auth';
import { colors, fontFamily, onInk, radius, spacing } from '@/theme/tokens';

const EMPTY = Array<string>(CODE_LENGTH).fill('');

function countdownLabel(msLeft: number): string {
  const total = Math.max(0, Math.ceil(msLeft / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export default function CodeScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { signIn } = useSession();

  const [digits, setDigits] = useState(EMPTY);
  const [focused, setFocused] = useState<number | null>(0);
  const [expiresAt, setExpiresAt] = useState(() => Date.now() + CODE_TTL_MS);
  const [msLeft, setMsLeft] = useState(CODE_TTL_MS);
  const boxes = useRef<(TextInputInstance | null)[]>([]);

  const verify = useVerifyCode();
  const resend = useRequestCode();

  useEffect(() => {
    const tick = setInterval(() => setMsLeft(expiresAt - Date.now()), 1000);
    return () => clearInterval(tick);
  }, [expiresAt]);

  const expired = msLeft <= 0;
  const complete = digits.every(Boolean);

  const state = expired
    ? 'expired'
    : verify.isPending
      ? 'checking'
      : verify.isError
        ? 'error'
        : 'input';

  const dimmed = state === 'checking' || state === 'expired';

  function submit(code: string) {
    verify.mutate({ phone, code }, { onSuccess: signIn });
  }

  function setAt(index: number, text: string) {
    const digit = text.replace(/\D/g, '').slice(-1);
    if (!digit) return;

    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (index < CODE_LENGTH - 1) boxes.current[index + 1]?.focus();
    else if (next.every(Boolean)) submit(next.join(''));
  }

  function onBackspace(index: number) {
    const next = [...digits];

    if (next[index]) {
      next[index] = '';
      setDigits(next);
      return;
    }

    if (index > 0) {
      next[index - 1] = '';
      setDigits(next);
      boxes.current[index - 1]?.focus();
    }
  }

  function requestNewCode() {
    resend.mutate(
      { phone },
      {
        onSuccess: () => {
          setDigits(EMPTY);
          setExpiresAt(Date.now() + CODE_TTL_MS);
          setMsLeft(CODE_TTL_MS);
          verify.reset();
          boxes.current[0]?.focus();
        },
      }
    );
  }

  return (
    <Screen background={colors.ink} style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.fill}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          hitSlop={8}
          onPress={() => router.back()}
          style={styles.back}>
          <ChevronLeftIcon size={20} color={onInk.text} />
        </Pressable>

        <View style={styles.brand}>
          <BrandRow compact />
        </View>

        <View style={styles.heading}>
          <AuthTitle first="Введіть код" accent="з чату" />
          <AuthLead>Бот «Гараж» надіслав шість цифр у Telegram</AuthLead>
        </View>

        <View style={[styles.boxes, dimmed && styles.dimmed]}>
          {digits.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.box,
                state === 'error' && styles.boxInvalid,
                state === 'input' && focused === index && styles.boxFocused,
              ]}>
              {digit ? (
                <Text style={styles.digit}>{digit}</Text>
              ) : (
                <View style={styles.dash} />
              )}
              <TextInput
                ref={(element) => {
                  boxes.current[index] = element;
                }}
                accessibilityLabel={`Цифра ${index + 1} з ${CODE_LENGTH}`}
                autoFocus={index === 0}
                editable={state === 'input' || state === 'error'}
                keyboardType="number-pad"
                textContentType={index === 0 ? 'oneTimeCode' : 'none'}
                value={digit}
                onChangeText={(text) => setAt(index, text)}
                onKeyPress={({ nativeEvent }) =>
                  nativeEvent.key === 'Backspace' && onBackspace(index)
                }
                onFocus={() => setFocused(index)}
                onBlur={() => setFocused(null)}
                style={styles.boxInput}
              />
            </View>
          ))}
        </View>

        {state === 'error' && (
          <View style={[styles.banner, styles.bannerDanger]}>
            <AlertCircleIcon color={colors.dangerOnInk} />
            <Text style={[styles.bannerText, styles.bannerTextDanger]}>
              Код невірний. Перевірте цифри або відкрийте чат і візьміть новий.
            </Text>
          </View>
        )}

        {state === 'expired' && (
          <View style={[styles.banner, styles.bannerWarning]}>
            <ClockIcon />
            <Text style={[styles.bannerText, styles.bannerTextWarning]}>
              Час коду вийшов. Відкрийте чат — бот надішле новий.
            </Text>
          </View>
        )}

        {(state === 'input' || state === 'error') && (
          <View style={styles.countdown}>
            <AuthHint center>Код діє ще {countdownLabel(msLeft)}</AuthHint>
          </View>
        )}

        <View style={styles.actions}>
          {expired ? (
            <AuthButton
              label="Отримати новий код"
              icon={<TelegramIcon color={colors.ink} />}
              busy={resend.isPending}
              onPress={requestNewCode}
            />
          ) : (
            <AuthButton
              label={state === 'checking' ? 'Перевіряємо…' : 'Увійти'}
              disabled={!complete}
              busy={verify.isPending}
              onPress={() => submit(digits.join(''))}
            />
          )}

          {!expired && (
            <AuthLink
              label="Не отримали код? Відкрити чат знову"
              icon={<TelegramIcon size={14} color={onInk.muted} />}
              onPress={() => router.back()}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  fill: {
    flex: 1,
  },
  back: {
    width: 40,
    height: 40,
    marginLeft: -spacing.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    marginTop: spacing.lg,
  },
  heading: {
    marginTop: 40,
  },
  boxes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: spacing.xxxl,
  },
  dimmed: {
    opacity: 0.45,
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: onInk.border,
    backgroundColor: onInk.fill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  boxFocused: {
    borderColor: colors.orange,
  },
  boxInvalid: {
    borderColor: onInk.dangerBorderStrong,
  },
  digit: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: fontFamily.mono,
    color: onInk.text,
  },
  dash: {
    width: 12,
    height: 1,
    backgroundColor: onInk.dim,
  },
  boxInput: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0,
    textAlign: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: spacing.xl,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  bannerDanger: {
    borderColor: onInk.dangerBorder,
    backgroundColor: onInk.dangerFill,
  },
  bannerWarning: {
    borderColor: onInk.warnBorder,
    backgroundColor: onInk.warnFill,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  bannerTextDanger: {
    color: colors.dangerOnInk,
  },
  bannerTextWarning: {
    color: colors.amberOnDark,
  },
  countdown: {
    marginTop: spacing.lg,
  },
  actions: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
});
