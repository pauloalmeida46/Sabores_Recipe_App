export interface PantryItem {
  id: string;
  ownerId: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiresAt: string | null; // ISO date, nullable
  urgent: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface PantrySummary {
  total: number;
  expiringSoon: number;
  preparedThisMonth: number;
  byCategory: Record<string, number>;
}
