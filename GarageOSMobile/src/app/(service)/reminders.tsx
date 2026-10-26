import { useRouter } from 'expo-router';
import { FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { ChevronRightIcon, PhoneIcon } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { EmptyState, QueryState } from '@/components/ui/query-state';
import { PlateTag } from '@/components/ui/plate-tag';
import { HomeButton } from '@/components/ui/nav-button';
import { Screen } from '@/components/ui/screen';
import { useReminders } from '@/queries/use-reminders';
import { colors, radius, spacing } from '@/theme/tokens';

export default function RemindersTab() {
  const router = useRouter();
  const reminders = useReminders();

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <HomeButton />
        <View>
          <Text style={styles.kicker}>ПЛАНОВІ</Text>
          <Text style={styles.title}>Нагадування</Text>
        </View>
      </View>

      <QueryState query={reminders}>
        {(items) =>
          items.length === 0 ? (
            <EmptyState text="Немає запланованих нагадувань" />
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <Card style={[styles.card, item.overdue && styles.overdueCard]}>
                  <View style={styles.row}>
                    <View style={styles.main}>
                      <PlateTag plate={item.plate} />
                      <Text style={styles.owner}>{item.owner}</Text>
                      <Text style={[styles.what, item.overdue && styles.overdueText]}>
                        {item.what}
                      </Text>
                    </View>

                    <View style={styles.actions}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Відкрити авто"
                        onPress={() => router.push(`/client-vehicles/${item.clientVehicleId}`)}
                        style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}>
                        <ChevronRightIcon size={15} color={colors.textBody} />
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Подзвонити"
                        onPress={() => Linking.openURL(`tel:${item.phone}`)}
                        style={({ pressed }) => [
                          styles.action,
                          styles.callAction,
                          pressed && { opacity: 0.7 },
                        ]}>
                        <PhoneIcon />
                      </Pressable>
                    </View>
                  </View>
                </Card>
              )}
            />
          )
        }
      </QueryState>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.textFaint,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: 10,
  },
  card: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  main: {
    flex: 1,
    gap: 4,
  },
  owner: {
    fontSize: 12,
    color: colors.textMuted,
  },
  what: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textBody,
  },
  overdueText: {
    color: colors.dangerOnInk,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginLeft: spacing.md,
  },
  action: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callAction: {
    backgroundColor: colors.successBg,
  },
});
