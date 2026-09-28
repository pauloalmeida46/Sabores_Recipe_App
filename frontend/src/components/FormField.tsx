import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  secureEntry?: boolean;
}

export function FormField({ label, error, secureEntry, style, ...inputProps }: FormFieldProps) {
  const [hidden, setHidden] = useState(!!secureEntry);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <View style={[styles.inputRow, !!error && styles.inputRowError]}>
        <TextInput
          {...inputProps}
          secureTextEntry={secureEntry ? hidden : inputProps.secureTextEntry}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, style]}
        />
        {secureEntry && (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={8}>
            <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.l,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.s,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingHorizontal: spacing.l,
    height: 52,
  },
  inputRowError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
  },
  error: {
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
