import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii } from '../theme';

interface ProgressBarProps {
  progress: number;
  style?: ViewStyle;
  height?: number;
}

export function ProgressBar({ progress, style, height = 4 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { height }, style]}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.divider,
    borderRadius: radii.round,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.black,
    borderRadius: radii.round,
  },
});
