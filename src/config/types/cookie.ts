// Cookie raw options
export type CookieRawOptions = {
  /** Enable cookie read/write behavior. Defaults to true */
  enabled?: boolean;
  /** Whether to persist the resolved locale in a cookie. Defaults to true */
  persist?: boolean;
  /** Cookie name used to store the locale. Defaults to "intor.locale" */
  name?: string;
  /** Cookie domain scope. Defaults to null */
  domain?: string | null;
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

// Cookie resolved options
export type CookieResolvedOptions = Required<
  Omit<CookieRawOptions, "domain">
> & { domain: string | null };
