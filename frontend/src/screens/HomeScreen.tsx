import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen, SectionHeader, RecipeHeroCard, RecipeMiniCard, StatTile, IconCircleButton } from '../components';
import { pantrySummary } from '../data';
import { Recipe } from '../data/types';
import { colors, radii, spacing, typography } from '../theme';
import { TabScreenProps } from '../navigation/types';
import { getSuggestions, RecipeSuggestion, SuggestionRecipe } from '../api/recipes';

/** Adapts a backend suggestion into the local `Recipe` shape the existing hero/mini cards expect. `ingredients`/`steps`/`nutrition` aren't rendered by these cards, so they're left empty here. */
function toDisplayRecipe(recipe: SuggestionRecipe, pantryHave: number, pantryTotal: number): Recipe {
  return {
    id: recipe.id,
    title: recipe.title,
    cuisine: recipe.cuisine,
    glyph: recipe.glyph,
    durationMin: recipe.totalTimeMin,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    safeForRestrictions: recipe.safety === 'certified',
    pantryHave,
    pantryTotal,
    calories: recipe.calories,
    costPerServing: recipe.costPerServing,
    tags: recipe.tags,
    ingredients: [],
    steps: [],
    nutrition: [],
  };
}

interface EmptyState {
  message?: string;
  guidance?: string[];
  fallback: RecipeSuggestion[];
}

export function HomeScreen({ navigation }: TabScreenProps<'Home'>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [emptyState, setEmptyState] = useState<EmptyState | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getSuggestions()
      .then((result) => {
        if (result.empty) {
          setSuggestions([]);
          setEmptyState({
            message: result.message,
            guidance: result.guidance,
            fallback: result.fallbackSuggestions ?? [],
          });
        } else {
          setSuggestions(result.suggestions);
          setEmptyState(null);
        }
      })
      .catch((err) => {
        setSuggestions([]);
        setEmptyState(null);
        setError(err instanceof Error ? err.message : 'Não foi possível carregar sugestões.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation, load]);

  const featured = suggestions[0];
  const rest = suggestions.slice(1);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={typography.eyebrow}>Boa noite</Text>
            <Text style={typography.screenTitle}>Paulo</Text>
          </View>
          <IconCircleButton size={48} onPress={() => navigation.navigate('Profile')}>
            <Feather name="user" size={20} color={colors.ink} />
          </IconCircleButton>
        </View>

        <Text style={[typography.sectionLabel, styles.cardLabel]}>O que vamos cozinhar hoje?</Text>

        {loading && <ActivityIndicator color={colors.ink} style={styles.spinner} />}

        {!loading && error && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{error}</Text>
          </View>
        )}

        {!loading && !error && featured && (
          <RecipeHeroCard
            recipe={toDisplayRecipe(featured.recipe, featured.pantryHave, featured.pantryTotal)}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: featured.recipe.id })}
          />
        )}

        {!loading && !error && !featured && emptyState && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>{emptyState.message}</Text>
            {emptyState.guidance?.map((tip) => (
              <Text key={tip} style={styles.infoText}>
                • {tip}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader
            label="Sua despensa"
            actionLabel="Ver tudo"
            onPressAction={() => navigation.navigate('Pantry')}
          />
          <View style={styles.statsRow}>
            <StatTile value={pantrySummary.total} label="itens cadastrados" />
            <StatTile value={pantrySummary.expiringSoon} label="vencendo em breve" highlighted />
            <StatTile value={pantrySummary.preparedThisMonth} label="preparadas no mês" />
          </View>
        </View>

        {!loading && !error && rest.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              label="Sugestões para você"
              actionLabel="Ver mais"
              onPressAction={() => navigation.navigate('Search')}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {rest.map((s) => (
                <RecipeMiniCard
                  key={s.recipe.id}
                  recipe={toDisplayRecipe(s.recipe, s.pantryHave, s.pantryTotal)}
                  onPress={() => navigation.navigate('RecipeDetail', { recipeId: s.recipe.id })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {!loading && !error && emptyState && emptyState.fallback.length > 0 && (
          <View style={styles.section}>
            <SectionHeader label="Receitas mais próximas (faltam mais itens)" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {emptyState.fallback.map((s) => (
                <RecipeMiniCard
                  key={s.recipe.id}
                  recipe={toDisplayRecipe(s.recipe, s.pantryHave, s.pantryTotal)}
                  onPress={() => navigation.navigate('RecipeDetail', { recipeId: s.recipe.id })}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.s,
    marginBottom: spacing.l,
  },
  cardLabel: {
    marginBottom: spacing.m,
  },
  section: {
    marginTop: spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  spinner: {
    marginVertical: spacing.xl,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.m,
    padding: spacing.l,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.s,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
