import type { IntorResolvedConfig } from "../../config";
import type { LocaleMessages, Translator } from "intor-translator";
import {
  resolveLoaderOptions,
  createTranslator,
  type CreateTranslatorParams,
  type MessagesLoader,
} from "../../core";
import { loadMessages, type LoadMessagesParams } from "../messages";

export interface InitTranslatorOptions
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
  locale: string,
  options: InitTranslatorOptions,
): Promise<Translator<LocaleMessages>> {
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
  if (loader) {
    messages = await loader(config, locale);
  } else if (loaderOptions) {
    const loaded = await loadMessages({
      config,
      locale,
      ...(readers !== undefined ? { readers } : {}),
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
    ...(handlers !== undefined ? { handlers } : {}),
    ...(plugins !== undefined ? { plugins } : {}),
  });
}
