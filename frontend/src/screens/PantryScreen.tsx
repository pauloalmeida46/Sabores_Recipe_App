import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen, SearchInput, Badge, Fab, FormField, Button } from '../components';
import { colors, radii, spacing, typography } from '../theme';
import { TabScreenProps } from '../navigation/types';
import {
  createPantryItem,
  deletePantryItem,
  getPantryItems,
  updatePantryItem,
  PantryItem,
} from '../api/pantry';
import { formatExpiryLabel } from '../utils/expiry';

interface FormState {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  expiresAt: string;
}

const EMPTY_FORM: FormState = { name: '', quantity: '', unit: '', category: '', expiresAt: '' };

interface FormErrors {
  name?: string;
  quantity?: string;
  unit?: string;
  category?: string;
  expiresAt?: string;
}

export function PantryScreen({ navigation }: TabScreenProps<'Pantry'>) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getPantryItems()
      .then((result) => setItems(result.items))
      .catch((err) => {
        setItems([]);
        setError(err instanceof Error ? err.message : 'Não foi possível carregar a despensa.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation, load]);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [query, items]);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSubmitError(null);
    setModalVisible(true);
  }

  function openEditModal(item: PantryItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      quantity: String(item.quantity),
      unit: item.unit,
      category: item.category,
      expiresAt: item.expiresAt ?? '',
    });
    setFormErrors({});
    setSubmitError(null);
    setModalVisible(true);
  }

  function closeModal() {
    if (submitting) return;
    setModalVisible(false);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'Nome é obrigatório.';

    const quantityNumber = Number(form.quantity.replace(',', '.'));
    if (!form.quantity.trim() || Number.isNaN(quantityNumber) || quantityNumber <= 0) {
      next.quantity = 'Quantidade deve ser um número maior que zero.';
    }

    if (!form.unit.trim()) next.unit = 'Unidade é obrigatória.';
    if (!form.category.trim()) next.category = 'Categoria é obrigatória.';

    if (form.expiresAt.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(form.expiresAt.trim())) {
      next.expiresAt = 'Use o formato AAAA-MM-DD.';
    }

    return next;
  }

  async function handleSubmit() {
    const validation = validate();
    setFormErrors(validation);
    setSubmitError(null);
    if (Object.keys(validation).length > 0) return;

    const payload = {
      name: form.name.trim(),
      quantity: Number(form.quantity.replace(',', '.')),
      unit: form.unit.trim(),
      category: form.category.trim(),
      expiresAt: form.expiresAt.trim() ? form.expiresAt.trim() : null,
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await updatePantryItem(editingId, payload);
      } else {
        await createPantryItem(payload);
      }
      setModalVisible(false);
      load();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Não foi possível salvar o item.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleDeletePress() {
    if (!editingId) return;
    Alert.alert('Excluir item', `Remover "${form.name}" da despensa?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setSubmitting(true);
          setSubmitError(null);
          try {
            await deletePantryItem(editingId);
            setModalVisible(false);
            load();
          } catch (err) {
            setSubmitError(
              err instanceof Error ? err.message : 'Não foi possível excluir o item.'
            );
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
  }

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={[typography.screenTitle, styles.title]}>Despensa</Text>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar na despensa"
          style={styles.search}
        />

        {loading && <ActivityIndicator color={colors.ink} style={styles.spinner} />}

        {!loading && error && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            {categories.map((category) => {
              const categoryItems = filtered.filter((item) => item.category === category);
              if (categoryItems.length === 0) return null;
              return (
                <View key={category} style={styles.categoryBlock}>
                  <Text style={styles.categoryLabel}>
                    {category.toUpperCase()} · {categoryItems.length}{' '}
                    {categoryItems.length === 1 ? 'ITEM' : 'ITENS'}
                  </Text>
                  {categoryItems.map((item) => {
                    const expiryLabel = formatExpiryLabel(item.expiresAt);
                    return (
                      <Pressable
                        key={item.id}
                        style={styles.row}
                        onPress={() => openEditModal(item)}
                      >
                        <View>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemQty}>
                            {item.quantity} {item.unit}
                          </Text>
                        </View>
                        {!!expiryLabel && (
                          <Badge label={expiryLabel} tone={item.urgent ? 'solid' : 'outline'} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
            {filtered.length === 0 && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  {items.length === 0
                    ? 'Sua despensa está vazia. Toque em + para adicionar o primeiro item.'
                    : 'Nenhum item encontrado para essa busca.'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        <Fab onPress={openCreateModal} />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={typography.cardTitleSmall}>
                {editingId ? 'Editar item' : 'Novo item'}
              </Text>
              <Pressable onPress={closeModal} hitSlop={10}>
                <Feather name="x" size={22} color={colors.ink} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FormField
                label="Nome"
                value={form.name}
                onChangeText={(text) => updateField('name', text)}
                placeholder="ex.: Tomate"
                error={formErrors.name}
              />
              <View style={styles.row2}>
                <View style={styles.flex1}>
                  <FormField
                    label="Quantidade"
                    value={form.quantity}
                    onChangeText={(text) => updateField('quantity', text)}
                    keyboardType="numeric"
                    placeholder="1"
                    error={formErrors.quantity}
                  />
                </View>
                <View style={[styles.flex1, styles.rowGap]}>
                  <FormField
                    label="Unidade"
                    value={form.unit}
                    onChangeText={(text) => updateField('unit', text)}
                    placeholder="kg, unid., g..."
                    error={formErrors.unit}
                  />
                </View>
              </View>
              <FormField
                label="Categoria"
                value={form.category}
                onChangeText={(text) => updateField('category', text)}
                placeholder="ex.: Hortaliças"
                error={formErrors.category}
              />
              <FormField
                label="Validade (opcional)"
                value={form.expiresAt}
                onChangeText={(text) => updateField('expiresAt', text)}
                placeholder="AAAA-MM-DD"
                error={formErrors.expiresAt}
              />

              {!!submitError && <Text style={styles.submitError}>{submitError}</Text>}

              <Button
                label={editingId ? 'Salvar alterações' : 'Adicionar'}
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting}
                style={styles.submitButton}
              />

              {!!editingId && (
                <Pressable
                  onPress={handleDeletePress}
                  disabled={submitting}
                  style={styles.deleteButton}
                >
                  <Feather name="trash-2" size={16} color={colors.danger} />
                  <Text style={styles.deleteButtonText}>Excluir item</Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
  },
  title: {
    marginTop: spacing.s,
    marginBottom: spacing.l,
  },
  search: {
    marginBottom: spacing.xl,
  },
  spinner: {
    marginVertical: spacing.xl,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.m,
    padding: spacing.l,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  list: {
    paddingBottom: 100,
  },
  categoryBlock: {
    marginBottom: spacing.l,
  },
  categoryLabel: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.s,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
  itemQty: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
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
  row2: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  rowGap: {
    marginLeft: spacing.m,
  },
  submitError: {
    fontSize: 12,
    color: colors.danger,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.s,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    marginTop: spacing.l,
    paddingVertical: spacing.s,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
  },
});
