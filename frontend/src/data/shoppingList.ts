import { ShoppingItem } from './types';

export const shoppingListItems: ShoppingItem[] = [
  { id: 'sl1', name: 'Cebola roxa', quantity: '2 unid.', category: 'Hortaliças', checked: true },
  { id: 'sl2', name: 'Manjericão fresco', quantity: '1 maço', category: 'Hortaliças', checked: false },
  { id: 'sl3', name: 'Abóbora', quantity: '1 kg', category: 'Hortaliças', checked: false },
  { id: 'sl4', name: 'Filé de salmão', quantity: '400 g', category: 'Proteínas', checked: true },
  { id: 'sl5', name: 'Peito de frango', quantity: '600 g', category: 'Proteínas', checked: false },
  { id: 'sl6', name: 'Arroz arbório', quantity: '500 g', category: 'Grãos & Massas', checked: true },
  { id: 'sl7', name: 'Tagliatelle', quantity: '250 g', category: 'Grãos & Massas', checked: true },
  { id: 'sl8', name: 'Queijo parmesão', quantity: '80 g', category: 'Temperos & Outros', checked: false },
  { id: 'sl9', name: 'Vinho branco seco', quantity: '1 garrafa', category: 'Temperos & Outros', checked: false },
  { id: 'sl10', name: 'Azeite extra virgem', quantity: '—', category: 'Temperos & Outros', checked: true },
];

export const shoppingListWeekLabel = 'Semana de 9 a 15/09';
