// Init cookie options
export type InitCookieOptions = {
  disabled?: boolean; // Completely disable cookie usage (no read, no write, no lookup by name)
  autoSetCookie?: boolean; // Allow the system to automatically set cookies (default: true)
  name?: string;
  maxAge?: number;
  path?: string;
  domain?: string | null;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
};

// Resolved cookie options
export type ResolvedCookieOptions = Required<
  Omit<InitCookieOptions, "domain">
> & {
  domain: string | null;
};
