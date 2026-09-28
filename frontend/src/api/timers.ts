import { apiGet, apiPatch, apiPost } from './client';

/**
 * Local mirror of the backend's timer shape (see
 * app/backend/src/modules/timers/timers.types.ts and timers.service.ts).
 * All routes require auth and are scoped to the authenticated account.
 * `remainingSec` is server-computed and authoritative — always trust it
 * over any client-side countdown math (a light client-side tick between
 * polls is fine for visual smoothness, but resync from a poll each time).
 */
export type TimerStatus = 'running' | 'paused' | 'cancelled' | 'completed';

export interface TimerWithRemaining {
  id: string;
  ownerId: string;
  recipeId?: string;
  stepId?: string;
  label: string;
  durationSec: number;
  status: TimerStatus;
  startedAt: string;
  endsAt: string | null;
  remainingSecAtPause: number | null;
  createdAt: string;
  updatedAt: string;
  remainingSec: number;
}

export interface TimerCreateInput {
  recipeId?: string;
  stepId?: string;
  label: string;
  durationSec: number;
}

export type TimerAction = 'pause' | 'resume' | 'cancel';

export function getTimers(): Promise<{ timers: TimerWithRemaining[] }> {
  return apiGet<{ timers: TimerWithRemaining[] }>('/timers');
}

export function createTimer(input: TimerCreateInput): Promise<TimerWithRemaining> {
  return apiPost<TimerWithRemaining>('/timers', input);
}

export function applyTimerAction(id: string, action: TimerAction): Promise<TimerWithRemaining> {
  return apiPatch<TimerWithRemaining>(`/timers/${id}`, { action });
}
