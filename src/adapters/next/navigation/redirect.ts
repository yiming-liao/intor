import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale } from "@/core";
import type { RedirectType } from "next/navigation";
import { redirect as nextRedirect } from "next/navigation";
import { isExternalDestination } from "@/core";
import { localizePathname } from "@/routing";
import { getLocale } from "../server/get-locale"; // NOTE: Import the concrete server module directly to avoid pulling in the full server barrel (Node-only deps).

/**
 * Locale-aware redirect helper (server-only).
 *
 * Wraps Next.js `redirect`
 *
 * - Resolves the effective locale before redirecting
 * - Applies locale prefix for internal destinations
 * - Bypasses localization for external destinations
 */
export const redirect = async <CK extends GenConfigKeys = "__default__">({
  config,
  locale,
  url,
  type,
}: {
  config: IntorResolvedConfig;
  locale?: GenLocale<CK>;
  url: string;
  type?: RedirectType | undefined;
}) => {
  // External destinations bypass app routing entirely
  const isExternal = isExternalDestination(url);
  if (isExternal) {
    nextRedirect(url);
    return;
  }

  // Determine locale for this redirect
  const targetLocale =
    locale && config.supportedLocales.includes(locale)
      ? locale
      : await getLocale(config);

  const { pathname } = localizePathname(config, url, targetLocale);
  return nextRedirect(pathname, type);
};
