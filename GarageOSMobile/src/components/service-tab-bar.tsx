import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BellIcon, HomeIcon, MoneyIcon, ToolboxIcon, type IconProps } from '@/components/icons';
import { colors } from '@/theme/tokens';

const TAB_META: Record<string, { label: string; Icon: ComponentType<IconProps> }> = {
  garage: { label: 'Гараж', Icon: HomeIcon },
  work: { label: 'В роботі', Icon: ToolboxIcon },
  money: { label: 'Гроші', Icon: MoneyIcon },
  reminders: { label: 'Нагадування', Icon: BellIcon },
};

export function ServiceTabBar({ state, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const meta = TAB_META[route.name];
        if (!meta) return null;

        const focused = state.index === index;
        const color = focused ? colors.amber : colors.textFaint;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.label}
            onPress={() => {
              if (!focused) navigation.navigate(route.name);
            }}
            style={styles.item}>
            <meta.Icon color={color} />
            <Text style={[styles.label, { color }]}>{meta.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingTop: 10,
    paddingBottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
});
