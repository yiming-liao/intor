import { toCacheKey } from "../utils/to-cache-key";

export function createDisplayNames() {
  const cache = new Map<string, Intl.DisplayNames>();

  return (locale: string, options: Intl.DisplayNamesOptions) => {
    const key = toCacheKey(locale, options);

    const cached = cache.get(key);
    if (cached) return cached;

    const displayNames = new Intl.DisplayNames(locale, options);

    cache.set(key, displayNames);
    return displayNames;
  };
}
