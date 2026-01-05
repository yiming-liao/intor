import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";

/**
 *  Derives a locale-specific destination using query-based navigation.
 */
export const deriveQueryDestination = (
  config: IntorResolvedConfig,
  rawDestination: string,
  locale: Locale,
): string => {
  const { queryKey } = config.routing.outbound;

  const url = new URL(rawDestination, "http://internal");
  url.searchParams.set(queryKey, locale);
  return `${url.pathname}${url.search}`;
};
