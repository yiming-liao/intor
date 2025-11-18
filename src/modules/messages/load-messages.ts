import type {
  LoadMessagesOptions,
  LoadMessagesResult,
} from "@/modules/messages/types";
import type {
  GenConfigKeys,
  GenMessages,
} from "@/shared/types/generated.types";
import type { LocaleMessages } from "intor-translator";
import { loadLocalMessages } from "@/modules/messages/load-local-messages";
import { loadRemoteMessages } from "@/modules/messages/load-remote-messages";
import { getLogger } from "@/shared/logger/get-logger";
import { resolveNamespaces } from "@/shared/utils";

/**
 * Load messages for a given locale and pathname.
 *
 * - Resolve namespaces based on config and pathname.
 * - Support both **local local** and **remote API** loaders.
 * - Apply fallback locales if needed.
 * - Cache messages if enabled (handled by underlying loader, not this function directly).
 */
export const loadMessages = async <C extends GenConfigKeys = "__default__">({
  config,
  locale,
  pathname = "",
  extraOptions: { exts, messagesReader } = {},
  allowCacheWrite = false,
}: LoadMessagesOptions): LoadMessagesResult<C> => {
  const baseLogger = getLogger({ id: config.id, ...config.logger });
  const logger = baseLogger.child({ scope: "load-messages" });

  if (!config.loader) {
    logger.warn(
      "No loader options have been configured in the current config.",
    );
    return;
  }

  const { type, concurrency, rootDir } = config.loader;
  const fallbackLocales = config.fallbackLocales[locale] || []; // fallback locales fro the pass-in target locale
  const namespaces = resolveNamespaces({ config, pathname }); // Resolve namespaces with pathname

  // Logs
  if (logger.core.level === "debug") {
    logger.debug("Starting to load messages.", { locale });
  }
  logger.trace("Starting to load messages with runtime context.", {
    loaderType: type,
    locale,
    fallbackLocales,
    namespaces: namespaces && namespaces.length > 0 ? [...namespaces] : "[ALL]",
    cache: config.cache,
    concurrency: concurrency ?? 10,
  });

  let loadedMessages: LocaleMessages | undefined;

  //====== loader type: local ======
  if (type === "local") {
    loadedMessages = await loadLocalMessages({
      rootDir,
      locale,
      fallbackLocales,
      namespaces,
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
  //====== loader type: remote ======
  else if (type === "remote") {
    // Fetch messages from remote
    loadedMessages = await loadRemoteMessages({
      rootDir,
      remoteUrl: config.loader.remoteUrl,
      remoteHeaders: config.loader.remoteHeaders,
      locale,
      fallbackLocales,
      namespaces,
      extraOptions: {
        cacheOptions: config.cache,
        loggerOptions: { id: config.id, ...config.logger },
      },
    });
  }

  // No messages found
  if (!loadedMessages || Object.keys(loadedMessages).length === 0) {
    logger.warn("No messages found.", { locale, namespaces });
  }

  return loadedMessages as GenMessages<C>;
};
