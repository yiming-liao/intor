import type {
  LocaleRef,
  TranslatorOptions,
} from "@/intor/core/intor-translator/types/intor-translator.types";
import type {
  LocaleNamespaceMessages,
  RawLocale,
} from "@/intor/types/message-structure-types";

export type SetLocale<Messages extends LocaleNamespaceMessages> = (
  newLocale: RawLocale<Messages>,
) => void;

/**
 * Create a function to set the current locale to a new locale
 */
export const createSetLocale = <Messages extends LocaleNamespaceMessages>(
  localeRef: LocaleRef<Messages>,
  translatorOptions: TranslatorOptions<Messages>,
): SetLocale<Messages> => {
  const { messages } = translatorOptions;

  /**
   * Set current locale to new locale
   */
  const setLocale = (newLocale: RawLocale<Messages>): void => {
    if (newLocale in messages) {
      localeRef.current = newLocale;
    }
  };

  return setLocale;
};
