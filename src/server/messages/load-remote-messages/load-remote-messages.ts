import type { LoadRemoteMessagesParams } from "./types";
import type { LocaleMessages } from "intor-translator";
import { DEFAULT_CACHE_OPTIONS } from "@/config/constants/cache.constants";
import { fetchLocaleMessages } from "@/server/messages/load-remote-messages/fetch-locale-messages";
import { buildSearchParams } from "@/server/messages/load-remote-messages/fetch-locale-messages/utils/build-search-params";
import { getLogger } from "@/server/shared/logger/get-logger";
import { getGlobalMessagesPool } from "@/server/shared/messages/global-messages-pool";
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
  locale,
  fallbackLocales,
  namespaces,
  remoteUrl,
  remoteHeaders,
  extraOptions: {
    cacheOptions = DEFAULT_CACHE_OPTIONS,
    loggerOptions = { id: "default" },
  } = {},
  allowCacheWrite = false,
}: LoadRemoteMessagesParams): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "load-remote-messages" });

  const start = performance.now();
  logger.debug("Loading remote messages from api.", { remoteUrl });

  // Cache key is scoped by loader type, locale, fallbacks and namespaces
  const cacheKey = normalizeCacheKey([
    loggerOptions.id,
    "loaderType:remote",
    rootDir,
    locale,
    (fallbackLocales ?? []).toSorted().join(","),
    (namespaces ?? []).toSorted().join(","),
  ]);

  //--- Cache read
  if (cacheOptions.enabled && cacheKey) {
    const cached = await pool?.get(cacheKey);
    if (cached) {
      logger.debug("Messages cache hit.", { key: cacheKey });
      return cached;
    }
  }

  const candidateLocales = [locale, ...(fallbackLocales || [])];
  let messages: LocaleMessages | undefined;

  // Try each candidate locale in order and stop at the first successful result
  for (let i = 0; i < candidateLocales.length; i++) {
    const candidateLocale = candidateLocales[i];
    const isLast = i === candidateLocales.length - 1;
    try {
      const fetched = await fetchLocaleMessages({
        remoteUrl,
        remoteHeaders,
        locale: candidateLocale,
        searchParams: buildSearchParams({ rootDir, namespaces }),
        extraOptions: { loggerOptions },
      });
      // Stop at the first locale that yields non-empty messages
      if (fetched && Object.values(fetched[candidateLocale] || {}).length > 0) {
        messages = fetched;
        break;
      }
    } catch (error) {
      if (isLast) {
        logger.warn("Failed to load messages for all candidate locales.", {
          locale,
          fallbackLocales,
        });
      } else {
        logger.warn(
          `Failed to fetch locale messages for "${candidateLocale}", trying next fallback.`,
        );
      }
      logger.trace("Remote fetch error detail.", {
        locale: candidateLocale,
        error,
      });
    }
  }

  //--- Cache write
  if (cacheOptions.enabled && allowCacheWrite && cacheKey && messages) {
    await pool?.set(cacheKey, messages, cacheOptions.ttl);
  }

  // Final success log with resolved locale and timing
  if (messages) {
    logger.trace("Finished loading remote messages.", {
      loadedLocale: messages ? Object.keys(messages)[0] : undefined,
      duration: `${Math.round(performance.now() - start)} ms`,
    });
  }

  return messages;
};
