import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

interface HeaderBarProps {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  serif?: boolean;
}

export function HeaderBar({ title, onBack, right, serif = true }: HeaderBarProps) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={10} style={styles.iconButton}>
          <Feather name="chevron-left" size={22} color={colors.ink} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
      {title ? (
        <Text style={serif ? typography.cardTitleSmall : typography.bodyStrong} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View />
      )}
      <View style={styles.iconButton}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
