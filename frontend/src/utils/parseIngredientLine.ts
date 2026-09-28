export interface ParsedIngredientLine {
  name: string;
  quantity: number;
  unit: string;
}

/**
 * Recognized unit tokens, ordered from most specific to least specific.
 * Order matters: since these are joined into a single regex alternation,
 * JS picks the first alternative that matches at a given position (not the
 * longest one) — so "colheres? de sopa" must be listed before the bare
 * "colheres?" or it would never get a chance to match the "de sopa" part.
 */
const UNIT_PATTERNS: { unit: string; pattern: string }[] = [
  { unit: 'colher de sopa', pattern: 'colher(?:es)? de sopa' },
  { unit: 'colher de chá', pattern: 'colher(?:es)? de ch[aá]' },
  { unit: 'colher de sopa', pattern: 'col\\.? de sopa' },
  { unit: 'colher de chá', pattern: 'col\\.? de ch[aá]' },
  // Bare "colher(es)"/"col." with no "de sopa/chá" qualifier — assume sopa.
  { unit: 'colher de sopa', pattern: 'colher(?:es)?' },
  { unit: 'colher de sopa', pattern: 'col\\.' },
  { unit: 'xícara', pattern: 'x[ií]caras?' },
  { unit: 'unidade', pattern: 'unid(?:ades?)?\\.?' },
  { unit: 'dente', pattern: 'dentes?' },
  { unit: 'maço', pattern: 'ma[çc]os?' },
  { unit: 'pitada', pattern: 'pitadas?' },
  { unit: 'pacote', pattern: 'pacotes?' },
  { unit: 'lata', pattern: 'latas?' },
  { unit: 'copo', pattern: 'copos?' },
  { unit: 'fatia', pattern: 'fatias?' },
  { unit: 'kg', pattern: 'kg' },
  { unit: 'g', pattern: 'g(?:ramas?)?' },
  { unit: 'ml', pattern: 'ml' },
  { unit: 'l', pattern: 'l(?:itros?)?' },
];

const UNIT_ALTERNATION = UNIT_PATTERNS.map((u) => `(?:${u.pattern})`).join('|');

// e.g. "1 abóbora média, em cubos", "320 g de arroz arbório", "2 col. de azeite".
// Leading number (optional comma/dot decimal), then one of the known unit
// tokens, then an optional "de" before the ingredient name.
const LINE_REGEX = new RegExp(
  `^\\s*(\\d+(?:[.,]\\d+)?)\\s*(${UNIT_ALTERNATION})\\.?\\s*(?:de\\s+)?(.+?)\\s*$`,
  'i'
);

function resolveUnitLabel(matchedUnitText: string): string {
  const normalized = matchedUnitText.trim().toLowerCase();
  const found = UNIT_PATTERNS.find((u) => new RegExp(`^(?:${u.pattern})$`, 'i').test(normalized));
  return found?.unit ?? normalized;
}

/**
 * Extracts `{ name, quantity, unit }` from a free-text ingredient line, e.g.
 * "320 g de arroz arbório" -> { name: 'arroz arbório', quantity: 320, unit: 'g' }.
 * Falls back to `{ quantity: 1, unit: 'un', name: <full trimmed text> }` when
 * the line doesn't start with a recognizable "<number> <unit>" pattern.
 */
export function parseIngredientLine(rawLine: string): ParsedIngredientLine {
  const line = rawLine.trim();
  if (!line) {
    return { name: '', quantity: 1, unit: 'un' };
  }

  const match = line.match(LINE_REGEX);
  if (match) {
    const [, quantityRaw, unitRaw, nameRaw] = match;
    const quantity = Number(quantityRaw.replace(',', '.'));
    const name = nameRaw.trim();
    if (Number.isFinite(quantity) && name) {
      return { quantity, unit: resolveUnitLabel(unitRaw), name };
    }
  }

  return { quantity: 1, unit: 'un', name: line };
}
