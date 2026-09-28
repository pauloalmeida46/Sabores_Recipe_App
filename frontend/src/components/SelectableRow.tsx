import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../theme';

interface SelectableRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  shape?: 'checkbox' | 'radio';
}

export function SelectableRow({ label, selected, onPress, shape = 'checkbox' }: SelectableRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          shape === 'checkbox' ? styles.checkbox : styles.radio,
          selected && (shape === 'checkbox' ? styles.checkboxSelected : styles.radioSelected),
        ]}
      >
        {shape === 'checkbox' && selected && <Feather name="check" size={13} color={colors.white} />}
        {shape === 'radio' && selected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.l,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  label: {
    fontSize: 15,
    color: colors.ink,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.s,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radii.round,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.black,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: radii.round,
    backgroundColor: colors.black,
  },
});
