import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import { decideNavigationStrategy } from "./decide-navigation-strategy";
import { deriveNavigationTarget } from "./derive-navigation-target";

export type NavigationResult =
  | { destination: string; kind: "external" }
  | { destination: string; kind: "client" }
  | { destination: string; kind: "reload" };

/**
 * Resolve a navigation attempt into an executable result.
 *
 * This function orchestrates target derivation and strategy selection,
 * producing a final navigation result ready for execution.
 */
export function resolveNavigation(
  config: IntorResolvedConfig,
  currentLocale: Locale,
  currentPathname: string,
  options: { destination?: string; locale?: Locale },
): NavigationResult {
  const target = deriveNavigationTarget(
    config,
    currentLocale,
    currentPathname,
    options,
  );

  const strategy = decideNavigationStrategy(config, target);

  return {
    destination: target.destination,
    kind: strategy.kind,
  };
}
