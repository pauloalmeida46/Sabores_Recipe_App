import { store } from '../../db/store';
import { MealSlot, PlanDay, Weekday, WEEKDAYS } from './plan.types';

const PT_MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

/**
 * Builds a brand-new, empty week (every meal slot `recipeId: null`) anchored
 * to the Monday of the week containing `referenceDate` (defaults to "now").
 * There's no ready-made "week label" for a new account the way the demo
 * user's seeded week has one, so this computes a real one from calendar
 * dates instead of hardcoding a placeholder string.
 */
function buildDefaultWeek(referenceDate: Date = new Date()): { weekLabel: string; days: PlanDay[] } {
  const dow = referenceDate.getDay(); // 0=Sun..6=Sat
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + diffToMonday);

  const days: PlanDay[] = WEEKDAYS.map((weekday, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      weekday,
      dateLabel: String(d.getDate()),
      almoco: { recipeId: null },
      jantar: { recipeId: null },
      lanche: { recipeId: null },
    };
  });

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const weekLabel = `${monday.getDate()} — ${sunday.getDate()} de ${PT_MONTHS[sunday.getMonth()]}`;

  return { weekLabel, days };
}

export const planRepository = {
  /**
   * Creates a fresh, empty week for `ownerId` if one doesn't already exist —
   * idempotent. Called at signup so a brand-new account always has a week to
   * read, and defensively here too so `getWeek`/`setMeal` never crash even
   * for an account that somehow predates provisioning.
   */
  ensure(ownerId: string): void {
    if (store.planWeeks.has(ownerId)) return;
    const { weekLabel, days } = buildDefaultWeek();
    const map = new Map<Weekday, PlanDay>();
    for (const day of days) map.set(day.weekday, day);
    store.planWeeks.set(ownerId, map);
    store.planWeekLabels.set(ownerId, weekLabel);
  },

  getWeek(ownerId: string): { weekLabel: string; days: PlanDay[] } {
    this.ensure(ownerId);
    return {
      weekLabel: store.planWeekLabels.get(ownerId) ?? '',
      days: Array.from(store.planWeeks.get(ownerId)!.values()),
    };
  },

  getDay(ownerId: string, weekday: Weekday): PlanDay | undefined {
    this.ensure(ownerId);
    return store.planWeeks.get(ownerId)?.get(weekday);
  },

  setMeal(ownerId: string, weekday: Weekday, meal: MealSlot, recipeId: string | null): PlanDay | undefined {
    this.ensure(ownerId);
    const day = store.planWeeks.get(ownerId)?.get(weekday);
    if (!day) return undefined;
    day[meal] = { recipeId };
    return day;
  },
};
