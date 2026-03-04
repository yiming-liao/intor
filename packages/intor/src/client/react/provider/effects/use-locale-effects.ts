"use client";

import type { IntorResolvedConfig } from "../../../../config";
import type { Locale } from "intor-translator";
import * as React from "react";
import { shouldPersistOnFirstVisit } from "../../../../policies";
import {
  setLocaleCookie,
  setDocumentLocale,
  getLocaleFromCookie,
} from "../../../shared/utils";

export function useLocaleEffects(config: IntorResolvedConfig, locale: Locale) {
  const { cookie, routing } = config;
  const isFirstSyncRef = React.useRef(true);

  React.useEffect(() => {
    // Always sync document language
    setDocumentLocale(locale);

    // -----------------------------------------------------------------------
    // First sync (initial mount / hydration)
    // -----------------------------------------------------------------------
    if (isFirstSyncRef.current) {
      isFirstSyncRef.current = false;

      const localeCookie = getLocaleFromCookie(cookie.name);
      const isFirstVisit = !localeCookie;

      if (
        shouldPersistOnFirstVisit(
          isFirstVisit,
          routing.inbound.firstVisit.persist,
        ) &&
        cookie.persist
      ) {
        setLocaleCookie(cookie, locale);
      }

      return;
    }

    // -----------------------------------------------------------------------
    // Subsequent locale changes (user-driven)
    // -----------------------------------------------------------------------
    if (cookie.persist) {
      setLocaleCookie(cookie, locale);
    }
  }, [locale, cookie, routing.inbound.firstVisit.persist]);
}
