import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import * as React from "react";
import {
  getLocaleCookieBrowser,
  setLocaleCookieBrowser,
} from "@/client/shared/utils";

/**
 * Persists the resolved locale to a client cookie on first visit.
 *
 * - Browser-only.
 * - Respects routing and cookie configuration.
 * - Skips if a locale cookie already exists.
 */
export const useInitLocaleCookie = (
  config: IntorResolvedConfig,
  locale: string,
) => {
  const { cookie, routing } = config;

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    // 1. Respect cookie configuration flags
    if (!cookie.enabled || !cookie.persist) return;

    // 2. Apply first-visit routing rule
    if (!routing.firstVisit.redirect) return;

    // 3. Skip if locale cookie already exists
    const localeCookie = getLocaleCookieBrowser(cookie);
    if (localeCookie) return;

    // Persist current locale to cookie
    setLocaleCookieBrowser(cookie, locale);
  }, [cookie, routing.firstVisit.redirect, locale]);
};
