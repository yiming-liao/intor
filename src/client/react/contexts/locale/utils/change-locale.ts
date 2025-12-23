import type { Locale } from "intor-translator";

interface ChangeLocaleParams {
  locale: Locale;
  newLocale: Locale;
  fullReloadRequired: boolean;
  setLocaleState: (locale: Locale) => void;
}

/**
 * Requests a locale change on the client.
 *
 * - This function updates the locale state only.
 * - Side effects such as cookie persistence, `<html lang>` updates,
 * or message refetching are handled by higher-level providers.
 *
 * Notes:
 * - When using a `local` loader, client-side locale switching
 *   requires a full page reload to load new message bundles.
 */
export const changeLocale = ({
  locale,
  newLocale,
  fullReloadRequired,
  setLocaleState,
}: ChangeLocaleParams) => {
  // No-op when locale does not change
  if (newLocale === locale) return;

  // Informational warning when a full reload is required
  if (fullReloadRequired) {
    console.warn(
      `[Intor] Locale change requested while using a "local" loader. ` +
        `Client-side navigation alone will not load new messages. ` +
        `Use the provided <Link> wrapper or trigger a full page reload.`,
    );
  }

  // Update locale state
  setLocaleState(newLocale);
};
