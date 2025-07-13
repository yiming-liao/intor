import path from "node:path";
import { performance } from "node:perf_hooks";
import { LocaleNamespaceMessages } from "intor-translator";
import { logry } from "logry";
import pLimit from "p-limit";
import { loadLocaleWithFallback } from "@/modules/intor-messages-loader/load-local-messages/load-locale-with-fallback";
import { normalizePathname } from "@/shared/utils/pathname/normalize-pathname";

export type LoadLocalMessagesOptions = {
  basePath?: string;
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  concurrency?: number;
  loggerId: string;
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

  const logger = logry({ id: loggerId, scope: "loadLocalMessages" });

  const resolvedBasePath = path.resolve(
    process.cwd(),
    normalizePathname(basePath, { removeLeadingSlash: true }),
  );
  const messages: LocaleNamespaceMessages = {};
  const limit = pLimit(concurrency);

  // Start performance measurement
  const start = performance.now();

  // [DEBUG] Log loader configuration
  logger.debug("Starting to load local messages with configuration:", {
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
    loggerId,
  });

  const end = performance.now();
  const duration = Math.round(end - start);
  // Log out validnamespaces & performance measurement
  if (validNamespaces && validNamespaces?.length > 0) {
    logger.info("Finished loading local messages.", {
      locale,
      namespaces: validNamespaces,
      duration: `${duration} ms`,
    });
  }
  // No valid namespaces found
  else {
    logger.warn("No valid namespaces found for the locale.", {
      locale,
      namespaces: validNamespaces,
      duration: `${duration} ms`,
    });
  }

  return messages;
};
