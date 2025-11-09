import { LocaleNamespaceMessages } from "intor-translator";
import { fetchMessages } from "@/modules/messages-loader/load-api-messages/fetch-messages";
import { FetchFallbackMessagesOptions } from "@/modules/messages-loader/load-api-messages/types";

/**
 * Try to fetch messages from fallback locales in order.
 * Returns the first successful result, or undefined if all fail.
 */
export const fetchFallbackMessages = async <
  Messages extends LocaleNamespaceMessages,
>({
  apiUrl,
  searchParams,
  fallbackLocales,
  configId,
}: FetchFallbackMessagesOptions): Promise<
  { locale: string; messages: Messages } | undefined
> => {
  // Try fetch with current fallback locale
  for (const fallbackLocale of fallbackLocales) {
    const result = await fetchMessages<Messages>({
      apiUrl,
      searchParams,
      locale: fallbackLocale,
      configId,
    });

    // Return on first success
    if (result) {
      return { locale: fallbackLocale, messages: result };
    }
  }

  // All fallback attempts failed
  return;
};
