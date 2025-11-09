import { LocaleNamespaceMessages } from "intor-translator";
import { FetcherOptions } from "@/modules/messages-loader/load-api-messages/types";
import { getLogger } from "@/shared/logger/get-logger";

/**
 * Fetches locale messages from a remote API.
 */
export const fetchMessages = async <Messages extends LocaleNamespaceMessages>({
  apiUrl,
  locale,
  searchParams,
  configId,
}: FetcherOptions): Promise<Messages | undefined> => {
  const baseLogger = getLogger({ id: configId });
  const logger = baseLogger.child({ scope: "fetch-messages" });

  try {
    const params = new URLSearchParams(searchParams);
    params.append("locale", locale);
    const url = `${apiUrl}?${params.toString()}`;

    // Perform the fetch request
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    // Handle non-OK responses
    if (!response.ok) {
      throw new Error(`Fetch failed: ${locale} (${response.status})`);
    }

    // Parse JSON body
    const data = await response.json();

    // Validate content
    if (
      data == null ||
      (typeof data === "object" && Object.keys(data).length === 0)
    ) {
      throw new Error(`Invalid messages: ${locale}`);
    }

    // Cast to expected message type and return
    return data as Messages;
  } catch (error) {
    logger.warn(`Failed to fetch messages for locale "${locale}".`, {
      locale,
      apiUrl,
      searchParams: decodeURIComponent(searchParams.toString()),
      error,
    });
    return;
  }
};
