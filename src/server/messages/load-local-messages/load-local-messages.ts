import type { LoadLocalMessagesParams } from "./types";
import type { LocaleMessages } from "intor-translator";
import path from "node:path";
import pLimit from "p-limit";
import { readLocaleMessages } from "@/server/messages/load-local-messages/read-locale-messages";
import { getLogger } from "@/shared/logger";
import { getGlobalMessagesPool } from "@/shared/messages/global-messages-pool";
import { normalizeCacheKey } from "@/shared/utils";

/**
 * Load locale messages from the local file system.
 *
 * This function acts as the orchestration layer for local message loading.
 * It is responsible for:
 *
 * - Resolving fallback locales in order
 * - Coordinating cache read / write behavior
 * - Limiting concurrent file reads for performance
 *
 * File system traversal, parsing, and message validation are delegated to lower-level utilities.
 */
export const loadLocalMessages = async ({
  locale,
  fallbackLocales,
  namespaces,
  rootDir = "messages",
  concurrency = 10,
  exts,
  messagesReader,
  pool = getGlobalMessagesPool(),
  cacheOptions,
  allowCacheWrite = false,
  loggerOptions,
}: LoadLocalMessagesParams): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger(loggerOptions);
  const logger = baseLogger.child({ scope: "load-local-messages" });

  const start = performance.now();
  logger.debug("Loading local messages.", {
    rootDir,
    resolvedRootDir: path.resolve(process.cwd(), rootDir),
  });

  // --- Cache key ---
  const cacheKey = normalizeCacheKey([
    loggerOptions.id,
    "loaderType:local",
    rootDir,
    locale,
    (fallbackLocales || []).toSorted().join(","),
    (namespaces || []).toSorted().join(","),
  ]);

  // --- Cache read ---
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
        locale: candidateLocale,
        namespaces,
        rootDir,
        limit,
        extraOptions: { exts, messagesReader, loggerOptions },
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

  // --- Cache write ---
  if (cacheOptions.enabled && allowCacheWrite && cacheKey && messages) {
    await pool?.set(cacheKey, messages, cacheOptions.ttl);
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
