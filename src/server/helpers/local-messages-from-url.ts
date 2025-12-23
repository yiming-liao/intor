import type { LoadLocalMessagesExtraOptions } from "@/server/messages/load-local-messages";
import { loadLocalMessages } from "@/server/messages/load-local-messages";

/** Parse a multi-value query parameter into a normalized string array. */
function parseMultiValueParam(values: string[] | null): string[] | undefined {
  if (!values || values.length === 0) return undefined;
  const result = values.flatMap((value) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
  );
  return result.length > 0 ? result : undefined;
}

/**
 * Load local locale messages from a URL-based query protocol.
 *
 * - A convenience helper for exposing local messages through a URL-accessible interface.
 *
 * @example
 * ```ts
 * const url = new URL(
 *   "https://example.com/messages" +
 *   "?locale=en-US" +
 *   "&rootDir=./messages" +
 *   "&namespaces=common" +
 *   "&namespaces=homepage" +
 *   "&fallbackLocales=zh-TW"
 * );
 *
 * const messages = await loadLocalMessagesFromUrl(url);
 * ```
 */
export async function loadLocalMessagesFromUrl(
  url: URL,
  extraOptions?: LoadLocalMessagesExtraOptions,
) {
  // Parse query parameters
  const rootDir = url.searchParams.get("rootDir") ?? "";
  const locale = url.searchParams.get("locale") ?? "en-US";
  const namespaces = parseMultiValueParam(
    url.searchParams.getAll("namespaces"),
  );
  const fallbackLocales = parseMultiValueParam(
    url.searchParams.getAll("fallbackLocales"),
  );

  // Load local messages
  return loadLocalMessages({
    rootDir,
    locale,
    namespaces,
    fallbackLocales,
    extraOptions,
  });
}
