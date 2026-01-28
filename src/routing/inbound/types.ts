import type { RoutingLocaleSource } from "@/core";
import type { Locale } from "intor-translator";

export interface ResolveInboundResult {
  /** Resolved locale */
  locale: Locale;
  /** Locale source used for resolution */
  localeSource: RoutingLocaleSource;
  /** Localized pathname */
  pathname: string;
  /** Whether redirect is required */
  shouldRedirect: boolean;
}

export type InboundContext = Pick<
  ResolveInboundResult,
  "locale" | "pathname" | "localeSource"
>;
