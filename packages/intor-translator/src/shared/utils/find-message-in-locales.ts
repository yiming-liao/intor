import type { LocaleMessages, MessageValue } from "../../types";

interface FindMessageInLocalesOptions {
  messages: LocaleMessages;
  candidateLocales: string[];
  key: string;
}

function findMessageByPath(
  candidate: MessageValue | undefined,
  segments: string[],
  start = 0,
): MessageValue | undefined {
  if (start >= segments.length) {
    return candidate;
  }

  if (candidate === null || typeof candidate !== "object") {
    return undefined;
  }

  const objectCandidate = candidate as Record<string, MessageValue>;

  for (let end = segments.length; end > start; end--) {
    const segment = segments.slice(start, end).join(".");

    if (!(segment in objectCandidate)) continue;

    const next = objectCandidate[segment];
    if (end === segments.length) {
      return next;
    }

    const resolved = findMessageByPath(next, segments, end);
    if (resolved !== undefined) {
      return resolved;
    }
  }

  return undefined;
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

    const candidate = findMessageByPath(messagesForLocale, key.split("."));

    if (candidate !== undefined) {
      return candidate;
    }
  }

  return undefined;
};
