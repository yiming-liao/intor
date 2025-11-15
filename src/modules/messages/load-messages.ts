import type {
  MessagesLoaderOptions,
  MessagesLoaderResult,
} from "@/modules/messages/types";
import type {
  GenConfigKeys,
  GenMessages,
} from "@/shared/types/generated.types";
import type { LocaleMessages } from "intor-translator";
import { createLoadLocalMessages } from "@/modules/messages/create-load-local-messages";
import { loadApiMessages } from "@/modules/messages/load-api-messages";
import { getLogger } from "@/shared/logger/get-logger";
import { resolveNamespaces } from "@/shared/utils";

/**
 * Load messages for a given locale and pathname.
 *
 * - Resolve namespaces based on config and pathname.
 * - Support both **local import** and **remote API** loaders.
 * - Apply fallback locales if needed.
 * - Cache messages if enabled (handled by underlying loader, not this function directly).
 */
export const loadMessages = async <C extends GenConfigKeys = "__default__">({
  config,
  locale,
  pathname,
}: MessagesLoaderOptions): MessagesLoaderResult<C> => {
  const baseLogger = getLogger({ id: config.id, ...config.logger });
  const logger = baseLogger.child({ scope: "messages-loader" });

  if (!config.loader) {
    logger.warn(
      "No loader options have been configured in the current config.",
    );
    return;
  }

  const { id, loader, cache } = config;
  const fallbackLocales = config.fallbackLocales[locale] || []; // fallback locales fro the pass-in target locale
  const namespaces = resolveNamespaces({ config, pathname }); // Resolve namespaces with pathname

  logger.debug("Namespaces ready for loading.", {
    namespaces:
      namespaces.length > 0
        ? { count: namespaces.length, list: [...namespaces] }
        : "All Namespaces",
  });
  logger.debug("Loader type selected.", { loaderType: loader.type });

  let loadedMessages: LocaleMessages | undefined;

  //====== loader type: import ======
  if (loader.type === "import") {
    // Create load local messages (make basePath static)
    const loadLocalMessages = createLoadLocalMessages(loader.basePath);
    loadedMessages = await loadLocalMessages({
      ...loader,
      locale,
      fallbackLocales,
      namespaces,
      cache,
      logger: { id },
    });
  }
  //====== loader type: api ======
  else if (loader.type === "api") {
    // Fetch messages from API
    loadedMessages = await loadApiMessages({
      ...loader,
      locale,
      fallbackLocales,
      namespaces,
      logger: { id },
    });
  }

  // No messages found
  if (!loadedMessages || Object.keys(loadedMessages).length === 0) {
    logger.warn("No messages found.", { locale, namespaces });
  }

  return loadedMessages as GenMessages<C>;
};
