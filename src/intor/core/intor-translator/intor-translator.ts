import type {
  Translator,
  TranslatorOptions,
} from "@/intor/core/intor-translator/types/intor-translator.types";
import type { LocaleNamespaceMessages } from "@/intor/types/message-structure-types";
import { createGetLocale } from "@/intor/core/intor-translator/translator-methods/create-get-locale";
import { createGetMessages } from "@/intor/core/intor-translator/translator-methods/create-get-messages";
import { createHasKey } from "@/intor/core/intor-translator/translator-methods/create-has-key";
import { createScoped } from "@/intor/core/intor-translator/translator-methods/create-scoped";
import { createSetLocale } from "@/intor/core/intor-translator/translator-methods/create-set-locale";
import { createTranslate } from "@/intor/core/intor-translator/translator-methods/create-translate";

/**
 * Factory function to create an translator instance
 */
export function intorTranslator<Messages extends LocaleNamespaceMessages>(
  translatorOptions: TranslatorOptions<Messages>,
): Translator<Messages> {
  const { locale } = translatorOptions;

  const localeRef = { current: locale }; // Set a ref of current locale

  // Get current locale
  const getLocale = createGetLocale(localeRef);

  // Set current locale to a new locale
  const setLocale = createSetLocale(localeRef, translatorOptions);

  // Get messages
  const getMessages = createGetMessages(translatorOptions);

  // Check if a translation key exists in the specified locale(s)
  const hasKey = createHasKey(localeRef, translatorOptions);

  // Translation function to retrieve translated messages (no namespace)
  const t = createTranslate(localeRef, translatorOptions);

  // Scoped translator with an optional prefix key
  const scoped = createScoped(localeRef, translatorOptions);

  return {
    getLocale,
    setLocale,
    getMessages,
    hasKey,
    t,
    scoped,
  };
}
