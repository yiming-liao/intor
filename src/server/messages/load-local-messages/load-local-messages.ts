import type { LoadLocalMessagesOptions } from "./types";
import type { LocaleMessages } from "intor-translator";
import path from "node:path";
import { performance } from "node:perf_hooks";
import pLimit from "p-limit";
import { DEFAULT_CACHE_OPTIONS } from "@/config/constants/cache.constants";
import { readLocaleMessages } from "@/server/messages/load-local-messages/read-locale-messages";
import { getLogger } from "@/server/shared/logger/get-logger";
import { getGlobalMessagesPool } from "@/server/shared/messages/global-messages-pool";
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

  const start = performance.now();
  logger.debug("Loading local messages from directory.", {
    rootDir,
    resolvedRootDir: path.resolve(process.cwd(), rootDir),
  });

  const cacheKey = normalizeCacheKey([
    loggerOptions.id,
    "loaderType:local",
    rootDir,
    locale,
    (fallbackLocales || []).toSorted().join(","),
    (namespaces || []).toSorted().join(","),
  ]);

  //--- Cache read
  if (cacheOptions.enabled && cacheKey) {
    const cached = await pool?.get(cacheKey);
    if (cached) {
      logger.debug("Messages cache hit.", { key: cacheKey });
      return cached;
    }
  }

  const limit = pLimit(concurrency);
  const candidateLocales = [locale, ...(fallbackLocales || [])];
  let messages: LocaleMessages | undefined;

  // Try each candidate locale in order and stop at the first successful result
  for (let i = 0; i < candidateLocales.length; i++) {
    const candidateLocale = candidateLocales[i];
    const isLast = i === candidateLocales.length - 1;
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
    } catch {
      if (isLast) {
        logger.warn("Failed to load messages for all candidate locales.", {
          locale,
          fallbackLocales,
        });
      } else {
        logger.warn(
          `Failed to load locale messages for "${candidateLocale}", trying next fallback.`,
        );
      }
    }
  }

  //--- Cache write
  if (allowCacheWrite && cacheOptions.enabled && cacheKey && messages) {
    await pool?.set(cacheKey, messages, cacheOptions.ttl);
  }

  // Log out validnamespaces & performance measurement
  if (messages) {
    logger.trace("Finished loading local messages.", {
      loadedLocale: Object.keys(messages)[0],
      duration: `${Math.round(performance.now() - start)} ms`,
    });
  }

  return messages;
};
