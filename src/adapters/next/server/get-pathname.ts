import type { IntorResolvedConfig } from "@/config";
import { headers } from "next/headers";
import { INTOR_HEADERS } from "@/core";
import { localizePathname, type LocalizedPathname } from "@/routing";

/**
 * Get the resolved pathname variants for the current execution context.
 *
 * @example
 * ```ts
 * const { pathname, unprefixedPathname, templatedPathname } = await getPathname();
 * // pathname => "/app/en-US/about"
 * // unprefixedPathname => "/about"
 * // templatedPathname => "/app/{locale}/about"
 * ```
 * @note Requires inbound routing context; otherwise the result may be inferred.
 * @platform Next.js
 */
export async function getPathname(
  config: IntorResolvedConfig,
): Promise<LocalizedPathname> {
  const headersStore = await headers();
  const locale = headersStore.get(INTOR_HEADERS.LOCALE) || config.defaultLocale;
  const rawPathname = headersStore.get(INTOR_HEADERS.PATHNAME) || "/";
  return localizePathname(rawPathname, config, locale);
}
