import type { LocaleMessages } from "intor-translator";

/**
 * Merge static and loaded namespace messages by locale.
 * Loaded messages override static ones on conflict.
 */
export const mergeMessages = (
  staticMessages: LocaleMessages = {},
  loadedMessages: LocaleMessages | null = {},
): LocaleMessages => {
  const result: LocaleMessages = Object.keys(staticMessages).length
    ? { ...staticMessages }
    : {};

  for (const locale in loadedMessages) {
    const loaded = loadedMessages[locale];

    // If the locale doesn't exist in static messages
    if (!result[locale]) {
      result[locale] = loaded;
      continue;
    }

    // Merge namespaces under the same locale
    result[locale] = {
      ...result[locale],
      ...loaded,
    };
  }

  return result;
};
