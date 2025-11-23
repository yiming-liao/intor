// Cookie raw options
export type CookieRawOptions = {
  /** Completely disable cookie usage (no read, no write, no lookup by name) - default: false */
  disabled?: boolean;
  /** Allow the system to automatically set cookies - default: true */
  autoSetCookie?: boolean;
  /** default: "intor.i18n.locale" */
  name?: string;
  /** default: null */
  domain?: string | null;
  /** default: "/" */
  path?: string;
  /** default: 60 * 60 * 24 * 365 (365 days) */
  maxAge?: number;
  /** default: false */
  httpOnly?: boolean;
  /** default: process.env.NODE_ENV !== "development" */
  secure?: boolean;
  /** default: lax */
  sameSite?: "lax" | "strict" | "none";
};

// Cookie resolved options
export type CookieResolvedOptions = Required<
  Omit<CookieRawOptions, "domain">
> & { domain: string | null };
