export function toCacheKey(locale: string, options?: object): string {
  if (!options || Object.keys(options).length === 0) return locale;

  const normalized = Object.entries(options)
    .filter(([, value]) => value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${String(value)}`)
    .join("|");

  return `${locale}__${normalized}`;
}
