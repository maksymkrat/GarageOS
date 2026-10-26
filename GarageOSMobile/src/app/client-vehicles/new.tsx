import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

import type { UploadFile } from '@/api/client';
import { CameraIcon } from '@/components/icons';
import { BackButton } from '@/components/ui/nav-button';
import { PickerDialog } from '@/components/ui/picker-dialog';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { usePhotoActions, type PhotoAction } from '@/hooks/use-photo-actions';
import {
  useCreateClientVehicle,
  useSetNewClientVehiclePhoto,
} from '@/queries/use-client-vehicles';
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

export default function NewClientVehicleScreen() {
  const router = useRouter();
  const createVehicle = useCreateClientVehicle();
  const uploadPhoto = useSetNewClientVehiclePhoto();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [withOrder, setWithOrder] = useState(true);

  // Held locally until the car exists: the upload endpoint is addressed by the
  // car's id, and there is no id before the POST comes back.
  const [photo, setPhoto] = useState<UploadFile | null>(null);

  // The same flow as on a car's card, except "saving" here only parks the file
  // in state: there is no id to upload against until the POST comes back.
  const photoActions = usePhotoActions(
    async (file) => setPhoto(file),
    photo === null ? null : async () => setPhoto(null)
  );

  const update = (field: keyof FormState) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  async function submit() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const vehicle = await createVehicle.mutateAsync({
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

    if (photo !== null) {
      try {
        await uploadPhoto.mutateAsync({ id: vehicle.id, file: photo });
      } catch (cause) {
        // The car is saved by now, so a failed photo must not read as a failed
        // save. Alert survives the navigation that follows; an inline error on
        // this screen would not.
        Alert.alert(
          'Фото',
          `Авто збережено, але фото не завантажилось: ${
            cause instanceof Error ? cause.message : 'не вдалося'
          }. Додайте його з картки авто.`
        );
      }
    }

    router.replace(`/client-vehicles/${vehicle.id}`);
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
              accessibilityLabel="Камера або галерея"
              onPress={photoActions.start}
              style={({ pressed }) => [
                photo === null ? styles.photo : styles.photoFrame,
                pressed && { opacity: 0.7 },
              ]}>
              {photo === null ? (
                <>
                  <CameraIcon />
                  <Text style={styles.photoLabel}>Камера або галерея</Text>
                </>
              ) : (
                <Image source={{ uri: photo.uri }} contentFit="cover" style={styles.photoPreview} />
              )}
            </Pressable>

            <PickerDialog
              visible={photoActions.open}
              title="Фото авто"
              options={photoActions.options}
              value={'' as PhotoAction}
              busy={photoActions.busy}
              onPick={photoActions.run}
              onCancel={photoActions.close}
            />
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
              thumbColor={colors.onAccent}
            />
            <Text style={styles.switchLabel}>Одразу створити наряд</Text>
          </View>

          {!!createVehicle.error && (
            <Text style={styles.submitError}>
              {createVehicle.error instanceof Error
                ? createVehicle.error.message
                : 'Не вдалося зберегти авто'}
            </Text>
          )}

          <Pressable
            accessibilityRole="button"
            disabled={createVehicle.isPending}
            onPress={submit}
            style={({ pressed }) => [
              styles.submit,
              (pressed || createVehicle.isPending) && { opacity: 0.85 },
            ]}>
            {createVehicle.isPending ? (
              <ActivityIndicator color={colors.onAccent} />
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
  photoFrame: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.fill,
  },
  // Square: the picker crops to 1:1, so the preview shows exactly what will be
  // stored (ADR-0026).
  photoPreview: {
    width: '100%',
    aspectRatio: 1,
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
});
