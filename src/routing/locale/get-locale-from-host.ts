import type { IntorResolvedConfig } from "@/config";
import { normalizeLocale } from "@/core";

/**
 * Extract locale from hostname.
 *
 * Only the left-most subdomain is considered as a locale candidate, if present.
 *
 * @example
 * ```ts
 * getLocaleFromHost(config, "en.example.com")
 * // => "en"
 * getLocaleFromHost(config, "example.com")
 * // => undefined
 * getLocaleFromHost(config, "api.jp.example.com")
 * // => undefined
 * ```
 */
export function getLocaleFromHost(
  config: IntorResolvedConfig,
  host: string | undefined,
): string | undefined {
  if (!host) return;

  const { supportedLocales } = config;

  // Remove port (e.g. localhost:3000)
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");

  if (parts.length < 2) return;

  const candidate = parts[0];
  return normalizeLocale(candidate, supportedLocales);
}
