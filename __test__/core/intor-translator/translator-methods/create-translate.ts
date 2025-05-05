import type {
  LocaleRef,
  TranslatorOptions,
} from "@/intor/core/intor-translator/types/intor-translator-types";
import type {
  NestedKeyPaths,
  RawLocale,
} from "@/intor/core/intor-translator/types/locale-types";
import type { TranslatorHandlers } from "@/intor/core/intor-translator/types/translator-handlers-types";
import type {
  LocaleNamespaceMessages,
  Replacement,
} from "@/intor/types/message-structure-types";
import { getValueByKey } from "@/intor/core/intor-translator/utils/get-value-by-key";
import { replaceValues } from "@/intor/core/intor-translator/utils/replace-values";
import { resolveLocalesToTry } from "@/intor/core/intor-translator/utils/resolve-locales-to-try";

export type Translate<Messages extends LocaleNamespaceMessages> = <
  Locale extends RawLocale<Messages>,
>(
  key?: NestedKeyPaths<Messages[Locale]>,
  replacements?: Replacement,
) => string;

/**
 * Factory function to create a hasKey function
 * Checks if a translation key exists in the specified locale(s)
 */
export const createTranslate = <Messages extends LocaleNamespaceMessages>(
  localeRef: LocaleRef<Messages>,
  translatorOptions: TranslatorOptions<Messages>,
): Translate<Messages> => {
  const {
    messages,
    fallbackLocales,
    isLoading,
    loadingMessage,
    placeholder,
    debugHandler,
  } = translatorOptions;

  const handlers = translatorOptions.handlers as TranslatorHandlers<
    string,
    string,
    string
  >; // Assert all generics to string
  const { messageFormatter, loadingMessageHandler, placeholderHandler } =
    handlers;

  const t = <Locale extends RawLocale<Messages>>(
    key: NestedKeyPaths<Messages[Locale]> | string = "",
    replacements?: Replacement,
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

      const messageCandidate = getValueByKey(localeMessages, key);

      // If message found, break the loop
      if (typeof messageCandidate === "string") {
        message = messageCandidate;
        break;
      }
    }

    // If no message found, handle accordingly
    if (!message) {
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

      // Debug
      if (debugHandler) {
        debugHandler(key, localeRef.current);
      }

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

    // If a message is found, apply message formatter or replace values
    if (messageFormatter) {
      return messageFormatter({
        message,
        key,
        locale: localeRef.current as string,
        replacements,
      });
    }

    // Apply replacements if provided
    return replacements ? replaceValues(message, replacements) : message;
  };

  return t;
};
