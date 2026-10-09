import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CameraIcon } from '@/components/icons';
import { BackButton } from '@/components/ui/back-button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { showPrototypeNotice } from '@/lib/prototype';
import { useCreateCar } from '@/queries/use-cars';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

interface FormState {
  plate: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  owner: string;
  phone: string;
  complaint: string;
}

const EMPTY_FORM: FormState = {
  plate: '',
  make: '',
  model: '',
  year: '',
  mileage: '',
  owner: '',
  phone: '',
  complaint: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.plate.trim()) errors.plate = 'Вкажіть держномер';
  if (!form.make.trim()) errors.make = 'Вкажіть марку';
  if (!form.model.trim()) errors.model = 'Вкажіть модель';
  if (!form.owner.trim()) errors.owner = "Вкажіть ім'я власника";
  if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Вкажіть телефон, 10 цифр';
  return errors;
}

export default function NewCarScreen() {
  const router = useRouter();
  const createCar = useCreateCar();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [withOrder, setWithOrder] = useState(true);

  const update = (field: keyof FormState) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  async function submit() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const car = await createCar.mutateAsync({
      plate: form.plate,
      make: form.make,
      model: form.model,
      year: form.year ? Number(form.year) : undefined,
      mileage: form.mileage ? Number(form.mileage.replace(/\D/g, '')) : undefined,
      owner: form.owner,
      phone: form.phone,
      complaint: form.complaint,
      createOrder: withOrder,
    });

    router.replace(`/cars/${car.id}`);
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.header}>
          <BackButton fallback="/garage" />
          <Text style={styles.title}>Нове авто</Text>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <TextField
            label="Держномер *"
            placeholder="АА0000ВВ"
            mono
            autoCapitalize="characters"
            value={form.plate}
            onChangeText={update('plate')}
            error={errors.plate}
          />
          <TextField
            label="Марка *"
            placeholder="Volkswagen"
            value={form.make}
            onChangeText={update('make')}
            error={errors.make}
          />
          <TextField
            label="Модель *"
            placeholder="Passat B7"
            value={form.model}
            onChangeText={update('model')}
            error={errors.model}
          />
          <TextField
            label="Рік"
            placeholder="2018"
            keyboardType="number-pad"
            value={form.year}
            onChangeText={update('year')}
          />
          <TextField
            label="Пробіг, км"
            placeholder="145 000"
            keyboardType="number-pad"
            value={form.mileage}
            onChangeText={update('mileage')}
          />
          <TextField
            label="Ім'я власника *"
            placeholder="Іван Петренко"
            value={form.owner}
            onChangeText={update('owner')}
            error={errors.owner}
          />
          <TextField
            label="Телефон *"
            placeholder="+38 (050) 000-00-00"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={update('phone')}
            error={errors.phone}
          />

          <View style={styles.group}>
            <Text style={styles.label}>Фото</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => showPrototypeNotice('Камера або галерея')}
              style={({ pressed }) => [styles.photo, pressed && { opacity: 0.7 }]}>
              <CameraIcon />
              <Text style={styles.photoLabel}>Камера або галерея</Text>
            </Pressable>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>Скарга / що з машиною</Text>
            <TextInput
              value={form.complaint}
              onChangeText={update('complaint')}
              placeholder="Стукіт при гальмуванні, потік масла..."
              placeholderTextColor={colors.placeholder}
              multiline
              style={styles.textarea}
            />
          </View>

          <View style={styles.switchRow}>
            <Switch
              value={withOrder}
              onValueChange={setWithOrder}
              trackColor={{ true: colors.amber, false: colors.placeholder }}
              thumbColor={colors.surface}
            />
            <Text style={styles.switchLabel}>Одразу створити наряд</Text>
          </View>

          {!!createCar.error && (
            <Text style={styles.submitError}>
              {createCar.error instanceof Error
                ? createCar.error.message
                : 'Не вдалося зберегти авто'}
            </Text>
          )}

          <Pressable
            accessibilityRole="button"
            disabled={createCar.isPending}
            onPress={submit}
            style={({ pressed }) => [
              styles.submit,
              (pressed || createCar.isPending) && { opacity: 0.85 },
            ]}>
            {createCar.isPending ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.submitLabel}>Зберегти авто</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    marginTop: spacing.sm,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  group: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  photo: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.placeholder,
    borderRadius: radius.md,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    gap: 6,
  },
  photoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textFaint,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.warningText,
  },
  submitError: {
    fontSize: 13,
    color: colors.dangerDark,
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
    color: colors.surface,
  },
});
