import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowUpRightIcon, ExitIcon } from '@/components/icons';
import { LogoMark } from '@/components/logo-mark';
import { Screen } from '@/components/ui/screen';
import { mockDueCount } from '@/lib/due-mock';
import { useSession } from '@/lib/session';
import { useClientVehicles } from '@/queries/use-client-vehicles';
import { useMyVehicles } from '@/queries/use-vehicles';
import { colors, radius, spacing } from '@/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useSession();
  const clientVehicles = useClientVehicles();
  const vehicles = useMyVehicles();

  const clientVehicleCount = clientVehicles.data?.length ?? 0;
  const inWorkCount =
    clientVehicles.data?.filter((vehicle) => vehicle.status === 'in_work').length ?? 0;
  const readyCount =
    clientVehicles.data?.filter((vehicle) => vehicle.status === 'ready').length ?? 0;
  const vehicleCount = vehicles.data?.length ?? 0;
  const dueCount = mockDueCount(vehicles.data);

  return (
    <Screen style={styles.screen}>
      <View style={styles.brandRow}>
        <LogoMark size={40} onDark />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Вийти"
          hitSlop={8}
          onPress={signOut}
          style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}>
          <ExitIcon color={colors.amber} />
        </Pressable>
      </View>

      <View style={styles.cards}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/garage')}
          style={({ pressed }) => [styles.card, styles.serviceCard, pressed && styles.pressed]}>
          <View style={[styles.ring, styles.ringOuter]} />
          <View style={[styles.ring, styles.ringInner]} />

          <View style={styles.cardHead}>
            <Text style={styles.serviceKicker}>01</Text>
            <View style={styles.arrow}>
              <ArrowUpRightIcon color={colors.cream} />
            </View>
          </View>

          <Text style={styles.serviceTitle}>Сервіс</Text>

          <View style={[styles.stats, styles.serviceStats]}>
            <Stat value={clientVehicleCount} label="авто" onDark />
            <Stat value={inWorkCount} label="в роботі" onDark />
            <Stat value={readyCount} label="готові" onDark accent />
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/personal')}
          style={({ pressed }) => [styles.card, styles.personalCard, pressed && styles.pressed]}>
          <View style={styles.cardHead}>
            <Text style={styles.personalKicker}>02</Text>
            <View style={styles.arrow}>
              <ArrowUpRightIcon color={colors.cream} />
            </View>
          </View>

          <Text style={styles.personalTitle}>Гараж</Text>

          <View style={[styles.stats, styles.personalStats]}>
            <Stat value={vehicleCount} label="одиниці" />
            <Stat value={dueCount} label="потребує уваги" accent />
          </View>
        </Pressable>
      </View>

      <Text style={styles.footer}>Більше розділів — незабаром</Text>
    </Screen>
  );
}

interface StatProps {
  value: number;
  label: string;
  onDark?: boolean;
  accent?: boolean;
}

function Stat({ value, label, onDark, accent }: StatProps) {
  const valueColor = accent ? colors.orange : onDark ? colors.cream : colors.ink;
  const labelColor = onDark ? 'rgba(237, 232, 223, 0.5)' : colors.warmMuted;

  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: labelColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // The square of the Back and Home buttons on every other screen.
  signOut: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cards: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  personalCard: {
    backgroundColor: colors.warmSurface,
    borderWidth: 1,
    borderColor: colors.warmBorder,
  },
  ring: {
    position: 'absolute',
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  ringOuter: {
    width: 144,
    height: 144,
    right: -24,
    top: -24,
    borderColor: 'rgba(201, 123, 34, 0.3)',
  },
  ringInner: {
    width: 208,
    height: 208,
    right: -56,
    top: -56,
    borderColor: 'rgba(201, 123, 34, 0.15)',
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceKicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.orange,
  },
  personalKicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.warmMuted,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    marginTop: spacing.lg,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  personalTitle: {
    marginTop: spacing.lg,
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  serviceStats: {
    borderTopColor: 'rgba(237, 232, 223, 0.1)',
  },
  personalStats: {
    borderTopColor: 'rgba(26, 23, 20, 0.1)',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: 11,
    color: colors.textFaint,
  },
});
