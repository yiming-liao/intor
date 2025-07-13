import type pLimit from "p-limit";
import { Namespace, NestedMessage } from "intor-translator";
import { logry } from "logry";
import { loadSingleLocale } from "@/modules/intor-messages-loader/load-local-messages/load-single-locale";

type LoadLocaleWithFallbackOptions = {
  basePath: string;
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  messages: Record<string, Record<string, NestedMessage>>;
  limit: ReturnType<typeof pLimit>;
  loggerId: string;
};

export const loadLocaleWithFallback = async ({
  basePath,
  locale: targetLocale,
  fallbackLocales = [],
  namespaces,
  messages,
  limit,
  loggerId,
}: LoadLocaleWithFallbackOptions): Promise<Namespace[] | undefined> => {
  const logger = logry({ id: loggerId, scope: "loadLocaleWithFallback" });

  const localesToTry = [targetLocale, ...fallbackLocales];

  for (const locale of localesToTry) {
    try {
      const validNamespaces = await loadSingleLocale({
        basePath,
        locale,
        namespaces,
        messages,
        limit,
        loggerId,
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

  return undefined;
};
