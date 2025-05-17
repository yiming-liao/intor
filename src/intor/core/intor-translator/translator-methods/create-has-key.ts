import type { LocaleNamespaceMessages } from "../../../types/message-structure-types";
import type {
  LocaleRef,
  TranslatorOptions,
} from "../types/intor-translator-types";
import type { NestedKeyPaths, RawLocale } from "../types/locale-types";
import { getValueByKey } from "../utils/get-value-by-key";
import { resolveLocalesToTry } from "../utils/resolve-locales-to-try";

export type HasKey<Messages extends LocaleNamespaceMessages> = <
  Locale extends RawLocale<Messages>,
>(
  key: NestedKeyPaths<Messages[Locale]>,
  locale?: Locale,
) => boolean;

/**
 * Factory function to create a hasKey function
 * Checks if a translation key exists in the specified locale(s)
 */
export const createHasKey = <Messages extends LocaleNamespaceMessages>(
  localeRef: LocaleRef<Messages>,
  translatorOptions: TranslatorOptions<Messages>,
): HasKey<Messages> => {
  const { messages, fallbackLocales } = translatorOptions;

  const hasKey = <Locale extends RawLocale<Messages>>(
    key: NestedKeyPaths<Messages[Locale]>,
    locale?: Locale,
  ): boolean => {
    const effectiveLocale = locale ?? localeRef.current; // Default to localeRef.current
    const localesToTry = resolveLocalesToTry(effectiveLocale, fallbackLocales); // Current locale + fallback locales

    for (const loc of localesToTry) {
      const localeMessages = messages[loc];
      if (!localeMessages) {
        continue;
      }

      const messageCandidate = getValueByKey(loc, localeMessages, key);

      if (typeof messageCandidate === "string") {
        return true;
      }
    }

    return false;
  };

  return hasKey;
};
