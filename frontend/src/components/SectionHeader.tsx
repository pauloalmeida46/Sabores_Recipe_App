import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface SectionHeaderProps {
  label: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export function SectionHeader({ label, actionLabel, onPressAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={typography.sectionLabel}>{label}</Text>
      {actionLabel && (
        <Pressable onPress={onPressAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  action: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
