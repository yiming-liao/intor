import type { LoadRemoteMessagesOptions } from "./types";
import type { LocaleMessages } from "intor-translator";
import { DEFAULT_CACHE_OPTIONS } from "@/modules/config/constants/cache.constants";
import { fetchLocaleMessages } from "@/modules/messages/load-remote-messages/fetch-locale-messages";
import { buildSearchParams } from "@/modules/messages/load-remote-messages/fetch-locale-messages/utils/build-search-params";
import { getLogger } from "@/shared/logger/get-logger";
import { getGlobalMessagesPool } from "@/shared/messages/global-messages-pool";
import { normalizeCacheKey } from "@/shared/utils";

/**
 * Load locale messages from a remote API.
 *
 * - Fetch messages for a target locale with optional fallback locales.
 * - Cache messages if enabled.
 */
export const loadRemoteMessages = async ({
  pool = getGlobalMessagesPool(),
  rootDir,
  remoteUrl,
  remoteHeaders,
  locale,
  fallbackLocales = [],
  namespaces = [],
  extraOptions: {
    cacheOptions = DEFAULT_CACHE_OPTIONS,
    loggerOptions = { id: "default" },
  } = {},
  allowCacheWrite,
}: LoadRemoteMessagesOptions): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "load-remote-messages" });

  // Start performance measurement
  const start = performance.now();
  logger.debug("Loading remote messages from api.", { remoteUrl });

  //====== Cache lookup ======
  const key = normalizeCacheKey([
    loggerOptions.id,
    "loaderType:remote",
    rootDir,
    locale,
    (fallbackLocales ?? []).toSorted().join(","),
    (namespaces ?? []).toSorted().join(","),
  ]);
  if (cacheOptions.enabled && key) {
    const cached = await pool?.get(key);
    if (cached) {
      logger.debug("Messages cache hit.", { key });
      return cached;
    }
  }

  // Build search params
  const searchParams = buildSearchParams({ rootDir, namespaces });

  //============================================================
  // Fetch messages
  //============================================================
  const candidateLocales = [locale, ...(fallbackLocales || [])];
  let messages: LocaleMessages | undefined;
  for (const candidateLocale of candidateLocales) {
    try {
      const result = await fetchLocaleMessages({
        remoteUrl,
        remoteHeaders,
        searchParams,
        locale: candidateLocale,
        extraOptions: { loggerOptions },
      });
      if (result && Object.values(result[candidateLocale] || {}).length > 0) {
        messages = result;
        break;
      }
    } catch (error) {
      logger.error("Failed to fetch locale messages.", {
        locale: candidateLocale,
        error,
      });
    }
  }

  //====== Cache ======
  if (allowCacheWrite && cacheOptions.enabled && key && messages) {
    await pool?.set(key, messages, cacheOptions.ttl);
  }

  // Log out validnamespaces & performance measurement
  const end = performance.now();
  const duration = Math.round(end - start);
  logger.trace("Finished loading remote messages.", {
    loadedLocale: messages ? Object.keys(messages)[0] : undefined,
    duration: `${duration} ms`,
  });

  return messages;
};
