import type { IntorConfig } from "../../config";
import type { GenConfigKeys, GenLocale } from "../../core";
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
 * @public
 */
export const redirect = async <CK extends GenConfigKeys = "__default__">(
  config: IntorConfig,
  url: string,
  options?: { locale?: GenLocale<CK>; type?: RedirectType },
) => {
  const { locale, type } = options ?? {};

  const currentLocale = await getLocale(config);

  const { destination } = resolveOutbound(
    config,
    currentLocale,
    "", // server redirect does not depend on current pathname
    {
      destination: url,
      ...(locale !== undefined ? { locale } : {}),
    },
  );

  return nextRedirect(destination, type);
};
