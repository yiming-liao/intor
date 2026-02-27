import type { GenConfigKeys, GenLocale } from "../../../core";
import type { IntorConfig } from "intor";
import { cookies, headers } from "next/headers";
import { INTOR_HEADERS, matchLocale } from "../../../core";

/**
 * Get the locale for the current execution context.
 *
 * @note Uses inbound routing context when available, otherwise falls back to persisted state.
 * @platform Next.js
 */
export const getLocale = async <CK extends GenConfigKeys = "__default__">(
  config: IntorConfig,
): Promise<GenLocale<CK>> => {
  const headersStore = await headers();

  // Inbound routing context (authoritative)
  const headerLocale = headersStore.get(INTOR_HEADERS.LOCALE);
  if (headerLocale) {
    return headerLocale;
  }

  // Persisted state
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(config.cookie.name)?.value;
  if (cookieLocale) {
    const matched = matchLocale(cookieLocale, config.supportedLocales);
    if (matched) return matched;
  }

  // Explicit default
  return config.defaultLocale;
};
