import { Namespace } from "intor-translator";
import { LoadLocaleWithFallbackOptions } from "./types";
import { loadSingleLocale } from "@/modules/messages-loader/load-local-messages/load-single-locale";
import { getLogger } from "@/shared/logger/get-logger";

export const loadLocaleWithFallback = async ({
  basePath,
  locale: targetLocale,
  fallbackLocales = [],
  namespaces,
  messages,
  limit,
  configId,
}: LoadLocaleWithFallbackOptions): Promise<Namespace[] | undefined> => {
  const baseLogger = getLogger({ id: configId });
  const logger = baseLogger.child({ scope: "load-locale-with-fallback" });

  const localesToTry = [targetLocale, ...fallbackLocales];

  for (const locale of localesToTry) {
    try {
      const validNamespaces = await loadSingleLocale({
        basePath,
        locale,
        namespaces,
        messages,
        limit,
        configId,
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
    attemptedLocales: localesToTry,
  });

  return;
};
