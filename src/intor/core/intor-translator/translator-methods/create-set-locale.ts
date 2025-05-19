import type { LocaleNamespaceMessages } from "../../../types/message-structure-types";
import type { LocaleRef, RawLocale } from "../types/locale-types";
import { TranslatorOptions } from "../types/intor-translator-options-types";

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
