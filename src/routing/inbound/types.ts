import type { RoutingLocaleSource } from "../../core";
import type { Locale } from "intor-translator";

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
export type InboundContext = Pick<
  InboundResult,
  "locale" | "pathname" | "localeSource"
>;
