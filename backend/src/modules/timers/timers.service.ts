import { AppError } from '../../utils/AppError';
import { timersRepository } from './timers.repository';
import { Timer, TimerCreateInput } from './timers.types';

export type TimerWithRemaining = Timer & { remainingSec: number };

function withRemaining(timer: Timer): TimerWithRemaining {
  let remainingSec: number;
  if (timer.status === 'running' && timer.endsAt) {
    remainingSec = Math.max(0, Math.round((new Date(timer.endsAt).getTime() - Date.now()) / 1000));
  } else if (timer.status === 'paused' && timer.remainingSecAtPause !== null) {
    remainingSec = timer.remainingSecAtPause;
  } else if (timer.status === 'completed') {
    remainingSec = 0;
  } else {
    remainingSec = timer.remainingSecAtPause ?? timer.durationSec;
  }
  return { ...timer, remainingSec };
}

function findOwned(ownerId: string, id: string): Timer {
  const timer = timersRepository.findById(id);
  if (!timer || timer.ownerId !== ownerId) throw AppError.notFound(`Timer ${id} não encontrado.`);
  return timer;
}

export const timersService = {
  list(ownerId: string): TimerWithRemaining[] {
    return timersRepository.list(ownerId).map(withRemaining);
  },

  getById(ownerId: string, id: string): TimerWithRemaining {
    return withRemaining(findOwned(ownerId, id));
  },

  create(ownerId: string, input: TimerCreateInput): TimerWithRemaining {
    if (input.durationSec <= 0) throw AppError.badRequest('durationSec deve ser maior que zero.');
    const timer = timersRepository.create(ownerId, input);
    return withRemaining(timer);
  },

  /**
   * Pausing/resuming/cancelling one timer only mutates that timer's own row,
   * so concurrent timers are naturally unaffected by each other.
   */
  applyAction(ownerId: string, id: string, action: 'pause' | 'resume' | 'cancel'): TimerWithRemaining {
    const timer = findOwned(ownerId, id);

    if (action === 'pause') {
      if (timer.status !== 'running') throw AppError.badRequest('Apenas timers em execução podem ser pausados.');
      const remaining = timer.endsAt
        ? Math.max(0, Math.round((new Date(timer.endsAt).getTime() - Date.now()) / 1000))
        : timer.durationSec;
      timer.status = 'paused';
      timer.remainingSecAtPause = remaining;
      timer.endsAt = null;
    } else if (action === 'resume') {
      if (timer.status !== 'paused') throw AppError.badRequest('Apenas timers pausados podem ser retomados.');
      const remaining = timer.remainingSecAtPause ?? timer.durationSec;
      timer.status = 'running';
      timer.endsAt = new Date(Date.now() + remaining * 1000).toISOString();
      timer.remainingSecAtPause = null;
    } else if (action === 'cancel') {
      timer.status = 'cancelled';
      timer.endsAt = null;
    }

    return withRemaining(timersRepository.save(timer));
  },
};
