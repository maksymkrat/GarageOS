import { useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ChipRow } from '@/components/ui/chip-row';
import { SearchPickerDialog } from '@/components/ui/search-picker-dialog';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { mileageUnitLabel } from '@/lib/format';
import {
  EARLIEST_YEAR,
  VEHICLE_KINDS,
  catalogFor,
  latestYear,
  vehicleYears,
} from '@/lib/vehicle-catalog';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { MileageUnit } from '@/types/domain';

const UNITS: MileageUnit[] = ['km', 'hours'];

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
  make: string;
  model: string;
  year: string;
  mileage: string;
  mileageUnit: MileageUnit;
}

type TextKey = 'name' | 'mileage';

type FieldKey = TextKey | 'make' | 'model' | 'year';

type Picker = 'make' | 'model' | 'year';

type FormErrors = Partial<Record<FieldKey, string>>;

const NO_FIELDS = { make: '', model: '' };

function digitsOf(value: string): string {
  return value.replace(/\D/g, '');
}

function composeName(form: FormState): string {
  return catalogFor(form.kind) ? `${form.make} ${form.model}`.trim() : form.name.trim();
}

function toFormState(initial?: MyVehicleFormValues): FormState {
  const name = initial?.name ?? '';
  const kind = initial?.kind ?? VEHICLE_KINDS[0];
  const catalog = catalogFor(kind);

  return {
    kind,
    name,
    ...(catalog ? catalog.fields(name) : NO_FIELDS),
    year: initial === undefined ? '' : String(initial.year),
    mileage: initial === undefined ? '' : String(initial.mileage),
    mileageUnit: initial?.mileageUnit ?? 'km',
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const limit = latestYear();
  const year = Number(digitsOf(form.year));

  if (catalogFor(form.kind)) {
    if (!form.make.trim()) errors.make = 'Оберіть марку';
  } else if (!form.name.trim()) {
    errors.name = 'Вкажіть назву';
  }

  if (!year || year < EARLIEST_YEAR || year > limit) {
    errors.year = `Вкажіть рік від ${EARLIEST_YEAR} до ${limit}`;
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
  const [picker, setPicker] = useState<Picker | null>(null);

  const catalog = catalogFor(form.kind);

  const years = useMemo(() => vehicleYears(), []);

  const makes = useMemo(() => {
    const known = catalog?.names ?? [];

    return !form.make || known.includes(form.make) ? known : [form.make, ...known];
  }, [catalog, form.make]);

  const models = useMemo(() => {
    const known = catalog?.models(form.make) ?? [];

    return !form.model || known.includes(form.model) ? known : [form.model, ...known];
  }, [catalog, form.make, form.model]);

  const update = (field: TextKey) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  function pickKind(kind: string) {
    setForm((current) => {
      if (kind === current.kind) return current;

      const leaving = catalogFor(current.kind);
      const entering = catalogFor(kind);

      const name = leaving ? current.name || composeName(current) : current.name;
      const fields = entering && !leaving ? entering.fields(name) : NO_FIELDS;

      return { ...current, kind, name, ...fields };
    });
  }

  function pickMake(make: string) {
    setForm((current) => (current.make === make ? current : { ...current, make, model: '' }));
    setPicker(null);
  }

  function pick(field: 'model' | 'year', value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setPicker(null);
  }

  function submit() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      kind: form.kind,
      name: composeName(form),
      year: Number(digitsOf(form.year)),
      mileage: Number(digitsOf(form.mileage)),
      mileageUnit: form.mileageUnit,
    });
  }

  return (
    <>
      <ChipRow
        label="Вид"
        options={VEHICLE_KINDS.map((kind) => ({ value: kind, label: kind }))}
        value={form.kind}
        onChange={pickKind}
      />

      {catalog ? (
        <>
          <SelectField
            label="Марка *"
            placeholder="Оберіть марку"
            value={form.make}
            error={errors.make}
            onPress={() => setPicker('make')}
          />

          <SelectField
            label="Модель"
            placeholder={form.make ? 'Оберіть модель' : 'Спершу оберіть марку'}
            value={form.model}
            disabled={!form.make}
            error={errors.model}
            onPress={() => setPicker('model')}
          />
        </>
      ) : (
        <TextField
          label="Назва *"
          placeholder="Мотоблок Кентавр"
          value={form.name}
          onChangeText={update('name')}
          error={errors.name}
        />
      )}

      <SelectField
        label="Рік *"
        placeholder="Оберіть рік"
        value={form.year}
        error={errors.year}
        onPress={() => setPicker('year')}
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

      <SearchPickerDialog
        visible={picker === 'make'}
        title="Марка"
        searchPlaceholder="Почніть вводити марку…"
        options={makes}
        value={form.make}
        emptyText="Такої марки немає в списку"
        allowCustom
        match={catalog?.matches}
        onPick={pickMake}
        onCancel={() => setPicker(null)}
      />

      <SearchPickerDialog
        visible={picker === 'model'}
        title={form.make || 'Модель'}
        searchPlaceholder="Почніть вводити модель…"
        options={models}
        value={form.model}
        emptyText="Такої моделі немає в списку"
        allowCustom
        onPick={(model) => pick('model', model)}
        onCancel={() => setPicker(null)}
      />

      <SearchPickerDialog
        visible={picker === 'year'}
        title="Рік випуску"
        searchPlaceholder="Наприклад, 2019"
        options={years}
        value={form.year}
        emptyText="Такого року немає в списку"
        onPick={(year) => pick('year', year)}
        onCancel={() => setPicker(null)}
      />

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
