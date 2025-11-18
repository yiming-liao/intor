import type { LoadLocalMessagesOptions } from "./types";
import type { LocaleMessages } from "intor-translator";
import path from "node:path";
import { performance } from "node:perf_hooks";
import pLimit from "p-limit";
import { DEFAULT_CACHE_OPTIONS } from "@/modules/config/constants/cache.constants";
import { readLocaleMessages } from "@/modules/messages/load-local-messages/read-locale-messages";
import { getLogger } from "@/shared/logger/get-logger";
import { getGlobalMessagesPool } from "@/shared/messages/global-messages-pool";
import { normalizeCacheKey } from "@/shared/utils";

/**
 * Load local messages from the file system.
 *
 * - Load messages for a target locale with optional fallback locales.
 * - Support filtering by specific namespaces.
 * - Cache messages if enabled.
 * - Limit concurrent file reads for performance.
 */
export const loadLocalMessages = async ({
  pool = getGlobalMessagesPool(),
  rootDir = "messages",
  locale,
  fallbackLocales,
  namespaces,
  extraOptions: {
    concurrency = 10,
    cacheOptions = DEFAULT_CACHE_OPTIONS,
    loggerOptions = { id: "default" },
    exts,
    messagesReader,
  } = {},
  allowCacheWrite = false,
}: LoadLocalMessagesOptions): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "load-local-messages" });

  // Start performance measurement
  const start = performance.now();
  logger.debug("Loading local messages from directory.", {
    rootDir,
    resolvedRootDir: path.resolve(process.cwd(), rootDir),
  });

  //====== Cache lookup ======
  const key = normalizeCacheKey([
    loggerOptions.id,
    "loaderType:local",
    rootDir,
    locale,
    (fallbackLocales || []).toSorted().join(","),
    (namespaces || []).toSorted().join(","),
  ]);
  if (cacheOptions.enabled && key) {
    const cached = await pool?.get(key);
    if (cached) {
      logger.debug("Messages cache hit.", { key });
      return cached;
    }
  }

  //============================================================
  // Read messages
  //============================================================
  const limit = pLimit(concurrency);
  const candidateLocales = [locale, ...(fallbackLocales || [])];
  let messages: LocaleMessages | undefined;
  for (const candidateLocale of candidateLocales) {
    try {
      const result = await readLocaleMessages({
        limit,
        rootDir,
        locale: candidateLocale,
        namespaces,
        extraOptions: { loggerOptions, exts, messagesReader },
      });
      if (result && Object.values(result[candidateLocale] || {}).length > 0) {
        messages = result;
        break;
      }
    } catch (error) {
      logger.error("Failed to read locale messages", {
        locale: candidateLocale,
        error,
      });
    }
  }

  //====== Cache storage ======
  if (allowCacheWrite && cacheOptions.enabled && key && messages) {
    await pool?.set(key, messages, cacheOptions.ttl);
  }

  // Log out validnamespaces & performance measurement
  const end = performance.now();
  const duration = Math.round(end - start);
  logger.trace("Finished loading local messages.", {
    loadedLocale: messages ? Object.keys(messages)[0] : undefined,
    duration: `${duration} ms`,
  });

  return messages;
};
