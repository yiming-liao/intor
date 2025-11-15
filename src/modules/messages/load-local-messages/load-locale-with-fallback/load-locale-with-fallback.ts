import type { LoadLocaleWithFallbackOptions } from "./types";
import { loadSingleLocale } from "@/modules/messages/load-local-messages/load-single-locale";
import { getLogger } from "@/shared/logger/get-logger";

export const loadLocaleWithFallback = async ({
  basePath,
  locale: targetLocale,
  fallbackLocales = [],
  namespaces,
  messages,
  limit,
  logger: loggerOptions = { id: "default" },
}: LoadLocaleWithFallbackOptions): Promise<string[] | undefined> => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "load-locale-with-fallback" });

  const candidateLocales = [targetLocale, ...fallbackLocales];

  for (const locale of candidateLocales) {
    try {
      const validNamespaces = await loadSingleLocale({
        basePath,
        locale,
        namespaces,
        messages,
        limit,
        logger: loggerOptions,
      });
      return validNamespaces;
    } catch (error) {
      logger.warn("Error occurred while processing the locale.", {
        locale,
        error,
      });
    }
  }

  // Log out all attempted locales are failed
  logger.warn("All fallback locales failed.", {
    attemptedLocales: candidateLocales,
  });

  return;
};
