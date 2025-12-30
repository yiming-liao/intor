"use client";

import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import * as React from "react";
import {
  setLocaleCookieBrowser,
  setDocumentLocale,
  getLocaleCookieBrowser,
} from "../../../shared/utils";

export function useLocaleEffects(config: IntorResolvedConfig, locale: Locale) {
  const { cookie, routing } = config;

  // Sync locale-related browser side effects.
  React.useEffect(() => {
    // Always sync document language
    setDocumentLocale(locale);

    const localeCookie = getLocaleCookieBrowser(cookie.name);
    const isFirstVisit = !localeCookie;

    if (!isFirstVisit || routing.firstVisit.persist) {
      setLocaleCookieBrowser(cookie, locale);
    }
  }, [locale, cookie, routing.firstVisit.persist]);
}
