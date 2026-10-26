import { useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ChipRow } from '@/components/ui/chip-row';
import { SearchPickerDialog } from '@/components/ui/search-picker-dialog';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { MAKE_NAMES, makeMatches, modelsOf, splitVehicleName } from '@/lib/car-catalog';
import { mileageUnitLabel } from '@/lib/format';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { MileageUnit } from '@/types/domain';

// `kind` is free text in the contract, and these three are what the garage
// already holds. Offering them as a choice keeps one kind from arriving under
// three spellings.
const CAR = 'Авто';

const KINDS = [CAR, 'Мото', 'Техніка'];

const UNITS: MileageUnit[] = ['km', 'hours'];

const EARLIEST_YEAR = 1900;

// A car is picked from the catalogue, everything else is still typed: there is
// no list of make and model worth the name for a Niva trailer or a tiller.
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

function digitsOf(value: string): string {
  return value.replace(/\D/g, '');
}

function nextYear(): number {
  return new Date().getFullYear() + 1;
}

// Newest first: a car from this decade is what somebody is adding, and the
// 1950s are a scroll away rather than the other way round.
function yearOptions(): string[] {
  const years: string[] = [];

  for (let year = nextYear(); year >= EARLIEST_YEAR; year -= 1) years.push(String(year));

  return years;
}

// A name the pickers did not write — one typed before this screen existed —
// still has to survive an edit, so it lands in the make whole and the model
// stays empty rather than being guessed at.
function toCarFields(name: string): { make: string; model: string } {
  const split = splitVehicleName(name);

  return split.make ? split : { make: name.trim(), model: '' };
}

function composeName(form: FormState): string {
  return form.kind === CAR ? `${form.make} ${form.model}`.trim() : form.name.trim();
}

function toFormState(initial?: MyVehicleFormValues): FormState {
  const name = initial?.name ?? '';
  const kind = initial?.kind ?? KINDS[0];

  return {
    kind,
    name,
    ...(kind === CAR ? toCarFields(name) : { make: '', model: '' }),
    year: initial === undefined ? '' : String(initial.year),
    mileage: initial === undefined ? '' : String(initial.mileage),
    mileageUnit: initial?.mileageUnit ?? 'km',
  };
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const limit = nextYear();
  const year = Number(digitsOf(form.year));

  if (form.kind === CAR) {
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

  const isCar = form.kind === CAR;

  const years = useMemo(() => yearOptions(), []);

  // A value saved earlier may be outside the catalogue; it still has to show as
  // the current choice instead of disappearing from its own list.
  const makes = useMemo(
    () => (!form.make || MAKE_NAMES.includes(form.make) ? MAKE_NAMES : [form.make, ...MAKE_NAMES]),
    [form.make]
  );

  const models = useMemo(() => {
    const known = modelsOf(form.make);

    return !form.model || known.includes(form.model) ? known : [form.model, ...known];
  }, [form.make, form.model]);

  const update = (field: TextKey) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  // Switching kind must not throw away what is already typed: the two shapes
  // of the same answer are converted into each other instead.
  function pickKind(kind: string) {
    setForm((current) => {
      if (kind === current.kind) return current;

      if (current.kind === CAR) {
        return { ...current, kind, name: current.name || composeName(current) };
      }

      return { ...current, kind, ...(kind === CAR ? toCarFields(current.name) : {}) };
    });
  }

  function pickMake(make: string) {
    // A model belongs to one make, so changing the make drops it.
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
        options={KINDS.map((kind) => ({ value: kind, label: kind }))}
        value={form.kind}
        onChange={pickKind}
      />

      {isCar ? (
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
        match={makeMatches}
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
