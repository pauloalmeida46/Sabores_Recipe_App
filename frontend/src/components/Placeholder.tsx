import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, radii } from '../theme';
import { PlaceholderGlyph } from '../data/types';

interface PlaceholderProps {
  glyph?: PlaceholderGlyph;
  style?: ViewStyle;
  rounded?: boolean;
  size?: number;
}

const GLYPHS: Record<PlaceholderGlyph, React.ReactNode> = {
  fork: <Ionicons name="restaurant-outline" size={26} color={colors.textTertiary} />,
  circle: <Feather name="circle" size={24} color={colors.textTertiary} />,
  lines: <Feather name="menu" size={24} color={colors.textTertiary} />,
  plus: <Feather name="plus" size={26} color={colors.textTertiary} />,
};

export function Placeholder({ glyph = 'fork', style, rounded = false, size }: PlaceholderProps) {
  return (
    <View
      style={[
        styles.base,
        rounded && { borderRadius: radii.m },
        size ? { width: size, height: size } : undefined,
        style,
      ]}
    >
      {GLYPHS[glyph]}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
