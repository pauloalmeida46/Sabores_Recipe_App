/**
 * ============================================================================
 * STUB / MOCK — image → recipe extraction (US-008, RF17-18).
 *
 * RF17 explicitly requires the extraction to run "localmente no dispositivo"
 * (on-device). A Node backend cannot legitimately claim to do on-device ML,
 * so this endpoint is a clearly-labeled placeholder: it validates the
 * uploaded image and returns a CANNED/RANDOMIZED structured draft, exactly
 * shaped like the structured editor's input (RecipeDraftPayload), for the
 * client to show in a reviewable form before saving (AC2). Real extraction
 * belongs either on-device (e.g. a local ML Kit / Core ML / TFLite model) or
 * behind a real vision/OCR service — swap this function's body for that call
 * when it exists; nothing else in the API needs to change.
 * ============================================================================
 */
import { RecipeDraftPayload } from './recipes.types';

const CANNED_DRAFTS: RecipeDraftPayload[] = [
  {
    title: 'Omelete de Espinafre e Queijo (extraído de imagem)',
    cuisine: 'Cozinha Caseira',
    difficulty: 'Fácil',
    servings: 2,
    prepTimeMin: 5,
    cookTimeMin: 8,
    totalTimeMin: 13,
    tags: ['Vegetariano'],
    ingredients: [
      { id: 'r-ing-1', name: 'ovos', quantity: 4, unit: 'unid', scalingRule: 'linear' },
      { id: 'r-ing-2', name: 'espinafre', quantity: 100, unit: 'g', scalingRule: 'linear' },
      { id: 'r-ing-3', name: 'queijo minas', quantity: 60, unit: 'g', scalingRule: 'linear' },
      { id: 'r-ing-4', name: 'sal', quantity: 1, unit: 'a gosto', scalingRule: 'fixed' },
    ],
    steps: [
      { id: 'r-step-1', order: 1, text: 'Bata os ovos com sal.', ingredientRefs: ['r-ing-1', 'r-ing-4'] },
      { id: 'r-step-2', order: 2, text: 'Refogue o espinafre rapidamente.', timerSec: 120, ingredientRefs: ['r-ing-2'] },
      { id: 'r-step-3', order: 3, text: 'Despeje os ovos na frigideira e adicione o queijo e o espinafre.', timerSec: 300, ingredientRefs: ['r-ing-1', 'r-ing-3', 'r-ing-2'] },
    ],
  },
  {
    title: 'Bowl de Quinoa com Legumes (extraído de imagem)',
    cuisine: 'Cozinha Contemporânea',
    difficulty: 'Fácil',
    servings: 2,
    prepTimeMin: 10,
    cookTimeMin: 20,
    totalTimeMin: 30,
    tags: ['Vegano', 'Sem glúten'],
    ingredients: [
      { id: 'r-ing-1', name: 'quinoa', quantity: 150, unit: 'g', scalingRule: 'linear' },
      { id: 'r-ing-2', name: 'abobrinha', quantity: 1, unit: 'unid', scalingRule: 'linear' },
      { id: 'r-ing-3', name: 'cenoura', quantity: 1, unit: 'unid', scalingRule: 'linear' },
      { id: 'r-ing-4', name: 'azeite', quantity: 1, unit: 'colher de sopa', scalingRule: 'linear' },
    ],
    steps: [
      { id: 'r-step-1', order: 1, text: 'Cozinhe a quinoa em água até secar.', timerSec: 900, ingredientRefs: ['r-ing-1'] },
      { id: 'r-step-2', order: 2, text: 'Refogue os legumes picados no azeite.', timerSec: 480, ingredientRefs: ['r-ing-2', 'r-ing-3', 'r-ing-4'] },
      { id: 'r-step-3', order: 3, text: 'Monte o bowl com a quinoa e os legumes.', ingredientRefs: ['r-ing-1', 'r-ing-2', 'r-ing-3'] },
    ],
  },
];

export const recognizeService = {
  /** Returns a randomized canned draft — the "extracted" result to be reviewed by the user. */
  extractDraftFromImage(): RecipeDraftPayload {
    const template = CANNED_DRAFTS[Math.floor(Math.random() * CANNED_DRAFTS.length)];
    return JSON.parse(JSON.stringify(template));
  },
};
