import type { GenConfigKeys, GenLocale } from "../../core";
import type { IntorConfig } from "intor";
import type { RedirectType } from "next/navigation";
import { redirect as nextRedirect } from "next/navigation";
import { resolveOutbound } from "../../routing";
import { getLocale } from "./server/get-locale"; // NOTE: Import the concrete server module directly to avoid pulling in the full server barrel (Node-only deps).

/**
 * Redirect to a locale-aware destination for the current execution context.
 *
 * - Bypasses localization for external destinations.
 * - Automatically resolves the effective locale from the execution context.
 *
 * @platform Next.js
 */
export const redirect = async <CK extends GenConfigKeys = "__default__">(
  config: IntorConfig,
  url: string,
  { locale, type }: { locale?: GenLocale<CK>; type?: RedirectType },
) => {
  const currentLocale = await getLocale(config);

  const { destination, kind } = resolveOutbound(config, currentLocale, url, {
    ...(locale !== undefined ? { locale } : {}),
  });

  if (kind === "external") {
    nextRedirect(url);
    return;
  }

  return nextRedirect(destination, type);
};
