import type { IntorResolvedConfig } from "../../config";
import type { Locale, LocaleMessages, Translator } from "intor-translator";
import {
  createTranslator,
  loadRemoteMessages,
  type CreateTranslatorParams,
  type RuntimeFetch,
} from "../../core";

interface InitTranslatorOptions
  extends Omit<CreateTranslatorParams, "config" | "locale" | "messages"> {
  fetch: RuntimeFetch;
}

/**
 * Initialize a locale-bound Translator snapshot.
 *
 * - Loads translation messages using the configured remote loader, if present.
 * - Creates an immutable Translator instance for edge runtimes
 */
export async function initTranslator(
  config: IntorResolvedConfig,
  locale: Locale,
  options: InitTranslatorOptions,
): Promise<Translator<LocaleMessages>> {
  const { loader } = config;
  const { fetch, handlers, plugins } = options;

  // Load messages
  let messages: LocaleMessages = {};
  if (loader && loader.mode === "remote") {
    const { namespaces, concurrency, url, headers } = loader;
    const loaded = await loadRemoteMessages({
      locale,
      fallbackLocales: config.fallbackLocales[locale] || [],
      ...(namespaces !== undefined ? { namespaces } : {}),
      ...(concurrency !== undefined ? { concurrency } : {}),
      fetch,
      url,
      ...(headers !== undefined ? { headers: headers } : {}),
      loggerOptions: config.logger,
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
