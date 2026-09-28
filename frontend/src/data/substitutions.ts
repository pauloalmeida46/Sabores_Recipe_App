export interface Substitution {
  name: string;
  description: string;
  confidence: 'Alta confiança' | 'Confiança média' | 'Confiança baixa';
}

export const substitutionsByIngredient: Record<string, Substitution[]> = {
  'queijo parmesão': [
    { name: 'Queijo grana padano', description: 'Mantém sabor e textura muito próximos', confidence: 'Alta confiança' },
    { name: 'Queijo pecorino', description: 'Sabor um pouco mais salgado e marcante', confidence: 'Confiança média' },
    { name: 'Levedura nutricional', description: 'Alternativa sem laticínios, sabor mais sutil', confidence: 'Confiança baixa' },
  ],
  'vinho branco seco': [
    { name: 'Caldo de legumes com limão', description: 'Substitui a acidez sem álcool', confidence: 'Alta confiança' },
    { name: 'Vinagre de maçã diluído', description: 'Acidez similar, sabor mais forte', confidence: 'Confiança média' },
  ],
  'farinha de rosca sem glúten': [
    { name: 'Farinha de amêndoas', description: 'Textura levemente mais úmida', confidence: 'Alta confiança' },
    { name: 'Flocos de milho triturados', description: 'Fica mais crocante que o original', confidence: 'Confiança média' },
  ],
};

export function findSubstitutions(ingredientText: string): Substitution[] {
  const key = Object.keys(substitutionsByIngredient).find((k) =>
    ingredientText.toLowerCase().includes(k)
  );
  return key ? substitutionsByIngredient[key] : [];
}
