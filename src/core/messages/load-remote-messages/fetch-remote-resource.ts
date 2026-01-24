import type { RuntimeFetch } from "../../types";
import type { RemoteHeaders, LoggerOptions } from "@/config";
import type { MessageObject } from "intor-translator";
import { getLogger } from "../../logger";
import { isValidMessages } from "../utils/is-valid-messages";

interface FetchLocaleMessagesParams {
  fetch: RuntimeFetch;
  url: string;
  headers?: RemoteHeaders;
  signal?: AbortSignal;
  loggerOptions: LoggerOptions;
}

/**
 * Fetch a single remote messages resource.
 *
 * This function performs a single HTTP request to retrieve
 * a remote translation messages payload.
 *
 * It is responsible for:
 * - Issuing the network request
 * - Validating the returned message structure
 * - Handling abort and network errors
 */
export async function fetchRemoteResource({
  fetch,
  url,
  headers,
  signal,
  loggerOptions,
}: FetchLocaleMessagesParams): Promise<MessageObject | undefined> {
  const baseLogger = getLogger(loggerOptions);
  const logger = baseLogger.child({ scope: "fetch-locale-messages" });

  try {
    // Fetch
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...headers },
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    // Parse JSON body
    const data = await response.json();

    // Validate messages structure
    if (!isValidMessages(data)) {
      throw new Error("Invalid messages structure");
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      logger.debug("Remote fetch aborted.", { url });
      return;
    }
    logger.warn("Failed to fetch remote messages.", { url, error });
    return;
  }
}
