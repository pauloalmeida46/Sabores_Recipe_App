export type RestrictionKind = 'allergy' | 'diet';

export interface Restriction {
  id: string;
  label: string;
  kind: RestrictionKind;
  /** Normalized allergen key this restriction maps to for safety checks (allergy kind only). */
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

export interface Profile {
  id: string;
  ownerId: string;
  name: string;
  firstName: string;
  restrictions: Restriction[];
  skillLevel: 'Iniciante' | 'Intermediário' | 'Avançado';
  equipment: EquipmentItem[];
  preferences: ProfilePreferences;
  dailyGoals: DailyGoals;
}

export interface ProfilePatchInput {
  name?: string;
  firstName?: string;
  skillLevel?: 'Iniciante' | 'Intermediário' | 'Avançado';
  preferences?: Partial<ProfilePreferences>;
  dailyGoals?: Partial<DailyGoals>;
  equipment?: EquipmentItem[];
}
