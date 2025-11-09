import { LocaleNamespaceMessages } from "intor-translator";
import { LoadApiMessagesOptions } from "./types";
import { fetchFallbackMessages } from "@/modules/messages-loader/load-api-messages/fetch-fallback-messages";
import { fetchMessages } from "@/modules/messages-loader/load-api-messages/fetch-messages";
import { buildSearchParams } from "@/modules/messages-loader/load-api-messages/utils/build-search-params";
import { getLogger } from "@/shared/logger/get-logger";

/**
 * Load locale messages from a remote API.
 */
export const loadApiMessages = async <
  Messages extends LocaleNamespaceMessages,
>({
  apiUrl,
  basePath,
  locale,
  fallbackLocales = [],
  namespaces = [],
  configId,
}: LoadApiMessagesOptions): Promise<Messages | undefined> => {
  const baseLogger = getLogger({ id: configId });
  const logger = baseLogger.child({ scope: "load-api-messages" });

  if (!apiUrl) {
    logger.warn("No apiUrl provided. Skipping fetch.");
    return;
  }

  // Build search params
  const searchParams = buildSearchParams({ basePath, namespaces });

  // First attempt to fetch messages for the target locale
  const messages = await fetchMessages<Messages>({
    apiUrl,
    searchParams,
    locale,
    configId,
  });
  if (messages) return messages;

  // If failed, attempt fallback locales
  const fallbackResult = await fetchFallbackMessages<Messages>({
    apiUrl,
    searchParams,
    fallbackLocales,
    configId,
  });

  if (fallbackResult) {
    logger.info("Fallback locale succeeded.", {
      usedLocale: fallbackResult.locale,
      apiUrl,
      searchParams: decodeURIComponent(searchParams.toString()),
    });
    return fallbackResult.messages;
  }

  // If all fail, log an error and return undefined
  logger.warn("Failed to fetch messages for all locales.", {
    locale,
    fallbackLocales,
  });

  return;
};
