import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Screen, HeaderBar } from '../components';
import { colors, radii, spacing, typography } from '../theme';
import { RootScreenProps } from '../navigation/types';

type OptionKey = 'manual' | 'photo' | 'import';

const OPTIONS: {
  key: OptionKey;
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
}[] = [
  { key: 'manual', icon: 'home', title: 'Digitar manualmente', subtitle: 'Editor estruturado, passo a passo' },
  { key: 'photo', icon: 'camera', title: 'Fotografar receita', subtitle: 'Livro, embalagem ou anotação' },
  {
    key: 'import',
    icon: 'link',
    title: 'Importar de um link ou arquivo',
    subtitle: 'Cole a URL ou envie um arquivo .txt',
  },
];

export function NewRecipeChooseScreen({ navigation }: RootScreenProps<'NewRecipeChoose'>) {
  async function openCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para fotografar a receita.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled || !result.assets?.length) return;
    navigation.navigate('NewRecipeForm', { photoUri: result.assets[0].uri });
  }

  async function openLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso às suas fotos para escolher a imagem da receita.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled || !result.assets?.length) return;
    navigation.navigate('NewRecipeForm', { photoUri: result.assets[0].uri });
  }

  function handlePhotoOption() {
    Alert.alert('Fotografar receita', 'Como você quer adicionar a foto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Tirar foto', onPress: () => openCamera() },
      { text: 'Escolher da galeria', onPress: () => openLibrary() },
    ]);
  }

  function handleOptionPress(key: OptionKey) {
    if (key === 'manual') {
      navigation.navigate('NewRecipeForm');
    } else if (key === 'photo') {
      handlePhotoOption();
    } else {
      // Importar de um link ou arquivo — fora do escopo do Sprint 1, mantido como estava.
      navigation.navigate('NewRecipeForm');
    }
  }

  return (
    <Screen>
      <HeaderBar title="Nova Receita" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Como você quer cadastrar sua receita?</Text>

        {OPTIONS.map((option) => (
          <Pressable key={option.key} style={styles.card} onPress={() => handleOptionPress(option.key)}>
            <View style={styles.iconCircle}>
              <Feather name={option.icon} size={20} color={colors.ink} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textTertiary} />
          </Pressable>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Em qualquer um dos três caminhos, você revisa os dados extraídos antes de salvar — e
            recebe um aviso se a receita parecer duplicada de outra já cadastrada.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.l, paddingBottom: spacing.xxxl },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.m,
    padding: spacing.l,
    marginBottom: spacing.l,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.l,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.ink },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  infoBox: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.m,
    padding: spacing.l,
    marginTop: spacing.m,
  },
  infoText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
});
