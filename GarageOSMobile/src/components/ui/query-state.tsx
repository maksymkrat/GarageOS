import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

export interface QueryLike<T> {
  data: T | undefined;
  isPending: boolean;
  error: unknown;
  refetch: () => void;
}

interface QueryStateProps<T> {
  query: QueryLike<T>;
  children: (data: T) => ReactNode;
}

/** Renders the shared pending / failed states so screens only describe success. */
export function QueryState<T>({ query, children }: QueryStateProps<T>) {
  if (query.isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.amber} />
      </View>
    );
  }

  if (query.error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Не вдалося завантажити</Text>
        <Text style={styles.errorBody}>
          {query.error instanceof Error ? query.error.message : 'Спробуйте ще раз'}
        </Text>
        <Pressable
          onPress={query.refetch}
          accessibilityRole="button"
          style={({ pressed }) => [styles.retry, pressed && { opacity: 0.8 }]}>
          <Text style={styles.retryLabel}>Повторити</Text>
        </Pressable>
      </View>
    );
  }

  if (query.data === undefined) return null;

  return <>{children(query.data)}</>;
}

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.centered}>
      <Text style={styles.empty}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  errorBody: {
    fontSize: 13,
    color: colors.textFaint,
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.amber,
  },
  retryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.surface,
  },
  empty: {
    fontSize: 14,
    color: colors.textFaint,
  },
});
