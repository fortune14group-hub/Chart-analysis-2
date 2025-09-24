const cache = new Map<string, number>();

export function assertIdempotency(key: string, ttlMs = 7_200_000): boolean {
  const now = Date.now();
  const existing = cache.get(key);
  if (existing && now - existing < ttlMs) {
    return false;
  }
  cache.set(key, now);
  return true;
}
