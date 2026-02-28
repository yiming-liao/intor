/**
 * Fetch-compatible function used by Intor for runtime loading.
 *
 * Mirrors the standard WHATWG Fetch API.
 *
 * @public
 */
export type RuntimeFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;
