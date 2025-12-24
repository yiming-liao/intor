import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale } from "@/shared/types/generated";
import type { RedirectType } from "next/navigation";
import { redirect as nextRedirect } from "next/navigation";
import { getLocale } from "@/adapters/next/server";
import { localizePathname } from "@/shared/utils";
import { isExternalDestination } from "@/shared/utils/is-external-destination";

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

  const { localizedPathname } = localizePathname(config, url, targetLocale);
  return nextRedirect(localizedPathname, type);
};
