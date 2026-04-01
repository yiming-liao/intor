import { toCacheKey } from "../utils/to-cache-key";

export function createPluralRules() {
  const cache = new Map<string, Intl.PluralRules>();

  return (locale: string, options?: Intl.PluralRulesOptions) => {
    const key = toCacheKey(locale, options);

    const cached = cache.get(key);
    if (cached) return cached;

    const rules = new Intl.PluralRules(locale, options);

    cache.set(key, rules);
    return rules;
  };
}
