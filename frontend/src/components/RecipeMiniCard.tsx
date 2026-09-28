import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Recipe } from '../data/types';
import { Placeholder } from './Placeholder';
import { colors, radii, spacing } from '../theme';

interface RecipeMiniCardProps {
  recipe: Recipe;
  onPress?: () => void;
}

export function RecipeMiniCard({ recipe, onPress }: RecipeMiniCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Placeholder glyph={recipe.glyph} rounded style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={styles.meta}>
          {recipe.durationMin} min · {recipe.difficulty}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 148,
    marginRight: spacing.m,
  },
  image: {
    width: 148,
    height: 148,
    borderRadius: radii.m,
  },
  body: {
    marginTop: spacing.s,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
