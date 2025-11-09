import { LocaleNamespaceMessages, NamespaceMessages } from "intor-translator";

/**
 * Merge static and loaded namespace messages by locale.
 * Loaded messages override static ones on conflict.
 */
export const mergeMessages = (
  staticMessages: LocaleNamespaceMessages = {},
  loadedMessages: LocaleNamespaceMessages | null = {},
): LocaleNamespaceMessages => {
  const result: LocaleNamespaceMessages = Object.keys(staticMessages).length
    ? { ...staticMessages }
    : {};

  for (const locale in loadedMessages) {
    const loaded = loadedMessages[locale];

    // If the locale doesn't exist in static messages
    if (!result[locale]) {
      result[locale] = loaded as NamespaceMessages;
      continue;
    }

    // Merge namespaces under the same locale
    result[locale] = {
      ...result[locale],
      ...loaded,
    } as NamespaceMessages;
  }

  return result;
};
