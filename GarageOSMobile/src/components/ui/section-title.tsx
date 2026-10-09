import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { colors } from '@/theme/tokens';

interface SectionTitleProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

export function SectionTitle({ children, style }: SectionTitleProps) {
  return <Text style={[styles.title, style]}>{children.toUpperCase()}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: colors.textFaint,
  },
});
