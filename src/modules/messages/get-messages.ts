import { LocaleNamespaceMessages } from "intor-translator";
import { LoaderOptions } from "@/modules/config/types/loader.types";
import { createLoadLocalMessages } from "@/modules/messages/create-load-local-messages";
import { loadApiMessages } from "@/modules/messages/load-api-messages";
import {
  MessagesLoaderOptions,
  MessagesLoaderResult,
} from "@/modules/messages/types";
import { getLogger } from "@/shared/logger/get-logger";
import { resolveNamespaces } from "@/shared/utils";

/**
 * Get messages (import / api)
 */
export const getMessages = async ({
  config,
  locale,
  pathname,
}: MessagesLoaderOptions): MessagesLoaderResult => {
  const baseLogger = getLogger({ id: config.id });
  const logger = baseLogger.child({ scope: "messages-loader" });

  const loaderOptions = config.loader as LoaderOptions; // Assert as required
  const fallbackLocales = config.fallbackLocales[locale] || []; // fallback locales fro the pass-in target locale
  const namespaces = resolveNamespaces({ config, pathname }); // Resolve namespaces with pathname

  logger.debug("Namespaces ready for loading.", {
    namespaces:
      namespaces.length > 0
        ? { count: namespaces.length, list: [...namespaces] }
        : "All Namespaces",
  });
  logger.debug("Loader type selected.", { loaderType: loaderOptions.type });

  let loadedMessages: LocaleNamespaceMessages | undefined;

  //====== loader type: import ======
  if (loaderOptions.type === "import") {
    // Create load local messages (make basePath static)
    const loadLocalMessages = createLoadLocalMessages(loaderOptions.basePath);
    loadedMessages = await loadLocalMessages({
      ...loaderOptions,
      locale,
      fallbackLocales,
      namespaces,
      cache: config.cache,
      logger: { id: config.id },
    });
  }
  //====== loader type: api ======
  else if (loaderOptions.type === "api") {
    // Fetch messages from API
    loadedMessages = await loadApiMessages({
      ...loaderOptions,
      locale,
      fallbackLocales,
      namespaces,
      logger: { id: config.id },
    });
  }

  // No messages found
  if (!loadedMessages || Object.keys(loadedMessages).length === 0) {
    logger.warn("No messages found.", { locale, namespaces });
  }

  return loadedMessages;
};
