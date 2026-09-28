import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

interface StatTileProps {
  value: string | number;
  label: string;
  highlighted?: boolean;
  style?: ViewStyle;
}

export function StatTile({ value, label, highlighted = false, style }: StatTileProps) {
  return (
    <View style={[styles.tile, highlighted && styles.highlighted, style]}>
      <Text style={typography.statNumber}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.m,
    padding: spacing.l,
  },
  highlighted: {
    borderColor: colors.black,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
