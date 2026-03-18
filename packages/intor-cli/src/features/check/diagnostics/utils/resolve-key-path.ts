export function resolveKeyPath(key: string, preKey?: string): string {
  if (!preKey) return key;
  if (!key) return preKey;
  return `${preKey}.${key}`;
}
