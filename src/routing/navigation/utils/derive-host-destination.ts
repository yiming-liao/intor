import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";

/**
 * Derives a locale-specific destination using host-based navigation.
 */
export const deriveHostDestination = (
  config: IntorResolvedConfig,
  rawDestination: string,
  locale: Locale,
): string => {
  const { host } = config.routing.outbound;

  const resolvedHost = host.map[locale] ?? host.default;
  if (!resolvedHost) return rawDestination;

  const url = new URL(rawDestination, "http://internal");
  return `${url.protocol}//${resolvedHost}${url.pathname}${url.search}`;
};
