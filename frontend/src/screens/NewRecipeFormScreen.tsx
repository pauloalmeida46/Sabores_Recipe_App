import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen, Button, Chip, FormField } from '../components';
import { colors, radii, spacing, typography } from '../theme';
import { RootScreenProps } from '../navigation/types';
import {
  checkDuplicate,
  createDraft,
  Difficulty,
  finalizeDraft,
  mergeRecipe,
  RecipeCreatePayload,
  RecipeIngredient,
  RecipeStep,
  upsertDraft,
} from '../api/recipes';
import { parseIngredientLine } from '../utils/parseIngredientLine';

interface DraftRow {
  id: string;
  text: string;
}

let idCounter = 0;
const nextId = () => `draft-${idCounter++}`;

const DIFFICULTY_OPTIONS: Difficulty[] = ['Fácil', 'Intermediário', 'Avançado'];
const AUTOSAVE_INTERVAL_MS = 30000;

interface FormErrors {
  title?: string;
  cuisine?: string;
  ingredients?: string;
  steps?: string;
}

type DuplicateChoice = 'cancel' | 'saveAnyway' | 'merge';

function askDuplicateAction(existingTitle: string): Promise<DuplicateChoice> {
  return new Promise((resolve) => {
    Alert.alert(
      'Receita parecida encontrada',
      `Encontramos uma receita parecida: "${existingTitle}". O que você quer fazer?`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve('cancel') },
        { text: 'Salvar mesmo assim', onPress: () => resolve('saveAnyway') },
        { text: 'Mesclar com a existente', onPress: () => resolve('merge') },
      ],
      { cancelable: true, onDismiss: () => resolve('cancel') }
    );
  });
}

export function NewRecipeFormScreen({ navigation, route }: RootScreenProps<'NewRecipeForm'>) {
  const photoUri = route.params?.photoUri;

  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Fácil');
  const [servingsText, setServingsText] = useState('2');
  const [totalTimeText, setTotalTimeText] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<DraftRow[]>([{ id: nextId(), text: '' }]);
  const [steps, setSteps] = useState<DraftRow[]>([{ id: nextId(), text: '' }]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const draftIdRef = useRef<string | null>(null);

  const addIngredient = () => setIngredients((prev) => [...prev, { id: nextId(), text: '' }]);
  const removeIngredient = (id: string) =>
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  const updateIngredient = (id: string, text: string) =>
    setIngredients((prev) => prev.map((i) => (i.id === id ? { ...i, text } : i)));

  const addStep = () => setSteps((prev) => [...prev, { id: nextId(), text: '' }]);
  const updateStep = (id: string, text: string) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));

  /** Builds the recipe-schema-shaped payload from the current form state. */
  function buildPayload(): RecipeCreatePayload {
    const parsedIngredients: RecipeIngredient[] = ingredients
      .filter((row) => row.text.trim().length > 0)
      .map((row) => {
        const parsed = parseIngredientLine(row.text);
        return { id: row.id, name: parsed.name, quantity: parsed.quantity, unit: parsed.unit };
      });

    const ingredientIds = parsedIngredients.map((i) => i.id as string);

    const parsedSteps: RecipeStep[] = steps
      .filter((row) => row.text.trim().length > 0)
      .map((row) => ({
        id: row.id,
        text: row.text.trim(),
        // Simplificação: ainda não existe UI para marcar quais ingredientes
        // cada passo usa, então cada passo referencia todos os ingredientes
        // da receita.
        ingredientRefs: ingredientIds,
      }));

    const totalTimeMin = Math.max(0, Math.round(Number(totalTimeText.replace(',', '.')) || 0));
    const servings = Math.max(1, Math.round(Number(servingsText.replace(',', '.')) || 1));

    return {
      title: title.trim(),
      cuisine: cuisine.trim(),
      difficulty,
      servings,
      // A UI só tem um campo de "tempo total"; jogar tudo em prepTimeMin e
      // zerar cookTimeMin sempre satisfaz totalTimeMin >= max(prep, cook).
      prepTimeMin: totalTimeMin,
      cookTimeMin: 0,
      totalTimeMin,
      ingredientInfoComplete: true,
      ingredients: parsedIngredients,
      steps: parsedSteps,
    };
  }

  // Ref sempre com o payload mais recente, para o autosave (que roda num
  // setInterval criado uma única vez) conseguir ler o estado atual sem
  // recriar o interval a cada tecla digitada.
  const latestPayloadRef = useRef<RecipeCreatePayload>(buildPayload());
  latestPayloadRef.current = buildPayload();

  // Cria o rascunho assim que a tela monta. Se falhar (backend fora do ar),
  // não bloqueia o preenchimento local — só avisa uma vez no console.
  useEffect(() => {
    let cancelled = false;
    createDraft({})
      .then((draft) => {
        if (cancelled) return;
        draftIdRef.current = draft.id;
        setDraftSaved(true);
      })
      .catch((err) => {
        console.warn('[NewRecipeForm] Não foi possível criar o rascunho inicial:', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Autosave a cada ~30s, melhor-esforço (não interrompe o usuário em caso de erro).
  useEffect(() => {
    const interval = setInterval(() => {
      const draftId = draftIdRef.current;
      if (!draftId) return;
      upsertDraft(draftId, latestPayloadRef.current)
        .then(() => setDraftSaved(true))
        .catch((err) => {
          console.warn('[NewRecipeForm] Falha no autosave do rascunho:', err);
        });
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!title.trim()) next.title = 'Título é obrigatório.';
    if (!cuisine.trim()) next.cuisine = 'Cozinha/estilo é obrigatório.';
    if (!ingredients.some((row) => row.text.trim().length > 0)) {
      next.ingredients = 'Adicione ao menos um ingrediente.';
    }
    if (!steps.some((row) => row.text.trim().length > 0)) {
      next.steps = 'Adicione ao menos um passo do modo de preparo.';
    }
    return next;
  }

  async function handleSave() {
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSaving(true);
    try {
      const payload = buildPayload();

      let draftId = draftIdRef.current;
      if (!draftId) {
        // Criação inicial do rascunho falhou (backend indisponível na
        // montagem da tela) — tenta de novo agora, antes de salvar.
        const draft = await createDraft(payload);
        draftId = draft.id;
        draftIdRef.current = draft.id;
      } else {
        await upsertDraft(draftId, payload);
      }
      setDraftSaved(true);

      const duplicateResult = await checkDuplicate({
        title: payload.title,
        ingredients: payload.ingredients.map((i) => ({ name: i.name })),
        steps: payload.steps.map((s) => ({ text: s.text })),
      });

      const topCandidate = duplicateResult.candidates[0];

      if (topCandidate?.possibleDuplicate) {
        const choice = await askDuplicateAction(topCandidate.recipe.title);
        if (choice === 'cancel') {
          setSaving(false);
          return;
        }
        if (choice === 'merge') {
          await mergeRecipe(
            topCandidate.recipe.id,
            { title: payload.title, ingredients: payload.ingredients, steps: payload.steps },
            { title: 'keepDraft', mergeIngredients: 'union', mergeSteps: 'union' }
          );
          navigation.goBack();
          return;
        }
        // 'saveAnyway' segue direto para o finalize abaixo.
      }

      await finalizeDraft(draftId);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro ao salvar', err instanceof Error ? err.message : 'Erro inesperado ao salvar a receita.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="x" size={22} color={colors.ink} />
        </Pressable>
        <Text style={typography.cardTitleSmall}>Nova Receita</Text>
        <Text style={styles.draftLabel}>{draftSaved ? 'rascunho salvo' : ''}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!!photoUri && (
          <>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                O reconhecimento automático de texto ainda não está disponível nesta versão do
                app — a foto fica como referência visual, mas os campos abaixo precisam ser
                preenchidos manualmente.
              </Text>
            </View>
          </>
        )}

        <FormField
          label="Título"
          value={title}
          onChangeText={setTitle}
          placeholder="Nome da receita"
          error={errors.title}
        />

        <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Uma breve descrição da receita..."
          placeholderTextColor={colors.textTertiary}
          multiline
          style={[styles.input, styles.textarea]}
        />

        <View style={[styles.row, styles.fieldSpacing]}>
          <View style={styles.flex1}>
            <FormField
              label="Cozinha / Estilo"
              value={cuisine}
              onChangeText={setCuisine}
              placeholder="Cozinha Caseira"
              error={errors.cuisine}
            />
          </View>
          <View style={[styles.flex1, styles.rowGap]}>
            <FormField
              label="Porções"
              value={servingsText}
              onChangeText={setServingsText}
              keyboardType="numeric"
              placeholder="2"
            />
          </View>
        </View>

        <FormField
          label="Tempo total (minutos)"
          value={totalTimeText}
          onChangeText={setTotalTimeText}
          keyboardType="numeric"
          placeholder="40"
        />

        <Text style={styles.fieldLabel}>DIFICULDADE</Text>
        <View style={styles.chipsRow}>
          {DIFFICULTY_OPTIONS.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={difficulty === option}
              onPress={() => setDifficulty(option)}
            />
          ))}
        </View>

        <Text style={[styles.fieldLabel, styles.fieldSpacing]}>INGREDIENTES</Text>
        {!!errors.ingredients && <Text style={styles.sectionError}>{errors.ingredients}</Text>}
        {ingredients.map((ingredient) => (
          <View key={ingredient.id} style={styles.listRow}>
            <TextInput
              value={ingredient.text}
              onChangeText={(text) => updateIngredient(ingredient.id, text)}
              placeholder="ex.: 320 g de arroz arbório"
              placeholderTextColor={colors.textTertiary}
              style={styles.listInput}
            />
            <Pressable onPress={() => removeIngredient(ingredient.id)} hitSlop={8}>
              <Feather name="x" size={16} color={colors.textTertiary} />
            </Pressable>
          </View>
        ))}
        <Pressable style={styles.dashedButton} onPress={addIngredient}>
          <Text style={styles.dashedButtonText}>+ Adicionar ingrediente</Text>
        </Pressable>

        <Text style={[styles.fieldLabel, styles.fieldSpacing]}>MODO DE PREPARO</Text>
        {!!errors.steps && <Text style={styles.sectionError}>{errors.steps}</Text>}
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepCard}>
            <Text style={styles.stepLabel}>Passo {index + 1}</Text>
            <TextInput
              value={step.text}
              onChangeText={(text) => updateStep(step.id, text)}
              multiline
              placeholder="Descreva este passo..."
              placeholderTextColor={colors.textTertiary}
              style={styles.stepInput}
            />
          </View>
        ))}
        <Pressable style={styles.dashedButton} onPress={addStep}>
          <Text style={styles.dashedButtonText}>+ Adicionar passo</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerHint}>Validação automática antes de salvar</Text>
        <Button label="Salvar" style={styles.saveButton} onPress={handleSave} loading={saving} disabled={saving} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  draftLabel: { fontSize: 12, color: colors.textTertiary },
  content: { paddingHorizontal: spacing.l, paddingBottom: spacing.xxxl },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: radii.l,
    backgroundColor: colors.placeholder,
    marginBottom: spacing.m,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.m,
    padding: spacing.l,
    marginBottom: spacing.l,
  },
  infoText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.s,
  },
  fieldSpacing: { marginTop: spacing.l },
  input: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    fontSize: 15,
    color: colors.ink,
  },
  textarea: { minHeight: 70, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  flex1: { flex: 1 },
  rowGap: { marginLeft: spacing.m },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  sectionError: { fontSize: 12, color: colors.danger, marginBottom: spacing.s },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  listInput: { flex: 1, fontSize: 15, color: colors.ink, paddingVertical: spacing.s },
  dashedButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingVertical: spacing.l,
    alignItems: 'center',
    marginTop: spacing.m,
  },
  dashedButtonText: { fontSize: 14, color: colors.textTertiary },
  stepCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.m,
    padding: spacing.l,
    marginTop: spacing.m,
  },
  stepLabel: { fontSize: 12, color: colors.textTertiary, marginBottom: spacing.s },
  stepInput: { fontSize: 15, color: colors.ink, lineHeight: 21 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  footerHint: { fontSize: 12, color: colors.textTertiary, flex: 1, marginRight: spacing.m },
  saveButton: { paddingHorizontal: spacing.xl, minHeight: 48 },
});
