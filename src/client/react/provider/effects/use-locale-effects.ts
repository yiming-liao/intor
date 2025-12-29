"use client";

import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import * as React from "react";
import {
  setLocaleCookieBrowser,
  setDocumentLocale,
} from "../../../shared/utils";

export function useLocaleEffects(config: IntorResolvedConfig, locale: Locale) {
  // Sync locale-related browser side effects.
  React.useEffect(() => {
    setLocaleCookieBrowser(config.cookie, locale);
    setDocumentLocale(locale);
  }, [config.cookie, locale]);
}
