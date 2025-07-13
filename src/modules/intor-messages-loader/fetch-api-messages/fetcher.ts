import { LocaleNamespaceMessages } from "intor-translator";
import { logry } from "logry";

type FetcherOptions = {
  apiUrl: string;
  locale: string;
  searchParams: URLSearchParams;
  loggerId: string;
};

/**
 * Fetches locale messages from a remote API.
 *
 * @template Messages - The expected structure of the locale messages.
 * @param {Object} params
 * @param {string} params.apiUrl - The base URL to fetch messages from.
 * @param {string} params.locale - The target locale (e.g. "en", "zh-TW").
 * @param {URLSearchParams} params.searchParams - Additional search parameters to append to the URL.
 * @param {string} params.loggerId - The logger identifier for logging.
 * @returns {Promise<Messages | undefined>} The parsed messages for the given locale, or undefined if failed.
 */
export const fetcher = async <Messages extends LocaleNamespaceMessages>({
  apiUrl,
  locale,
  searchParams,
  loggerId,
}: FetcherOptions): Promise<Messages | undefined> => {
  const logger = logry({ id: loggerId, scope: "fetcher" });

  try {
    // Create a new URLSearchParams instance to avoid modifying the original searchParams
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
      throw new Error(
        `Fetch failed for locale "${locale}" at URL: ${url} - ${response.status} ${response.statusText}`,
      );
    }

    // Parse JSON body
    const data = await response.json();

    // Validate content
    if (
      data == null ||
      (typeof data === "object" && Object.keys(data).length === 0)
    ) {
      throw new Error(
        `Missing or invalid messages for locale "${locale}" at URL: ${url}`,
      );
    }

    // Cast to expected message type and return
    return data as Messages;
  } catch {
    logger.warn(`Failed to fetch messages for locale "${locale}".`, {
      locale,
      apiUrl,
      searchParams: decodeURIComponent(searchParams.toString()),
    });
    return undefined;
  }
};
