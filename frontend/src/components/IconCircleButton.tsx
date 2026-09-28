import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii } from '../theme';

interface IconCircleButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  filled?: boolean;
  size?: number;
}

export function IconCircleButton({ children, onPress, style, filled = false, size = 40 }: IconCircleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        filled ? styles.filled : styles.outline,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  filled: {
    backgroundColor: colors.black,
  },
});
