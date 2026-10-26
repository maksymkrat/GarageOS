import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { myVehiclePhotoSource } from '@/api/vehicles';
import { CameraIcon, CarGlyph } from '@/components/icons';
import { ModeHeader } from '@/components/mode-header';
import { PressableCard } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';
import { PickerDialog } from '@/components/ui/picker-dialog';
import { QueryState } from '@/components/ui/query-state';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { usePhotoActions, type PhotoAction } from '@/hooks/use-photo-actions';
import { mockDue } from '@/lib/due-mock';
import { formatMileage, formatMoney, formatNumber, mileageUnitLabel } from '@/lib/format';
import {
  useDeleteMyVehiclePhoto,
  useMyVehicle,
  useSetMyVehiclePhoto,
} from '@/queries/use-vehicles';
import type { MyVehicle } from '@/types/domain';
import { LOG_KIND_COLOR } from '@/theme/status';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';

export default function MyVehicleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicle = useMyVehicle(Number(id));

  return (
    <Screen>
      <ModeHeader title="My Garage" />

      <QueryState query={vehicle}>
        {(item) => {
          const spent = item.log.reduce((sum, entry) => sum + entry.cost, 0);
          const due = mockDue(item);

          return (
            <ScrollView contentContainerStyle={styles.body}>
              <View style={styles.headerRow}>
                <BackButton fallback="/personal" />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push(`/personal/edit?vehicleId=${item.id}`)}
                  style={({ pressed }) => pressed && { opacity: 0.7 }}>
                  <Text style={styles.editVehicle}>Змінити</Text>
                </Pressable>
              </View>

              <View style={styles.hero}>
                <View style={styles.heroInfo}>
                  <Text style={styles.heroKicker}>
                    {item.kind.toUpperCase()} · {item.year}
                  </Text>
                  <Text style={styles.heroTitle}>{item.name}</Text>
                  <Text style={styles.heroMileage}>
                    {formatNumber(item.mileage)}
                    <Text style={styles.heroUnit}> {mileageUnitLabel(item.mileageUnit)}</Text>
                  </Text>

                  {!!due && (
                    <View style={styles.dueChip}>
                      <Text style={styles.dueLabel}>⚠ {due}</Text>
                    </View>
                  )}
                </View>

                <MyVehiclePhoto vehicle={item} />
              </View>

              <View style={styles.logHead}>
                <SectionTitle>Історія обслуговування</SectionTitle>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push(`/personal/log/new?vehicleId=${item.id}`)}
                  style={({ pressed }) => pressed && { opacity: 0.7 }}>
                  <Text style={styles.addEntry}>+ Запис</Text>
                </Pressable>
              </View>

              <View style={styles.timeline}>
                <View style={styles.timelineLine} />

                {item.log.map((entry) => (
                  <View key={entry.id} style={styles.entryRow}>
                    <View
                      style={[styles.entryDot, { backgroundColor: LOG_KIND_COLOR[entry.kind] }]}
                    />

                    <PressableCard
                      accessibilityLabel={`Змінити запис: ${entry.note}`}
                      onPress={() =>
                        router.push(
                          `/personal/log/edit?vehicleId=${item.id}&entryId=${entry.id}`
                        )
                      }
                      style={styles.entryCard}>
                      <View style={styles.entryTop}>
                        <Text style={styles.entryTitle}>{entry.note}</Text>
                        <Text style={styles.entryCost}>{formatMoney(entry.cost)}</Text>
                      </View>

                      <Text style={styles.entryMeta}>
                        {entry.date}
                        {entry.mileage !== undefined &&
                          ` · ${formatMileage(entry.mileage, entry.mileageUnit)}`}
                      </Text>
                    </PressableCard>
                  </View>
                ))}
              </View>

              <Text style={styles.total}>
                Усього витрачено: <Text style={styles.totalValue}>{formatMoney(spent)}</Text>
              </Text>
            </ScrollView>
          );
        }}
      </QueryState>
    </Screen>
  );
}


// Inside the hero block rather than behind it: the stored photo is square
// (ADR-0026), so a square slot shows all of it instead of cropping a band out
// of the middle the way the customer card's header does.
function MyVehiclePhoto({ vehicle }: { vehicle: MyVehicle }) {
  const save = useSetMyVehiclePhoto(vehicle.id);
  const remove = useDeleteMyVehiclePhoto(vehicle.id);

  const photo = usePhotoActions(
    save.mutateAsync,
    vehicle.photoId === undefined ? null : remove.mutateAsync
  );

  return (
    <View style={styles.photoSlot}>
      <View style={[styles.photo, vehicle.photoId === undefined && styles.photoEmpty]}>
        <CarGlyph size={64} color={colors.placeholder} />
      </View>

      {vehicle.photoId !== undefined && (
        <Image
          source={myVehiclePhotoSource(vehicle.id, vehicle.photoId, 'full')}
          contentFit="cover"
          cachePolicy="memory-disk"
          style={styles.photoImage}
        />
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={vehicle.photoId === undefined ? 'Додати фото' : 'Змінити фото'}
        disabled={photo.busy}
        hitSlop={8}
        onPress={photo.start}
        style={({ pressed }) => [styles.photoButton, (pressed || photo.busy) && { opacity: 0.7 }]}>
        {photo.busy ? (
          <ActivityIndicator size="small" color={colors.cream} />
        ) : (
          <CameraIcon size={18} color={colors.cream} />
        )}
      </Pressable>

      <PickerDialog
        visible={photo.open}
        title="Фото техніки"
        options={photo.options}
        value={'' as PhotoAction}
        busy={photo.busy}
        onPick={photo.run}
        onCancel={photo.close}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  editVehicle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.amber,
  },
  hero: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  // Two equal halves. `flex: 1` on both rather than a width, so the split holds
  // on any screen; the text sizes below are tuned for the narrower column.
  heroInfo: {
    flex: 1,
  },
  photoSlot: {
    flex: 1,
  },
  // Square, so the whole stored picture is visible — the hero's own padding
  // frames it.
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoEmpty: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  photoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.lg,
  },
  photoButton: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 23, 20, 0.55)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroKicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.orange,
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  heroMileage: {
    marginTop: spacing.md,
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    fontFamily: fontFamily.mono,
  },
  heroUnit: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textMuted,
    fontFamily: fontFamily.sans,
  },
  dueChip: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(201, 123, 34, 0.15)',
  },
  dueLabel: {
    fontSize: 12,
    color: colors.warningOnInk,
  },
  logHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  addEntry: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warningOnInk,
  },
  timeline: {
    marginHorizontal: spacing.lg,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: spacing.sm,
    bottom: spacing.sm,
    width: 1,
    backgroundColor: colors.borderSoft,
  },
  entryRow: {
    paddingLeft: 28,
    paddingBottom: spacing.lg,
  },
  entryDot: {
    position: 'absolute',
    left: 0,
    top: spacing.lg,
    width: 15,
    height: 15,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.bg,
  },
  entryCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  entryTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  entryCost: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  entryMeta: {
    marginTop: spacing.sm,
    fontSize: 11,
    color: colors.textFaint,
    fontFamily: fontFamily.mono,
  },
  total: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textFaint,
  },
  totalValue: {
    fontWeight: '700',
    color: colors.text,
  },
});
