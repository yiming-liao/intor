import { LocaleMessages } from "intor-translator";
import { FetcherOptions } from "@/modules/messages/load-api-messages/types";
import { getLogger } from "@/shared/logger/get-logger";

/**
 * Fetches locale messages from a remote API.
 */
export const fetchMessages = async <Messages extends LocaleMessages>({
  apiUrl,
  apiHeaders,
  locale,
  searchParams,
  logger: loggerOptions = { id: "default" },
}: FetcherOptions): Promise<Messages | undefined> => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "fetch-messages" });

  try {
    const params = new URLSearchParams(searchParams);
    params.append("locale", locale);
    const url = `${apiUrl}?${params.toString()}`;

    // Headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...apiHeaders,
    };

    // Fetch
    const response = await fetch(url, {
      method: "GET",
      headers,
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
