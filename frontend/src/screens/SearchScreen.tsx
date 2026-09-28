import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen, RecipeListItem, Chip, SelectableRow } from '../components';
import { Recipe } from '../data/types';
import { colors, radii, spacing, typography } from '../theme';
import { TabScreenProps } from '../navigation/types';
import { RecipeDetail, searchRecipes } from '../api/recipes';

const QUICK_FILTERS = ['Todas', 'Rápidas', 'Vegetariano', 'Sem glúten'] as const;
const PREP_TIMES = ['Até 15 minutos', 'Até 30 minutos', 'Até 1 hora', 'Sem limite'];
// Fixed a pre-existing mock bug: the backend's real `Recipe.difficulty` enum is
// 'Fácil' | 'Intermediário' | 'Avançado' — 'Iniciante' never matched any real
// recipe. (Skill level elsewhere, e.g. ProfileScreen, is a different concept
// and correctly stays 'Iniciante'/'Intermediário'/'Avançado'.)
const DIFFICULTIES = ['Fácil', 'Intermediário', 'Avançado'];
const DIETS = ['Vegetariano', 'Vegano', 'Sem glúten', 'Baixo carboidrato'];

const PREP_TIME_TO_MAX_DURATION: Record<string, number | undefined> = {
  'Até 15 minutos': 15,
  'Até 30 minutos': 30,
  'Até 1 hora': 60,
  'Sem limite': undefined,
};

/** Adapts a backend search result into the local `Recipe` shape the existing list item expects.
 * `ingredients`/`steps`/`nutrition` aren't rendered in this context, so they're left empty here
 * (same pattern as HomeScreen's `toDisplayRecipe`). Search results don't carry pantry-match info,
 * so `pantryHave`/`pantryTotal` are left at 0 — the caller passes an explicit `subtitle` to
 * `RecipeListItem` instead of letting it fall back to its (here, misleading) pantry badge. */
function toDisplayRecipe(recipe: RecipeDetail): Recipe {
  return {
    id: recipe.id,
    title: recipe.title,
    cuisine: recipe.cuisine,
    glyph: recipe.glyph,
    durationMin: recipe.durationMin,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    safeForRestrictions: recipe.safety === 'certified',
    pantryHave: 0,
    pantryTotal: 0,
    calories: recipe.calories,
    costPerServing: recipe.costPerServing,
    tags: recipe.tags,
    ingredients: [],
    steps: [],
    nutrition: [],
  };
}

export function SearchScreen({ navigation }: TabScreenProps<'Search'>) {
  const [query, setQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<(typeof QUICK_FILTERS)[number]>('Todas');
  const [showFilters, setShowFilters] = useState(false);
  const [prepTime, setPrepTime] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [diets, setDiets] = useState<string[]>([]);
  const [highlightIngredient, setHighlightIngredient] = useState('');
  const [excludeIngredient, setExcludeIngredient] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecipeDetail[]>([]);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [emptySuggestion, setEmptySuggestion] = useState<string | undefined>(undefined);

  const toggleDiet = (diet: string) => {
    setDiets((prev) => (prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]));
  };

  // The backend's `diet` search param only accepts a SINGLE value (see
  // api/recipes.ts's SearchRecipesParams / the backend's SearchParams type),
  // but this screen has two diet-ish controls: the quick-filter chips and the
  // advanced panel's multi-select DIETS checkboxes. Coherent rule used here:
  // the advanced panel wins when it has a selection (and only its FIRST
  // checked item is actually sent — checking more than one doesn't narrow the
  // search further, it's a real backend contract limitation, not something
  // worked around by calling the API multiple times); otherwise, if the quick
  // filter itself is a diet-like option ('Vegetariano'/'Sem glúten'), that's
  // used as the single diet param.
  const dietParam = useMemo(() => {
    if (diets.length > 0) return diets[0];
    if (quickFilter === 'Vegetariano' || quickFilter === 'Sem glúten') return quickFilter;
    return undefined;
  }, [diets, quickFilter]);

  // Similarly, both the quick filter ('Rápidas' → 20 min, matching the old
  // mock threshold) and the advanced panel's prepTime selector feed the same
  // single `maxDurationMin` param. The advanced (more specific) selection
  // wins when set; otherwise the quick filter's threshold applies.
  const maxDurationMin = useMemo(() => {
    if (prepTime) return PREP_TIME_TO_MAX_DURATION[prepTime];
    if (quickFilter === 'Rápidas') return 20;
    return undefined;
  }, [prepTime, quickFilter]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => {
      searchRecipes({
        q: query.trim() || undefined,
        maxDurationMin,
        difficulty: difficulty ?? undefined,
        diet: dietParam,
        highlightIngredient: highlightIngredient.trim() || undefined,
        excludeIngredient: excludeIngredient.trim() || undefined,
      })
        .then((result) => {
          setResults(result.results);
          if (result.results.length === 0) {
            setEmptyMessage(result.message ?? 'Nenhuma receita encontrada com esses filtros.');
            setEmptySuggestion(result.suggestion);
          } else {
            setEmptyMessage(null);
            setEmptySuggestion(undefined);
          }
        })
        .catch((err) => {
          setResults([]);
          setEmptyMessage(null);
          setEmptySuggestion(undefined);
          setError(err instanceof Error ? err.message : 'Não foi possível buscar receitas.');
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, maxDurationMin, difficulty, dietParam, highlightIngredient, excludeIngredient]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={typography.screenTitle}>Buscar</Text>
          <Pressable
            onPress={() => navigation.navigate('NewRecipeChoose')}
            style={styles.newRecipeButton}
            hitSlop={8}
          >
            <Feather name="plus" size={20} color={colors.ink} />
          </Pressable>
        </View>

        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="confit de pato"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
          />
          <Feather name="mic" size={18} color={colors.textSecondary} style={styles.icon} />
          <Feather name="camera" size={18} color={colors.textSecondary} />
        </View>
        <Text style={styles.hint}>
          Toque no microfone para buscar por voz, ou na câmera para buscar por foto de um prato
        </Text>

        <View style={styles.chipsRow}>
          {QUICK_FILTERS.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              selected={quickFilter === filter}
              onPress={() => setQuickFilter(filter)}
            />
          ))}
          <Pressable style={styles.addFilter} onPress={() => setShowFilters((v) => !v)}>
            <Text style={styles.addFilterText}>+ Adicionar filtro</Text>
          </Pressable>
        </View>

        {showFilters && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterGroupLabel}>Tempo de preparo</Text>
            {PREP_TIMES.map((option) => (
              <SelectableRow
                key={option}
                label={option}
                selected={prepTime === option}
                onPress={() => setPrepTime((prev) => (prev === option ? null : option))}
              />
            ))}

            <Text style={[styles.filterGroupLabel, styles.filterGroupSpacing]}>Dificuldade</Text>
            {DIFFICULTIES.map((option) => (
              <SelectableRow
                key={option}
                shape="radio"
                label={option}
                selected={difficulty === option}
                onPress={() => setDifficulty((prev) => (prev === option ? null : option))}
              />
            ))}

            <Text style={[styles.filterGroupLabel, styles.filterGroupSpacing]}>Tipo de dieta</Text>
            {DIETS.map((option) => (
              <SelectableRow
                key={option}
                label={option}
                selected={diets.includes(option)}
                onPress={() => toggleDiet(option)}
              />
            ))}
            {diets.length > 1 && (
              <Text style={styles.hint}>
                A busca só suporta uma dieta por vez — apenas "{diets[0]}" será considerada.
              </Text>
            )}

            <Text style={[styles.filterGroupLabel, styles.filterGroupSpacing]}>Ingrediente em destaque</Text>
            <TextInput
              value={highlightIngredient}
              onChangeText={setHighlightIngredient}
              placeholder="ex.: cogumelos"
              placeholderTextColor={colors.textTertiary}
              style={styles.filterInput}
            />

            <Text style={[styles.filterGroupLabel, styles.filterGroupSpacing]}>Ingrediente a excluir</Text>
            <TextInput
              value={excludeIngredient}
              onChangeText={setExcludeIngredient}
              placeholder="ex.: glúten"
              placeholderTextColor={colors.textTertiary}
              style={styles.filterInput}
            />
          </View>
        )}

        <View style={styles.results}>
          {loading && <ActivityIndicator color={colors.ink} style={styles.spinner} />}

          {!loading && error && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{error}</Text>
            </View>
          )}

          {!loading && !error && results.length === 0 && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{emptyMessage}</Text>
              {!!emptySuggestion && (
                <Text style={styles.infoText}>Tente remover o filtro: {emptySuggestion}</Text>
              )}
            </View>
          )}

          {!loading &&
            !error &&
            results.map((recipe) => (
              <RecipeListItem
                key={recipe.id}
                recipe={toDisplayRecipe(recipe)}
                subtitle={`${recipe.ingredients.length} ingredientes`}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
              />
            ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xxxl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.s,
    marginBottom: spacing.l,
  },
  newRecipeButton: {
    width: 40,
    height: 40,
    borderRadius: radii.s,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingHorizontal: spacing.l,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    marginLeft: spacing.m,
  },
  icon: {
    marginRight: spacing.m,
  },
  hint: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.s,
    lineHeight: 17,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.l,
    gap: spacing.s,
  },
  addFilter: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingHorizontal: spacing.l,
    paddingVertical: 10,
  },
  addFilterText: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: '500',
  },
  filterPanel: {
    marginTop: spacing.xl,
    paddingTop: spacing.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  filterGroupLabel: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  filterGroupSpacing: {
    marginTop: spacing.l,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingHorizontal: spacing.l,
    height: 48,
    fontSize: 14,
    color: colors.ink,
  },
  results: {
    marginTop: spacing.xl,
  },
  spinner: {
    marginVertical: spacing.xxl,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.m,
    padding: spacing.l,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    textAlign: 'center',
  },
});
