import { store } from '../../db/store';
import { normalizeText } from '../../utils/normalize';
import { PantryItem, PantryItemCreateInput, PantryItemUpdateInput } from './pantry.types';

export const pantryRepository = {
  list(ownerId: string): PantryItem[] {
    return Array.from(store.pantryItems.values())
      .filter((item) => item.ownerId === ownerId)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  },

  findById(id: string): PantryItem | undefined {
    return store.pantryItems.get(id);
  },

  findByNormalizedNameAndUnit(ownerId: string, name: string, unit: string): PantryItem | undefined {
    const n = normalizeText(name);
    const u = normalizeText(unit);
    return Array.from(store.pantryItems.values()).find(
      (item) => item.ownerId === ownerId && normalizeText(item.name) === n && normalizeText(item.unit) === u
    );
  },

  create(ownerId: string, input: PantryItemCreateInput): PantryItem {
    const now = new Date().toISOString();
    const item: PantryItem = {
      id: crypto.randomUUID(),
      ownerId,
      name: input.name,
      quantity: input.quantity,
      unit: input.unit,
      category: input.category,
      expiresAt: input.expiresAt ?? null,
      urgent: false,
      createdAt: now,
      updatedAt: now,
    };
    store.pantryItems.set(item.id, item);
    return item;
  },

  incrementQuantity(id: string, delta: number): PantryItem {
    const item = store.pantryItems.get(id);
    if (!item) throw new Error(`Pantry item ${id} not found`);
    item.quantity += delta;
    item.updatedAt = new Date().toISOString();
    return item;
  },

  update(id: string, patch: PantryItemUpdateInput): PantryItem | undefined {
    const item = store.pantryItems.get(id);
    if (!item) return undefined;
    Object.assign(item, patch, { updatedAt: new Date().toISOString() });
    return item;
  },

  remove(id: string): boolean {
    return store.pantryItems.delete(id);
  },
};
