import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii } from '../theme';

interface FabProps {
  onPress?: () => void;
  icon?: keyof typeof Feather.glyphMap;
}

export function Fab({ onPress, icon = 'plus' }: FabProps) {
  return (
    <Pressable onPress={onPress} style={styles.fab}>
      <Feather name={icon} size={24} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: radii.round,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
