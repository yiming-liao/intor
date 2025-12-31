"use client";

import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import * as React from "react";
import { shouldPersist, shouldPersistOnFirstVisit } from "@/policies";
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

    if (
      shouldPersistOnFirstVisit(isFirstVisit, routing.firstVisit.persist) &&
      shouldPersist(cookie)
    ) {
      setLocaleCookieBrowser(cookie, locale);
    }
  }, [locale, cookie, routing.firstVisit.persist]);
}
