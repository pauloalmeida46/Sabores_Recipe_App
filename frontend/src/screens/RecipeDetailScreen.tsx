import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Placeholder, Button, IconCircleButton, ProgressBar } from '../components';
import { colors, radii, spacing, typography } from '../theme';
import { RootScreenProps } from '../navigation/types';
import {
  applySubstitution,
  getNutrition,
  getRecipe,
  scaleRecipe,
  trackUse,
  NutritionTotals,
  RecipeDetail,
} from '../api/recipes';
import { lookupSubstitutions, SubstitutionOption } from '../api/substitutions';
import { getPantryItems, PantryItem } from '../api/pantry';
import { getProfile, DailyGoals } from '../api/profile';

type Tab = 'Ingredientes' | 'Modo de Preparo' | 'Nutrição';
const TABS: Tab[] = ['Ingredientes', 'Modo de Preparo', 'Nutrição'];

/** Common shape rendered by the ingredients tab, satisfied by both the recipe's own
 * `RecipeDetailIngredient[]` and the `RecipeIngredient[]` returned by scale/apply-substitution. */
interface DisplayIngredient {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
}

const NUTRIENTS: Array<{ key: keyof NutritionTotals; label: string; unit: string }> = [
  { key: 'calories', label: 'Calorias', unit: 'kcal' },
  { key: 'protein', label: 'Proteínas', unit: 'g' },
  { key: 'carbs', label: 'Carboidratos', unit: 'g' },
  { key: 'fat', label: 'Gorduras', unit: 'g' },
  { key: 'fiber', label: 'Fibras', unit: 'g' },
  { key: 'sodium', label: 'Sódio', unit: 'mg' },
  { key: 'sugar', label: 'Açúcar', unit: 'g' },
];

/** Lowercases and strips accents so pantry/ingredient names compare loosely
 * (e.g. "cogumelos" ~ "Cogumelos frescos"). Good-enough UX parity with the
 * old mock's per-ingredient `have` flag — not a certified computation. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1).replace(/\.0$/, '');
}

export function RecipeDetailScreen({ navigation, route }: RootScreenProps<'RecipeDetail'>) {
  const recipeId = route.params.recipeId;

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>('Ingredientes');
  const [servings, setServings] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [scaleWarning, setScaleWarning] = useState<string | undefined>(undefined);
  const [ingredients, setIngredients] = useState<DisplayIngredient[]>([]);

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

  const [activeIngredient, setActiveIngredient] = useState<DisplayIngredient | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [subMessage, setSubMessage] = useState<string | null>(null);
  const [substitutions, setSubstitutions] = useState<SubstitutionOption[]>([]);

  const [nutritionLoading, setNutritionLoading] = useState(true);
  const [nutritionError, setNutritionError] = useState<string | null>(null);
  const [perServing, setPerServing] = useState<NutritionTotals | null>(null);
  const [missingData, setMissingData] = useState<Array<{ ingredientId: string; name: string; reason: string }>>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoals | null>(null);

  // Main recipe fetch.
  useEffect(() => {
    setLoading(true);
    setError(null);
    getRecipe(recipeId)
      .then((data) => {
        setRecipe(data);
        setServings(data.servings);
        setIngredients(data.ingredients);
      })
      .catch((err) => {
        setRecipe(null);
        setError(err instanceof Error ? err.message : 'Não foi possível carregar a receita.');
      })
      .finally(() => setLoading(false));
  }, [recipeId]);

  // Pantry snapshot, fetched once, used only to compute a client-side have/missing dot.
  useEffect(() => {
    getPantryItems()
      .then((result) => setPantryItems(result.items))
      .catch(() => setPantryItems([]));
  }, []);

  // Nutrition + this account's daily goals, fetched once.
  useEffect(() => {
    setNutritionLoading(true);
    setNutritionError(null);
    Promise.all([getNutrition(recipeId), getProfile()])
      .then(([nutrition, profile]) => {
        setPerServing(nutrition.perServing);
        setMissingData(nutrition.missingData);
        setDailyGoals(profile.dailyGoals);
      })
      .catch((err) => {
        setNutritionError(err instanceof Error ? err.message : 'Não foi possível carregar a nutrição.');
      })
      .finally(() => setNutritionLoading(false));
  }, [recipeId]);

  // Servings stepper → scale on the backend (authoritative recalculated quantities)
  // whenever it differs from the recipe's own servings; otherwise show the
  // original ingredients with no extra call.
  useEffect(() => {
    if (!recipe) return;
    if (servings === recipe.servings) {
      setScaleWarning(undefined);
      setIngredients(recipe.ingredients);
      return;
    }
    let cancelled = false;
    const timeout = setTimeout(() => {
      scaleRecipe(recipe.id, servings)
        .then((result) => {
          if (cancelled) return;
          setIngredients(result.ingredients);
          setScaleWarning(result.warning);
        })
        .catch(() => {
          // Scaling is a nice-to-have on top of the already-loaded recipe —
          // leave the previously-shown ingredients in place on failure.
        });
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [servings, recipe]);

  const pantryHaveSet = useMemo(() => pantryItems.map((item) => normalize(item.name)), [pantryItems]);

  function hasIngredientInPantry(name: string): boolean {
    const n = normalize(name);
    return pantryHaveSet.some((pantryName) => pantryName === n || pantryName.includes(n) || n.includes(pantryName));
  }

  function openSubstitutionSheet(ingredient: DisplayIngredient) {
    setActiveIngredient(ingredient);
    setSubLoading(true);
    setSubMessage(null);
    setSubstitutions([]);
    lookupSubstitutions(ingredient.name)
      .then((result) => {
        setSubstitutions(result.substitutions);
        if (!result.found) setSubMessage(result.message ?? null);
      })
      .catch((err) => {
        setSubMessage(err instanceof Error ? err.message : 'Não foi possível buscar substituições.');
      })
      .finally(() => setSubLoading(false));
  }

  function closeSubstitutionSheet() {
    setActiveIngredient(null);
  }

  function handlePickSubstitution(sub: SubstitutionOption) {
    if (!recipe || !activeIngredient?.id) {
      closeSubstitutionSheet();
      return;
    }
    applySubstitution(recipe.id, activeIngredient.id, sub.name)
      .then((result) => {
        setIngredients(result.ingredients);
      })
      .catch(() => {
        // Best-effort — leave the ingredient list as-is if the swap fails.
      })
      .finally(() => closeSubstitutionSheet());
  }

  function handleStartGuidedCooking() {
    if (!recipe) return;
    trackUse(recipe.id).catch(() => {
      // Fire-and-forget nice-to-have side effect — not critical path.
    });
    navigation.navigate('GuidedCooking', { recipeId: recipe.id });
  }

  if (loading) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.loadingWrap}>
          <ActivityIndicator color={colors.ink} />
        </SafeAreaView>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.errorHeader}>
          <IconCircleButton onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={20} color={colors.ink} />
          </IconCircleButton>
        </SafeAreaView>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{error ?? 'Receita não encontrada.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageWrap}>
          <Placeholder glyph={recipe.glyph} style={styles.image} />
          <SafeAreaView edges={['top']} style={styles.imageOverlay}>
            <IconCircleButton onPress={() => navigation.goBack()}>
              <Feather name="chevron-left" size={20} color={colors.ink} />
            </IconCircleButton>
            <IconCircleButton onPress={() => setFavorite((v) => !v)}>
              <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={18} color={colors.ink} />
            </IconCircleButton>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <Text style={typography.eyebrow}>{recipe.cuisine.toUpperCase()}</Text>
          <Text style={[typography.cardTitle, styles.title]}>{recipe.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>{recipe.durationMin} min</Text>
            <Text style={styles.meta}>{recipe.difficulty}</Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setServings((s) => Math.max(1, s - 1))}
                style={styles.stepperButton}
              >
                <Text style={styles.stepperText}>–</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{servings}</Text>
              <Pressable onPress={() => setServings((s) => s + 1)} style={styles.stepperButton}>
                <Text style={styles.stepperText}>+</Text>
              </Pressable>
            </View>
          </View>

          {!!scaleWarning && <Text style={styles.scaleWarning}>{scaleWarning}</Text>}

          {recipe.safety === 'certified' && (
            <View style={styles.safeBadge}>
              <Feather name="check" size={13} color={colors.ink} />
              <Text style={styles.safeText}>Seguro para suas restrições</Text>
            </View>
          )}

          <View style={styles.tabsRow}>
            {TABS.map((t) => (
              <Pressable key={t} onPress={() => setTab(t)} style={styles.tabButton}>
                <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>{t}</Text>
                {tab === t && <View style={styles.tabIndicator} />}
              </Pressable>
            ))}
          </View>

          {tab === 'Ingredientes' && (
            <View style={styles.tabContent}>
              {ingredients.map((ingredient, index) => {
                const have = hasIngredientInPantry(ingredient.name);
                return (
                  <Pressable
                    key={ingredient.id ?? `${ingredient.name}-${index}`}
                    style={styles.ingredientRow}
                    onPress={() => !have && openSubstitutionSheet(ingredient)}
                  >
                    <View style={[styles.dot, have && styles.dotFilled]} />
                    <Text style={[styles.ingredientText, !have && styles.ingredientMissing]}>
                      {formatQuantity(ingredient.quantity)} {ingredient.unit} {ingredient.name}
                    </Text>
                  </Pressable>
                );
              })}
              {ingredients.some((i) => !hasIngredientInPantry(i.name)) && (
                <Text style={styles.hint}>Toque em um item faltante para ver substituições.</Text>
              )}
            </View>
          )}

          {tab === 'Modo de Preparo' && (
            <View style={styles.tabContent}>
              {recipe.steps.map((step, index) => (
                <View key={step.id} style={styles.stepRow}>
                  <Text style={styles.stepNumber}>Passo {index + 1}</Text>
                  <Text style={styles.stepText}>{step.text}</Text>
                  {!!step.timerSec && (
                    <View style={styles.timerTag}>
                      <Feather name="clock" size={12} color={colors.textSecondary} />
                      <Text style={styles.timerText}>
                        Temporizador: {Math.round(step.timerSec / 60)} min
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {tab === 'Nutrição' && (
            <View style={styles.tabContent}>
              {nutritionLoading && <ActivityIndicator color={colors.ink} style={styles.spinner} />}

              {!nutritionLoading && nutritionError && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>{nutritionError}</Text>
                </View>
              )}

              {!nutritionLoading &&
                !nutritionError &&
                perServing &&
                dailyGoals &&
                NUTRIENTS.map((fact) => {
                  const value = perServing[fact.key];
                  const goal = dailyGoals[fact.key];
                  return (
                    <View key={fact.key} style={styles.nutritionRow}>
                      <View style={styles.nutritionHeader}>
                        <Text style={styles.nutritionLabel}>{fact.label}</Text>
                        <Text style={styles.nutritionValue}>
                          {value} {fact.unit} · meta {goal} {fact.unit}
                        </Text>
                      </View>
                      <ProgressBar progress={goal > 0 ? value / goal : 0} />
                    </View>
                  );
                })}

              {!nutritionLoading && !nutritionError && missingData.length > 0 && (
                <Text style={styles.hint}>
                  Dados incompletos para: {missingData.map((m) => m.name).join(', ')}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Button label="Iniciar preparo guiado" onPress={handleStartGuidedCooking} />
      </SafeAreaView>

      <Modal visible={!!activeIngredient} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={closeSubstitutionSheet} />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={typography.eyebrow}>Falta na sua despensa</Text>
          <Text style={[typography.cardTitle, styles.sheetTitle]}>
            Substituir: {activeIngredient?.name}
          </Text>
          {subLoading && <ActivityIndicator color={colors.ink} style={styles.spinner} />}
          {!subLoading && substitutions.length === 0 ? (
            <Text style={styles.hint}>
              {subMessage ?? 'Nenhuma substituição sugerida disponível para este item.'}
            </Text>
          ) : (
            !subLoading &&
            substitutions.map((sub, index) => (
              <Pressable
                key={sub.name}
                style={[styles.subCard, index === 0 && styles.subCardHighlighted]}
                onPress={() => handlePickSubstitution(sub)}
              >
                <View style={styles.subCardText}>
                  <Text style={styles.subName}>{sub.name}</Text>
                  <Text style={styles.subDescription}>{sub.description}</Text>
                </View>
                <Text style={styles.subConfidence}>{sub.confidence}</Text>
              </Pressable>
            ))
          )}
          <Text style={styles.sheetFooterHint}>
            Baseado na função culinária, sabor e proporção do ingrediente
          </Text>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorHeader: {
    flexDirection: 'row',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.s,
  },
  imageWrap: { height: 300, backgroundColor: colors.placeholder },
  image: { flex: 1, borderRadius: 0 },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.s,
  },
  body: { paddingHorizontal: spacing.l, paddingTop: spacing.l, paddingBottom: 140 },
  title: { marginTop: spacing.xs },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.m,
  },
  meta: { fontSize: 14, color: colors.textSecondary },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    overflow: 'hidden',
  },
  stepperButton: { paddingHorizontal: spacing.m, paddingVertical: spacing.s },
  stepperText: { fontSize: 18, color: colors.ink },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    paddingHorizontal: spacing.s,
  },
  scaleWarning: {
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.s,
    lineHeight: 17,
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
    marginTop: spacing.l,
    gap: 6,
  },
  safeText: { fontSize: 12, color: colors.ink },
  tabsRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  tabButton: { marginRight: spacing.xl, paddingBottom: spacing.m },
  tabLabel: { fontSize: 14, color: colors.textTertiary },
  tabLabelActive: { color: colors.ink, fontWeight: '600' },
  tabIndicator: { height: 2, backgroundColor: colors.black, marginTop: spacing.s },
  tabContent: { marginTop: spacing.l },
  spinner: { marginVertical: spacing.xl },
  infoBox: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.m,
    padding: spacing.l,
    marginHorizontal: spacing.l,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.m },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.4,
    borderColor: colors.borderStrong,
    marginRight: spacing.m,
  },
  dotFilled: { backgroundColor: colors.black, borderColor: colors.black },
  ingredientText: { fontSize: 15, color: colors.ink, flex: 1 },
  ingredientMissing: { color: colors.textTertiary },
  hint: { fontSize: 12, color: colors.textTertiary, marginTop: spacing.s },
  stepRow: {
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  stepNumber: { fontSize: 12, color: colors.textTertiary, marginBottom: spacing.xs },
  stepText: { fontSize: 15, color: colors.ink, lineHeight: 21 },
  timerTag: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.s, gap: 6 },
  timerText: { fontSize: 12, color: colors.textSecondary },
  nutritionRow: { marginBottom: spacing.l },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  nutritionLabel: { fontSize: 14, color: colors.ink },
  nutritionValue: { fontSize: 13, color: colors.textSecondary },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  modalBackdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.l,
    borderTopRightRadius: radii.l,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.s,
    paddingBottom: spacing.xl,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.l,
  },
  sheetTitle: { marginTop: spacing.xs, marginBottom: spacing.l },
  subCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.m,
    padding: spacing.l,
    marginBottom: spacing.m,
  },
  subCardHighlighted: { borderColor: colors.black },
  subCardText: { flex: 1, marginRight: spacing.m },
  subName: { fontSize: 15, fontWeight: '600', color: colors.ink },
  subDescription: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  subConfidence: { fontSize: 12, fontWeight: '600', color: colors.ink },
  sheetFooterHint: { fontSize: 12, color: colors.textTertiary, marginTop: spacing.s },
});
