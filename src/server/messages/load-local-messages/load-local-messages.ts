import type { LoadLocalMessagesParams } from "./types";
import type { LocaleMessages } from "intor-translator";
import path from "node:path";
import pLimit from "p-limit";
import { getLogger, normalizeCacheKey, getGlobalMessagesPool } from "@/core";
import { readLocaleMessages } from "./read-locale-messages";

/**
 * Load locale messages from the local file system.
 *
 * This function serves as the orchestration layer for local message loading.
 * It coordinates:
 *
 * - Locale resolution with fallbacks
 * - Concurrency control for file system access
 * - Process-level memoization (read by default, write by ownership)
 *
 * Local messages are cached for the lifetime of the process.
 * Cache writes are restricted to the primary initialization flow.
 *
 * File traversal, parsing, and validation are delegated to lower-level utilities.
 */
export const loadLocalMessages = async ({
  id,
  locale,
  fallbackLocales,
  namespaces,
  rootDir = "messages",
  concurrency = 10,
  readers,
  pool = getGlobalMessagesPool(),
  allowCacheWrite = false,
  loggerOptions,
}: LoadLocalMessagesParams): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger(loggerOptions);
  const logger = baseLogger.child({ scope: "load-local-messages" });

  const start = performance.now();
  logger.debug("Loading local messages.", {
    rootDir,
    resolvedRootDir: path.resolve(rootDir),
  });

  // ---------------------------------------------------------------------------
  // Cache key resolution
  // ---------------------------------------------------------------------------
  const cacheKey = normalizeCacheKey(
    [
      id,
      "loaderType:local",
      rootDir,
      locale,
      fallbackLocales?.toSorted().join(","),
      namespaces?.toSorted().join(","),
    ].filter(Boolean),
  );

  // ---------------------------------------------------------------------------
  // Cache read
  // ---------------------------------------------------------------------------
  if (cacheKey) {
    const cached = pool.get(cacheKey);
    if (cached) {
      logger.debug("Messages cache hit.", { key: cacheKey });
      return cached;
    }
  }

  // ---------------------------------------------------------------------------
  // Resolve locale messages with ordered fallback strategy
  // ---------------------------------------------------------------------------
  const limit = pLimit(concurrency);
  const candidateLocales = [locale, ...(fallbackLocales || [])];
  let messages: LocaleMessages | undefined;

  for (let i = 0; i < candidateLocales.length; i++) {
    const candidateLocale = candidateLocales[i];
    const isLast = i === candidateLocales.length - 1;
    try {
      const result = await readLocaleMessages({
        locale: candidateLocale,
        namespaces,
        rootDir,
        limit,
        readers,
        loggerOptions,
      });

      // Stop at the first locale that yields non-empty messages
      if (Object.values(result[candidateLocale] || {}).length > 0) {
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

  // ---------------------------------------------------------------------------
  // Cache write (explicitly permitted)
  // ---------------------------------------------------------------------------
  const isProd = process.env.NODE_ENV === "production";
  const canWriteCache = isProd && allowCacheWrite;
  if (canWriteCache && cacheKey && messages) {
    pool.set(cacheKey, messages);
  }

  // Final success log with resolved locale and timing
  if (messages) {
    logger.trace("Finished loading local messages.", {
      loadedLocale: Object.keys(messages)[0],
      duration: `${Math.round(performance.now() - start)} ms`,
    });
  }

  return messages;
};
