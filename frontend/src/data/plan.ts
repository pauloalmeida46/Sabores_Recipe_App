import { PlanDay } from './types';

export const planWeekLabel = '9 — 15 de setembro';

export const planDays: PlanDay[] = [
  {
    weekday: 'SEG',
    dateLabel: '9',
    almoco: { recipeId: 'sopa-abobora-assada', calories: 210 },
    jantar: { recipeId: 'salmao-crosta-ervas', calories: 480 },
    lanche: { recipeId: null },
  },
  {
    weekday: 'TER',
    dateLabel: '10',
    almoco: { recipeId: 'tagliatelle-limao-siciliano', calories: 480 },
    jantar: { recipeId: null },
    lanche: { recipeId: null },
  },
  {
    weekday: 'QUA',
    dateLabel: '11',
    almoco: { recipeId: 'tagliatelle-limao-siciliano', calories: 480 },
    jantar: { recipeId: 'risoto-cogumelos', calories: 610 },
    lanche: { recipeId: null },
  },
  {
    weekday: 'QUI',
    dateLabel: '12',
    almoco: { recipeId: null },
    jantar: { recipeId: 'sopa-abobora-assada', calories: 210 },
    lanche: { recipeId: null },
  },
  {
    weekday: 'SEX',
    dateLabel: '13',
    almoco: { recipeId: 'salmao-crosta-ervas', calories: 480 },
    jantar: { recipeId: null },
    lanche: { recipeId: null },
  },
  {
    weekday: 'SÁB',
    dateLabel: '14',
    almoco: { recipeId: null },
    jantar: { recipeId: 'tarte-tatin-maca', calories: 340 },
    lanche: { recipeId: null },
  },
  {
    weekday: 'DOM',
    dateLabel: '15',
    almoco: { recipeId: 'risoto-cogumelos', calories: 610 },
    jantar: { recipeId: null },
    lanche: { recipeId: null },
  },
];

export const selectedDayIndex = 2;
