import { Locale } from "intor-translator";
import { setLocaleCookieClient } from "@/adapters/next/utils/set-locale-cookie-client";
import { CookieResolvedOptions } from "@/modules/config/types/cookie.types";
import { LoaderOptions } from "@/modules/config/types/loader.types";

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
 * 4. Refetch messages if using a dynamic API loader
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

  // Warn: Using dynamic import cannot switch locale with CSR only
  if (loaderType === "import") {
    console.warn(
      `[Intor] You are using dynamic import to switch languages. Please make sure to use the wrapped <Link> component to trigger a page reload, ensuring that the translation data is dynamically updated.`,
    );
  }

  // Update the locale state
  setLocale(newLocale);

  // Set the locale cookie on client side
  setLocaleCookieClient({ cookie, locale: newLocale });

  // Update the <html lang> attribute
  document.documentElement.lang = newLocale;

  // Refetch messages via dynamic API, if applicable
  if (loaderType === "api" && refetchMessages) {
    void refetchMessages(newLocale);
  }
};
