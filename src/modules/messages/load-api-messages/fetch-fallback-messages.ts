import type { FetchFallbackMessagesOptions } from "@/modules/messages/load-api-messages/types";
import type { LocaleMessages } from "intor-translator";
import { fetchMessages } from "@/modules/messages/load-api-messages/fetch-messages";

/**
 * Try to fetch messages from fallback locales in order.
 * Returns the first successful result, or undefined if all fail.
 */
export const fetchFallbackMessages = async <Messages extends LocaleMessages>({
  apiUrl,
  apiHeaders,
  searchParams,
  fallbackLocales,
  logger,
}: FetchFallbackMessagesOptions): Promise<
  { locale: string; messages: Messages } | undefined
> => {
  // Try fetch with current fallback locale
  for (const fallbackLocale of fallbackLocales) {
    const result = await fetchMessages<Messages>({
      apiUrl,
      searchParams,
      locale: fallbackLocale,
      apiHeaders,
      logger,
    });

    // Return on first success
    if (result) {
      return { locale: fallbackLocale, messages: result };
    }
  }

  // All fallback attempts failed
  return;
};
