import { LocaleNamespaceMessages } from "intor-translator";
import { fetcher } from "@/modules/intor-messages-loader/fetch-api-messages/fetcher";

/**
 * Try to fetch messages from fallback locales in order.
 * Returns the first successful result, or undefined if all fail.
 *
 * @param apiUrl - The API base URL
 * @param searchParams - Query parameters for the API request
 * @param fallbackLocales - Locales to try in fallback order
 * @param loggerId - Logger context ID
 * @returns The first successful locale and its messages, or undefined
 */
export const fetchFallbackMessages = async <
  Messages extends LocaleNamespaceMessages,
>(
  apiUrl: string,
  searchParams: URLSearchParams,
  fallbackLocales: string[],
  loggerId: string,
): Promise<{ locale: string; messages: Messages } | undefined> => {
  // Try fetch with current fallback locale
  for (const fallbackLocale of fallbackLocales) {
    const result = await fetcher<Messages>({
      apiUrl,
      searchParams,
      locale: fallbackLocale,
      loggerId,
    });

    // Return on first success
    if (result) {
      return { locale: fallbackLocale, messages: result };
    }
  }

  // All fallback attempts failed
  return undefined;
};
