import { store } from '../../db/store';
import { Timer, TimerCreateInput } from './timers.types';

export const timersRepository = {
  list(ownerId: string): Timer[] {
    return Array.from(store.timers.values())
      .filter((t) => t.ownerId === ownerId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  findById(id: string): Timer | undefined {
    return store.timers.get(id);
  },

  create(ownerId: string, input: TimerCreateInput): Timer {
    const now = new Date();
    const nowIso = now.toISOString();
    const timer: Timer = {
      id: crypto.randomUUID(),
      ownerId,
      recipeId: input.recipeId,
      stepId: input.stepId,
      label: input.label,
      durationSec: input.durationSec,
      status: 'running',
      startedAt: nowIso,
      endsAt: new Date(now.getTime() + input.durationSec * 1000).toISOString(),
      remainingSecAtPause: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    store.timers.set(timer.id, timer);
    return timer;
  },

  save(timer: Timer): Timer {
    timer.updatedAt = new Date().toISOString();
    store.timers.set(timer.id, timer);
    return timer;
  },
};
