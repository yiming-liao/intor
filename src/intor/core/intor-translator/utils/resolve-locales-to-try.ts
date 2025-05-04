import type {
  FallbackLocalesMap,
  LocaleNamespaceMessages,
  RawLocale,
} from "@/intor/types/message-structure-types";

/**
 * Resolves a prioritized list of locales to try based on the given primary locale.
 *
 * The returned list includes the primary locale first, followed by any fallback locales
 * defined in the fallbackLocales map. Any fallback that is the same as the primary locale
 * will be automatically excluded.
 *
 * @template Messages - The structure of supported locales and namespace messages.
 * @param locale - The primary locale to try.
 * @param fallbackLocales - A map defining fallback locales for each primary locale.
 * @returns An array of locales to try, starting with the primary locale.
 */
export const resolveLocalesToTry = <Messages extends LocaleNamespaceMessages>(
  locale: RawLocale<Messages>,
  fallbackLocales: FallbackLocalesMap,
): RawLocale<Messages>[] => {
  const fallbacks = fallbackLocales[locale] || [];
  return [locale, ...fallbacks.filter((l) => l !== locale)];
};
