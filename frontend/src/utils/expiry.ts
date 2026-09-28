/**
 * Formats a pantry item's `expiresAt` (ISO date/datetime string, or `null`)
 * into a short pt-BR label for the expiry badge. Mirrors the phrasing the
 * old mocked data used (`vence em 2 dias`, `vence amanhã`, ...), but computed
 * live against the current date instead of being pre-baked into the mock.
 *
 * Returns `null` when there's no expiry date — callers should render no
 * badge at all in that case, same as before.
 */
export function formatExpiryLabel(expiresAt: string | null, now: Date = new Date()): string | null {
  if (!expiresAt) return null;

  const expiryDate = new Date(expiresAt);
  if (Number.isNaN(expiryDate.getTime())) return null;

  // Compare calendar days only (ignore time-of-day) so "hoje"/"amanhã" read
  // naturally regardless of what time the item expires at.
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfDay(expiryDate).getTime() - startOfDay(now).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return 'vencido';
  if (diffDays === 0) return 'vence hoje';
  if (diffDays === 1) return 'vence amanhã';
  if (diffDays <= 30) return `vence em ${diffDays} dias`;

  return `vence em ${expiryDate.toLocaleDateString('pt-BR')}`;
}
