import type { LocaleNamespaceMessages } from "../../types/message-structure-types";
import type { LoaderOptions } from "../intor-config/types/loader-options-types";
import type {
  IntorMessagesOptions,
  IntorMessagesResult,
} from "../intor-messages-loader/intor-messages-loader-types";
import { IntorError, IntorErrorCode } from "../intor-error";
import { getOrCreateLogger } from "../intor-logger";
import { createLocalMessagesLoader } from "../intor-messages-loader/create-local-messages-loader/create-local-messages-loader";
import { fetchApiMessages } from "../intor-messages-loader/fetch-api-messages/fetch-api-messages";
import { resolveNamespaces } from "../utils/resolve-namespaces";

/**
 * Intor messages loader (Dynamic Import / Dynamic API)
 */
export const intorMessagesLoader = async ({
  config,
  locale,
  pathname,
}: IntorMessagesOptions): IntorMessagesResult => {
  const logger = getOrCreateLogger({
    id: config.id,
    prefix: "intorMessagesLoader",
  });

  // Assert as required
  const loaderOptions = config.loaderOptions as LoaderOptions;
  // fallback locales fro the pass-in target locale
  const fallbackLocales = config.fallbackLocales[locale] || [];
  // Resolve namespaces with pathname
  const namespaces = resolveNamespaces({ config, pathname });

  let dynamicMessages: LocaleNamespaceMessages | undefined;

  void logger.info("Namespaces ready for loading:", {
    namespaces:
      namespaces.length > 0
        ? { count: namespaces.length, list: [...namespaces] }
        : "All",
  });
  void logger.debug("Loader type selected:", {
    loaderType: loaderOptions.type,
  });

  // Dynamic import
  if (loaderOptions.type === "import") {
    // Create local messages loader (make basePath static)
    const loadLocalMessages = createLocalMessagesLoader(loaderOptions.basePath);
    dynamicMessages = await loadLocalMessages({
      ...loaderOptions,
      locale,
      fallbackLocales,
      namespaces,
      loggerId: config.id,
    });
  }
  // Dynamic api
  else if (loaderOptions.type === "api") {
    // Fetch messages from API
    dynamicMessages = await fetchApiMessages({
      ...loaderOptions,
      locale,
      fallbackLocales,
      namespaces,
      loggerId: config.id,
    });
  }
  // Unknown loader type
  else {
    void logger.error("Unknown loader type.", {
      type: (loaderOptions as LoaderOptions).type,
    });
    throw new IntorError({
      id: config.id,
      code: IntorErrorCode.UNKNOWN_LOADER_TYPE,
      message: `Unknown loader type: ${(loaderOptions as LoaderOptions).type}`,
    });
  }

  // No messages found
  if (!dynamicMessages || Object.keys(dynamicMessages).length === 0) {
    void logger.warn("No messages found.", { locale, namespaces });
  }

  return dynamicMessages;
};
