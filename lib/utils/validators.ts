export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidToken(provided: string | null | undefined, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  return provided === expected;
}
