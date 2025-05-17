import type {
  LocaleNamespaceMessages,
  NamespaceMessages,
} from "../../types/message-structure-types";

/**
 * Merge static and dynamic namespace messages by locale.
 * Dynamic messages override static ones on conflict.
 *
 * @param staticMessages - Predefined static messages
 * @param dynamicMessages - Runtime-loaded dynamic messages
 * @returns Merged locale-namespace messages
 */
export const mergeStaticAndDynamicMessages = (
  staticMessages: LocaleNamespaceMessages = {},
  dynamicMessages: LocaleNamespaceMessages = {},
): LocaleNamespaceMessages => {
  const result: LocaleNamespaceMessages = Object.keys(staticMessages).length
    ? { ...staticMessages }
    : {};

  for (const locale in dynamicMessages) {
    const dynamic = dynamicMessages[locale];

    // If the locale doesn't exist in static messages
    if (!result[locale]) {
      result[locale] = dynamic as NamespaceMessages;
      continue;
    }

    // Merge namespaces under the same locale
    result[locale] = {
      ...result[locale],
      ...dynamic,
    } as NamespaceMessages;
  }

  return result;
};
