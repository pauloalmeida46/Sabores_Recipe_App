import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Recipe } from '../data/types';
import { Placeholder } from './Placeholder';
import { Badge } from './Badge';
import { colors, radii, spacing, typography } from '../theme';

interface RecipeListItemProps {
  recipe: Recipe;
  onPress?: () => void;
  subtitle?: string;
  trailing?: React.ReactNode;
}

export function RecipeListItem({ recipe, onPress, subtitle, trailing }: RecipeListItemProps) {
  const missing = recipe.pantryTotal - recipe.pantryHave;
  const badgeLabel =
    missing <= 0 ? `Usa ${recipe.pantryHave}/${recipe.pantryTotal} itens da despensa` : `Faltam ${missing} ${missing === 1 ? 'item' : 'itens'}`;

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Placeholder glyph={recipe.glyph} rounded style={styles.thumb} />
      <View style={styles.content}>
        <Text style={typography.cardTitleSmall} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={styles.meta}>
          {recipe.durationMin} min · {recipe.difficulty}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : (
          <Badge label={badgeLabel} style={styles.badge} />
        )}
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.m,
    alignItems: 'flex-start',
  },
  thumb: {
    width: 92,
    height: 92,
    borderRadius: radii.m,
    marginRight: spacing.l,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.s,
  },
  badge: {
    marginTop: spacing.s,
  },
});
