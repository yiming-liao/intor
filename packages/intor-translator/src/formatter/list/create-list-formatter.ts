import { toCacheKey } from "../utils/to-cache-key";

export function createListFormatter() {
  const cache = new Map<string, Intl.ListFormat>();

  return (locale: string, options?: Intl.ListFormatOptions) => {
    const key = toCacheKey(locale, options);

    const cached = cache.get(key);
    if (cached) return cached;

    const formatter = new Intl.ListFormat(locale, options);

    cache.set(key, formatter);
    return formatter;
  };
}
