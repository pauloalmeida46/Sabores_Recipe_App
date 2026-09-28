import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, onRemove, style }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, selected && styles.selected, style]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeIcon}>
          <Feather name="x" size={14} color={selected ? colors.white : colors.ink} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: 10,
    borderRadius: radii.s,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    marginRight: spacing.s,
  },
  selected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  text: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: '500',
  },
  selectedText: {
    color: colors.white,
  },
  removeIcon: {
    marginLeft: spacing.s,
  },
});
