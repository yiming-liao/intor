import type { TranslatorInstanceServer } from "./translator-instance";
import type { IntorResolvedConfig } from "@/config";
import type { Locale, LocaleMessages } from "intor-translator";
import { resolveLoaderOptions } from "@/core";
import { loadMessages, type LoadMessagesParams } from "../messages";
import {
  createTranslator,
  type CreateTranslatorParams,
} from "./create-translator";

export interface InitTranslatorOptions
  extends Pick<LoadMessagesParams, "readers" | "allowCacheWrite" | "fetch">,
    Pick<CreateTranslatorParams, "preKey" | "handlers" | "plugins"> {}

/**
 * Initializes a server-side translator for a specific locale.
 *
 * - Performs message loading during initialization.
 * - Returns an immutable translator snapshot.
 */
export async function initTranslator(
  config: IntorResolvedConfig,
  locale: Locale,
  options: InitTranslatorOptions,
): Promise<TranslatorInstanceServer<LocaleMessages>> {
  const {
    readers,
    allowCacheWrite = false,
    fetch,
    preKey,
    handlers,
    plugins,
  } = options;

  const loader = resolveLoaderOptions(config, "server");

  // Load messages
  let messages: LocaleMessages = {};
  if (loader) {
    const loaded = await loadMessages({
      config,
      locale,
      readers,
      allowCacheWrite,
      fetch,
    });
    messages = loaded || {};
  }

  // Create immutable translator snapshot
  return createTranslator({
    config,
    locale,
    messages,
    preKey,
    handlers,
    plugins,
  }) as TranslatorInstanceServer<LocaleMessages>;
}
