import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen, Placeholder, Button } from '../components';
import { planDays, planWeekLabel, selectedDayIndex, getRecipeById } from '../data';
import { colors, radii, spacing, typography } from '../theme';
import { TabScreenProps } from '../navigation/types';

const MEAL_LABELS: { key: 'almoco' | 'jantar' | 'lanche'; label: string }[] = [
  { key: 'almoco', label: 'Almoço' },
  { key: 'jantar', label: 'Jantar' },
  { key: 'lanche', label: 'Lanche' },
];

export function PlanScreen({ navigation }: TabScreenProps<'Plan'>) {
  const [dayIndex, setDayIndex] = useState(selectedDayIndex);
  const day = planDays[dayIndex];

  const dayCalories = MEAL_LABELS.reduce((sum, meal) => sum + (day[meal.key].calories ?? 0), 0);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[typography.screenTitle, styles.title]}>Planejamento</Text>
        <Text style={styles.weekLabel}>{planWeekLabel}</Text>

        <View style={styles.daysRow}>
          {planDays.map((d, index) => {
            const selected = index === dayIndex;
            return (
              <Pressable key={d.dateLabel} onPress={() => setDayIndex(index)} style={styles.dayColumn}>
                <Text style={[styles.weekday, selected && styles.weekdaySelected]}>{d.weekday}</Text>
                <View style={[styles.dateCircle, selected && styles.dateCircleSelected]}>
                  <Text style={[styles.dateNumber, selected && styles.dateNumberSelected]}>
                    {d.dateLabel}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {MEAL_LABELS.map(({ key, label }) => {
          const meal = day[key];
          const recipe = meal.recipeId ? getRecipeById(meal.recipeId) : undefined;
          return (
            <View key={key} style={styles.mealBlock}>
              <Text style={styles.mealLabel}>{label.toUpperCase()}</Text>
              {recipe ? (
                <Pressable
                  style={styles.mealCard}
                  onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
                >
                  <Placeholder glyph={recipe.glyph} rounded style={styles.mealThumb} />
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealTitle}>{recipe.title}</Text>
                    <Text style={styles.mealMeta}>
                      {recipe.durationMin} min · {meal.calories} kcal
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <View style={styles.emptyMeal}>
                  <Text style={styles.emptyMealText}>+ Adicionar receita</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.summary}>
          <View style={styles.summaryHeader}>
            <Text style={styles.mealLabel}>RESUMO NUTRICIONAL DO DIA</Text>
            <Text style={styles.summaryKcal}>{dayCalories} kcal</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItem}>Proteínas 42 g</Text>
            <Text style={styles.summaryItem}>Carboidratos 118 g</Text>
            <Text style={styles.summaryItem}>Gorduras 38 g</Text>
          </View>
        </View>

        <Button
          label="Gerar lista de compras"
          style={styles.cta}
          onPress={() => navigation.navigate('ShoppingList')}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.l, paddingBottom: spacing.xxxl },
  title: { marginTop: spacing.s },
  weekLabel: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xl },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingBottom: spacing.l,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  dayColumn: { alignItems: 'center', gap: spacing.s },
  weekday: { fontSize: 11, color: colors.textTertiary, fontWeight: '600' },
  weekdaySelected: { color: colors.ink },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCircleSelected: { backgroundColor: colors.black },
  dateNumber: { fontSize: 15, color: colors.ink, fontWeight: '600' },
  dateNumberSelected: { color: colors.white },
  mealBlock: { marginBottom: spacing.xl },
  mealLabel: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.m,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.m,
    padding: spacing.m,
  },
  mealThumb: { width: 56, height: 56, borderRadius: radii.s, marginRight: spacing.m },
  mealInfo: { flex: 1 },
  mealTitle: { fontSize: 15, fontWeight: '600', color: colors.ink },
  mealMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  emptyMeal: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    borderRadius: radii.m,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyMealText: { fontSize: 14, color: colors.textTertiary },
  summary: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingTop: spacing.l,
    marginBottom: spacing.xl,
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryKcal: { fontSize: 15, fontWeight: '700', color: colors.ink },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.m },
  summaryItem: { fontSize: 13, color: colors.textSecondary },
  cta: { marginTop: spacing.s },
});
