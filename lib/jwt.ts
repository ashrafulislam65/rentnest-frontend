// Decodes a JWT payload WITHOUT verifying the signature.
// Safe for client-side use since we only read already-trusted data
// (the token itself is verified server-side on every request).
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}