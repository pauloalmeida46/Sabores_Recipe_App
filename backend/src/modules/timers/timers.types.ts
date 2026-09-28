export type TimerStatus = 'running' | 'paused' | 'cancelled' | 'completed';

export interface Timer {
  id: string;
  ownerId: string;
  recipeId?: string;
  stepId?: string;
  label: string;
  durationSec: number;
  status: TimerStatus;
  startedAt: string;
  /** Only meaningful while status === 'running'. */
  endsAt: string | null;
  /** Snapshot of remaining seconds, stored when paused so resume can recompute endsAt. */
  remainingSecAtPause: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TimerCreateInput {
  recipeId?: string;
  stepId?: string;
  label: string;
  durationSec: number;
}
