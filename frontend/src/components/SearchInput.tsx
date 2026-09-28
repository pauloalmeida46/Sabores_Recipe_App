import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../theme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function SearchInput({ value, onChangeText, placeholder, right, style }: SearchInputProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <Feather name="search" size={18} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
      />
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingHorizontal: spacing.l,
    height: 52,
    gap: spacing.m,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
  },
});
