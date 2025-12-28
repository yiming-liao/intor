import type { LoadMessagesParams } from "./types";
import type { LocaleMessages } from "intor-translator";
import { getLogger, loadRemoteMessages, resolveLoaderOptions } from "@/core";
import { loadLocalMessages } from "./load-local-messages";

/**
 * Load locale messages based on the resolved Intor configuration.
 *
 * This function acts as a thin orchestration layer that:
 *
 * - Selects the appropriate message loader (local or remote)
 * - Applies fallback locale resolution
 * - Delegates caching and concurrency behavior to the underlying loader
 *
 * It does not perform message normalization or transformation itself.
 */
export const loadMessages = async ({
  config,
  locale,
  extraOptions: { exts, messagesReader } = {},
  allowCacheWrite = false,
}: LoadMessagesParams): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger(config.logger);
  const logger = baseLogger.child({ scope: "load-messages" });

  const loader = resolveLoaderOptions(config, "server");

  // Guard: no loader configured
  if (!loader) {
    logger.warn(
      "No loader options have been configured in the current config.",
    );
    return;
  }

  const { type, namespaces, rootDir } = loader;
  const fallbackLocales = config.fallbackLocales[locale] || [];

  logger.info(`Loading messages for locale "${locale}".`);
  logger.trace("Starting to load messages with runtime context.", {
    loaderType: type,
    locale,
    fallbackLocales,
    namespaces: namespaces && namespaces.length > 0 ? [...namespaces] : "[ALL]",
    cache: config.cache,
  });

  let loadedMessages: LocaleMessages | undefined;

  // ====== loader type: local ======
  if (type === "local") {
    loadedMessages = await loadLocalMessages({
      // --- Messages Scope ---
      locale,
      fallbackLocales,
      namespaces,
      rootDir,
      // --- Execution ---
      concurrency: loader.concurrency,
      exts,
      messagesReader,
      // --- Caching ---
      cacheOptions: config.cache,
      allowCacheWrite,
      // --- Observability ---
      loggerOptions: config.logger,
    });
  }
  // ====== loader type: remote ======
  else if (type === "remote") {
    loadedMessages = await loadRemoteMessages({
      // --- Messages Scope ---
      locale,
      fallbackLocales,
      namespaces,
      rootDir,
      // --- Remote Source ---
      url: loader.url,
      headers: loader.headers,
      // --- Caching ---
      allowCacheWrite,
      cacheOptions: config.cache,
      // --- Observability ---
      loggerOptions: config.logger,
    });
  }

  // No messages found
  if (!loadedMessages || Object.keys(loadedMessages).length === 0) {
    logger.warn("No messages found.", { locale, fallbackLocales, namespaces });
  }

  return loadedMessages;
};
