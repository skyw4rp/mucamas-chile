/** Fecha civil YYYY-MM-DD en America/Santiago. */
export function santiagoCalendarDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Medianoche del día civil en Santiago como ISO UTC.
 * Usa offset fijo -03 (Chile continental); suficiente para métricas operativas.
 */
export function startOfSantiagoDayIso(now = new Date()): string {
  const day = santiagoCalendarDate(now);
  return new Date(`${day}T00:00:00-03:00`).toISOString();
}

/** Instantánea exclusiva del fin del día civil (siguiente medianoche Santiago). */
export function endOfSantiagoDayExclusiveIso(now = new Date()): string {
  const startMs = new Date(startOfSantiagoDayIso(now)).getTime();
  return new Date(startMs + 24 * 60 * 60 * 1000).toISOString();
}
