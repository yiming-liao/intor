import { headers } from "next/headers";
import { INTOR_HEADER_KEYS } from "../header-keys";

/**
 * Read the current request's Intor URL state.
 *
 * - Resolves locale, pathname, and search from the execution context.
 *
 * @public
 */
export async function readIntorUrlState() {
  const headersList = await headers();

  return {
    locale: headersList.get(INTOR_HEADER_KEYS.LOCALE) ?? null,
    pathname: headersList.get(INTOR_HEADER_KEYS.PATHNAME) ?? "/",
    search: headersList.get(INTOR_HEADER_KEYS.SEARCH) ?? "",
  };
}
