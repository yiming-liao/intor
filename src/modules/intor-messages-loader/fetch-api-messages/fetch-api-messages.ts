import { LocaleNamespaceMessages } from "intor-translator";
import { logry } from "logry";
import { ApiLoader } from "@/modules/intor-config/types/loader-options-types";
import { buildSearchParams } from "@/modules/intor-messages-loader/fetch-api-messages/build-search-params";
import { fetchFallbackMessages } from "@/modules/intor-messages-loader/fetch-api-messages/fetch-fallback-messages";
import { fetcher } from "@/modules/intor-messages-loader/fetch-api-messages/fetcher";

export type FetchApiMessagesOptions = Omit<ApiLoader, "type"> & {
  locale: string;
  fallbackLocales: string[];
  loggerId: string;
};

/**
 * Fetches locale messages from a remote API.
 *
 * @param apiUrl - The base URL of the API to fetch messages from.
 * @param basePath - The base path to append to the `apiUrl`.
 * @param locale - The target locale to fetch messages for.
 * @param fallbackLocales - A list of fallback locales to use if the primary locale fetch fails.
 * @param namespaces - A list of namespaces to fetch messages for.
 * @param loggerId - The unique identifier for the logger.
 *
 * @returns Messages if found, or undefined if all fetch attempts fail.
 */
export const fetchApiMessages = async <
  Messages extends LocaleNamespaceMessages,
>({
  apiUrl,
  basePath,
  locale,
  fallbackLocales = [],
  namespaces = [],
  loggerId,
}: FetchApiMessagesOptions): Promise<Messages | undefined> => {
  const logger = logry({ id: loggerId, scope: "fetchApiMessages" });

  // No api url provided
  if (!apiUrl) {
    logger.warn("No apiUrl provided for fetchApiMessages. Skipping fetch.");
    return undefined;
  }

  // Build search params
  const searchParams = buildSearchParams({
    basePath,
    loggerId,
    namespaces,
  });

  // First attempt to fetch messages for the target locale
  const messages = await fetcher<Messages>({
    apiUrl,
    searchParams,
    locale,
    loggerId,
  });
  if (messages) {
    return messages;
  }

  // If failed, attempt fallback locales
  const fallbackResult = await fetchFallbackMessages<Messages>(
    apiUrl,
    searchParams,
    fallbackLocales,
    loggerId,
  );
  if (fallbackResult) {
    logger.info("Fallback locale succeeded.", {
      usedLocale: fallbackResult.locale,
      apiUrl,
      searchParams: decodeURIComponent(searchParams.toString()),
    });
    return fallbackResult.messages;
  }

  // If all fail, log an error and return undefined
  logger.warn("Failed to fetch messages for all locales.", {
    locale,
    fallbackLocales,
  });

  return undefined;
};
