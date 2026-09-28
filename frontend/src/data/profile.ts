export interface ProfilePreferences {
  expiryNoticeDays: number;
  syncDevices: boolean;
  autoBackup: string;
}

export const profile = {
  name: 'Paulo Almeida',
  firstName: 'Paulo',
  restrictions: [
    { id: 'r1', label: 'Doença celíaca', active: true },
    { id: 'r2', label: 'Intolerância à lactose', active: false },
    { id: 'r3', label: 'Diabetes', active: true },
    { id: 'r4', label: 'Alergia a frutos do mar', active: false },
    { id: 'r5', label: 'Alergia a amendoim', active: false },
  ],
  skillLevel: 'Intermediário' as 'Iniciante' | 'Intermediário' | 'Avançado',
  equipment: [
    { id: 'e1', label: 'Forno', active: true },
    { id: 'e2', label: 'Air fryer', active: true },
    { id: 'e3', label: 'Panela de pressão', active: false },
    { id: 'e4', label: 'Batedeira', active: true },
    { id: 'e5', label: 'Processador', active: false },
    { id: 'e6', label: 'Fogão lento', active: false },
  ],
  preferences: {
    expiryNoticeDays: 3,
    syncDevices: true,
    autoBackup: 'Diário',
  } as ProfilePreferences,
};
