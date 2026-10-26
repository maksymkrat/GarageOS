import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius } from '@/theme/tokens';

export function PlateTag({ plate }: { plate: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{plate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm / 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.text,
    fontFamily: fontFamily.mono,
  },
});
