/**
 * Context for pathname processing.
 *
 * - Assumes the locale has already been resolved.
 */
export interface PathnameContext {
  /** Final resolved locale used for pathname decisions */
  locale: string;
  /** Whether the current URL already contains a locale prefix */
  hasPathLocale: boolean;
  /** Whether a locale has been persisted from a previous visit */
  hasPersisted: boolean;
  /** Whether a locale redirect has already occurred in this navigation flow */
  hasRedirected: boolean;
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
