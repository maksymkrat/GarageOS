import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { UploadFile } from '@/api/client';
import { CameraIcon } from '@/components/icons';
import { ChipRow } from '@/components/ui/chip-row';
import { PickerDialog } from '@/components/ui/picker-dialog';
import { SectionTitle } from '@/components/ui/section-title';
import { TextArea } from '@/components/ui/text-area';
import { TextField } from '@/components/ui/text-field';
import { VehicleImage } from '@/components/ui/vehicle-image';
import { usePhotoActions, type PhotoAction } from '@/hooks/use-photo-actions';
import { formatMoney, parseMoney } from '@/lib/format';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { OrderPartInput, OrderWorkInput, PaymentStatus } from '@/types/domain';

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'unpaid', label: 'Не оплачено' },
  { value: 'paid', label: 'Оплачено' },
];

export interface OrderFormValues {
  description: string;
  works: OrderWorkInput[];
  parts: OrderPartInput[];
}

interface WorkRow {
  description: string;
  price: string;
  paymentStatus: PaymentStatus;
}

interface PartRow {
  description: string;
  buy: string;
  sell: string;
  paymentStatus: PaymentStatus;
}

interface LineErrors {
  description?: string;
  price?: string;
  buy?: string;
  sell?: string;
}

interface FormErrors {
  description?: string;
  works: LineErrors[];
  parts: LineErrors[];
}

const EMPTY_WORK: WorkRow = { description: '', price: '', paymentStatus: 'unpaid' };
const EMPTY_PART: PartRow = { description: '', buy: '', sell: '', paymentStatus: 'unpaid' };

function money(value: string): number {
  return parseMoney(value) ?? 0;
}

function hasErrors(errors: FormErrors): boolean {
  if (errors.description) return true;

  return [...errors.works, ...errors.parts].some((line) => Object.keys(line).length > 0);
}

function validate(description: string, works: WorkRow[], parts: PartRow[]): FormErrors {
  const errors: FormErrors = { works: [], parts: [] };

  if (!description.trim()) errors.description = 'Опишіть, з чим приїхало авто';

  for (const work of works) {
    const line: LineErrors = {};
    if (!work.description.trim()) line.description = 'Вкажіть, що зроблено';
    if (parseMoney(work.price) === null) line.price = 'Вкажіть ціну, напр. 1250 або 1250,50';
    errors.works.push(line);
  }

  for (const part of parts) {
    const line: LineErrors = {};
    if (!part.description.trim()) line.description = 'Вкажіть назву деталі';
    if (parseMoney(part.buy) === null) line.buy = 'Вкажіть закупку';
    if (parseMoney(part.sell) === null) line.sell = 'Вкажіть продаж';
    errors.parts.push(line);
  }

  return errors;
}

interface OrderFormProps {
  initial?: OrderFormValues;
  submitLabel: string;
  pending: boolean;
  error: unknown;
  onSubmit: (values: OrderFormValues) => void;
  children?: ReactNode;

  // Photos stay outside OrderFormValues because they are not part of
  // CreateOrderInput: they upload one by one after the order exists, so the
  // screen holds them and only lends them to the form (ADR-0027).
  photos?: UploadFile[];
  // Takes an updater, not a value: a batch pick calls it once per file before
  // React has re-rendered, so appending to a captured array would keep only the
  // last photo.
  onPhotos?: Dispatch<SetStateAction<UploadFile[]>>;
}

export function OrderForm({
  initial,
  submitLabel,
  pending,
  error,
  onSubmit,
  photos,
  onPhotos,
  children,
}: OrderFormProps) {
  const [description, setDescription] = useState(initial?.description ?? '');
  const [works, setWorks] = useState<WorkRow[]>(() =>
    (initial?.works ?? []).map((work) => ({
      description: work.description,
      price: String(work.price).replace('.', ','),
      paymentStatus: work.paymentStatus,
    }))
  );
  const [parts, setParts] = useState<PartRow[]>(() =>
    (initial?.parts ?? []).map((part) => ({
      description: part.description,
      buy: String(part.buy).replace('.', ','),
      sell: String(part.sell).replace('.', ','),
      paymentStatus: part.paymentStatus,
    }))
  );
  const [errors, setErrors] = useState<FormErrors>({ works: [], parts: [] });

  const worksTotal = works.reduce((sum, work) => sum + money(work.price), 0);
  const partsTotal = parts.reduce((sum, part) => sum + money(part.sell), 0);

  function patchWork(index: number, patch: Partial<WorkRow>) {
    setWorks((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function patchPart(index: number, patch: Partial<PartRow>) {
    setParts((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function submit() {
    const found = validate(description, works, parts);
    setErrors(found);
    if (hasErrors(found)) return;

    onSubmit({
      description: description.trim(),
      works: works.map((work) => ({
        description: work.description.trim(),
        price: money(work.price),
        paymentStatus: work.paymentStatus,
      })),
      parts: parts.map((part) => ({
        description: part.description.trim(),
        buy: money(part.buy),
        sell: money(part.sell),
        paymentStatus: part.paymentStatus,
      })),
    });
  }

  return (
    <>
      <TextArea
        label="Скарга / що з машиною *"
        placeholder="Стукіт при гальмуванні, тече масло…"
        value={description}
        onChangeText={setDescription}
        error={errors.description}
      />

      <SectionTitle style={styles.section}>Роботи</SectionTitle>

      {works.map((work, index) => (
        <LineCard
          key={`work-${index}`}
          title={`Робота ${index + 1}`}
          onRemove={() => setWorks((current) => current.filter((_, i) => i !== index))}>
          <TextField
            label="Що зроблено *"
            placeholder="Заміна гальмівних колодок"
            value={work.description}
            onChangeText={(value) => patchWork(index, { description: value })}
            error={errors.works[index]?.description}
          />
          <TextField
            label="Ціна, ₴ *"
            placeholder="1 200"
            keyboardType="decimal-pad"
            value={work.price}
            onChangeText={(value) => patchWork(index, { price: value })}
            error={errors.works[index]?.price}
          />
          <ChipRow
            label="Оплата"
            options={PAYMENT_OPTIONS}
            value={work.paymentStatus}
            onChange={(value) => patchWork(index, { paymentStatus: value })}
          />
        </LineCard>
      ))}

      <AddButton label="Додати роботу" onPress={() => setWorks((c) => [...c, { ...EMPTY_WORK }])} />

      <SectionTitle style={styles.section}>Запчастини</SectionTitle>

      {parts.map((part, index) => (
        <LineCard
          key={`part-${index}`}
          title={`Деталь ${index + 1}`}
          onRemove={() => setParts((current) => current.filter((_, i) => i !== index))}>
          <TextField
            label="Назва *"
            placeholder="Колодки передні Akebono"
            value={part.description}
            onChangeText={(value) => patchPart(index, { description: value })}
            error={errors.parts[index]?.description}
          />
          <TextField
            label="Закупка, ₴ *"
            placeholder="900"
            keyboardType="decimal-pad"
            value={part.buy}
            onChangeText={(value) => patchPart(index, { buy: value })}
            error={errors.parts[index]?.buy}
          />
          <TextField
            label="Продаж, ₴ *"
            placeholder="1 350"
            keyboardType="decimal-pad"
            value={part.sell}
            onChangeText={(value) => patchPart(index, { sell: value })}
            error={errors.parts[index]?.sell}
          />
          <ChipRow
            label="Оплата"
            options={PAYMENT_OPTIONS}
            value={part.paymentStatus}
            onChange={(value) => patchPart(index, { paymentStatus: value })}
          />
        </LineCard>
      ))}

      <AddButton label="Додати деталь" onPress={() => setParts((c) => [...c, { ...EMPTY_PART }])} />

      {photos !== undefined && onPhotos !== undefined && (
        <PickedPhotos photos={photos} onPhotos={onPhotos} />
      )}

      <View style={styles.totals}>
        <Total label="Роботи" value={worksTotal} />
        <Total label="Деталі" value={partsTotal} />
        <Total label="Усього" value={worksTotal + partsTotal} strong />
      </View>

      {!!error && (
        <Text style={styles.error}>
          {error instanceof Error ? error.message : 'Не вдалося зберегти наряд'}
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


// Before the order exists there is nothing to upload against, so the files are
// only parked in state and the screen sends them once the POST comes back.
function PickedPhotos({
  photos,
  onPhotos,
}: {
  photos: UploadFile[];
  onPhotos: Dispatch<SetStateAction<UploadFile[]>>;
}) {
  // Appends one by one, so a batch arrives in the order it was picked.
  const picker = usePhotoActions(
    async (file) => onPhotos((current) => [...current, file]),
    null,
    { multiple: true }
  );

  return (
    <>
      <SectionTitle style={styles.section}>Фото</SectionTitle>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photoRow}>
        {photos.map((photo, index) => (
          <Pressable
            key={photo.uri}
            accessibilityRole="button"
            accessibilityLabel="Прибрати фото"
            onPress={() => onPhotos((current) => current.filter((_, at) => at !== index))}
            style={({ pressed }) => pressed && { opacity: 0.7 }}>
            <VehicleImage source={{ uri: photo.uri }} style={styles.photoThumb} />
          </Pressable>
        ))}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Додати фото"
          disabled={picker.busy}
          onPress={picker.start}
          style={({ pressed }) => [
            styles.photoAdd,
            (pressed || picker.busy) && { opacity: 0.7 },
          ]}>
          {picker.busy ? (
            <ActivityIndicator color={colors.textMuted} />
          ) : (
            <View style={styles.photoAddInner}>
              <CameraIcon size={20} />
              <Text style={styles.photoAddLabel}>+ Фото</Text>
            </View>
          )}
        </Pressable>
      </ScrollView>

      <PickerDialog
        visible={picker.open}
        title="Додати фото"
        options={picker.options}
        value={'' as PhotoAction}
        busy={picker.busy}
        onPick={picker.run}
        onCancel={picker.close}
      />
    </>
  );
}

interface LineCardProps {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}

function LineCard({ title, onRemove, children }: LineCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Прибрати: ${title}`}
          hitSlop={8}
          onPress={onRemove}
          style={({ pressed }) => pressed && { opacity: 0.7 }}>
          <Text style={styles.remove}>Прибрати</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

function AddButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.add, pressed && { opacity: 0.7 }]}>
      <Text style={styles.addLabel}>+ {label}</Text>
    </Pressable>
  );
}

function Total({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <View style={styles.totalRow}>
      <Text style={[styles.totalLabel, strong && styles.totalStrong]}>{label}</Text>
      <Text style={[styles.totalValue, strong && styles.totalStrong]}>{formatMoney(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  photoRow: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  photoThumb: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
  },
  photoAdd: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAddInner: {
    alignItems: 'center',
    gap: 4,
  },
  photoAddLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  section: {
    marginTop: spacing.sm,
  },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  remove: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dangerOnInk,
  },
  add: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  addLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  totals: {
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.fill,
    gap: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: 13,
    color: colors.text,
  },
  totalStrong: {
    fontWeight: '700',
    color: colors.text,
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
