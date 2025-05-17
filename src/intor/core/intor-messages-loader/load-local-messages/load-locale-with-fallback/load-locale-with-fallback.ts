import type { IntorLogger } from "../../../../core/intor-logger/intor-logger";
import type {
  Namespace,
  NestedMessage,
} from "../../../../types/message-structure-types";
import type pLimit from "p-limit";
import { loadSingleLocale } from "../load-single-locale";

type LoadLocaleWithFallbackOptions = {
  basePath: string;
  locale: string;
  fallbackLocales?: string[];
  namespaces?: string[];
  messages: Record<string, Record<string, NestedMessage>>;
  limit: ReturnType<typeof pLimit>;
  logger?: IntorLogger;
};

export const loadLocaleWithFallback = async ({
  basePath,
  locale: targetLocale,
  fallbackLocales = [],
  namespaces,
  messages,
  limit,
  logger: baseLogger,
}: LoadLocaleWithFallbackOptions): Promise<Namespace[] | undefined> => {
  const logger = baseLogger?.child({ prefix: "loadLocaleWithFallback" });

  const localesToTry = [targetLocale, ...fallbackLocales];

  for (const locale of localesToTry) {
    try {
      const validNamespaces = await loadSingleLocale({
        basePath,
        locale,
        namespaces,
        messages,
        limit,
        logger,
      });
      return validNamespaces;
    } catch (error) {
      void logger?.warn("Error occurred while processing the locale.", {
        locale,
        error,
      });
    }
  }

  // Log out all attempted locales are failed
  void logger?.warn("All fallback locales failed.", {
    attemptedLocales: localesToTry,
  });

  return undefined;
};
