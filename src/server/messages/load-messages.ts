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
  readOptions,
  allowCacheWrite = false,
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

  const { type, namespaces } = loader;
  const fallbackLocales = config.fallbackLocales[locale] || [];

  logger.info(`Loading messages for locale "${locale}".`);
  logger.trace("Starting to load messages with runtime context.", {
    loaderType: type,
    locale,
    fallbackLocales,
    namespaces: namespaces && namespaces.length > 0 ? [...namespaces] : ["*"],
    cache: config.cache,
  });

  // ---------------------------------------------------------------------------
  // Dispatch to loader implementation
  // ---------------------------------------------------------------------------
  let loadedMessages: LocaleMessages | undefined;
  if (type === "local") {
    loadedMessages = await loadLocalMessages({
      id: config.id,
      locale,
      fallbackLocales,
      namespaces,
      rootDir: loader.rootDir,
      concurrency: loader.concurrency,
      readOptions,
      allowCacheWrite,
      loggerOptions: config.logger,
    });
  } else if (type === "remote") {
    loadedMessages = await loadRemoteMessages({
      id: config.id,
      locale,
      fallbackLocales,
      namespaces,
      rootDir: loader.rootDir,
      url: loader.url,
      headers: loader.headers,
      allowCacheWrite,
      cacheOptions: config.cache,
      loggerOptions: config.logger,
    });
  }

  // Final sanity check
  if (!loadedMessages || Object.keys(loadedMessages).length === 0) {
    logger.warn("No messages found.", { locale, fallbackLocales, namespaces });
  }

  return loadedMessages;
};
