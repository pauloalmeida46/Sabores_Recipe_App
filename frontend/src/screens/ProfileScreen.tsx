import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen, Button, IconCircleButton, Chip, FormField } from '../components';
import { colors, radii, spacing, typography } from '../theme';
import { TabScreenProps } from '../navigation/types';
import { useSession } from '../state/SessionContext';
import {
  addRestriction,
  getProfile,
  patchProfile,
  removeRestriction,
  setRestrictionActive,
  EquipmentItem,
  Profile,
  Restriction,
  RestrictionKind,
  SkillLevel,
} from '../api/profile';

const SKILL_LEVELS: SkillLevel[] = ['Iniciante', 'Intermediário', 'Avançado'];

interface RestrictionFormErrors {
  label?: string;
  allergenKey?: string;
}

export function ProfileScreen({ navigation }: TabScreenProps<'Profile'>) {
  const { logout } = useSession();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [skill, setSkill] = useState<SkillLevel>('Iniciante');
  const [equipmentActive, setEquipmentActive] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [restrictionModalVisible, setRestrictionModalVisible] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newKind, setNewKind] = useState<RestrictionKind>('allergy');
  const [newAllergenKey, setNewAllergenKey] = useState('');
  const [restrictionErrors, setRestrictionErrors] = useState<RestrictionFormErrors>({});
  const [restrictionSubmitting, setRestrictionSubmitting] = useState(false);
  const [restrictionSubmitError, setRestrictionSubmitError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getProfile()
      .then((data) => {
        setProfile(data);
        setSkill(data.skillLevel);
        setEquipmentActive(new Set(data.equipment.filter((e) => e.active).map((e) => e.id)));
      })
      .catch((err) => {
        setProfile(null);
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o perfil.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation, load]);

  const toggleEquipment = (id: string) => {
    setEquipmentActive((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  async function handleToggleRestriction(restriction: Restriction) {
    if (!profile) return;
    const nextActive = !restriction.active;
    try {
      const updated = await setRestrictionActive(restriction.id, nextActive);
      setProfile({
        ...profile,
        restrictions: profile.restrictions.map((r) => (r.id === updated.id ? updated : r)),
      });
    } catch (err) {
      Alert.alert(
        'Erro',
        err instanceof Error ? err.message : 'Não foi possível atualizar a restrição.'
      );
    }
  }

  function handleLongPressRestriction(restriction: Restriction) {
    if (!profile) return;
    Alert.alert('Excluir restrição', `Remover "${restriction.label}" da sua conta?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeRestriction(restriction.id);
            setProfile({
              ...profile,
              restrictions: profile.restrictions.filter((r) => r.id !== restriction.id),
            });
          } catch (err) {
            Alert.alert(
              'Erro',
              err instanceof Error ? err.message : 'Não foi possível excluir a restrição.'
            );
          }
        },
      },
    ]);
  }

  function openRestrictionModal() {
    setNewLabel('');
    setNewKind('allergy');
    setNewAllergenKey('');
    setRestrictionErrors({});
    setRestrictionSubmitError(null);
    setRestrictionModalVisible(true);
  }

  function closeRestrictionModal() {
    if (restrictionSubmitting) return;
    setRestrictionModalVisible(false);
  }

  async function handleAddRestriction() {
    const errors: RestrictionFormErrors = {};
    if (!newLabel.trim()) errors.label = 'Nome é obrigatório.';
    if (newKind === 'allergy' && !newAllergenKey.trim()) {
      errors.allergenKey = 'Informe o ingrediente/alérgeno associado.';
    }
    setRestrictionErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setRestrictionSubmitting(true);
    setRestrictionSubmitError(null);
    try {
      const created = await addRestriction(
        newLabel.trim(),
        newKind,
        newKind === 'allergy' ? newAllergenKey.trim() : undefined
      );
      setProfile((prev) => (prev ? { ...prev, restrictions: [...prev.restrictions, created] } : prev));
      setRestrictionModalVisible(false);
    } catch (err) {
      setRestrictionSubmitError(
        err instanceof Error ? err.message : 'Não foi possível adicionar a restrição.'
      );
    } finally {
      setRestrictionSubmitting(false);
    }
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setSaveError(null);
    try {
      const equipment: EquipmentItem[] = profile.equipment.map((e) => ({
        ...e,
        active: equipmentActive.has(e.id),
      }));
      const updated = await patchProfile({ skillLevel: skill, equipment });
      setProfile(updated);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  }

  const restrictions = useMemo(() => profile?.restrictions ?? [], [profile]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading && <ActivityIndicator color={colors.ink} style={styles.spinner} />}

        {!loading && error && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{error}</Text>
          </View>
        )}

        {!loading && !error && profile && (
          <>
            <View style={styles.headerRow}>
              <IconCircleButton size={64}>
                <Feather name="user" size={26} color={colors.ink} />
              </IconCircleButton>
              <View style={styles.headerText}>
                <Text style={typography.cardTitle}>{profile.name}</Text>
                <Text style={styles.editLink}>Editar perfil</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>RESTRIÇÕES ALIMENTARES</Text>
            <Text style={styles.sectionHint}>
              Toque para ativar/desativar. Segure para excluir uma restrição.
            </Text>
            <View style={styles.wrap}>
              {restrictions.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => handleToggleRestriction(r)}
                  onLongPress={() => handleLongPressRestriction(r)}
                  style={[styles.pill, r.active && styles.pillActive]}
                >
                  <Text style={[styles.pillText, r.active && styles.pillTextActive]}>{r.label}</Text>
                </Pressable>
              ))}
              <Pressable style={styles.pill} onPress={openRestrictionModal}>
                <Text style={styles.pillText}>+ Outra</Text>
              </Pressable>
            </View>

            <Text style={[styles.sectionLabel, styles.sectionSpacing]}>NÍVEL DE HABILIDADE</Text>
            <View style={styles.segmented}>
              {SKILL_LEVELS.map((level) => {
                const active = skill === level;
                return (
                  <Pressable
                    key={level}
                    onPress={() => setSkill(level)}
                    style={[styles.segment, active && styles.segmentActive]}
                  >
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                      {level}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionLabel, styles.sectionSpacing]}>EQUIPAMENTOS DISPONÍVEIS</Text>
            <View style={styles.wrap}>
              {profile.equipment.map((e) => {
                const active = equipmentActive.has(e.id);
                return (
                  <Pressable
                    key={e.id}
                    onPress={() => toggleEquipment(e.id)}
                    style={[styles.pill, active && styles.pillActive]}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>{e.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionLabel, styles.sectionSpacing]}>PREFERÊNCIAS</Text>
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Notificações de validade</Text>
              <Text style={styles.prefValue}>{profile.preferences.expiryNoticeDays} dias antes</Text>
            </View>
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Sincronizar entre dispositivos</Text>
              <Text style={styles.prefValue}>
                {profile.preferences.syncDevices ? 'Ativado' : 'Desativado'}
              </Text>
            </View>
            <View style={[styles.prefRow, styles.prefRowLast]}>
              <Text style={styles.prefLabel}>Backup automático</Text>
              <Text style={styles.prefValue}>{profile.preferences.autoBackup}</Text>
            </View>

            {!!saveError && <Text style={styles.submitError}>{saveError}</Text>}
            <Button
              label="Salvar alterações"
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              style={styles.save}
            />

            <Pressable style={styles.logout} onPress={() => logout()}>
              <Feather name="log-out" size={16} color={colors.textSecondary} />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <Modal
        visible={restrictionModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeRestrictionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={typography.cardTitleSmall}>Nova restrição</Text>
              <Pressable onPress={closeRestrictionModal} hitSlop={10}>
                <Feather name="x" size={22} color={colors.ink} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FormField
                label="Nome"
                value={newLabel}
                onChangeText={setNewLabel}
                placeholder="ex.: Alergia a nozes"
                error={restrictionErrors.label}
              />

              <Text style={styles.fieldLabel}>TIPO</Text>
              <View style={styles.kindRow}>
                <Chip
                  label="Alergia"
                  selected={newKind === 'allergy'}
                  onPress={() => setNewKind('allergy')}
                />
                <Chip
                  label="Restrição de dieta"
                  selected={newKind === 'diet'}
                  onPress={() => setNewKind('diet')}
                />
              </View>

              {newKind === 'allergy' && (
                <FormField
                  label="Ingrediente/alérgeno associado"
                  value={newAllergenKey}
                  onChangeText={setNewAllergenKey}
                  placeholder="ex.: nozes"
                  error={restrictionErrors.allergenKey}
                />
              )}

              {!!restrictionSubmitError && (
                <Text style={styles.submitError}>{restrictionSubmitError}</Text>
              )}

              <Button
                label="Adicionar"
                onPress={handleAddRestriction}
                loading={restrictionSubmitting}
                disabled={restrictionSubmitting}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.l, paddingBottom: spacing.xxxl },
  spinner: { marginVertical: spacing.xxxl },
  infoBox: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.m,
    padding: spacing.l,
  },
  infoText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s,
    marginBottom: spacing.xxl,
  },
  headerText: { marginLeft: spacing.l },
  editLink: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.s,
  },
  sectionHint: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: spacing.m,
  },
  sectionSpacing: { marginTop: spacing.xl },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  pill: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  pillActive: { backgroundColor: colors.black, borderColor: colors.black },
  pillText: { fontSize: 14, color: colors.ink },
  pillTextActive: { color: colors.white },
  segmented: { flexDirection: 'row', gap: spacing.s },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
  segmentActive: { backgroundColor: colors.black, borderColor: colors.black },
  segmentText: { fontSize: 14, color: colors.ink },
  segmentTextActive: { color: colors.white },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.l,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  prefRowLast: { borderBottomWidth: 0 },
  prefLabel: { fontSize: 15, color: colors.ink },
  prefValue: { fontSize: 14, color: colors.textSecondary },
  save: { marginTop: spacing.xl },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    marginTop: spacing.xl,
    paddingVertical: spacing.m,
  },
  logoutText: { fontSize: 14, color: colors.textSecondary },
  submitError: {
    fontSize: 12,
    color: colors.danger,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.l,
    borderTopRightRadius: radii.l,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
    paddingBottom: spacing.xxxl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.l,
  },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.s,
    marginTop: spacing.s,
  },
  kindRow: {
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
  submitButton: {
    marginTop: spacing.s,
  },
});
