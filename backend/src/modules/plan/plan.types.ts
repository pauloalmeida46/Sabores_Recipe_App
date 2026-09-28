export type Weekday = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SÁB' | 'DOM';
export type MealSlot = 'almoco' | 'jantar' | 'lanche';

export const WEEKDAYS: Weekday[] = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
export const MEAL_SLOTS: MealSlot[] = ['almoco', 'jantar', 'lanche'];

export interface PlanMeal {
  recipeId: string | null;
}

export interface PlanDay {
  weekday: Weekday;
  dateLabel: string;
  almoco: PlanMeal;
  jantar: PlanMeal;
  lanche: PlanMeal;
}

export interface PlanWeek {
  weekLabel: string;
  days: PlanDay[];
}
