import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  AuthButton,
  AuthHint,
  AuthLead,
  AuthLink,
  AuthTitle,
} from '@/components/auth/auth-button';
import { BrandRow } from '@/components/auth/brand-row';
import { AlertCircleIcon, ChevronLeftIcon, TelegramIcon } from '@/components/icons';
import { Screen } from '@/components/ui/screen';
import { useRequestCode } from '@/queries/use-auth';
import { colors, onInk, radius, spacing } from '@/theme/tokens';

const LOCAL_LENGTH = 9;

function group(digits: string): string {
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)]
    .filter(Boolean)
    .join(' ');
}

export default function PhoneScreen() {
  const router = useRouter();
  const [digits, setDigits] = useState('');
  const [focused, setFocused] = useState(false);
  const requestCode = useRequestCode();

  const complete = digits.length === LOCAL_LENGTH;

  function send() {
    const phone = `0${digits}`;

    requestCode.mutate(
      { phone },
      { onSuccess: () => router.push({ pathname: '/code', params: { phone } }) }
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
          <AuthTitle first="Ваш номер" accent="у Telegram" />
          <AuthLead>Бот «Гараж» надішле код у чат, прив&apos;язаний до цього номера</AuthLead>
        </View>

        <View style={[styles.field, focused && styles.fieldFocused]}>
          <Text style={styles.prefix}>+380</Text>
          <View style={styles.divider} />
          <TextInput
            autoFocus
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            placeholder="67 123 45 67"
            placeholderTextColor={onInk.dim}
            value={group(digits)}
            onChangeText={(text) => setDigits(text.replace(/\D/g, '').slice(0, LOCAL_LENGTH))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={() => complete && send()}
            style={styles.input}
          />
        </View>

        <View style={styles.note}>
          <AuthHint>Номер має збігатися з тим, що вказаний у вашому Telegram</AuthHint>
        </View>

        {requestCode.isError && (
          <View style={styles.error}>
            <AlertCircleIcon color={colors.dangerOnInk} />
            <Text style={styles.errorText}>{requestCode.error.message}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <AuthButton
            label="Надіслати код у Telegram"
            icon={<TelegramIcon color={colors.ink} />}
            disabled={!complete}
            busy={requestCode.isPending}
            onPress={send}
          />
          <AuthLink
            label="Ще не запускали бота? Почати з Telegram"
            onPress={() => router.back()}
          />
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 56,
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: onInk.border,
    backgroundColor: onInk.fill,
  },
  fieldFocused: {
    borderColor: colors.orange,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    color: onInk.muted,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: onInk.border,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: onInk.text,
  },
  note: {
    marginTop: spacing.md,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: spacing.xl,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: onInk.dangerBorder,
    backgroundColor: onInk.dangerFill,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: colors.dangerOnInk,
  },
  actions: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
});
