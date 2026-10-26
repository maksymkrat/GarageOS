import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowUpRightIcon } from '@/components/icons';
import { LogoMark } from '@/components/logo-mark';
import { Screen } from '@/components/ui/screen';
import { mockDueCount } from '@/lib/due-mock';
import { vocative } from '@/lib/format';
import { useSession } from '@/lib/session';
import { useClientVehicles } from '@/queries/use-client-vehicles';
import { useMyVehicles } from '@/queries/use-vehicles';
import { colors, radius, spacing } from '@/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { session, signOut } = useSession();
  const clientVehicles = useClientVehicles();
  const vehicles = useMyVehicles();

  const clientVehicleCount = clientVehicles.data?.length ?? 0;
  const inWorkCount =
    clientVehicles.data?.filter((vehicle) => vehicle.status === 'in_work').length ?? 0;
  const readyCount =
    clientVehicles.data?.filter((vehicle) => vehicle.status === 'ready').length ?? 0;
  const vehicleCount = vehicles.data?.length ?? 0;
  const dueCount = mockDueCount(vehicles.data);
  const firstName = vocative(session?.user.firstName ?? '');

  return (
    <Screen style={styles.screen}>
      <View style={styles.brandRow}>
        <LogoMark size={40} onDark />
        <View style={styles.brandText}>
          <Text style={styles.kicker}>WORKSPACE</Text>
          <Text style={styles.greeting}>Добрий день, {firstName}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={signOut}
          style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}>
          <Text style={styles.signOutLabel}>Вийти</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>
        Що відкриваємо{'\n'}
        <Text style={styles.titleAccent}>сьогодні?</Text>
      </Text>

      <View style={styles.cards}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/garage')}
          style={({ pressed }) => [styles.card, styles.serviceCard, pressed && styles.pressed]}>
          <View style={[styles.ring, styles.ringOuter]} />
          <View style={[styles.ring, styles.ringInner]} />

          <View style={styles.cardHead}>
            <Text style={styles.serviceKicker}>01 · SERVICE</Text>
            <View style={styles.arrow}>
              <ArrowUpRightIcon color={colors.cream} />
            </View>
          </View>

          <Text style={styles.serviceTitle}>Сервіс</Text>
          <Text style={styles.serviceBody}>Клієнтські авто, наряди, гроші та нагадування</Text>

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
            <Text style={styles.personalKicker}>02 · MY GARAGE</Text>
            <View style={styles.arrow}>
              <ArrowUpRightIcon color={colors.cream} />
            </View>
          </View>

          <Text style={styles.personalTitle}>Мій гараж</Text>
          <Text style={styles.personalBody}>
            Особиста техніка: що, коли й на якому пробігу замінено
          </Text>

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
    gap: spacing.md,
  },
  brandText: {
    flex: 1,
  },
  signOut: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.fill,
  },
  signOutLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.textFaint,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  title: {
    marginTop: 40,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.text,
  },
  titleAccent: {
    color: colors.orange,
  },
  cards: {
    marginTop: spacing.xxxl,
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.sheet,
    padding: spacing.xl,
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
    marginTop: 40,
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  personalTitle: {
    marginTop: 40,
    fontSize: 26,
    fontWeight: '700',
    color: colors.ink,
  },
  serviceBody: {
    marginTop: spacing.sm,
    fontSize: 13,
    maxWidth: 220,
    color: 'rgba(237, 232, 223, 0.6)',
  },
  personalBody: {
    marginTop: spacing.sm,
    fontSize: 13,
    maxWidth: 220,
    color: colors.warmBody,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
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
