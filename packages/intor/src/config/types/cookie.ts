/**
 * User-provided cookie configuration.
 *
 * @public
 */
export type CookieRawOptions = {
  /** Whether to use the locale cookie for reading and writing. Defaults to true */
  enabled?: boolean;

  /** Cookie name used to store the locale. Defaults to "intor.locale" */
  name?: string;

  /** Cookie domain scope. Defaults to undefined */
  domain?: string;

  /** Cookie path scope. Defaults to "/" */
  path?: string;

  /** Cookie max age in seconds. Defaults to 365 days */
  maxAge?: number;

  /** Restrict cookie access to HTTP(S) only. Defaults to false */
  httpOnly?: boolean;

  /** Send cookie only over secure connections. Defaults to production */
  secure?: boolean;

  /** Cookie SameSite policy. Defaults to "lax" */
  sameSite?: "lax" | "strict" | "none";
};

/**
 * Fully normalized cookie configuration used at runtime.
 *
 * @public
 */
export type CookieResolvedOptions = Required<
  Omit<CookieRawOptions, "domain">
> & {
  domain: string | undefined;
};
