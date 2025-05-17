import type { LocaleNamespaceMessages } from "../../../types/message-structure-types";
import path from "node:path";
import { performance } from "node:perf_hooks";
import pLimit from "p-limit";
import { getOrCreateLogger } from "../../../core/intor-logger";
import { normalizePathname } from "../../../core/utils/pathname/normalize-pathname";
import { loadLocaleWithFallback } from "./load-locale-with-fallback";

export type LoadLocalMessagesOptions = {
  basePath?: string;
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  concurrency?: number;
  loggerId?: string;
};

/**
 * Load local messages
 * - Dynamic (Server side)
 */
export const loadLocalMessages = async ({
  basePath = "messages",
  locale,
  fallbackLocales,
  namespaces,
  concurrency = 10,
  loggerId,
}: LoadLocalMessagesOptions): Promise<LocaleNamespaceMessages> => {
  if (!locale || locale.trim() === "") {
    return {};
  }

  const logger = loggerId
    ? getOrCreateLogger({ id: loggerId, prefix: "loadLocalMessages" })
    : undefined;

  const resolvedBasePath = path.resolve(
    process.cwd(),
    normalizePathname(basePath, { removeLeadingSlash: true }),
  );
  const messages: LocaleNamespaceMessages = {};
  const limit = pLimit(concurrency);

  // Start performance measurement
  const start = performance.now();

  // [DEBUG] Log loader configuration
  void logger?.debug("Starting to load local messages with configuration:", {
    path: { basePath, resolvedBasePath },
    locale,
    fallbackLocales,
    namespaces:
      namespaces && namespaces.length > 0
        ? { count: namespaces?.length, list: [...namespaces] }
        : "All",
    concurrency,
  });

  // Try to load (locale + fallback locales)
  const validNamespaces = await loadLocaleWithFallback({
    basePath: resolvedBasePath,
    locale,
    fallbackLocales,
    namespaces,
    messages,
    limit,
    logger,
  });

  const end = performance.now();
  const duration = Math.round(end - start);
  // Log out validnamespaces & performance measurement
  if (validNamespaces && validNamespaces?.length > 0) {
    void logger?.info("Finished loading local messages.", {
      locale,
      namespaces: validNamespaces,
      duration: `${duration} ms`,
    });
  }
  // No valid namespaces found
  else {
    void logger?.warn("No valid namespaces found for the locale.", {
      locale,
      namespaces: validNamespaces,
      duration: `${duration} ms`,
    });
  }

  return messages;
};
