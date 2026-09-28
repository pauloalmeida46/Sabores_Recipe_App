import { AppError } from '../../utils/AppError';
import { pantryRepository } from './pantry.repository';
import { PantryItem, PantryItemCreateInput, PantryItemUpdateInput, PantrySummary } from './pantry.types';

export const pantryService = {
  list(ownerId: string): PantryItem[] {
    return pantryRepository.list(ownerId);
  },

  getSummary(ownerId: string): PantrySummary {
    const items = pantryRepository.list(ownerId);
    const now = Date.now();
    const soonThresholdMs = 4 * 24 * 60 * 60 * 1000; // 4 days, mirrors "vence em X dias" mock tone
    const byCategory: Record<string, number> = {};
    let expiringSoon = 0;
    for (const item of items) {
      byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
      if (item.expiresAt) {
        const diff = new Date(item.expiresAt).getTime() - now;
        if (diff >= 0 && diff <= soonThresholdMs) expiringSoon += 1;
      }
    }
    return {
      total: items.length,
      expiringSoon,
      preparedThisMonth: 12, // static placeholder — no "prepared recipe" history tracked in Sprint 1
      byCategory,
    };
  },

  create(ownerId: string, input: PantryItemCreateInput): PantryItem {
    const existing = pantryRepository.findByNormalizedNameAndUnit(ownerId, input.name, input.unit);
    if (existing) {
      return pantryRepository.incrementQuantity(existing.id, input.quantity);
    }
    return pantryRepository.create(ownerId, input);
  },

  update(ownerId: string, id: string, patch: PantryItemUpdateInput): PantryItem {
    if (patch.quantity !== undefined && patch.quantity <= 0) {
      throw AppError.badRequest('Quantidade deve ser maior que zero.');
    }
    const existing = pantryRepository.findById(id);
    if (!existing || existing.ownerId !== ownerId) {
      throw AppError.notFound(`Item de despensa ${id} não encontrado.`);
    }
    const updated = pantryRepository.update(id, patch);
    if (!updated) throw AppError.notFound(`Item de despensa ${id} não encontrado.`);
    return updated;
  },

  remove(ownerId: string, id: string): void {
    const existing = pantryRepository.findById(id);
    if (!existing || existing.ownerId !== ownerId) {
      throw AppError.notFound(`Item de despensa ${id} não encontrado.`);
    }
    pantryRepository.remove(id);
  },
};
