import type { FetcherOptions } from "./types";
import type { LocaleMessages } from "intor-translator";
import { getLogger } from "@/core/logger";
import { buildSearchParams } from "@/core/messages/load-remote-messages/fetch-locale-messages/utils/build-search-params";
import { isValidMessages } from "@/core/messages/utils/is-valid-messages";

/**
 * Fetches locale messages from a remote API.
 *
 * - Validates that the returned JSON matches the expected `NamespaceMessages` structure.
 * - Uses `fetch` with `no-store` cache to always get fresh data.
 */
export const fetchLocaleMessages = async ({
  locale,
  namespaces,
  rootDir,
  url: rawUrl,
  headers: rawHeaders,
  signal,
  extraOptions: { loggerOptions },
}: FetcherOptions): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger(loggerOptions);
  const logger = baseLogger.child({ scope: "fetch-locale-messages" });

  const searchParams = buildSearchParams({ locale, rootDir, namespaces });
  const url = `${rawUrl}?${searchParams.toString()}`;

  try {
    // Headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...rawHeaders,
    };

    // Fetch
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} ${response.statusText}`);
    }

    // Parse JSON body
    const data = (await response.json()) as LocaleMessages;

    // Validate messages structure
    if (!isValidMessages(data[locale])) {
      throw new Error("JSON file does not match NamespaceMessages structure");
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      logger.debug("Fetching locale messages aborted.", { locale, url });
      return;
    }
    logger.warn("Fetching locale messages failed.", {
      locale,
      url,
      searchParams: decodeURIComponent(searchParams.toString()),
      error,
    });
    return;
  }
};
