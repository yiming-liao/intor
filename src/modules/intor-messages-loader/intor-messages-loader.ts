import { LocaleNamespaceMessages } from "intor-translator";
import { logry } from "logry";
import { LoaderOptions } from "@/modules/intor-config/types/loader-options-types";
import { IntorError, IntorErrorCode } from "@/modules/intor-error";
import { createLocalMessagesLoader } from "@/modules/intor-messages-loader/create-local-messages-loader";
import { fetchApiMessages } from "@/modules/intor-messages-loader/fetch-api-messages";
import {
  IntorMessagesOptions,
  IntorMessagesResult,
} from "@/modules/intor-messages-loader/intor-messages-loader-types";
import { resolveNamespaces } from "@/shared/utils/resolve-namespaces";

/**
 * Intor messages loader (Dynamic Import / Dynamic API)
 */
export const intorMessagesLoader = async ({
  config,
  locale,
  pathname,
}: IntorMessagesOptions): IntorMessagesResult => {
  const logger = logry({ id: config.id, scope: "intorMessagesLoader" });

  // Assert as required
  const loaderOptions = config.loaderOptions as LoaderOptions;
  // fallback locales fro the pass-in target locale
  const fallbackLocales = config.fallbackLocales[locale] || [];
  // Resolve namespaces with pathname
  const namespaces = resolveNamespaces({ config, pathname });

  let dynamicMessages: LocaleNamespaceMessages | undefined;

  logger.info("Namespaces ready for loading:", {
    namespaces:
      namespaces.length > 0
        ? { count: namespaces.length, list: [...namespaces] }
        : "All",
  });
  logger.debug("Loader type selected:", {
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
    logger.error("Unknown loader type.", {
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
    logger.warn("No messages found.", { locale, namespaces });
  }

  return dynamicMessages;
};
