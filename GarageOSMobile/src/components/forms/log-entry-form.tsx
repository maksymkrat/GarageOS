import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ChipRow } from '@/components/ui/chip-row';
import { TextField } from '@/components/ui/text-field';
import { mileageUnitLabel } from '@/lib/format';
import { LOG_KIND_LABEL } from '@/theme/status';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { LogEntryKind, MileageUnit } from '@/types/domain';

const KINDS = Object.keys(LOG_KIND_LABEL) as LogEntryKind[];

export interface LogEntryFormValues {
  kind: LogEntryKind;
  note: string;
  cost: number;
  mileage?: number;
}

interface FormState {
  kind: LogEntryKind;
  note: string;
  cost: string;
  mileage: string;
}

type TextKey = 'note' | 'cost' | 'mileage';

type FormErrors = Partial<Record<TextKey, string>>;

function digitsOf(value: string): string {
  return value.replace(/\D/g, '');
}

// The cost column keeps two decimals, so 1250 and 1250,50 both have to pass —
// stripping non-digits would silently turn the second into 125050.
function parseMoney(value: string): number | null {
  const normalized = value.replace(/\s/g, '').replace(',', '.');

  return /^\d+(\.\d{1,2})?$/.test(normalized) ? Number(normalized) : null;
}

function toFormState(initial?: LogEntryFormValues): FormState {
  return {
    kind: initial?.kind ?? 'oil',
    note: initial?.note ?? '',
    cost: initial === undefined ? '' : String(initial.cost).replace('.', ','),
    mileage: initial?.mileage === undefined ? '' : String(initial.mileage),
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.note.trim()) errors.note = 'Опишіть, що зроблено';
  if (parseMoney(form.cost) === null) errors.cost = 'Вкажіть витрати, напр. 1250 або 1250,50';

  return errors;
}

interface LogEntryFormProps {
  initial?: LogEntryFormValues;
  mileageUnit: MileageUnit;
  submitLabel: string;
  pending: boolean;
  error: unknown;
  onSubmit: (values: LogEntryFormValues) => void;
  children?: ReactNode;
}

export function LogEntryForm({
  initial,
  mileageUnit,
  submitLabel,
  pending,
  error,
  onSubmit,
  children,
}: LogEntryFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [errors, setErrors] = useState<FormErrors>({});

  const update = (field: TextKey) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  function submit() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const mileage = digitsOf(form.mileage);

    onSubmit({
      kind: form.kind,
      note: form.note.trim(),
      cost: parseMoney(form.cost) ?? 0,
      // Left empty means unknown, not nought: the field is absent from the
      // request rather than sent as zero (ADR-0012).
      mileage: mileage ? Number(mileage) : undefined,
    });
  }

  return (
    <>
      <ChipRow
        label="Тип"
        options={KINDS.map((kind) => ({ value: kind, label: LOG_KIND_LABEL[kind] }))}
        value={form.kind}
        onChange={(kind) => setForm((current) => ({ ...current, kind }))}
      />

      <View style={styles.group}>
        <Text style={styles.label}>Що зроблено *</Text>
        <TextInput
          value={form.note}
          onChangeText={update('note')}
          placeholder="Олива + масляний фільтр, Mazda Dexelia 0W-20, 4.5 л"
          placeholderTextColor={colors.placeholder}
          multiline
          style={[styles.textarea, !!errors.note && styles.invalid]}
        />
        {!!errors.note && <Text style={styles.fieldError}>{errors.note}</Text>}
      </View>

      <TextField
        label="Витрати, ₴ *"
        placeholder="1 250"
        keyboardType="decimal-pad"
        value={form.cost}
        onChangeText={update('cost')}
        error={errors.cost}
      />

      <TextField
        label={`Пробіг, ${mileageUnitLabel(mileageUnit)}`}
        placeholder="98 400"
        keyboardType="number-pad"
        value={form.mileage}
        onChangeText={update('mileage')}
      />
      <Text style={styles.hint}>
        Можна не вказувати — тоді пробіг лишиться невідомим, а не нульовим
      </Text>

      {!!error && (
        <Text style={styles.error}>
          {error instanceof Error ? error.message : 'Не вдалося зберегти запис'}
        </Text>
      )}

      <Pressable
        accessibilityRole="button"
        disabled={pending}
        onPress={submit}
        style={({ pressed }) => [styles.submit, (pressed || pending) && { opacity: 0.85 }]}>
        {pending ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.submitLabel}>{submitLabel}</Text>
        )}
      </Pressable>

      {children !== undefined && <View style={styles.extra}>{children}</View>}
    </>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  textarea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.text,
    minHeight: 84,
    textAlignVertical: 'top',
  },
  invalid: {
    borderColor: colors.dangerBorder,
  },
  fieldError: {
    fontSize: 11,
    color: colors.dangerOnInk,
  },
  hint: {
    marginTop: -spacing.sm,
    fontSize: 11,
    color: colors.textFaint,
  },
  error: {
    fontSize: 13,
    color: colors.dangerOnInk,
  },
  submit: {
    backgroundColor: colors.amber,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.submit,
  },
  submitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onAccent,
  },
  extra: {
    marginTop: spacing.lg,
  },
});
