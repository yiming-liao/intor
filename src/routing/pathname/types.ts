import type { RoutingLocaleSource } from "@/core";

/**
 * Context for pathname processing.
 *
 * - Assumes the locale has already been resolved.
 */
export interface PathnameContext {
  /** Final resolved locale (single source of truth) */
  locale: string;
  /** Source from which the locale was resolved */
  localeSource: RoutingLocaleSource;
}

/**
 * Directive describing how the pathname should be handled.
 */
export interface PathnameDirective {
  /** Indicates whether a redirect is required */
  type: "pass" | "redirect";
}

/**
 * Final resolved pathname result.
 */
export interface ResolvedPathname {
  /** Normalized pathname after applying routing rules */
  pathname: string;
  /** Whether a redirect should occur */
  shouldRedirect: boolean;
}
