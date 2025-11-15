import { LocaleMessages } from "intor-translator";
import { LoadApiMessagesOptions } from "./types";
import { DEFAULT_CACHE_OPTIONS } from "@/modules/config/constants/cache.constants";
import { fetchFallbackMessages } from "@/modules/messages/load-api-messages/fetch-fallback-messages";
import { fetchMessages } from "@/modules/messages/load-api-messages/fetch-messages";
import { buildSearchParams } from "@/modules/messages/load-api-messages/utils/build-search-params";
import { getLogger } from "@/shared/logger/get-logger";
import { getGlobalMessagesPool } from "@/shared/messages/global-messages-pool";
import { normalizeCacheKey } from "@/shared/utils";

/**
 * Load locale messages from a remote API.
 *
 * - Fetch messages for a target locale with optional fallback locales.
 * - Cache messages if enabled.
 */
export const loadApiMessages = async <Messages extends LocaleMessages>({
  apiUrl,
  apiHeaders,
  basePath,
  locale,
  fallbackLocales = [],
  namespaces = [],
  cache = DEFAULT_CACHE_OPTIONS,
  logger: loggerOptions = { id: "default" },
}: LoadApiMessagesOptions): Promise<Messages | undefined> => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "load-api-messages" });

  if (!apiUrl) {
    logger.warn("No apiUrl provided. Skipping fetch.");
    return;
  }

  //====== Cache ======
  let pool;
  if (cache.enabled) {
    pool = getGlobalMessagesPool();
  }
  const key = normalizeCacheKey([
    loggerOptions.id,
    basePath,
    locale,
    [...(fallbackLocales ?? [])].sort().join(","),
    [...(namespaces ?? [])].sort().join(","),
  ]);
  if (cache.enabled && key) {
    const cached = await pool?.get(key);
    if (cached) {
      logger.debug("Messages cache hit.", { key });
      return cached as Messages;
    }
  }

  // Build search params
  const searchParams = buildSearchParams({ basePath, namespaces });

  // First attempt to fetch messages for the target locale
  const messages = await fetchMessages<Messages>({
    apiUrl,
    apiHeaders,
    searchParams,
    locale,
    logger: loggerOptions,
  });
  if (messages) {
    //====== Cache ======
    if (cache.enabled && key) {
      await pool?.set(key, messages, cache.ttl);
    }
    return messages;
  }

  // If failed, attempt fallback locales
  const fallbackResult = await fetchFallbackMessages<Messages>({
    apiUrl,
    apiHeaders,
    searchParams,
    fallbackLocales,
    logger: loggerOptions,
  });

  if (fallbackResult) {
    logger.info("Fallback locale succeeded.", {
      usedLocale: fallbackResult.locale,
      apiUrl,
      searchParams: decodeURIComponent(searchParams.toString()),
    });
    //====== Cache ======
    if (cache.enabled && key) {
      await pool?.set(key, fallbackResult.messages, cache.ttl);
    }
    return fallbackResult.messages;
  }

  // If all fail, log an error and return undefined
  logger.warn("Failed to fetch messages for all locales.", {
    locale,
    fallbackLocales,
  });

  return;
};
