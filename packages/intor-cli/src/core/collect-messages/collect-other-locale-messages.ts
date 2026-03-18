import type { ReaderOptions } from "./types";
import type { IntorResolvedConfig } from "intor";
import type { MessageObject } from "intor";
import { collectRuntimeMessages } from "./collect-runtime-messages";

export async function collectOtherLocaleMessages(
  config: IntorResolvedConfig,
  { exts, customReaders }: ReaderOptions,
): Promise<Record<string, MessageObject>> {
  const { supportedLocales, defaultLocale } = config;

  const result: Record<string, MessageObject> = {};

  for (const locale of supportedLocales) {
    if (locale === defaultLocale) continue;

    const { messages } = await collectRuntimeMessages(config, locale, {
      ...(exts !== undefined ? { exts } : {}),
      ...(customReaders !== undefined ? { customReaders } : {}),
    });

    if (messages[locale]) {
      result[locale] = messages[locale];
    }
  }

  return result;
}
