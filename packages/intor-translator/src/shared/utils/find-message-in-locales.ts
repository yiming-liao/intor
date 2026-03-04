import type { LocaleMessages, MessageValue } from "../../types";

interface FindMessageInLocalesOptions {
  messages: LocaleMessages;
  candidateLocales: string[];
  key: string;
}

/**
 * Finds the first available message value for a given key across a list of locales.
 *
 * The returned value is the raw message from the locale message tree and may be
 * of any type (e.g. string, object, array, or null).
 *
 * A value of `undefined` indicates that the key does not exist in any of the candidate locales.
 *
 * @example
 * ```ts
 * const messages = {
 *   en: { home: { title: "Welcome" } },
 *   zh: { home: { title: "歡迎" } },
 * };
 *
 * findMessageInLocales({
 *   messages,
 *   candidateLocales: ["en", "zh"],
 *   key: "home.title",
 * });
 * // => "Welcome"
 * ```
 */
export const findMessageInLocales = ({
  messages,
  candidateLocales,
  key,
}: FindMessageInLocalesOptions): MessageValue | undefined => {
  for (const locale of candidateLocales) {
    const messagesForLocale = messages[locale];
    if (!messagesForLocale) continue;

    let candidate: MessageValue | undefined = messagesForLocale;
    const keys = key.split(".");

    for (const key of keys) {
      if (
        candidate !== null &&
        typeof candidate === "object" &&
        key in candidate
      ) {
        candidate = (candidate as Record<string, MessageValue>)[key];
      } else {
        candidate = undefined;
        break;
      }
    }

    if (candidate !== undefined) {
      return candidate;
    }
  }

  return undefined;
};
