import type { ReaderOptions } from "./types";
import type { IntorResolvedConfig, LocaleMessages } from "intor";
import { collectMessages } from "./collect-messages";

/**
 * Collect messages for all non-default locales in a config.
 */
export async function collectNonDefaultLocaleMessages(
  config: IntorResolvedConfig,
  readerOptions: ReaderOptions,
): Promise<LocaleMessages> {
  const { supportedLocales, defaultLocale } = config;
  const result: LocaleMessages = {};

  for (const locale of supportedLocales) {
    if (locale === defaultLocale) continue;

    const { messages } = await collectMessages(locale, config, readerOptions);
    if (messages[locale]) result[locale] = messages[locale];
  }

  return result;
}
