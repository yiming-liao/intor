import { toCacheKey } from "../utils/to-cache-key";

export function createRelativeTimeFormatter() {
  const cache = new Map<string, Intl.RelativeTimeFormat>();

  return (locale: string, options?: Intl.RelativeTimeFormatOptions) => {
    const key = toCacheKey(locale, options);

    const cached = cache.get(key);
    if (cached) return cached;

    const formatter = new Intl.RelativeTimeFormat(locale, options);

    cache.set(key, formatter);
    return formatter;
  };
}
