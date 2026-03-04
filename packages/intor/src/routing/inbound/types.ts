import type { RoutingLocaleSource } from "../../core";
import type { Locale } from "intor-translator";

/**
 * Result of inbound locale resolution.
 *
 * Represents the full routing decision produced by
 * inbound resolution, including redirect requirement.
 *
 * @public
 */
export interface InboundResult {
  /** Resolved locale */
  locale: Locale;
  /** Locale source used for resolution */
  localeSource: RoutingLocaleSource;
  /** Localized pathname */
  pathname: string;
  /** Whether redirect is required */
  shouldRedirect: boolean;
}

/**
 * Inbound routing context attached to a request.
 *
 * Represents the resolved routing state for the current request.
 *
 * @public
 */
export type InboundContext = Omit<InboundResult, "shouldRedirect">;
