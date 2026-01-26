import type { IntorResolvedConfig } from "@/config";
import type { Locale, LocaleMessages, Translator } from "intor-translator";
import { resolveLoaderOptions } from "@/core";
import { loadMessages, type LoadMessagesParams } from "../messages";
import {
  createTranslator,
  type CreateTranslatorParams,
} from "./create-translator";

export interface InitTranslatorOptions
  extends Pick<LoadMessagesParams, "readers" | "allowCacheWrite" | "fetch">,
    Pick<CreateTranslatorParams, "handlers" | "plugins"> {}

/**
 * Initialize a locale-bound Translator snapshot.
 *
 * - Resolves loader options and loads messages if configured
 * - Creates an immutable Translator instance for server usage
 */
export async function initTranslator(
  config: IntorResolvedConfig,
  locale: Locale,
  options: InitTranslatorOptions,
): Promise<Translator<unknown>> {
  const {
    readers,
    allowCacheWrite = false,
    fetch,
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
  return createTranslator({ config, locale, messages, handlers, plugins });
}
