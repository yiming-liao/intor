import type { MessagesLoader } from "./types";
import type { IntorResolvedConfig } from "@/config";
import type { Locale, LocaleMessages, Translator } from "intor-translator";
import {
  resolveLoaderOptions,
  createTranslator,
  type CreateTranslatorParams,
} from "@/core";
import { loadMessages, type LoadMessagesParams } from "../messages";

interface InitTranslatorOptions
  extends Pick<LoadMessagesParams, "readers" | "allowCacheWrite" | "fetch">,
    Pick<CreateTranslatorParams, "handlers" | "plugins"> {
  loader?: MessagesLoader;
}

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
    loader,
    readers,
    allowCacheWrite = false,
    fetch,
    handlers,
    plugins,
  } = options;

  const loaderOptions = resolveLoaderOptions(config, "server");

  // Load messages
  let messages: LocaleMessages = {};
  if (loaderOptions && !loader) {
    const loaded = await loadMessages({
      config,
      locale,
      readers,
      allowCacheWrite,
      fetch,
    });
    messages = loaded || {};
  }
  if (loader) {
    messages = await loader(config, locale);
  }

  // Create immutable translator snapshot
  return createTranslator({ config, locale, messages, handlers, plugins });
}
