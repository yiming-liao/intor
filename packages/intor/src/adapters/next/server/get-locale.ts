import type { IntorConfig } from "../../../config";
import type { GenConfigKeys, GenLocale } from "../../../core";
import { cookies, headers } from "next/headers";
import { matchLocale } from "../../../core";
import { INTOR_HEADER_KEYS } from "../header-keys";

/**
 * Get the locale for the current execution context.
 *
 * Uses inbound routing context when available, otherwise falls back to persisted state.
 *
 * @public
 */
export const getLocale = async <CK extends GenConfigKeys = "__default__">(
  config: IntorConfig,
): Promise<GenLocale<CK>> => {
  const headersList = await headers();

  // Inbound routing context (authoritative)
  const headerLocale = headersList.get(INTOR_HEADER_KEYS.LOCALE);
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
