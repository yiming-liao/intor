import type { RoutingLocaleSource } from "@/core";

export interface ResolveInboundResult {
  /** Resolved locale */
  locale: string;
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
