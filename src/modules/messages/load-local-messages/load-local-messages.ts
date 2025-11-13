import path from "node:path";
import { performance } from "node:perf_hooks";
import { LocaleNamespaceMessages } from "intor-translator";
import pLimit from "p-limit";
import { LoadLocalMessagesOptions } from "./types";
import { DEFAULT_CACHE_OPTIONS } from "@/modules/config/constants/cache.constants";
import { loadLocaleWithFallback } from "@/modules/messages/load-local-messages/load-locale-with-fallback";
import { getLogger } from "@/shared/logger/get-logger";
import { getGlobalMessagesPool } from "@/shared/messages/global-messages-pool";
import { normalizeCacheKey, normalizePathname } from "@/shared/utils";

/**
 * Load local messages from the file system.
 *
 * - Load messages for a target locale with optional fallback locales.
 * - Support filtering by specific namespaces.
 * - Cache messages if enabled.
 * - Limit concurrent file reads for performance.
 */
export const loadLocalMessages = async ({
  basePath,
  locale,
  fallbackLocales,
  namespaces,
  concurrency = 10,
  cache = DEFAULT_CACHE_OPTIONS,
  logger: loggerOptions = { id: "default" },
}: LoadLocalMessagesOptions): Promise<LocaleNamespaceMessages> => {
  basePath = basePath ?? "messages";
  if (!locale || locale.trim() === "") return {};

  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "load-locale-messages" });

  const messages: LocaleNamespaceMessages = {};
  const resolvedBasePath = path.resolve(
    process.cwd(),
    normalizePathname(basePath, { removeLeadingSlash: true }),
  );

  // Start performance measurement
  const start = performance.now();
  logger.trace("Starting to load local messages with configuration.", {
    path: { basePath, resolvedBasePath },
    locale,
    fallbackLocales,
    namespaces:
      namespaces && namespaces.length > 0
        ? { count: namespaces?.length, list: [...namespaces] }
        : "All Namespaces",
    concurrency,
  });

  //====== Cache ======
  let pool;
  if (cache.enabled) {
    pool = getGlobalMessagesPool();
  }
  const key = normalizeCacheKey([
    loggerOptions.id,
    resolvedBasePath,
    locale,
    [...(fallbackLocales ?? [])].sort().join(","),
    [...(namespaces ?? [])].sort().join(","),
  ]);
  if (cache.enabled && key) {
    const cached = await pool?.get(key);
    if (cached) {
      logger.debug("Messages cache hit.", { key });
      return cached;
    }
  }

  //====== Main Function: Load messages at locale + fallback locales ======
  const limit = pLimit(concurrency);
  const validNamespaces = await loadLocaleWithFallback({
    basePath: resolvedBasePath,
    locale,
    fallbackLocales,
    namespaces,
    messages,
    limit,
    logger: loggerOptions,
  });

  //====== Cache ======
  if (cache.enabled && key) {
    await pool?.set(key, messages, cache.ttl);
  }

  const end = performance.now();
  const duration = Math.round(end - start);
  // Log out validnamespaces & performance measurement
  logger.trace("Finished loading local messages.", {
    locale,
    validNamespaces: validNamespaces,
    duration: `${duration} ms`,
  });

  return messages;
};
