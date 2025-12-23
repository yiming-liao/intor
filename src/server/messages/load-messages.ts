import type {
  LoadMessagesOptions,
  LoadMessagesResult,
} from "@/server/messages/types";
import type { GenConfigKeys, GenMessages } from "@/shared/types/generated";
import type { LocaleMessages } from "intor-translator";
import { loadLocalMessages } from "@/server/messages/load-local-messages";
import { loadRemoteMessages } from "@/server/messages/load-remote-messages";
import { getLogger } from "@/server/shared/logger/get-logger";

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
export const loadMessages = async <CK extends GenConfigKeys = "__default__">({
  config,
  locale,
  extraOptions: { exts, messagesReader } = {},
  allowCacheWrite = false,
}: LoadMessagesOptions): LoadMessagesResult<CK> => {
  const baseLogger = getLogger({ id: config.id, ...config.logger });
  const logger = baseLogger.child({ scope: "load-messages" });

  // Guard: no loader configured
  if (!config.loader) {
    logger.warn(
      "No loader options have been configured in the current config.",
    );
    return;
  }

  const { type, concurrency, rootDir, namespaces } = config.loader;
  const fallbackLocales = config.fallbackLocales[locale] || [];

  logger.info(`Loading messages for locale "${locale}".`);
  logger.trace("Starting to load messages with runtime context.", {
    loaderType: type,
    locale,
    fallbackLocales,
    namespaces: namespaces && namespaces.length > 0 ? [...namespaces] : "[ALL]",
    cache: config.cache,
    concurrency: concurrency ?? 10,
  });

  let loadedMessages: LocaleMessages | undefined;

  // --- loader type: local
  if (type === "local") {
    loadedMessages = await loadLocalMessages({
      locale,
      fallbackLocales,
      namespaces,
      rootDir,
      extraOptions: {
        concurrency,
        cacheOptions: config.cache,
        loggerOptions: { id: config.id, ...config.logger },
        exts,
        messagesReader,
      },
      allowCacheWrite,
    });
  }
  // --- loader type: remote
  else if (type === "remote") {
    // Fetch messages from remote
    loadedMessages = await loadRemoteMessages({
      locale,
      fallbackLocales,
      namespaces,
      rootDir,
      remoteUrl: config.loader.remoteUrl,
      remoteHeaders: config.loader.remoteHeaders,
      extraOptions: {
        cacheOptions: config.cache,
        loggerOptions: { id: config.id, ...config.logger },
      },
    });
  }

  // No messages found
  if (!loadedMessages || Object.keys(loadedMessages).length === 0) {
    logger.warn("No messages found.", { locale, fallbackLocales, namespaces });
  }

  return loadedMessages as GenMessages<CK>;
};
