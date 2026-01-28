import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import { decideStrategy, type OutboundStrategy } from "./decide-strategy";
import { determineTarget, type OutboundTarget } from "./determine-target";

export type OutboundResult = Pick<OutboundTarget, "locale" | "destination"> & {
  kind: OutboundStrategy;
};

/**
 * Resolve an outbound routing attempt into an executable result.
 */
export function resolveOutbound(
  config: IntorResolvedConfig,
  currentLocale: Locale,
  currentPathname: string,
  intent: { destination?: string; locale?: Locale },
): OutboundResult {
  // --------------------------------------------------
  // Determine outbound target
  // --------------------------------------------------
  const target = determineTarget(
    config,
    currentLocale,
    currentPathname,
    intent,
  );

  // --------------------------------------------------
  // Decide outbound strategy
  // --------------------------------------------------
  const strategy = decideStrategy(config, target);

  return {
    locale: target.locale,
    destination: target.destination,
    kind: strategy,
  };
}
