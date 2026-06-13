const numberFmt = new Intl.NumberFormat("en-US");
const compactFmt = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatNumber(value: number): string {
  return numberFmt.format(value);
}

/** Money without a currency symbol (GHL location currency is unknown). */
export function formatMoney(value: number): string {
  return numberFmt.format(Math.round(value));
}

/** Compact money for KPI cards, e.g. 14.2K, 2.3M. */
export function formatMoneyCompact(value: number): string {
  return compactFmt.format(value);
}

export function formatPercent(value: number | null, digits = 0): string {
  if (value === null || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatDays(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "—";
  if (value < 1) return "<1d";
  return `${Math.round(value)}d`;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
