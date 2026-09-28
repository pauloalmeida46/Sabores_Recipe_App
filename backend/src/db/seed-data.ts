/**
 * Raw seed data for the in-memory store, mirroring the tone/shape of
 * app/frontend/src/data/*.ts but re-shaped into the backend's richer,
 * structured domain model (see README.md and BACKEND_DATABASE.md).
 *
 * This file exports plain data only — it must never import from
 * src/db/store.ts (store.ts imports FROM here, not the other way around).
 */
import { Recipe, RecipeIngredient, RecipeStep } from '../modules/recipes/recipes.types';
import { PantryItem } from '../modules/pantry/pantry.types';
import { Profile } from '../modules/profile/profile.types';
import { PlanDay } from '../modules/plan/plan.types';
import { Substitution } from '../modules/substitutions/substitutions.types';
import { HouseholdMeasure, IngredientDensity } from '../modules/conversions/conversions.types';
import { NutritionPer100g } from '../modules/nutrition/nutrition.types';
import type { User } from '../modules/auth/auth.types';
import { hashPassword } from '../utils/password';

const now = '2026-09-22T09:00:00.000Z';

// ---------------------------------------------------------------------------
// Demo/test account (for the school demo) — deterministic id so it's easy to
// reference/debug, real bcrypt hash so it round-trips through the JSON
// snapshot exactly like a real signup would.
// ---------------------------------------------------------------------------

export const DEMO_USER_ID = 'user-teste';

export const seedUsers: User[] = [
  {
    id: DEMO_USER_ID,
    name: 'Usuário Teste',
    email: 'teste@sabores.app',
    passwordHash: hashPassword('Sabores123!'),
    createdAt: now,
  },
];

function ing(
  recipeId: string,
  n: number,
  name: string,
  quantity: number,
  unit: string,
  extra: Partial<RecipeIngredient> = {}
): RecipeIngredient {
  return {
    id: `${recipeId}-ing-${n}`,
    name,
    quantity,
    unit,
    scalingRule: extra.scalingRule ?? 'linear',
    ...extra,
  };
}

function step(
  recipeId: string,
  n: number,
  text: string,
  refs: number[],
  extra: Partial<RecipeStep> = {}
): RecipeStep {
  return {
    id: `${recipeId}-step-${n}`,
    order: n,
    text,
    ingredientRefs: refs.map((r) => `${recipeId}-ing-${r}`),
    ...extra,
  };
}

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------

const risoto: Recipe = {
  id: 'risoto-cogumelos',
  title: 'Risoto de Cogumelos com Ervas Frescas',
  cuisine: 'Cozinha Italiana',
  glyph: 'fork',
  difficulty: 'Intermediário',
  servings: 4,
  prepTimeMin: 10,
  cookTimeMin: 25,
  totalTimeMin: 35,
  durationMin: 35,
  safeForRestrictions: true,
  pantryHave: 5,
  pantryTotal: 7,
  calories: 610,
  costPerServing: 18.5,
  tags: ['Vegetariano'],
  dietTags: ['vegetariano'],
  allergens: ['leite'],
  ingredientInfoComplete: true,
  equipmentCapacityLiters: 4,
  equipmentNeeded: ['Fogão'],
  season: undefined,
  usageCount: 12,
  lastUsedAt: '2026-09-18T19:30:00.000Z',
  ingredients: [
    ing('risoto-cogumelos', 1, 'arroz arbório', 320, 'g'),
    ing('risoto-cogumelos', 2, 'cogumelos frescos', 200, 'g', { isKeyIngredient: true }),
    ing('risoto-cogumelos', 3, 'caldo de legumes', 1, 'l'),
    ing('risoto-cogumelos', 4, 'queijo parmesão', 80, 'g', { allergens: ['leite'] }),
    ing('risoto-cogumelos', 5, 'cebola roxa', 1, 'unid', { note: 'picada' }),
    ing('risoto-cogumelos', 6, 'manjericão fresco', 1, 'a gosto', { scalingRule: 'fixed' }),
    ing('risoto-cogumelos', 7, 'vinho branco seco', 0.5, 'copo'),
  ],
  steps: [
    step('risoto-cogumelos', 1, 'Aqueça o caldo de legumes e mantenha em fogo baixo.', [3]),
    step('risoto-cogumelos', 2, 'Refogue a cebola roxa no azeite até ficar translúcida.', [5], {
      timerSec: 180,
    }),
    step(
      'risoto-cogumelos',
      3,
      'Adicione o arroz arbório e refogue por 2 minutos, mexendo sempre, até ficar translúcido.',
      [1],
      { timerSec: 120, stationLabel: 'Refogar' }
    ),
    step('risoto-cogumelos', 4, 'Adicione o vinho branco e mexa até evaporar.', [7], {
      timerSec: 60,
    }),
    step(
      'risoto-cogumelos',
      5,
      'Adicione o caldo quente aos poucos, uma concha por vez, mexendo sempre.',
      [3],
      { timerSec: 1080 }
    ),
    step('risoto-cogumelos', 6, 'Refogue os cogumelos à parte em manteiga.', [2], {
      timerSec: 300,
    }),
    step('risoto-cogumelos', 7, 'Incorpore os cogumelos e o parmesão ao risoto fora do fogo.', [
      2, 4,
    ]),
    step(
      'risoto-cogumelos',
      8,
      'Finalize com manjericão fresco picado e sirva imediatamente.',
      [6]
    ),
  ],
  nutrition: [
    { label: 'Proteínas', value: 24, goal: 30, unit: 'g' },
    { label: 'Carboidratos', value: 72, goal: 90, unit: 'g' },
    { label: 'Gorduras', value: 21, goal: 25, unit: 'g' },
    { label: 'Fibras', value: 6, goal: 8, unit: 'g' },
    { label: 'Sódio', value: 620, goal: 800, unit: 'mg' },
    { label: 'Açúcar', value: 4, goal: 25, unit: 'g' },
  ],
  createdByUserId: DEMO_USER_ID,
  createdAt: now,
  updatedAt: now,
};

const salmao: Recipe = {
  id: 'salmao-crosta-ervas',
  title: 'Salmão em Crosta de Ervas',
  cuisine: 'Cozinha Contemporânea',
  glyph: 'circle',
  difficulty: 'Fácil',
  servings: 2,
  prepTimeMin: 7,
  cookTimeMin: 15,
  totalTimeMin: 22,
  durationMin: 22,
  safeForRestrictions: true,
  pantryHave: 4,
  pantryTotal: 6,
  calories: 480,
  costPerServing: 24,
  tags: ['Sem glúten'],
  dietTags: ['sem-gluten'],
  allergens: ['peixe'],
  ingredientInfoComplete: true,
  equipmentNeeded: ['Forno'],
  season: undefined,
  usageCount: 8,
  lastUsedAt: '2026-09-15T20:00:00.000Z',
  ingredients: [
    ing('salmao-crosta-ervas', 1, 'filé de salmão', 400, 'g', {
      isKeyIngredient: true,
      allergens: ['peixe'],
    }),
    ing('salmao-crosta-ervas', 2, 'ervas frescas (salsa, endro)', 1, 'a gosto', {
      scalingRule: 'fixed',
    }),
    ing('salmao-crosta-ervas', 3, 'azeite extra virgem', 2, 'colher de sopa'),
    ing('salmao-crosta-ervas', 4, 'farinha de rosca sem glúten', 60, 'g', {
      containsTraceAllergens: ['glúten'],
    }),
    ing('salmao-crosta-ervas', 5, 'limão siciliano', 1, 'unid'),
    ing('salmao-crosta-ervas', 6, 'sal e pimenta', 1, 'a gosto', { scalingRule: 'fixed' }),
  ],
  steps: [
    step(
      'salmao-crosta-ervas',
      1,
      'Tempere o salmão com sal, pimenta e suco de limão.',
      [1, 5, 6]
    ),
    step(
      'salmao-crosta-ervas',
      2,
      'Misture as ervas picadas com a farinha de rosca e o azeite.',
      [2, 4, 3]
    ),
    step(
      'salmao-crosta-ervas',
      3,
      'Cubra o salmão com a crosta de ervas, pressionando levemente.',
      [1]
    ),
    step('salmao-crosta-ervas', 4, 'Asse a 200°C até dourar.', [1], {
      timerSec: 900,
      stationLabel: 'Forno',
    }),
  ],
  nutrition: [
    { label: 'Proteínas', value: 38, goal: 30, unit: 'g' },
    { label: 'Carboidratos', value: 14, goal: 90, unit: 'g' },
    { label: 'Gorduras', value: 26, goal: 25, unit: 'g' },
    { label: 'Fibras', value: 1, goal: 8, unit: 'g' },
    { label: 'Sódio', value: 410, goal: 800, unit: 'mg' },
    { label: 'Açúcar', value: 1, goal: 25, unit: 'g' },
  ],
  createdByUserId: null,
  createdAt: now,
  updatedAt: now,
};

const tagliatelle: Recipe = {
  id: 'tagliatelle-limao-siciliano',
  title: 'Tagliatelle ao Limão Siciliano',
  cuisine: 'Cozinha Italiana',
  glyph: 'lines',
  difficulty: 'Fácil',
  servings: 2,
  prepTimeMin: 5,
  cookTimeMin: 13,
  totalTimeMin: 18,
  durationMin: 18,
  safeForRestrictions: true,
  pantryHave: 5,
  pantryTotal: 5,
  calories: 480,
  costPerServing: 14,
  tags: ['Vegetariano', 'Rápida'],
  dietTags: ['vegetariano', 'rapida'],
  allergens: ['glúten', 'leite'],
  ingredientInfoComplete: true,
  equipmentNeeded: ['Fogão'],
  season: 'verão',
  usageCount: 15,
  lastUsedAt: '2026-09-20T12:15:00.000Z',
  ingredients: [
    ing('tagliatelle-limao-siciliano', 1, 'tagliatelle', 250, 'g', {
      isKeyIngredient: true,
      allergens: ['glúten'],
    }),
    ing('tagliatelle-limao-siciliano', 2, 'limão siciliano', 1, 'unid', {
      note: 'raspas e suco',
    }),
    ing('tagliatelle-limao-siciliano', 3, 'manteiga', 60, 'g', { allergens: ['leite'] }),
    ing('tagliatelle-limao-siciliano', 4, 'queijo parmesão', 40, 'g', { allergens: ['leite'] }),
    ing('tagliatelle-limao-siciliano', 5, 'pimenta-do-reino', 1, 'a gosto', {
      scalingRule: 'fixed',
    }),
  ],
  steps: [
    step(
      'tagliatelle-limao-siciliano',
      1,
      'Cozinhe o tagliatelle em água salgada até al dente.',
      [1],
      { timerSec: 600 }
    ),
    step('tagliatelle-limao-siciliano', 2, 'Derreta a manteiga com as raspas de limão.', [3, 2]),
    step(
      'tagliatelle-limao-siciliano',
      3,
      'Escorra a massa reservando um pouco da água do cozimento.',
      [1]
    ),
    step(
      'tagliatelle-limao-siciliano',
      4,
      'Misture a massa com a manteiga, o suco de limão e o parmesão.',
      [1, 3, 2, 4]
    ),
  ],
  nutrition: [
    { label: 'Proteínas', value: 16, goal: 30, unit: 'g' },
    { label: 'Carboidratos', value: 64, goal: 90, unit: 'g' },
    { label: 'Gorduras', value: 18, goal: 25, unit: 'g' },
    { label: 'Fibras', value: 3, goal: 8, unit: 'g' },
    { label: 'Sódio', value: 380, goal: 800, unit: 'mg' },
    { label: 'Açúcar', value: 2, goal: 25, unit: 'g' },
  ],
  createdByUserId: null,
  createdAt: now,
  updatedAt: now,
};

const tarteTatin: Recipe = {
  id: 'tarte-tatin-maca',
  title: 'Tarte Tatin de Maçã',
  cuisine: 'Confeitaria Francesa',
  glyph: 'plus',
  difficulty: 'Avançado',
  servings: 8,
  prepTimeMin: 25,
  cookTimeMin: 30,
  totalTimeMin: 55,
  durationMin: 55,
  safeForRestrictions: false,
  pantryHave: 3,
  pantryTotal: 6,
  calories: 340,
  costPerServing: 9,
  tags: ['Sobremesa'],
  dietTags: ['sobremesa'],
  allergens: ['leite', 'glúten'],
  ingredientInfoComplete: true,
  equipmentNeeded: ['Forno', 'Fôrma'],
  season: 'outono',
  usageCount: 3,
  lastUsedAt: '2026-08-30T16:00:00.000Z',
  ingredients: [
    ing('tarte-tatin-maca', 1, 'maçã', 6, 'unid', { note: 'médias' }),
    ing('tarte-tatin-maca', 2, 'açúcar', 150, 'g'),
    ing('tarte-tatin-maca', 3, 'manteiga', 80, 'g', { allergens: ['leite'] }),
    ing('tarte-tatin-maca', 4, 'massa folhada', 1, 'unid', {
      isKeyIngredient: true,
      allergens: ['glúten', 'leite'],
    }),
    ing('tarte-tatin-maca', 5, 'canela em pó', 1, 'a gosto', { scalingRule: 'sqrt' }),
    ing('tarte-tatin-maca', 6, 'fermento em pó', 5, 'g', { scalingRule: 'sqrt' }),
  ],
  steps: [
    step('tarte-tatin-maca', 1, 'Prepare um caramelo com açúcar e manteiga na fôrma.', [2, 3], {
      timerSec: 480,
    }),
    step('tarte-tatin-maca', 2, 'Descasque e corte as maçãs ao meio.', [1]),
    step('tarte-tatin-maca', 3, 'Arrume as maçãs sobre o caramelo.', [1]),
    step('tarte-tatin-maca', 4, 'Cubra com a massa folhada, ajustando as bordas.', [4]),
    step('tarte-tatin-maca', 5, 'Asse a 190°C até a massa dourar.', [4, 1], {
      timerSec: 1800,
      stationLabel: 'Forno',
    }),
    step('tarte-tatin-maca', 6, 'Desenforme virada ainda morna.', []),
  ],
  nutrition: [
    { label: 'Proteínas', value: 3, goal: 30, unit: 'g' },
    { label: 'Carboidratos', value: 48, goal: 90, unit: 'g' },
    { label: 'Gorduras', value: 14, goal: 25, unit: 'g' },
    { label: 'Fibras', value: 3, goal: 8, unit: 'g' },
    { label: 'Sódio', value: 90, goal: 800, unit: 'mg' },
    { label: 'Açúcar', value: 32, goal: 25, unit: 'g' },
  ],
  createdByUserId: null,
  createdAt: now,
  updatedAt: now,
};

const sopa: Recipe = {
  id: 'sopa-abobora-assada',
  title: 'Sopa de Abóbora Assada',
  cuisine: 'Cozinha Caseira',
  glyph: 'fork',
  difficulty: 'Fácil',
  servings: 4,
  prepTimeMin: 10,
  cookTimeMin: 30,
  totalTimeMin: 40,
  durationMin: 40,
  safeForRestrictions: true,
  pantryHave: 3,
  pantryTotal: 3,
  calories: 210,
  costPerServing: 8,
  tags: ['Vegano', 'Sem glúten'],
  dietTags: ['vegano', 'sem-gluten'],
  allergens: [],
  ingredientInfoComplete: true,
  equipmentCapacityLiters: 3,
  equipmentNeeded: ['Forno', 'Liquidificador'],
  season: 'inverno',
  usageCount: 20,
  lastUsedAt: '2026-09-21T11:00:00.000Z',
  ingredients: [
    ing('sopa-abobora-assada', 1, 'abóbora', 1, 'unid', {
      note: 'média, em cubos',
      isKeyIngredient: true,
    }),
    ing('sopa-abobora-assada', 2, 'azeite', 2, 'colher de sopa'),
    ing('sopa-abobora-assada', 3, 'caldo de legumes', 1, 'l'),
  ],
  steps: [
    step(
      'sopa-abobora-assada',
      1,
      'Asse a abóbora com azeite e sal por 25 minutos a 200°C.',
      [1, 2],
      { timerSec: 1500, stationLabel: 'Forno' }
    ),
    step(
      'sopa-abobora-assada',
      2,
      'Bata a abóbora assada com o caldo até obter um creme liso.',
      [1, 3]
    ),
  ],
  nutrition: [
    { label: 'Proteínas', value: 4, goal: 30, unit: 'g' },
    { label: 'Carboidratos', value: 28, goal: 90, unit: 'g' },
    { label: 'Gorduras', value: 8, goal: 25, unit: 'g' },
    { label: 'Fibras', value: 5, goal: 8, unit: 'g' },
    { label: 'Sódio', value: 520, goal: 800, unit: 'mg' },
    { label: 'Açúcar', value: 6, goal: 25, unit: 'g' },
  ],
  createdByUserId: DEMO_USER_ID,
  createdAt: now,
  updatedAt: now,
};

export const seedRecipes: Recipe[] = [risoto, salmao, tagliatelle, tarteTatin, sopa];

// ---------------------------------------------------------------------------
// Pantry
// ---------------------------------------------------------------------------

export const seedPantryItems: PantryItem[] = [
  { id: 'p1', name: 'Tomate', quantity: 1.2, unit: 'kg', category: 'Hortaliças', expiresAt: '2026-09-24', urgent: true, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p2', name: 'Cebola roxa', quantity: 4, unit: 'unid', category: 'Hortaliças', expiresAt: '2026-10-06', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p3', name: 'Manjericão fresco', quantity: 1, unit: 'maço', category: 'Hortaliças', expiresAt: '2026-09-23', urgent: true, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p4', name: 'Abóbora', quantity: 1, unit: 'kg', category: 'Hortaliças', expiresAt: '2026-09-29', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p5', name: 'Alho', quantity: 1, unit: 'cabeça', category: 'Hortaliças', expiresAt: '2026-10-13', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p6', name: 'Limão siciliano', quantity: 3, unit: 'unid', category: 'Hortaliças', expiresAt: '2026-09-29', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p7', name: 'Filé de salmão', quantity: 400, unit: 'g', category: 'Proteínas', expiresAt: '2026-09-27', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p8', name: 'Ovos', quantity: 8, unit: 'unid', category: 'Proteínas', expiresAt: '2026-10-13', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p9', name: 'Peito de frango', quantity: 600, unit: 'g', category: 'Proteínas', expiresAt: '2026-09-26', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p10', name: 'Queijo parmesão', quantity: 80, unit: 'g', category: 'Proteínas', expiresAt: '2026-11-22', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p11', name: 'Arroz arbório', quantity: 500, unit: 'g', category: 'Grãos & Massas', expiresAt: '2027-03-22', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p12', name: 'Tagliatelle', quantity: 250, unit: 'g', category: 'Grãos & Massas', expiresAt: '2027-01-22', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p13', name: 'Arroz branco', quantity: 1, unit: 'kg', category: 'Grãos & Massas', expiresAt: '2027-05-22', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p14', name: 'Farinha de trigo', quantity: 1, unit: 'kg', category: 'Grãos & Massas', expiresAt: '2027-02-22', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p15', name: 'Feijão preto', quantity: 500, unit: 'g', category: 'Grãos & Massas', expiresAt: '2027-07-22', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p16', name: 'Azeite extra virgem', quantity: 0.5, unit: 'l', category: 'Temperos & Outros', expiresAt: null, urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p17', name: 'Sal grosso', quantity: 1, unit: 'kg', category: 'Temperos & Outros', expiresAt: null, urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p18', name: 'Manteiga', quantity: 200, unit: 'g', category: 'Temperos & Outros', expiresAt: '2026-10-13', urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p19', name: 'Pimenta-do-reino', quantity: 50, unit: 'g', category: 'Temperos & Outros', expiresAt: null, urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
  { id: 'p20', name: 'Vinho branco seco', quantity: 1, unit: 'garrafa', category: 'Temperos & Outros', expiresAt: null, urgent: false, ownerId: DEMO_USER_ID, createdAt: now, updatedAt: now },
];

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

/**
 * Fresh default profile for a brand-new account — used both to seed the demo
 * user (further customized below with rich restrictions/equipment) and, at
 * signup time, for every new signup (see profile.repository.ts's `ensure`).
 * A new user hasn't declared any restrictions yet and hasn't told us which
 * equipment they own, so restrictions start empty and every equipment item
 * starts inactive; preferences/dailyGoals get sensible generic defaults.
 */
export function createDefaultProfile(ownerId: string): Profile {
  return {
    id: `profile-${ownerId}`,
    ownerId,
    name: '',
    firstName: '',
    restrictions: [],
    skillLevel: 'Iniciante',
    equipment: [
      { id: 'e1', label: 'Forno', active: false },
      { id: 'e2', label: 'Air fryer', active: false },
      { id: 'e3', label: 'Panela de pressão', active: false },
      { id: 'e4', label: 'Batedeira', active: false },
      { id: 'e5', label: 'Processador', active: false },
      { id: 'e6', label: 'Fogão lento', active: false },
    ],
    preferences: {
      expiryNoticeDays: 3,
      syncDevices: true,
      autoBackup: 'Diário',
    },
    dailyGoals: {
      calories: 2000,
      protein: 75,
      carbs: 250,
      fat: 65,
      fiber: 25,
      sodium: 2300,
      sugar: 50,
    },
  };
}

export const seedProfile: Profile = {
  ...createDefaultProfile(DEMO_USER_ID),
  id: 'profile-1',
  name: 'Paulo Almeida',
  firstName: 'Paulo',
  restrictions: [
    { id: 'r1', label: 'Doença celíaca', kind: 'allergy', allergenKey: 'glúten', active: true },
    { id: 'r2', label: 'Intolerância à lactose', kind: 'allergy', allergenKey: 'leite', active: false },
    { id: 'r3', label: 'Diabetes', kind: 'diet', active: true },
    { id: 'r4', label: 'Alergia a frutos do mar', kind: 'allergy', allergenKey: 'frutos do mar', active: false },
    { id: 'r5', label: 'Alergia a amendoim', kind: 'allergy', allergenKey: 'amendoim', active: false },
  ],
  skillLevel: 'Intermediário',
  equipment: [
    { id: 'e1', label: 'Forno', active: true },
    { id: 'e2', label: 'Air fryer', active: true },
    { id: 'e3', label: 'Panela de pressão', active: false },
    { id: 'e4', label: 'Batedeira', active: true },
    { id: 'e5', label: 'Processador', active: false },
    { id: 'e6', label: 'Fogão lento', active: false },
  ],
};

// ---------------------------------------------------------------------------
// Plan week
// ---------------------------------------------------------------------------

export const seedPlanWeekLabel = '9 — 15 de setembro';

export const seedPlanDays: PlanDay[] = [
  { weekday: 'SEG', dateLabel: '9', almoco: { recipeId: 'sopa-abobora-assada' }, jantar: { recipeId: 'salmao-crosta-ervas' }, lanche: { recipeId: null } },
  { weekday: 'TER', dateLabel: '10', almoco: { recipeId: 'tagliatelle-limao-siciliano' }, jantar: { recipeId: null }, lanche: { recipeId: null } },
  { weekday: 'QUA', dateLabel: '11', almoco: { recipeId: 'tagliatelle-limao-siciliano' }, jantar: { recipeId: 'risoto-cogumelos' }, lanche: { recipeId: null } },
  { weekday: 'QUI', dateLabel: '12', almoco: { recipeId: null }, jantar: { recipeId: 'sopa-abobora-assada' }, lanche: { recipeId: null } },
  { weekday: 'SEX', dateLabel: '13', almoco: { recipeId: 'salmao-crosta-ervas' }, jantar: { recipeId: null }, lanche: { recipeId: null } },
  { weekday: 'SÁB', dateLabel: '14', almoco: { recipeId: null }, jantar: { recipeId: 'tarte-tatin-maca' }, lanche: { recipeId: null } },
  { weekday: 'DOM', dateLabel: '15', almoco: { recipeId: 'risoto-cogumelos' }, jantar: { recipeId: null }, lanche: { recipeId: null } },
];

// ---------------------------------------------------------------------------
// Substitutions
// ---------------------------------------------------------------------------

export const seedSubstitutions: Record<string, Substitution[]> = {
  'queijo parmesão': [
    {
      name: 'Queijo grana padano',
      description: 'Mantém sabor e textura muito próximos',
      confidence: 'Alta confiança',
      ratio: 1,
      functionalNotes: 'Mesma função de finalização salgada e umami; derrete e gratina de forma semelhante.',
    },
    {
      name: 'Queijo pecorino',
      description: 'Sabor um pouco mais salgado e marcante',
      confidence: 'Confiança média',
      ratio: 0.8,
      functionalNotes: 'Reduza a quantidade em ~20% pois o sabor é mais intenso e mais salgado.',
    },
    {
      name: 'Levedura nutricional',
      description: 'Alternativa sem laticínios, sabor mais sutil',
      confidence: 'Confiança baixa',
      ratio: 0.5,
      functionalNotes: 'Não derrete como o queijo; use metade da quantidade para não dominar o sabor.',
    },
  ],
  'vinho branco seco': [
    {
      name: 'Caldo de legumes com limão',
      description: 'Substitui a acidez sem álcool',
      confidence: 'Alta confiança',
      ratio: 1,
      functionalNotes: 'Repõe o líquido de deglaceamento e parte da acidez do vinho.',
    },
    {
      name: 'Vinagre de maçã diluído',
      description: 'Acidez similar, sabor mais forte',
      confidence: 'Confiança média',
      ratio: 0.75,
      functionalNotes: 'Mais ácido que o vinho; use cerca de 3/4 da quantidade e complete com água.',
    },
  ],
  'farinha de rosca sem glúten': [
    {
      name: 'Farinha de amêndoas',
      description: 'Textura levemente mais úmida',
      confidence: 'Alta confiança',
      ratio: 1,
      functionalNotes: 'Mesma função de empanado/crosta; absorve um pouco mais de gordura.',
    },
    {
      name: 'Flocos de milho triturados',
      description: 'Fica mais crocante que o original',
      confidence: 'Confiança média',
      ratio: 1,
      functionalNotes: 'Boa função de crosta crocante; sabor mais neutro.',
    },
  ],
  manteiga: [
    {
      name: 'Óleo de coco',
      description: 'Alternativa vegetal sólida à temperatura ambiente',
      confidence: 'Alta confiança',
      ratio: 0.75,
      functionalNotes: 'Use cerca de 3/4 da quantidade; textura de gordura sólida semelhante em receitas assadas.',
    },
    {
      name: 'Margarina',
      description: 'Substituição direta em quase todas as receitas',
      confidence: 'Alta confiança',
      ratio: 1,
      functionalNotes: 'Função de gordura sólida equivalente; sabor levemente menos encorpado.',
    },
  ],
  açúcar: [
    {
      name: 'Mel',
      description: 'Adoçante líquido natural',
      confidence: 'Confiança média',
      ratio: 0.75,
      functionalNotes: 'Mais doce que o açúcar; use cerca de 3/4 da quantidade e reduza levemente o líquido da receita.',
    },
    {
      name: 'Adoçante culinário',
      description: 'Opção com menor impacto glicêmico',
      confidence: 'Confiança baixa',
      ratio: 0.3,
      functionalNotes: 'Alto poder adoçante; não cumpre a função estrutural do açúcar em massas e caramelos.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Household measures & ingredient densities (US-038/US-039)
// ---------------------------------------------------------------------------

export const seedHouseholdMeasures: HouseholdMeasure[] = [
  { measureName: 'xícara', standardEquivalentMl: 240 },
  { measureName: 'xícara de chá', standardEquivalentMl: 240 },
  { measureName: 'xícara de café', standardEquivalentMl: 50 },
  { measureName: 'colher de sopa', standardEquivalentMl: 15 },
  { measureName: 'colher de chá', standardEquivalentMl: 5 },
  { measureName: 'copo americano', standardEquivalentMl: 190 },
];

export const seedIngredientDensities: IngredientDensity[] = [
  { ingredient: 'água', gramsPerMl: 1.0 },
  { ingredient: 'leite', gramsPerMl: 1.03 },
  { ingredient: 'óleo', gramsPerMl: 0.92 },
  { ingredient: 'azeite', gramsPerMl: 0.92 },
  { ingredient: 'azeite extra virgem', gramsPerMl: 0.92 },
  { ingredient: 'açúcar', gramsPerMl: 0.85 },
  { ingredient: 'farinha de trigo', gramsPerMl: 0.53 },
  { ingredient: 'manteiga', gramsPerMl: 0.96 },
  { ingredient: 'arroz', gramsPerMl: 0.85 },
  { ingredient: 'sal', gramsPerMl: 1.2 },
  { ingredient: 'mel', gramsPerMl: 1.42 },
];

// ---------------------------------------------------------------------------
// TACO-style nutrition table (per 100g)
// ---------------------------------------------------------------------------

export const seedNutritionTable: NutritionPer100g[] = [
  { ingredient: 'arroz arbório', calories: 130, protein: 2.7, carbs: 28.6, fat: 0.3, fiber: 0.4, sodium: 1, sugar: 0.1 },
  { ingredient: 'cogumelos frescos', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, sodium: 5, sugar: 2 },
  { ingredient: 'caldo de legumes', calories: 8, protein: 0.3, carbs: 1.5, fat: 0.1, fiber: 0.1, sodium: 350, sugar: 0.5 },
  { ingredient: 'queijo parmesão', calories: 392, protein: 35.8, carbs: 3.2, fat: 25.8, fiber: 0, sodium: 1500, sugar: 0.9 },
  { ingredient: 'cebola roxa', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sodium: 4, sugar: 4.2 },
  { ingredient: 'manjericão fresco', calories: 23, protein: 3.2, carbs: 2.7, fat: 0.6, fiber: 1.6, sodium: 4, sugar: 0.3 },
  { ingredient: 'vinho branco seco', calories: 82, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0, sodium: 5, sugar: 1 },
  { ingredient: 'filé de salmão', calories: 208, protein: 20.4, carbs: 0, fat: 13, fiber: 0, sodium: 59, sugar: 0 },
  { ingredient: 'ervas frescas (salsa, endro)', calories: 36, protein: 3, carbs: 6.3, fat: 0.8, fiber: 3.3, sodium: 56, sugar: 0.9 },
  { ingredient: 'azeite extra virgem', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 2, sugar: 0 },
  { ingredient: 'farinha de rosca sem glúten', calories: 390, protein: 6, carbs: 80, fat: 3, fiber: 2, sodium: 600, sugar: 3 },
  { ingredient: 'limão siciliano', calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3, fiber: 2.8, sodium: 2, sugar: 2.5 },
  { ingredient: 'sal e pimenta', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 38700, sugar: 0 },
  { ingredient: 'tagliatelle', calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sodium: 6, sugar: 0.6 },
  { ingredient: 'manteiga', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, sodium: 11, sugar: 0.1 },
  { ingredient: 'pimenta-do-reino', calories: 251, protein: 10.4, carbs: 64, fat: 3.3, fiber: 25, sodium: 20, sugar: 0.6 },
  { ingredient: 'maçã', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sodium: 1, sugar: 10 },
  { ingredient: 'açúcar', calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sodium: 1, sugar: 100 },
  { ingredient: 'massa folhada', calories: 558, protein: 7, carbs: 45, fat: 40, fiber: 2, sodium: 400, sugar: 2 },
  { ingredient: 'canela em pó', calories: 247, protein: 4, carbs: 81, fat: 1.2, fiber: 53, sodium: 10, sugar: 2.2 },
  { ingredient: 'fermento em pó', calories: 53, protein: 0, carbs: 28, fat: 0, fiber: 0, sodium: 10600, sugar: 0 },
  { ingredient: 'abóbora', calories: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 0.5, sodium: 1, sugar: 2.8 },
  { ingredient: 'azeite', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 2, sugar: 0 },
];
