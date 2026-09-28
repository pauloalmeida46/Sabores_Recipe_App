import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Recipe } from '../data/types';
import { Placeholder } from './Placeholder';
import { colors, radii, spacing, typography } from '../theme';

interface RecipeHeroCardProps {
  recipe: Recipe;
  onPress?: () => void;
}

export function RecipeHeroCard({ recipe, onPress }: RecipeHeroCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Placeholder glyph={recipe.glyph} style={styles.image} />
      <View style={styles.body}>
        <Text style={typography.cardTitle}>{recipe.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{recipe.durationMin} min</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{recipe.difficulty}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>
            Usa {recipe.pantryHave}/{recipe.pantryTotal} itens da despensa
          </Text>
        </View>
        {recipe.safeForRestrictions && (
          <View style={styles.safeBadge}>
            <Feather name="check" size={13} color={colors.ink} />
            <Text style={styles.safeText}>Selo de segurança</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.m,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    height: 200,
    borderRadius: 0,
  },
  body: {
    padding: spacing.l,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  dot: {
    fontSize: 13,
    color: colors.textSecondary,
    marginHorizontal: 6,
  },
  safeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    marginTop: spacing.m,
    gap: 6,
  },
  safeText: {
    fontSize: 12,
    color: colors.ink,
  },
});
