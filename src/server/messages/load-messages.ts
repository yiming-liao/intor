import type { LoadMessagesParams } from "./types";
import type { LocaleMessages } from "intor-translator";
import { getLogger, loadRemoteMessages, resolveLoaderOptions } from "@/core";
import { loadLocalMessages } from "./load-local-messages";

/**
 * Load locale messages according to the resolved Intor loader configuration.
 *
 * This function is the top-level orchestration entry for message loading.
 * It is responsible for:
 *
 * - Resolving the active loader strategy (local or remote)
 * - Dispatching to the appropriate loader implementation
 * - Passing through cache and read-related options
 *
 * Message traversal, parsing, fallback resolution, and caching logic
 * are delegated to the selected loader.
 */
export const loadMessages = async ({
  config,
  locale,
  readers,
  allowCacheWrite = false,
  fetch,
}: LoadMessagesParams): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger(config.logger);
  const logger = baseLogger.child({ scope: "load-messages" });

  // ---------------------------------------------------------------------------
  // Resolve loader configuration
  // ---------------------------------------------------------------------------
  const loader = resolveLoaderOptions(config, "server");
  if (!loader) {
    logger.warn(
      "No loader options have been configured in the current config.",
    );
    return;
  }

  const { mode, namespaces, concurrency } = loader;
  const fallbackLocales: string[] = config.fallbackLocales[locale] || [];

  logger.info(`Loading messages for locale "${locale}".`);
  logger.trace("Starting to load messages with runtime context.", {
    loaderMode: mode,
    ...(mode === "local" ? { rootDir: loader.rootDir } : {}),
    locale,
    fallbackLocales: fallbackLocales.join(", "),
    namespaces: namespaces && namespaces.length > 0 ? [...namespaces] : "*",
  });

  // ---------------------------------------------------------------------------
  // Dispatch to loader implementation
  // ---------------------------------------------------------------------------
  let loadedMessages: LocaleMessages | undefined;
  if (mode === "local") {
    loadedMessages = await loadLocalMessages({
      id: config.id,
      locale,
      fallbackLocales,
      namespaces,
      rootDir: loader.rootDir,
      concurrency,
      readers,
      allowCacheWrite,
      loggerOptions: config.logger,
    });
  } else if (mode === "remote") {
    loadedMessages = await loadRemoteMessages({
      locale,
      fallbackLocales,
      namespaces,
      concurrency,
      fetch,
      url: loader.url,
      headers: loader.headers,
      loggerOptions: config.logger,
    });
  }

  // Final sanity check
  if (!loadedMessages || Object.keys(loadedMessages).length === 0) {
    logger.warn("No messages found.", { locale, fallbackLocales, namespaces });
  }

  return loadedMessages;
};
