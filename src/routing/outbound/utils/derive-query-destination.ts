import type { IntorResolvedConfig } from "../../../config";
import type { Locale } from "intor-translator";

/**
 *  Derives a locale-specific destination using query-based navigation.
 */
export const deriveQueryDestination = (
  rawDestination: string,
  config: IntorResolvedConfig,
  locale: Locale,
): string => {
  const { queryKey } = config.routing.outbound;

  const url = new URL(rawDestination, "http://localhost");
  url.searchParams.set(queryKey, locale);
  return `${url.pathname}${url.search}`;
};
