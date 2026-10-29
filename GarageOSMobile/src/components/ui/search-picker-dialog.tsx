import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { SearchIcon } from '@/components/icons';
import { colors, onInk, radius, shadows, spacing } from '@/theme/tokens';

interface SearchPickerDialogProps {
  visible: boolean;
  title: string;
  searchPlaceholder: string;
  options: readonly string[];
  value: string;
  emptyText: string;
  allowCustom?: boolean;
  match?: (option: string, query: string) => boolean;
  onPick: (value: string) => void;
  onCancel: () => void;
}

export function SearchPickerDialog(props: SearchPickerDialogProps) {
  if (!props.visible) return null;

  return <OpenPicker {...props} />;
}

function OpenPicker({
  title,
  searchPlaceholder,
  options,
  value,
  emptyText,
  allowCustom = false,
  match,
  onPick,
  onCancel,
}: SearchPickerDialogProps) {
  const [query, setQuery] = useState('');

  const trimmed = query.trim();
  const needle = trimmed.toLowerCase();

  const found = needle
    ? options.filter((option) =>
        match ? match(option, needle) : option.toLowerCase().includes(needle)
      )
    : options;

  const custom =
    allowCustom && trimmed && !options.some((option) => option.toLowerCase() === needle)
      ? trimmed
      : null;

  return (
    <Modal
      visible
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Закрити"
          onPress={onCancel}
          style={styles.backdrop}
        />

        <View accessibilityViewIsModal style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.search}>
            <SearchIcon />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.textFaint}
              style={styles.searchInput}
            />
          </View>

          {custom !== null && (
            <Pressable
              accessibilityRole="button"
              onPress={() => onPick(custom)}
              style={({ pressed }) => [styles.option, styles.custom, pressed && styles.pressed]}>
              <Text style={styles.customLabel} numberOfLines={1}>
                Використати «{custom}»
              </Text>
            </Pressable>
          )}

          {found.length === 0 && custom === null ? (
            <Text style={styles.empty}>{emptyText}</Text>
          ) : (
            <FlatList
              data={found}
              keyExtractor={(option) => option}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const active = item === value;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => onPick(item)}
                    style={({ pressed }) => [
                      styles.option,
                      active && styles.optionActive,
                      pressed && styles.pressed,
                    ]}>
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                      {item}
                    </Text>
                    {active && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                );
              }}
            />
          )}

          <Pressable
            accessibilityRole="button"
            onPress={onCancel}
            style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}>
            <Text style={styles.cancelLabel}>Скасувати</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(10, 8, 6, 0.72)',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.inkSoft,
    borderRadius: radius.sheet,
    borderWidth: 1,
    borderColor: onInk.border,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.dialog,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: onInk.border,
    backgroundColor: onInk.fill,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  list: {
    maxHeight: 280,
  },
  listContent: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: onInk.border,
  },
  optionActive: {
    borderColor: colors.amber,
    backgroundColor: colors.warningBg,
  },
  custom: {
    borderStyle: 'dashed',
    borderColor: colors.amber,
  },
  customLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.amberOnDark,
  },
  pressed: {
    opacity: 0.85,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textBody,
  },
  optionLabelActive: {
    fontWeight: '700',
    color: colors.text,
  },
  check: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.amberOnDark,
  },
  empty: {
    fontSize: 13,
    color: colors.textFaint,
    paddingVertical: spacing.sm,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: onInk.border,
  },
  cancelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
