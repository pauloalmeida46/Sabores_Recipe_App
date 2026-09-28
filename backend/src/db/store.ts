/**
 * ============================================================================
 * IN-MEMORY DATA STORE — the ONLY place in the codebase allowed to hold raw
 * application data.
 *
 * Architectural rule (see BACKEND_DATABASE.md): only `*.repository.ts` files
 * may import from this module. Services and controllers must never import
 * `store` directly — they call repository methods instead. This keeps a
 * future swap to PostgreSQL/Prisma isolated to store.ts + the repository
 * files, with zero changes needed in services/controllers/routes.
 *
 * (`app.ts` is the one deliberate exception: it calls `store.scheduleSave()`
 * from the autosave middleware. That's composition-root plumbing, not
 * business logic, so it doesn't go through a repository — see README.md.)
 *
 * Persistence: on boot, if data/db.json exists it is loaded and hydrates
 * every Map below instead of running the normal seed step; otherwise the
 * store seeds from seed-data.ts and immediately writes the first snapshot.
 * After that, app.ts's autosave middleware calls scheduleSave() after any
 * mutating 2xx request, which debounces a full re-serialization to disk.
 * ============================================================================
 */
import { Recipe, RecipeDraft, RecipeVariant } from '../modules/recipes/recipes.types';
import { PantryItem } from '../modules/pantry/pantry.types';
import { Profile } from '../modules/profile/profile.types';
import { PlanDay, Weekday } from '../modules/plan/plan.types';
import { Timer } from '../modules/timers/timers.types';
import { Substitution } from '../modules/substitutions/substitutions.types';
import { HouseholdMeasureOverride } from '../modules/conversions/conversions.types';
import { NutritionPer100g } from '../modules/nutrition/nutrition.types';
import type { Session, User } from '../modules/auth/auth.types';
import { normalizeText } from '../utils/normalize';
import { loadSnapshot, scheduleSnapshotSave, writeSnapshot } from './persistence';
import {
  seedRecipes,
  seedPantryItems,
  seedProfile,
  seedPlanDays,
  seedPlanWeekLabel,
  seedSubstitutions,
  seedHouseholdMeasures,
  seedIngredientDensities,
  seedNutritionTable,
  seedUsers,
  DEMO_USER_ID,
} from './seed-data';

type HouseholdMeasureDefault = { measureName: string; standardEquivalentMl: number };

class Store {
  recipes = new Map<string, Recipe>();
  recipeDrafts = new Map<string, RecipeDraft>();
  recipeVariants = new Map<string, RecipeVariant>();
  pantryItems = new Map<string, PantryItem>();
  timers = new Map<string, Timer>();
  /** Keyed by ownerId — each account has its own week, keyed internally by Weekday. */
  planWeeks = new Map<string, Map<Weekday, PlanDay>>();
  /** Keyed by ownerId. */
  planWeekLabels = new Map<string, string>();
  /** Keyed by normalized ingredient name. */
  substitutions = new Map<string, Substitution[]>();
  /** Keyed by normalized measure name; value keeps the original display name (with accents). */
  householdMeasureDefaults = new Map<string, HouseholdMeasureDefault>();
  /** Keyed by `${ownerId}::${normalizedMeasureName}`. */
  householdMeasureOverrides = new Map<string, HouseholdMeasureOverride>();
  /** Keyed by normalized ingredient name, grams per ml. */
  ingredientDensities = new Map<string, number>();
  /** Keyed by normalized ingredient name. */
  nutritionTable = new Map<string, NutritionPer100g>();
  users = new Map<string, User>();
  /** Keyed by session token. */
  sessions = new Map<string, Session>();
  /** Keyed by ownerId — one profile per account (see profile.repository.ts). */
  profiles = new Map<string, Profile>();

  constructor() {
    const snapshot = loadSnapshot();
    if (snapshot) {
      this.hydrate(snapshot);
      // eslint-disable-next-line no-console
      console.log('[store] snapshot carregado de data/db.json (dados persistidos de uma execução anterior)');
    } else {
      this.seed();
      // eslint-disable-next-line no-console
      console.log('[store] nenhum data/db.json encontrado — dados semeados a partir de seed-data.ts');
      this.persistNow();
    }
  }

  private seed() {
    for (const recipe of seedRecipes) this.recipes.set(recipe.id, recipe);
    for (const item of seedPantryItems) this.pantryItems.set(item.id, item);
    for (const user of seedUsers) this.users.set(user.id, user);
    const demoWeek = new Map<Weekday, PlanDay>();
    for (const day of seedPlanDays) demoWeek.set(day.weekday, day);
    this.planWeeks.set(DEMO_USER_ID, demoWeek);
    this.planWeekLabels.set(DEMO_USER_ID, seedPlanWeekLabel);
    this.profiles.set(seedProfile.ownerId, seedProfile);
    for (const [key, subs] of Object.entries(seedSubstitutions)) {
      this.substitutions.set(normalizeText(key), subs);
    }
    for (const measure of seedHouseholdMeasures) {
      this.householdMeasureDefaults.set(normalizeText(measure.measureName), measure);
    }
    for (const density of seedIngredientDensities) {
      this.ingredientDensities.set(normalizeText(density.ingredient), density.gramsPerMl);
    }
    for (const entry of seedNutritionTable) {
      this.nutritionTable.set(normalizeText(entry.ingredient), entry);
    }
  }

  private hydrate(snapshot: Record<string, unknown>) {
    const entries = <T,>(key: string): T[] => (snapshot[key] as T[] | undefined) ?? [];
    this.recipes = new Map(entries<[string, Recipe]>('recipes'));
    this.recipeDrafts = new Map(entries<[string, RecipeDraft]>('recipeDrafts'));
    this.recipeVariants = new Map(entries<[string, RecipeVariant]>('recipeVariants'));
    this.pantryItems = new Map(entries<[string, PantryItem]>('pantryItems'));
    this.timers = new Map(entries<[string, Timer]>('timers'));
    const planWeeksEntries = entries<[string, Array<[Weekday, PlanDay]>]>('planWeeks');
    this.planWeeks = new Map(planWeeksEntries.map(([ownerId, days]) => [ownerId, new Map(days)]));
    const planWeekLabelsEntries = entries<[string, string]>('planWeekLabels');
    this.planWeekLabels = new Map(planWeekLabelsEntries);
    // Backward-compat fallback for a snapshot written before plan became
    // per-account — seed the demo user's week from the old single-week shape
    // (or fresh seed data) so an old data/db.json doesn't leave it empty.
    if (this.planWeeks.size === 0) {
      const legacyDays = entries<[Weekday, PlanDay]>('planDays');
      const demoWeek = new Map<Weekday, PlanDay>(legacyDays.length > 0 ? legacyDays : seedPlanDays.map((d) => [d.weekday, d]));
      this.planWeeks.set(DEMO_USER_ID, demoWeek);
      this.planWeekLabels.set(DEMO_USER_ID, (snapshot.planWeekLabel as string | undefined) ?? seedPlanWeekLabel);
    }
    this.substitutions = new Map(entries<[string, Substitution[]]>('substitutions'));
    this.householdMeasureDefaults = new Map(entries<[string, HouseholdMeasureDefault]>('householdMeasureDefaults'));
    this.householdMeasureOverrides = new Map(entries<[string, HouseholdMeasureOverride]>('householdMeasureOverrides'));
    this.ingredientDensities = new Map(entries<[string, number]>('ingredientDensities'));
    this.nutritionTable = new Map(entries<[string, NutritionPer100g]>('nutritionTable'));
    this.users = new Map(entries<[string, User]>('users'));
    this.sessions = new Map(entries<[string, Session]>('sessions'));
    const profilesEntries = entries<[string, Profile]>('profiles');
    this.profiles = new Map(profilesEntries.length > 0 ? profilesEntries : [[seedProfile.ownerId, seedProfile]]);
  }

  toSnapshot(): Record<string, unknown> {
    return {
      recipes: Array.from(this.recipes.entries()),
      recipeDrafts: Array.from(this.recipeDrafts.entries()),
      recipeVariants: Array.from(this.recipeVariants.entries()),
      pantryItems: Array.from(this.pantryItems.entries()),
      timers: Array.from(this.timers.entries()),
      planWeeks: Array.from(this.planWeeks.entries()).map(
        ([ownerId, days]) => [ownerId, Array.from(days.entries())] as const
      ),
      planWeekLabels: Array.from(this.planWeekLabels.entries()),
      substitutions: Array.from(this.substitutions.entries()),
      householdMeasureDefaults: Array.from(this.householdMeasureDefaults.entries()),
      householdMeasureOverrides: Array.from(this.householdMeasureOverrides.entries()),
      ingredientDensities: Array.from(this.ingredientDensities.entries()),
      nutritionTable: Array.from(this.nutritionTable.entries()),
      users: Array.from(this.users.entries()),
      sessions: Array.from(this.sessions.entries()),
      profiles: Array.from(this.profiles.entries()),
    };
  }

  /** Synchronous, immediate write — used once at boot for the first snapshot. */
  persistNow(): void {
    writeSnapshot(this.toSnapshot());
  }

  /** Debounced autosave — called from app.ts's autosave middleware. */
  scheduleSave(): void {
    scheduleSnapshotSave(() => this.toSnapshot());
  }
}

export const store = new Store();
