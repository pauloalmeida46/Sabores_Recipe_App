import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen, HeaderBar, Button, ProgressBar } from '../components';
import { shoppingListItems, shoppingListWeekLabel } from '../data';
import { colors, radii, spacing, typography } from '../theme';
import { RootScreenProps } from '../navigation/types';

export function ShoppingListScreen({ navigation }: RootScreenProps<'ShoppingList'>) {
  const [items, setItems] = useState(shoppingListItems);
  const categories = Array.from(new Set(items.map((i) => i.category)));
  const checkedCount = items.filter((i) => i.checked).length;

  const toggle = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  return (
    <Screen>
      <HeaderBar onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[typography.screenTitle, styles.title]}>Lista de Compras</Text>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            {checkedCount} de {items.length} itens
          </Text>
          <Text style={styles.weekLabel}>{shoppingListWeekLabel}</Text>
        </View>
        <ProgressBar progress={checkedCount / items.length} style={styles.progressBar} />

        {categories.map((category) => (
          <View key={category} style={styles.categoryBlock}>
            <Text style={styles.categoryLabel}>{category.toUpperCase()}</Text>
            {items
              .filter((item) => item.category === category)
              .map((item) => (
                <Pressable key={item.id} style={styles.row} onPress={() => toggle(item.id)}>
                  <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                    {item.checked && <Feather name="check" size={13} color={colors.white} />}
                  </View>
                  <Text style={[styles.itemName, item.checked && styles.itemChecked]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemQty, item.checked && styles.itemChecked]}>
                    {item.quantity}
                  </Text>
                </Pressable>
              ))}
          </View>
        ))}

        <Button
          label="+ Adicionar item manualmente"
          variant="secondary"
          style={styles.addButton}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.l, paddingBottom: spacing.xxxl },
  title: { marginBottom: spacing.m },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.s },
  progressLabel: { fontSize: 14, color: colors.ink, fontWeight: '600' },
  weekLabel: { fontSize: 13, color: colors.textSecondary },
  progressBar: { marginBottom: spacing.xl },
  categoryBlock: { marginBottom: spacing.l },
  categoryLabel: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.s,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  checkboxChecked: { backgroundColor: colors.black, borderColor: colors.black },
  itemName: { flex: 1, fontSize: 15, color: colors.ink },
  itemQty: { fontSize: 14, color: colors.textSecondary },
  itemChecked: { textDecorationLine: 'line-through', color: colors.textTertiary },
  addButton: { marginTop: spacing.l },
});
