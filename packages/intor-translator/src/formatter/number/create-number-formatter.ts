import { toCacheKey } from "../utils/to-cache-key";

export function createNumberFormatter() {
  const cache = new Map<string, Intl.NumberFormat>();

  return (locale: string, options?: Intl.NumberFormatOptions) => {
    const key = toCacheKey(locale, options);

    const cached = cache.get(key);
    if (cached) return cached;

    const formatter = new Intl.NumberFormat(locale, options);

    cache.set(key, formatter);
    return formatter;
  };
}
