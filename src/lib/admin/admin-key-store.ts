/** Estado de la clave admin en sessionStorage, expuesto vía useSyncExternalStore (sin setState en effects). */

export const ADMIN_KEY_STORAGE = "mucamas-admin-key";

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function subscribeAdminKey(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAdminKeyServerSnapshot(): string | null {
  return null;
}

export function getAdminKeySnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(ADMIN_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function persistAdminKey(key: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (key === null || key === "") sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    else sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
  } finally {
    emit();
  }
}
