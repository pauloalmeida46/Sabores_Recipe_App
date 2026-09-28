import { store } from '../../db/store';
import { createDefaultProfile } from '../../db/seed-data';
import { EquipmentItem, Profile, ProfilePatchInput, Restriction, RestrictionKind } from './profile.types';
import { normalizeText } from '../../utils/normalize';

export const profileRepository = {
  find(ownerId: string): Profile | undefined {
    return store.profiles.get(ownerId);
  },

  /**
   * Creates a fresh default profile for `ownerId` if one doesn't already
   * exist — idempotent. Called at signup (auth.service.ts) so every account
   * has exactly one profile from the moment it exists, and defensively on
   * first access here too in case an account somehow predates provisioning.
   */
  ensure(ownerId: string): Profile {
    const existing = store.profiles.get(ownerId);
    if (existing) return existing;
    const profile = createDefaultProfile(ownerId);
    store.profiles.set(ownerId, profile);
    return profile;
  },

  patch(ownerId: string, input: ProfilePatchInput): Profile | undefined {
    const profile = store.profiles.get(ownerId);
    if (!profile) return undefined;
    if (input.name !== undefined) profile.name = input.name;
    if (input.firstName !== undefined) profile.firstName = input.firstName;
    if (input.skillLevel !== undefined) profile.skillLevel = input.skillLevel;
    if (input.preferences) Object.assign(profile.preferences, input.preferences);
    if (input.dailyGoals) Object.assign(profile.dailyGoals, input.dailyGoals);
    if (input.equipment) profile.equipment = input.equipment;
    return profile;
  },

  listRestrictions(ownerId: string): Restriction[] | undefined {
    return store.profiles.get(ownerId)?.restrictions;
  },

  addRestriction(ownerId: string, label: string, kind: RestrictionKind, allergenKey?: string): Restriction | undefined {
    const profile = store.profiles.get(ownerId);
    if (!profile) return undefined;
    const restriction: Restriction = {
      id: crypto.randomUUID(),
      label,
      kind,
      // Prefer an explicitly given allergen name (e.g. "nozes") — falling back to
      // the full label would normalize to something like "alergia a nozes",
      // which never matches an ingredient's `allergens` tag (e.g. "nozes") and
      // silently makes the restriction a no-op for the safety-certification check.
      allergenKey: kind === 'allergy' ? normalizeText(allergenKey || label) : undefined,
      active: true,
    };
    profile.restrictions.push(restriction);
    return restriction;
  },

  removeRestriction(ownerId: string, id: string): boolean {
    const profile = store.profiles.get(ownerId);
    if (!profile) return false;
    const before = profile.restrictions.length;
    profile.restrictions = profile.restrictions.filter((r) => r.id !== id);
    return profile.restrictions.length < before;
  },

  setRestrictionActive(ownerId: string, id: string, active: boolean): Restriction | undefined {
    const profile = store.profiles.get(ownerId);
    if (!profile) return undefined;
    const restriction = profile.restrictions.find((r) => r.id === id);
    if (!restriction) return undefined;
    restriction.active = active;
    return restriction;
  },

  listEquipment(ownerId: string): EquipmentItem[] | undefined {
    return store.profiles.get(ownerId)?.equipment;
  },
};
