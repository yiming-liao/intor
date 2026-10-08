import type { IntorConfig } from "../../config";
import type { LocaleMessages } from "intor-translator";
import { mergeMessages } from "./merge-messages";

/** Preserve loaded locale identities while applying runtime overrides. */
export function mergeLoadedMessages(
  config: IntorConfig,
  messages: LocaleMessages | undefined,
  locale: string,
): LocaleMessages {
  let merged = config.messages;
  const locales = new Set([locale, ...Object.keys(messages ?? {})]);
  for (const loadedLocale of locales) {
    merged = mergeMessages(merged, messages, { config, locale: loadedLocale });
  }
  return merged ?? {};
}
