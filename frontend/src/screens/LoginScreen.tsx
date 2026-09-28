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
import { Screen, FormField, Button, Placeholder } from '../components';
import { colors, radii, spacing, typography } from '../theme';
import { RootScreenProps } from '../navigation/types';
import { useSession } from '../state/SessionContext';

export function LoginScreen({ navigation }: RootScreenProps<'Login'>) {
  const { login } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;

    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = 'Informe seu e-mail.';
    else if (!email.includes('@')) nextErrors.email = 'E-mail inválido.';
    if (!password) nextErrors.password = 'Informe sua senha.';
    else if (password.length < 6) nextErrors.password = 'Mínimo de 6 caracteres.';

    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // Session context updating `user` makes RootNavigator swap to the
      // authed stack automatically — no manual navigation here.
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <Placeholder glyph="fork" rounded size={72} style={styles.logo} />
            <Text style={[typography.screenTitle, styles.brandTitle]}>Sabores</Text>
            <Text style={typography.eyebrow}>Seu assistente pessoal de cozinha</Text>
          </View>

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
            placeholder="Sua senha"
            secureEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <Pressable style={styles.forgotLink} hitSlop={8}>
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </Pressable>

          {!!formError && <Text style={styles.formError}>{formError}</Text>}

          <Button
            label="Entrar"
            onPress={handleSubmit}
            style={styles.submit}
            loading={submitting}
            disabled={submitting}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
            <Text style={styles.footerLink}> Criar conta</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.l, paddingTop: spacing.xxxl },
  brand: { alignItems: 'center', marginBottom: spacing.xxxl },
  logo: { marginBottom: spacing.l, borderRadius: 36 },
  brandTitle: { marginBottom: spacing.s },
  forgotLink: { alignSelf: 'flex-end', marginBottom: spacing.xl, marginTop: -spacing.s },
  forgotText: { fontSize: 13, color: colors.textSecondary },
  formError: { fontSize: 12, color: colors.danger, marginBottom: spacing.l, textAlign: 'center' },
  submit: {},
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.l,
  },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.ink, fontWeight: '700' },
});
