import {
  loadLocalMessages,
  type LoadLocalMessagesParams,
} from "../messages/load-local-messages";

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
 * Load locale messages using a URL-based query protocol.
 *
 * This helper parses Intor-compatible URL parameters and
 * delegates message loading to the local loader.
 *
 * This helper is intended for building custom HTTP endpoints.

 * @example
 * ```ts
 * // In a custom HTTP endpoint
 * export async function GET(req: Request) {
 *   const url = new URL(req.url);
 *   const messages = await loadMessagesFromUrl(url);
 *   return Response.json(messages);
 * }
 * ```
 */
export async function loadMessagesFromUrl(
  url: URL,
  options?: Omit<
    LoadLocalMessagesParams,
    "locale" | "fallbackLocales" | "namespaces" | "rootDir"
  >,
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
    id: options?.id || "default",
    rootDir,
    locale,
    namespaces,
    fallbackLocales,
    concurrency: options?.concurrency,
    readers: options?.readers,
    pool: options?.pool,
    allowCacheWrite: options?.allowCacheWrite,
    loggerOptions: options?.loggerOptions || { id: "default" },
  });
}
