/**
 * Lightweight file-based persistence for the in-memory store.
 *
 * Not a real database — just enough so the app's state survives a server
 * restart for the school demo. `store.ts` owns the actual Maps; this module
 * only knows how to read/write one JSON file (data/db.json) and how to
 * debounce writes.
 */
import fs from 'node:fs';
import path from 'node:path';

// __dirname is src/db (or dist/db once built) — either way, going up two
// levels lands on app/backend, so data/ sits next to src/ and dist/.
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export function loadSnapshot(): Record<string, unknown> | undefined {
  if (!fs.existsSync(DB_FILE)) return undefined;
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[persistence] Falha ao ler data/db.json — ignorando snapshot e semeando do zero:', err);
    return undefined;
  }
}

export function writeSnapshot(data: Record<string, unknown>): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data), 'utf-8');
}

let debounceTimer: NodeJS.Timeout | undefined;

/** Coalesces bursts of mutations into a single write ~`delayMs` after the last one. */
export function scheduleSnapshotSave(getSnapshot: () => Record<string, unknown>, delayMs = 300): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = undefined;
    try {
      writeSnapshot(getSnapshot());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[persistence] Falha ao salvar data/db.json:', err);
    }
  }, delayMs);
}
