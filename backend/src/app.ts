import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { store } from './db/store';
import { authRouter } from './modules/auth/auth.routes';
import { pantryRouter } from './modules/pantry/pantry.routes';
import { recipesRouter } from './modules/recipes/recipes.routes';
import { conversionsRouter } from './modules/conversions/conversions.routes';
import { substitutionsRouter } from './modules/substitutions/substitutions.routes';
import { profileRouter } from './modules/profile/profile.routes';
import { planRouter } from './modules/plan/plan.routes';
import { timersRouter } from './modules/timers/timers.routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/**
 * Lightweight autosave: after any mutating (non-GET) request that succeeded
 * (2xx), schedule a debounced snapshot write (see db/persistence.ts) so the
 * in-memory store survives a restart. This is the one deliberate exception
 * to "only *.repository.ts imports db/store" — app.ts is the composition
 * root wiring infrastructure plumbing, not business logic, and store.ts
 * exposes `scheduleSave()` specifically for this purpose.
 *
 * NOTE on placement: this must be registered BEFORE the routers, not after.
 * A route handler that sends a response (res.json/res.send) never calls
 * next() afterwards, so a middleware mounted after the routers would simply
 * never run for any successfully-handled request. Registering the
 * `res.on('finish', ...)` listener here — then calling next() immediately so
 * the real route still handles the request — works regardless of ordering,
 * because the 'finish' event fires whenever the response actually completes.
 */
app.use((req, res, next) => {
  res.on('finish', () => {
    if (req.method !== 'GET' && res.statusCode >= 200 && res.statusCode < 300) {
      store.scheduleSave();
    }
  });
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'sabores-backend', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/pantry', pantryRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/conversions', conversionsRouter);
app.use('/api/ingredients', substitutionsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/plan', planRouter);
app.use('/api/timers', timersRouter);

app.use(notFoundHandler);
app.use(errorHandler);
