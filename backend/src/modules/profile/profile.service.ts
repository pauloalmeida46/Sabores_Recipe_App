import { AppError } from '../../utils/AppError';
import { profileRepository } from './profile.repository';
import { Profile, ProfilePatchInput, Restriction, RestrictionKind } from './profile.types';

export const profileService = {
  get(ownerId: string): Profile {
    const profile = profileRepository.find(ownerId);
    if (!profile) throw AppError.notFound(`Perfil do usuário ${ownerId} não encontrado.`);
    return profile;
  },

  patch(ownerId: string, input: ProfilePatchInput): Profile {
    const updated = profileRepository.patch(ownerId, input);
    if (!updated) throw AppError.notFound(`Perfil do usuário ${ownerId} não encontrado.`);
    return updated;
  },

  listRestrictions(ownerId: string): Restriction[] {
    const restrictions = profileRepository.listRestrictions(ownerId);
    if (!restrictions) throw AppError.notFound(`Perfil do usuário ${ownerId} não encontrado.`);
    return restrictions;
  },

  addRestriction(ownerId: string, label: string, kind: RestrictionKind, allergenKey?: string): Restriction {
    if (!label.trim()) throw AppError.badRequest('O rótulo da restrição é obrigatório.');
    const restriction = profileRepository.addRestriction(ownerId, label.trim(), kind, allergenKey?.trim());
    if (!restriction) throw AppError.notFound(`Perfil do usuário ${ownerId} não encontrado.`);
    return restriction;
  },

  removeRestriction(ownerId: string, id: string): void {
    const removed = profileRepository.removeRestriction(ownerId, id);
    if (!removed) throw AppError.notFound(`Restrição ${id} não encontrada.`);
  },

  setRestrictionActive(ownerId: string, id: string, active: boolean): Restriction {
    const restriction = profileRepository.setRestrictionActive(ownerId, id, active);
    if (!restriction) throw AppError.notFound(`Restrição ${id} não encontrada.`);
    return restriction;
  },

  /**
   * Active restrictions with kind 'allergy', used by the safety-certification
   * logic. `ownerId` is optional so anonymous/unauthenticated callers (e.g. a
   * request with no valid bearer token hitting a public recipe-reading route
   * via `optionalAuth`) get an empty set back — no restrictions are known for
   * them, so nothing gets hidden as unsafe; `ingredientInfoComplete` still
   * drives certified-vs-unknown exactly as before.
   */
  activeAllergenKeys(ownerId?: string): Set<string> {
    if (!ownerId) return new Set();
    const profile = profileRepository.find(ownerId);
    if (!profile) return new Set();
    return new Set(
      profile.restrictions
        .filter((r) => r.active && r.kind === 'allergy' && r.allergenKey)
        .map((r) => r.allergenKey as string)
    );
  },
};
