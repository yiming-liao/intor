import type { CookieResolvedOptions } from "@/modules/config/types/cookie.types";
import type { LoaderOptions } from "@/modules/config/types/loader.types";
import type { Locale } from "intor-translator";
import { setLocaleCookieBrowser } from "@/adapters/next/shared/utils/set-locale-cookie-browser";

type Params = {
  currentLocale: Locale;
  newLocale: Locale;
  loaderOptions?: LoaderOptions;
  cookie: CookieResolvedOptions;
  setLocale: (locale: Locale) => void;
  refetchMessages?: (locale: Locale) => Promise<void>;
};

/**
 * Change the locale on the client side.
 *
 * The following steps will be performed:
 * 1. Update the locale state
 * 2. Set the locale cookie (if not disabled and autoSetCookie is enabled)
 * 3. Update the <html lang> attribute
 * 4. Refetch messages if using a remote API loader
 */
export const changeLocale = ({
  currentLocale,
  newLocale,
  loaderOptions,
  cookie,
  setLocale,
  refetchMessages,
}: Params) => {
  if (typeof document === "undefined") return;

  const loaderType = loaderOptions?.type;

  // Exit early if the new locale is the same as the current one
  if (newLocale === currentLocale) return;

  // Warn: Using dynamic local cannot switch locale with CSR only
  if (loaderType === "local") {
    console.warn(
      `[Intor] You are using dynamic local to switch languages. Please make sure to use the wrapped <Link> component to trigger a page reload, ensuring that the translation data is dynamically updated.`,
    );
  }

  // Update the locale state
  setLocale(newLocale);

  // Set the locale cookie on client side
  setLocaleCookieBrowser({ cookie, locale: newLocale });

  // Update the <html lang> attribute
  document.documentElement.lang = newLocale;

  // Refetch messages via remote API, if applicable
  if (loaderType === "remote" && refetchMessages) {
    void refetchMessages(newLocale);
  }
};
