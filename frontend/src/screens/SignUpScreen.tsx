import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen, HeaderBar, FormField, Button } from '../components';
import { colors, radii, spacing } from '../theme';
import { RootScreenProps } from '../navigation/types';
import { useSession } from '../state/SessionContext';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export function SignUpScreen({ navigation }: RootScreenProps<'SignUp'>) {
  const { signup } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;

    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = 'Informe seu nome.';
    if (!email.trim()) nextErrors.email = 'Informe seu e-mail.';
    else if (!email.includes('@')) nextErrors.email = 'E-mail inválido.';
    if (!password) nextErrors.password = 'Crie uma senha.';
    else if (password.length < 6) nextErrors.password = 'Mínimo de 6 caracteres.';
    if (confirmPassword !== password) nextErrors.confirmPassword = 'As senhas não coincidem.';
    if (!acceptedTerms) nextErrors.terms = 'Você precisa aceitar os termos para continuar.';

    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signup(name.trim(), email.trim(), password);
      // The backend logs the user in immediately on signup (returns a
      // token), so the session context updating `user` makes RootNavigator
      // swap to the authed stack automatically — no manual navigation here.
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <HeaderBar title="Criar conta" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>
            Crie sua conta para salvar sua despensa, receitas e planejamento.
          </Text>

          <FormField
            label="Nome completo"
            placeholder="Como podemos te chamar?"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          <FormField
            label="E-mail"
            placeholder="voce@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          <FormField
            label="Senha"
            placeholder="Crie uma senha"
            secureEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />
          <FormField
            label="Confirmar senha"
            placeholder="Repita a senha"
            secureEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
          />

          <Pressable
            style={styles.termsRow}
            onPress={() => setAcceptedTerms((v) => !v)}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Feather name="check" size={13} color={colors.white} />}
            </View>
            <Text style={styles.termsText}>
              Aceito os termos de uso e a política de privacidade
            </Text>
          </Pressable>
          {!!errors.terms && <Text style={styles.error}>{errors.terms}</Text>}
          {!!formError && <Text style={styles.error}>{formError}</Text>}

          <Button
            label="Criar conta"
            onPress={handleSubmit}
            style={styles.submit}
            loading={submitting}
            disabled={submitting}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={styles.footerLink}> Entrar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.l, paddingTop: spacing.l },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.s,
    marginBottom: spacing.l,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.s,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: colors.black, borderColor: colors.black },
  termsText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  error: { fontSize: 12, color: colors.danger, marginTop: -spacing.s, marginBottom: spacing.l },
  submit: { marginTop: spacing.s },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.l,
  },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.ink, fontWeight: '700' },
});
