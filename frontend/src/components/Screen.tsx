import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface ScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
  dark?: boolean;
}

export function Screen({ children, edges = ['top'], style, dark = false }: ScreenProps) {
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, dark && styles.dark, style]}
    >
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  dark: {
    backgroundColor: colors.kitchenBg,
  },
  inner: {
    flex: 1,
  },
});
