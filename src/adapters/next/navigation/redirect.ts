import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale } from "@/core";
import type { RedirectType } from "next/navigation";
import { redirect as nextRedirect } from "next/navigation";
import { isExternalDestination } from "@/core";
import { localizePathname } from "@/routing";
import { getLocale } from "../server/get-locale"; // NOTE: Import the concrete server module directly to avoid pulling in the full server barrel (Node-only deps).

/**
 * Redirect to a locale-aware destination for the current execution context.
 *
 * - Bypasses localization for external destinations.
 * - Automatically resolves the effective locale from the execution context.
 *
 * @platform Next.js
 */
export const redirect = async <CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  url: string,
  { locale, type }: { locale?: GenLocale<CK>; type?: RedirectType },
) => {
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
