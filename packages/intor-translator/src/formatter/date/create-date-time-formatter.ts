import { toCacheKey } from "../utils/to-cache-key";

export function createDateTimeFormatter() {
  const cache = new Map<string, Intl.DateTimeFormat>();

  return (locale: string, options?: Intl.DateTimeFormatOptions) => {
    const key = toCacheKey(locale, options);

    const cached = cache.get(key);
    if (cached) return cached;

    const formatter = new Intl.DateTimeFormat(locale, options);

    cache.set(key, formatter);
    return formatter;
  };
}
