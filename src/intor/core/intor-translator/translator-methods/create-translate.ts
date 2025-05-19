import type {
  LocaleNamespaceMessages,
  Replacement,
  RichReplacement,
} from "../../../types/message-structure-types";
import type {
  LocaleRef,
  NestedKeyPaths,
  RawLocale,
} from "../types/locale-types";
import type { TranslatorHandlers } from "../types/translator-handlers-types";
import { TranslatorOptions } from "../types/intor-translator-options-types";
import { getValueByKey } from "../utils/get-value-by-key";
import { replaceValues } from "../utils/replace-values";
import { resolveLocalesToTry } from "../utils/resolve-locales-to-try";

export type Translate<Messages extends LocaleNamespaceMessages> = {
  <Locale extends RawLocale<Messages>>(
    key: NestedKeyPaths<Messages[Locale]>,
    replacements?: Replacement | RichReplacement,
  ): string;
  (key: string, replacements?: Replacement | RichReplacement): string;
};

export type UntypedTranslate = (
  key?: string,
  replacements?: Replacement | RichReplacement,
) => string;

/**
 * Factory function to create a hasKey function
 * Checks if a translation key exists in the specified locale(s)
 */
export const createTranslate = <Messages extends LocaleNamespaceMessages>(
  localeRef: LocaleRef<Messages>,
  translatorOptions: TranslatorOptions<Messages>,
): Translate<Messages> => {
  const { messages, fallbackLocales, isLoading, loadingMessage, placeholder } =
    translatorOptions;

  const { messageFormatter, loadingMessageHandler, placeholderHandler } =
    (translatorOptions.handlers as TranslatorHandlers<
      string,
      string,
      string
    >) || {};

  const t = <Locale extends RawLocale<Messages>>(
    key: NestedKeyPaths<Messages[Locale]> | string = "",
    replacements?: Replacement | RichReplacement,
  ): string => {
    // Resolve the locales to try (current locale + fallback locales)
    const localesToTry = resolveLocalesToTry(
      localeRef.current,
      fallbackLocales,
    );
    let message: string | undefined;

    // Loop through locales to find the corresponding message
    for (const loc of localesToTry) {
      const localeMessages = messages[loc];
      if (!localeMessages) {
        continue;
      }

      const messageCandidate = getValueByKey(loc, localeMessages, key);

      // If message found, break the loop
      if (typeof messageCandidate === "string") {
        message = messageCandidate;
        break;
      }
    }

    // Check if it's loading dynamic messages
    if (isLoading) {
      // Handle loading state with provided handler or fallback message
      if (loadingMessageHandler) {
        return loadingMessageHandler({
          key,
          locale: localeRef.current as string,
          replacements,
        });
      }

      // Return loadingMessage if provided from defined config
      if (loadingMessage) {
        return loadingMessage;
      }
    }

    // If no message found, handle accordingly
    if (!message) {
      // Handle placeholder if defined
      if (placeholderHandler) {
        return placeholderHandler({
          key,
          locale: localeRef.current as string,
          replacements,
        });
      }

      // Return placeholder if provided from defined config
      if (placeholder) {
        return placeholder;
      }

      // Return the key if no message is found
      return key;
    }

    // If a message is found, apply message formatter or replace values (Rich replacement)
    if (messageFormatter) {
      return messageFormatter({
        message,
        key,
        locale: localeRef.current as string,
        replacements,
      });
    } else {
      // Apply replacements if provided (Basic replacement)
      return replacements
        ? replaceValues(message, replacements as Replacement)
        : message;
    }
  };

  return t;
};
