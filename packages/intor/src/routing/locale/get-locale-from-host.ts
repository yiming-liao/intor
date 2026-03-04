/**
 * Get locale candidate from hostname.
 *
 * Returns the left-most hostname label, without validation or normalization.
 *
 * @example
 * ```ts
 * getLocaleFromHost("en.example.com")
 * // => "en"
 *
 * getLocaleFromHost("example.com")
 * // => "example"
 *
 * getLocaleFromHost("api.jp.example.com")
 * // => "api"
 *
 * getLocaleFromHost("localhost")
 * // => undefined
 * ```
 */
export function getLocaleFromHost(
  host: string | undefined,
): string | undefined {
  if (!host) return;

  // Remove port (e.g. localhost:3000)
  const hostname = host.split(":")[0]!;
  const parts = hostname.split(".");

  if (parts.length < 2) return;

  return parts[0];
}
