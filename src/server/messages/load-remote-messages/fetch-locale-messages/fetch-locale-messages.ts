import type { FetcherOptions } from "./types";
import type { LocaleMessages } from "intor-translator";
import { isValidMessages } from "@/server/messages/shared/utils/is-valid-messages";
import { getLogger } from "@/server/shared/logger/get-logger";

/**
 * Fetches locale messages from a remote API.
 *
 * - Validates that the returned JSON matches the expected `NamespaceMessages` structure.
 * - Uses `fetch` with `no-store` cache to always get fresh data.
 */
export const fetchLocaleMessages = async ({
  remoteUrl,
  remoteHeaders,
  searchParams,
  locale,
  extraOptions: { loggerOptions } = {},
}: FetcherOptions): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger({ ...loggerOptions });
  const logger = baseLogger.child({ scope: "fetch-locale-messages" });

  try {
    const params = new URLSearchParams(searchParams);
    params.append("locale", locale);
    const url = `${remoteUrl}?${params.toString()}`;

    // Headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...remoteHeaders,
    };

    // Fetch
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
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
    logger.warn("Fetching locale messages failed.", {
      locale,
      remoteUrl,
      searchParams: decodeURIComponent(searchParams.toString()),
      error,
    });
    return;
  }
};
