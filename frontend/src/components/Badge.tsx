import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../theme';

interface BadgeProps {
  label: string;
  tone?: 'solid' | 'outline' | 'muted';
  style?: ViewStyle;
}

export function Badge({ label, tone = 'outline', style }: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        tone === 'solid' && styles.solid,
        tone === 'outline' && styles.outline,
        tone === 'muted' && styles.muted,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          tone === 'solid' && styles.solidText,
          tone === 'outline' && styles.outlineText,
          tone === 'muted' && styles.mutedText,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.s,
    paddingVertical: 5,
    borderRadius: radii.s,
    alignSelf: 'flex-start',
  },
  solid: {
    backgroundColor: colors.black,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: 'transparent',
  },
  muted: {
    backgroundColor: colors.divider,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  solidText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.ink,
  },
  mutedText: {
    color: colors.textSecondary,
  },
});
