import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ChipRow } from '@/components/ui/chip-row';
import { TextField } from '@/components/ui/text-field';
import { mileageUnitLabel } from '@/lib/format';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { MileageUnit } from '@/types/domain';

// `kind` is free text in the contract, and these three are what the garage
// already holds. Offering them as a choice keeps one kind from arriving under
// three spellings.
const KINDS = ['Авто', 'Мото', 'Техніка'];

const UNITS: MileageUnit[] = ['km', 'hours'];

const EARLIEST_YEAR = 1900;

export interface MyVehicleFormValues {
  kind: string;
  name: string;
  year: number;
  mileage: number;
  mileageUnit: MileageUnit;
}

interface FormState {
  kind: string;
  name: string;
  year: string;
  mileage: string;
  mileageUnit: MileageUnit;
}

type TextKey = 'name' | 'year' | 'mileage';

type FormErrors = Partial<Record<TextKey, string>>;

function digitsOf(value: string): string {
  return value.replace(/\D/g, '');
}

function toFormState(initial?: MyVehicleFormValues): FormState {
  return {
    kind: initial?.kind ?? KINDS[0],
    name: initial?.name ?? '',
    year: initial === undefined ? '' : String(initial.year),
    mileage: initial === undefined ? '' : String(initial.mileage),
    mileageUnit: initial?.mileageUnit ?? 'km',
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const nextYear = new Date().getFullYear() + 1;
  const year = Number(digitsOf(form.year));

  if (!form.name.trim()) errors.name = 'Вкажіть назву';

  if (!year || year < EARLIEST_YEAR || year > nextYear) {
    errors.year = `Вкажіть рік від ${EARLIEST_YEAR} до ${nextYear}`;
  }

  if (!digitsOf(form.mileage)) errors.mileage = 'Вкажіть пробіг';

  return errors;
}

interface MyVehicleFormProps {
  initial?: MyVehicleFormValues;
  submitLabel: string;
  pending: boolean;
  error: unknown;
  onSubmit: (values: MyVehicleFormValues) => void;
  children?: ReactNode;
}

export function MyVehicleForm({
  initial,
  submitLabel,
  pending,
  error,
  onSubmit,
  children,
}: MyVehicleFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [errors, setErrors] = useState<FormErrors>({});

  const update = (field: TextKey) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  function submit() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      kind: form.kind,
      name: form.name.trim(),
      year: Number(digitsOf(form.year)),
      mileage: Number(digitsOf(form.mileage)),
      mileageUnit: form.mileageUnit,
    });
  }

  return (
    <>
      <ChipRow
        label="Вид"
        options={KINDS.map((kind) => ({ value: kind, label: kind }))}
        value={form.kind}
        onChange={(kind) => setForm((current) => ({ ...current, kind }))}
      />

      <TextField
        label="Назва *"
        placeholder="Mazda CX-5"
        value={form.name}
        onChangeText={update('name')}
        error={errors.name}
      />

      <TextField
        label="Рік *"
        placeholder="2019"
        keyboardType="number-pad"
        value={form.year}
        onChangeText={update('year')}
        error={errors.year}
      />

      <ChipRow
        label="Одиниця пробігу"
        options={UNITS.map((unit) => ({ value: unit, label: mileageUnitLabel(unit) }))}
        value={form.mileageUnit}
        onChange={(mileageUnit) => setForm((current) => ({ ...current, mileageUnit }))}
      />

      <TextField
        label={`Пробіг, ${mileageUnitLabel(form.mileageUnit)} *`}
        placeholder="98 400"
        keyboardType="number-pad"
        value={form.mileage}
        onChangeText={update('mileage')}
        error={errors.mileage}
      />

      {initial !== undefined && form.mileageUnit !== initial.mileageUnit && (
        <Text style={styles.notice}>
          Записи журналу лишаться в тих одиницях, у яких їх зроблено — історія не
          перераховується
        </Text>
      )}

      {!!error && (
        <Text style={styles.error}>
          {error instanceof Error ? error.message : 'Не вдалося зберегти техніку'}
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
  notice: {
    fontSize: 11,
    color: colors.warningOnInk,
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
