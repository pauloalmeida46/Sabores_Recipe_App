import { apiDelete, apiGet, apiPatch, apiPost } from './client';

/**
 * Local mirror of the backend's `PantryItem` shape (see
 * app/backend/src/modules/pantry/pantry.types.ts). All pantry routes require
 * auth and are scoped to the authenticated account.
 */
export interface PantryItem {
  id: string;
  ownerId: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiresAt: string | null;
  urgent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PantrySummary {
  total: number;
  expiringSoon: number;
  preparedThisMonth: number;
  byCategory: Record<string, number>;
}

export interface PantryItemCreateInput {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiresAt?: string | null;
}

export interface PantryItemUpdateInput {
  name?: string;
  quantity?: number;
  unit?: string;
  category?: string;
  expiresAt?: string | null;
  urgent?: boolean;
}

export function getPantryItems(): Promise<{ items: PantryItem[] }> {
  return apiGet<{ items: PantryItem[] }>('/pantry');
}

export function getPantrySummary(): Promise<PantrySummary> {
  return apiGet<PantrySummary>('/pantry/summary');
}

export function createPantryItem(input: PantryItemCreateInput): Promise<PantryItem> {
  return apiPost<PantryItem>('/pantry', input);
}

export function updatePantryItem(id: string, input: PantryItemUpdateInput): Promise<PantryItem> {
  return apiPatch<PantryItem>(`/pantry/${id}`, input);
}

export function deletePantryItem(id: string): Promise<void> {
  return apiDelete<void>(`/pantry/${id}`);
}
