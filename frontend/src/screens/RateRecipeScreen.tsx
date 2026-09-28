import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Screen, Placeholder, Button } from '../components';
import { getRecipeById } from '../data';
import { colors, radii, spacing, typography } from '../theme';
import { RootScreenProps } from '../navigation/types';

const DIFFICULTY_OPTIONS = ['Mais fácil', 'Como esperado', 'Mais difícil'];

export function RateRecipeScreen({ navigation, route }: RootScreenProps<'RateRecipe'>) {
  const recipe = getRecipeById(route.params.recipeId);
  const [rating, setRating] = useState(4);
  const [difficulty, setDifficulty] = useState('Como esperado');
  const [timeSpent, setTimeSpent] = useState('');
  const [comment, setComment] = useState('');

  if (!recipe) return null;

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Tabs')} hitSlop={10}>
          <Feather name="x" size={22} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={typography.screenTitle}>Como ficou?</Text>

        <View style={styles.recipeRow}>
          <Placeholder glyph={recipe.glyph} rounded style={styles.thumb} />
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
        </View>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable key={value} onPress={() => setRating(value)} hitSlop={6}>
              <Ionicons
                name={value <= rating ? 'star' : 'star-outline'}
                size={30}
                color={colors.ink}
              />
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>DIFICULDADE PERCEBIDA</Text>
        <View style={styles.segmented}>
          {DIFFICULTY_OPTIONS.map((option) => {
            const active = difficulty === option;
            return (
              <Pressable
                key={option}
                onPress={() => setDifficulty(option)}
                style={[styles.segment, active && styles.segmentActive]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.fieldLabel, styles.fieldSpacing]}>TEMPO REAL GASTO</Text>
        <View style={styles.timeBox}>
          <TextInput
            value={timeSpent}
            onChangeText={setTimeSpent}
            placeholder={`${recipe.durationMin} minutos`}
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
            style={styles.timeInput}
          />
          <Text style={styles.timeHint}>(receita indicava {recipe.durationMin} min)</Text>
        </View>

        <Text style={[styles.fieldLabel, styles.fieldSpacing]}>COMENTÁRIO</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Ficou salgado demais — reduzir sal na próxima vez."
          placeholderTextColor={colors.textTertiary}
          multiline
          style={styles.commentInput}
        />

        <Pressable style={styles.photoBox}>
          <Text style={styles.photoText}>+ Adicionar foto do prato</Text>
        </Pressable>

        <Button
          label="Salvar avaliação"
          style={styles.save}
          onPress={() => navigation.navigate('Tabs')}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.l, paddingVertical: spacing.m },
  content: { paddingHorizontal: spacing.l, paddingBottom: spacing.xxxl },
  recipeRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.l },
  thumb: { width: 56, height: 56, borderRadius: radii.s, marginRight: spacing.m },
  recipeTitle: { flex: 1, fontSize: 18, fontFamily: typography.cardTitleSmall.fontFamily, color: colors.ink },
  starsRow: { flexDirection: 'row', gap: spacing.s, marginTop: spacing.xl },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
    color: colors.textTertiary,
    marginTop: spacing.xl,
    marginBottom: spacing.s,
  },
  fieldSpacing: {},
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
  segmentText: { fontSize: 13, color: colors.ink },
  segmentTextActive: { color: colors.white },
  timeBox: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    padding: spacing.l,
  },
  timeInput: { fontSize: 20, fontWeight: '700', color: colors.ink },
  timeHint: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    padding: spacing.l,
    minHeight: 90,
    fontSize: 15,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  photoBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    borderRadius: radii.s,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  photoText: { fontSize: 14, color: colors.textTertiary },
  save: { marginTop: spacing.xl },
});
