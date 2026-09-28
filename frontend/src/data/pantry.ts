import { PantryItem } from './types';

export const pantryItems: PantryItem[] = [
  { id: 'p1', name: 'Tomate', quantity: '1,2 kg', category: 'Hortaliças', expiresLabel: 'vence em 2 dias', urgent: true },
  { id: 'p2', name: 'Cebola roxa', quantity: '4 unid.', category: 'Hortaliças', expiresLabel: '2 semanas', urgent: false },
  { id: 'p3', name: 'Manjericão fresco', quantity: '1 maço', category: 'Hortaliças', expiresLabel: 'vence amanhã', urgent: true },
  { id: 'p4', name: 'Abóbora', quantity: '1 kg', category: 'Hortaliças', expiresLabel: '1 semana', urgent: false },
  { id: 'p5', name: 'Alho', quantity: '1 cabeça', category: 'Hortaliças', expiresLabel: '3 semanas', urgent: false },
  { id: 'p6', name: 'Limão siciliano', quantity: '3 unid.', category: 'Hortaliças', expiresLabel: '1 semana', urgent: false },

  { id: 'p7', name: 'Filé de salmão', quantity: '400 g', category: 'Proteínas', expiresLabel: '5 dias', urgent: false },
  { id: 'p8', name: 'Ovos', quantity: '8 unid.', category: 'Proteínas', expiresLabel: '3 semanas', urgent: false },
  { id: 'p9', name: 'Peito de frango', quantity: '600 g', category: 'Proteínas', expiresLabel: '4 dias', urgent: false },
  { id: 'p10', name: 'Queijo parmesão', quantity: '80 g', category: 'Proteínas', expiresLabel: '2 meses', urgent: false },

  { id: 'p11', name: 'Arroz arbório', quantity: '500 g', category: 'Grãos & Massas', expiresLabel: '6 meses', urgent: false },
  { id: 'p12', name: 'Tagliatelle', quantity: '250 g', category: 'Grãos & Massas', expiresLabel: '4 meses', urgent: false },
  { id: 'p13', name: 'Arroz branco', quantity: '1 kg', category: 'Grãos & Massas', expiresLabel: '8 meses', urgent: false },
  { id: 'p14', name: 'Farinha de trigo', quantity: '1 kg', category: 'Grãos & Massas', expiresLabel: '5 meses', urgent: false },
  { id: 'p15', name: 'Feijão preto', quantity: '500 g', category: 'Grãos & Massas', expiresLabel: '10 meses', urgent: false },

  { id: 'p16', name: 'Azeite extra virgem', quantity: 'Meio litro', category: 'Temperos & Outros', expiresLabel: null, urgent: false },
  { id: 'p17', name: 'Sal grosso', quantity: '1 kg', category: 'Temperos & Outros', expiresLabel: null, urgent: false },
  { id: 'p18', name: 'Manteiga', quantity: '200 g', category: 'Temperos & Outros', expiresLabel: '3 semanas', urgent: false },
  { id: 'p19', name: 'Pimenta-do-reino', quantity: '50 g', category: 'Temperos & Outros', expiresLabel: null, urgent: false },
  { id: 'p20', name: 'Vinho branco seco', quantity: '1 garrafa', category: 'Temperos & Outros', expiresLabel: null, urgent: false },
];

export const pantryCategories = Array.from(new Set(pantryItems.map((i) => i.category)));

export const pantrySummary = {
  total: 27,
  expiringSoon: 3,
  preparedThisMonth: 12,
};
