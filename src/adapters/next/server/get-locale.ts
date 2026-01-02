import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale } from "@/core";
import { headers } from "next/headers";
import { INTOR_HEADERS } from "@/core";

/**
 * Get the locale for the current execution context.
 *
 * @note Requires inbound routing context; otherwise the result may be inferred.
 * @platform Next.js
 */
export const getLocale = async <CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
): Promise<GenLocale<CK>> => {
  const headersStore = await headers();
  const locale = headersStore.get(INTOR_HEADERS.LOCALE) || config.defaultLocale;
  return locale as GenLocale<CK>;
};
