import type { LocaleMessages } from "intor-translator";
import merge from "lodash.merge";

/**
 * Deeply merges loaded messages into static messages by locale.
 * - Loaded messages override static ones on conflict.
 */
export const mergeMessages = (
  staticMessages: LocaleMessages = {},
  loadedMessages: LocaleMessages | undefined = {},
): LocaleMessages => {
  if (!loadedMessages) return { ...staticMessages };
  return merge({}, staticMessages, loadedMessages);
};
