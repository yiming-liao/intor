import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { Locale } from "intor-translator";
import { localizePathname } from "@/core/utils";
import { isExternalDestination } from "@/core/utils/is-external-destination";

export interface NavigationTarget {
  /** Locale selected for this navigation */
  locale: Locale;
  /** Final navigation destination (app-relative or external) */
  destination: string;
  /** Whether the destination should bypass app routing */
  isExternal: boolean;
}

/**
 * Resolves the destination of a navigation attempt.
 *
 * This is pure decision logic.
 * No side effects and no framework-specific behavior.
 */
export function resolveNavigationTarget(
  config: IntorResolvedConfig,
  currentLocale: Locale,
  currentPathname: string,
  input: { destination?: string; locale?: Locale },
): NavigationTarget {
  const locale =
    input.locale && config.supportedLocales.includes(input.locale)
      ? input.locale
      : currentLocale;

  let destination = input.destination ?? currentPathname;
  const isExternal = isExternalDestination(destination);

  // Localize destination when navigating within the app
  if (!isExternal) {
    const { localizedPathname } = localizePathname(config, destination, locale);
    destination = localizedPathname;
  }

  return {
    locale,
    destination,
    isExternal,
  };
}
