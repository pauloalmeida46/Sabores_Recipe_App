import { apiDelete, apiGet, apiPatch, apiPost } from './client';

/** Local mirror of the backend's `Profile` shape (see app/backend/src/modules/profile/profile.types.ts). */
export type RestrictionKind = 'allergy' | 'diet';

export interface Restriction {
  id: string;
  label: string;
  kind: RestrictionKind;
  allergenKey?: string;
  active: boolean;
}

export interface EquipmentItem {
  id: string;
  label: string;
  active: boolean;
}

export interface ProfilePreferences {
  expiryNoticeDays: number;
  syncDevices: boolean;
  autoBackup: string;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
}

export type SkillLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Profile {
  id: string;
  name: string;
  firstName: string;
  restrictions: Restriction[];
  skillLevel: SkillLevel;
  equipment: EquipmentItem[];
  preferences: ProfilePreferences;
  dailyGoals: DailyGoals;
}

export interface ProfilePatchInput {
  name?: string;
  firstName?: string;
  skillLevel?: SkillLevel;
  equipment?: EquipmentItem[];
}

export function getProfile(): Promise<Profile> {
  return apiGet<Profile>('/profile');
}

export function patchProfile(input: ProfilePatchInput): Promise<Profile> {
  return apiPatch<Profile>('/profile', input);
}

/** `allergenKey` is only meaningful for kind 'allergy' — the actual ingredient/substance
 * name (e.g. "nozes") the safety-certification check matches against, since a free-text
 * label like "Alergia a nozes" won't match an ingredient's `allergens` tag by itself. */
export function addRestriction(
  label: string,
  kind: RestrictionKind,
  allergenKey?: string
): Promise<Restriction> {
  return apiPost<Restriction>('/profile/restrictions', { label, kind, allergenKey });
}

export function setRestrictionActive(id: string, active: boolean): Promise<Restriction> {
  return apiPatch<Restriction>(`/profile/restrictions/${id}`, { active });
}

export function removeRestriction(id: string): Promise<void> {
  return apiDelete<void>(`/profile/restrictions/${id}`);
}
