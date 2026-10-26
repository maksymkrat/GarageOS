import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { orderPhotoSource } from '@/api/orders';
import { CameraIcon } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PickerDialog } from '@/components/ui/picker-dialog';
import { SectionTitle } from '@/components/ui/section-title';
import { VehicleImage } from '@/components/ui/vehicle-image';
import { usePhotoActions, type PhotoAction } from '@/hooks/use-photo-actions';
import { useAddOrderPhoto, useDeleteOrderPhoto } from '@/queries/use-orders';
import { colors, radius, spacing } from '@/theme/tokens';
import type { OrderPhoto } from '@/types/domain';
import { useState } from 'react';

interface OrderPhotosProps {
  orderId: number;
  photos: OrderPhoto[];
}

// A gallery, not a single picture: adding appends, and removing is per photo,
// so the picker offers only Camera and Gallery while a tap on a thumbnail asks
// about that one (ADR-0027).
export function OrderPhotos({ orderId, photos }: OrderPhotosProps) {
  const add = useAddOrderPhoto(orderId);
  const remove = useDeleteOrderPhoto(orderId);

  const [target, setTarget] = useState<number | null>(null);

  const picker = usePhotoActions(add.mutateAsync, null, { multiple: true });
  const busy = picker.busy || remove.isPending;

  return (
    <Card style={styles.block}>
      <SectionTitle style={styles.blockTitle}>Фото</SectionTitle>

      {photos.length === 0 && <Text style={styles.empty}>Фото ще немає</Text>}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {photos.map((photo) => (
          <Pressable
            key={photo.id}
            accessibilityRole="button"
            accessibilityLabel="Видалити фото"
            disabled={busy}
            onPress={() => setTarget(photo.id)}
            style={({ pressed }) => pressed && { opacity: 0.7 }}>
            <VehicleImage
              source={orderPhotoSource(orderId, photo.id, 'thumb')}
              style={styles.thumb}
            />
          </Pressable>
        ))}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Додати фото"
          disabled={busy}
          onPress={picker.start}
          style={({ pressed }) => [styles.add, (pressed || busy) && { opacity: 0.7 }]}>
          {busy ? (
            <ActivityIndicator color={colors.textMuted} />
          ) : (
            <View style={styles.addInner}>
              <CameraIcon size={20} />
              <Text style={styles.addLabel}>+ Фото</Text>
            </View>
          )}
        </Pressable>
      </ScrollView>

      {!!remove.error && (
        <Text style={styles.error}>
          {remove.error instanceof Error ? remove.error.message : 'Не вдалося'}
        </Text>
      )}

      <PickerDialog
        visible={picker.open}
        title="Додати фото"
        options={picker.options}
        value={'' as PhotoAction}
        busy={picker.busy}
        onPick={picker.run}
        onCancel={picker.close}
      />

      <ConfirmDialog
        visible={target !== null}
        title="Видалити фото?"
        body="Фото зникне з наряду назавжди."
        confirmLabel="Видалити"
        onConfirm={() => {
          const id = target;
          setTarget(null);

          if (id !== null) remove.mutate(id);
        }}
        onCancel={() => setTarget(null)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  block: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  blockTitle: {
    marginBottom: 10,
  },
  empty: {
    fontSize: 13,
    color: colors.textFaint,
    marginBottom: spacing.sm,
  },
  row: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
  },
  add: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addInner: {
    alignItems: 'center',
    gap: 4,
  },
  addLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.dangerOnInk,
  },
});
