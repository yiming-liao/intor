import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import { decideStrategy } from "./decide-strategy";
import { deriveTarget } from "./derive-target";

export type NavigationResult =
  | { locale: Locale; destination: string; kind: "external" }
  | { locale: Locale; destination: string; kind: "client" }
  | { locale: Locale; destination: string; kind: "reload" };

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
  intent: { destination?: string; locale?: Locale },
): NavigationResult {
  // --------------------------------------------------
  // Derive navigation target
  // --------------------------------------------------
  const target = deriveTarget(config, currentLocale, currentPathname, intent);

  // --------------------------------------------------
  // Decide navigation strategy
  // --------------------------------------------------
  const strategy = decideStrategy(config, target);

  return {
    locale: target.locale,
    destination: target.destination,
    kind: strategy.kind,
  };
}
