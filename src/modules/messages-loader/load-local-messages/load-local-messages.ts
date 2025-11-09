import path from "node:path";
import { performance } from "node:perf_hooks";
import { LocaleNamespaceMessages } from "intor-translator";
import pLimit from "p-limit";
import { LoadLocalMessagesOptions } from "./types";
import { loadLocaleWithFallback } from "@/modules/messages-loader/load-local-messages/load-locale-with-fallback";
import { getLogger } from "@/shared/logger/get-logger";
import { normalizePathname } from "@/shared/utils/pathname/normalize-pathname";

export const loadLocalMessages = async ({
  basePath,
  locale,
  fallbackLocales,
  namespaces,
  concurrency = 10,
  configId,
}: LoadLocalMessagesOptions): Promise<LocaleNamespaceMessages> => {
  basePath = basePath ?? "messages";
  configId = configId ?? "default";
  if (!locale || locale.trim() === "") return {};

  const baseLogger = getLogger({ id: configId });
  const logger = baseLogger.child({ scope: "load-locale-messages" });

  const resolvedBasePath = path.resolve(
    process.cwd(),
    normalizePathname(basePath, { removeLeadingSlash: true }),
  );

  const messages: LocaleNamespaceMessages = {};
  const limit = pLimit(concurrency);

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

  // Try to load (locale + fallback locales)
  const validNamespaces = await loadLocaleWithFallback({
    basePath: resolvedBasePath,
    locale,
    fallbackLocales,
    namespaces,
    messages,
    limit,
    configId,
  });

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
