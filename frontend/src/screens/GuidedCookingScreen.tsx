import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing, typography } from '../theme';
import { RootScreenProps } from '../navigation/types';
import { completeStep, getCookingSession, trackUse, RecipeDetailStep } from '../api/recipes';
import { applyTimerAction, createTimer, getTimers, TimerWithRemaining } from '../api/timers';

function formatTime(totalSeconds: number) {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function GuidedCookingScreen({ navigation, route }: RootScreenProps<'GuidedCooking'>) {
  const recipeId = route.params.recipeId;

  const [title, setTitle] = useState<string>('');
  const [steps, setSteps] = useState<RecipeDetailStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [audioMode, setAudioMode] = useState(false);
  const [messyKitchen, setMessyKitchen] = useState(false);

  const [timers, setTimers] = useState<TimerWithRemaining[]>([]);
  // Steps a timer has already been auto-started for in this session, so
  // revisiting a step (e.g. via "Etapa anterior") never spawns a duplicate.
  const startedStepIds = useRef<Set<string>>(new Set());

  const step = steps[stepIndex];
  const totalSteps = steps.length;
  const isLastStep = totalSteps > 0 && stepIndex === totalSteps - 1;
  const progress = totalSteps > 0 ? (stepIndex + 1) / totalSteps : 0;

  useEffect(() => {
    setLoading(true);
    setError(null);
    getCookingSession(recipeId)
      .then((session) => {
        setTitle(session.title);
        setSteps(session.steps);
        setStepIndex(0);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o modo de preparo guiado.');
      })
      .finally(() => setLoading(false));
  }, [recipeId]);

  const pollTimers = useCallback(() => {
    getTimers()
      .then((result) => setTimers(result.timers))
      .catch(() => {
        // Transient poll failures just skip a refresh — the next poll retries.
      });
  }, []);

  // Poll GET /api/timers every 1s while this screen is focused, so ALL
  // displayed countdowns stay driven by the server's authoritative
  // `remainingSec` rather than hand-rolled client-side countdown math.
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      pollTimers();
      if (!interval) interval = setInterval(pollTimers, 1000);
    };
    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    if (navigation.isFocused()) start();
    const unsubFocus = navigation.addListener('focus', start);
    const unsubBlur = navigation.addListener('blur', stop);
    return () => {
      stop();
      unsubFocus();
      unsubBlur();
    };
  }, [navigation, pollTimers]);

  // Auto-start a timer the first time the user reaches a step that has one.
  useEffect(() => {
    if (!step || !step.timerSec) return;
    if (startedStepIds.current.has(step.id)) return;
    startedStepIds.current.add(step.id);
    createTimer({
      recipeId,
      stepId: step.id,
      label: step.stationLabel || `Etapa ${stepIndex + 1}`,
      durationSec: step.timerSec,
    })
      .then((timer) => {
        setTimers((prev) => [...prev.filter((t) => t.id !== timer.id), timer]);
      })
      .catch(() => {
        // Allow a retry on a later visit if creation failed.
        startedStepIds.current.delete(step.id);
      });
  }, [step, stepIndex, recipeId]);

  function toggleTimer(timer: TimerWithRemaining) {
    const action = timer.status === 'running' ? 'pause' : timer.status === 'paused' ? 'resume' : null;
    if (!action) return;
    applyTimerAction(timer.id, action)
      .then((updated) => {
        setTimers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      })
      .catch(() => {
        // Leave the timer's displayed state as-is; the next poll will resync it.
      });
  }

  function handleComplete() {
    if (!step) return;
    completeStep(recipeId, step.id).catch(() => {
      // Fire-and-forget — we already have the next step locally.
    });
    if (isLastStep) {
      trackUse(recipeId).catch(() => {
        // Nice-to-have side effect, not critical path.
      });
      navigation.replace('RateRecipe', { recipeId });
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.root, styles.centerFill]} edges={['top', 'bottom']}>
        <ActivityIndicator color={colors.kitchenText} />
      </SafeAreaView>
    );
  }

  if (error || !step) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Feather name="x" size={22} color={colors.kitchenText} />
          </Pressable>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error ?? 'Esta receita não tem passos cadastrados.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentTimer = timers.find((t) => t.stepId === step.id);
  const otherTimers = timers.filter(
    (t) => t.id !== currentTimer?.id && (t.status === 'running' || t.status === 'paused')
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="x" size={22} color={colors.kitchenText} />
        </Pressable>
        <Text style={styles.stepCounter}>
          PASSO {stepIndex + 1} DE {totalSteps}
        </Text>
        <Feather name="more-horizontal" size={22} color={colors.kitchenText} />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setAudioMode((v) => !v)}
          style={[styles.toggle, audioMode && styles.toggleActive]}
        >
          <Feather name="mic" size={14} color={audioMode ? colors.kitchenBg : colors.kitchenText} />
          <Text style={[styles.toggleLabel, audioMode && styles.toggleLabelActive]}>Modo áudio</Text>
        </Pressable>
        <Pressable
          onPress={() => setMessyKitchen((v) => !v)}
          style={[styles.toggle, messyKitchen && styles.toggleActive]}
        >
          <Feather name="menu" size={14} color={messyKitchen ? colors.kitchenBg : colors.kitchenText} />
          <Text style={[styles.toggleLabel, messyKitchen && styles.toggleLabelActive]}>
            Cozinha suja
          </Text>
        </Pressable>
      </View>

      {otherTimers.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.otherTimersRow}
          contentContainerStyle={styles.otherTimersContent}
        >
          {otherTimers.map((timer) => (
            <View key={timer.id} style={styles.timerPill}>
              <View style={styles.timerPillText}>
                <Text style={styles.timerPillLabel} numberOfLines={1}>
                  {timer.label}
                </Text>
                <Text style={styles.timerPillValue}>{formatTime(timer.remainingSec)}</Text>
              </View>
              <Pressable onPress={() => toggleTimer(timer)} hitSlop={8} style={styles.timerPillButton}>
                <Feather
                  name={timer.status === 'running' ? 'pause' : 'play'}
                  size={14}
                  color={colors.kitchenText}
                />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.center}>
        <View style={styles.recipePill}>
          <Text style={styles.recipePillText}>{title.split(' com ')[0]}</Text>
        </View>

        <Text style={styles.instruction}>{step.text}</Text>

        {step.timerSec ? (
          <Pressable
            style={styles.timerCircle}
            onPress={() => currentTimer && toggleTimer(currentTimer)}
          >
            <Text style={styles.timerValue}>
              {formatTime(currentTimer ? currentTimer.remainingSec : step.timerSec)}
            </Text>
            {step.stationLabel && <Text style={styles.timerLabel}>{step.stationLabel.toUpperCase()}</Text>}
            {currentTimer?.status === 'paused' && <Text style={styles.timerPaused}>PAUSADO — toque para retomar</Text>}
          </Pressable>
        ) : (
          <View style={styles.noTimer}>
            <Feather name="check-circle" size={32} color={colors.kitchenTextSoft} />
          </View>
        )}

        {step.stationLabel && (
          <View style={styles.stationTag}>
            <Feather name="clock" size={12} color={colors.kitchenTextSoft} />
            <Text style={styles.stationText}>{step.stationLabel}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          style={[styles.footerButton, styles.footerButtonGhost, stepIndex === 0 && styles.footerDisabled]}
        >
          <Text style={styles.footerGhostText}>Etapa anterior</Text>
        </Pressable>
        <Pressable onPress={handleComplete} style={[styles.footerButton, styles.footerButtonSolid]}>
          <Text style={styles.footerSolidText}>{isLastStep ? 'Concluir receita' : 'Concluir etapa'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.kitchenBg, paddingHorizontal: spacing.l },
  centerFill: { alignItems: 'center', justifyContent: 'center' },
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.l },
  errorText: { color: colors.kitchenTextSoft, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  stepCounter: { fontSize: 12, letterSpacing: 1.4, color: colors.kitchenTextSoft, fontWeight: '600' },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(245,242,233,0.15)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: { height: 2, backgroundColor: colors.kitchenText },
  toggleRow: { flexDirection: 'row', gap: spacing.m, marginTop: spacing.xl },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(245,242,233,0.25)',
    borderRadius: radii.s,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  toggleActive: { backgroundColor: colors.kitchenText },
  toggleLabel: { fontSize: 13, color: colors.kitchenText },
  toggleLabelActive: { color: colors.kitchenBg, fontWeight: '600' },
  otherTimersRow: { marginTop: spacing.l, flexGrow: 0 },
  otherTimersContent: { gap: spacing.s, paddingRight: spacing.l },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    backgroundColor: colors.kitchenSurface,
    borderWidth: 1,
    borderColor: 'rgba(245,242,233,0.2)',
    borderRadius: radii.s,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    marginRight: spacing.s,
  },
  timerPillText: { maxWidth: 120 },
  timerPillLabel: { fontSize: 11, color: colors.kitchenTextSoft },
  timerPillValue: { fontSize: 14, fontWeight: '600', color: colors.kitchenText, marginTop: 2 },
  timerPillButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,242,233,0.3)',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  recipePill: {
    borderWidth: 1,
    borderColor: 'rgba(245,242,233,0.3)',
    borderRadius: radii.s,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    marginBottom: spacing.xl,
  },
  recipePillText: { fontSize: 13, color: colors.kitchenTextSoft },
  instruction: {
    fontFamily: typography.cardTitle.fontFamily,
    fontSize: 26,
    lineHeight: 34,
    color: colors.kitchenText,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(245,242,233,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerValue: { fontSize: 48, fontWeight: '300', color: colors.kitchenText },
  timerLabel: { fontSize: 12, letterSpacing: 1.5, color: colors.kitchenTextSoft, marginTop: spacing.s },
  timerPaused: { fontSize: 10, letterSpacing: 1, color: colors.kitchenTextSoft, marginTop: spacing.s },
  noTimer: { paddingVertical: spacing.xl },
  stationTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xxl },
  stationText: { fontSize: 13, color: colors.kitchenTextSoft },
  footer: { flexDirection: 'row', gap: spacing.m, paddingBottom: spacing.l },
  footerButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: radii.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonGhost: { borderWidth: 1, borderColor: 'rgba(245,242,233,0.3)' },
  footerButtonSolid: { backgroundColor: colors.kitchenText },
  footerDisabled: { opacity: 0.35 },
  footerGhostText: { color: colors.kitchenText, fontSize: 15, fontWeight: '600' },
  footerSolidText: { color: colors.kitchenBg, fontSize: 15, fontWeight: '600' },
});
