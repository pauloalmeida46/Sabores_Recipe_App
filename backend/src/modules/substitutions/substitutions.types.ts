export type SubstitutionConfidence = 'Alta confiança' | 'Confiança média' | 'Confiança baixa';

export interface Substitution {
  name: string;
  description: string;
  confidence: SubstitutionConfidence;
  /** Multiplier applied to the original ingredient quantity when this substitution is used. */
  ratio: number;
  functionalNotes: string;
}
