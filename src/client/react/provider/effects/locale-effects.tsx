"use client";

import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import * as React from "react";
import {
  setLocaleCookieBrowser,
  setDocumentLocale,
} from "@/client/shared/utils/locale";

export interface LocaleEffectsProps {
  config: IntorResolvedConfig;
  locale: Locale;
}

export function LocaleEffects({ config, locale }: LocaleEffectsProps): null {
  // Sync locale-related browser side effects.
  React.useEffect(() => {
    setLocaleCookieBrowser(config.cookie, locale);
    setDocumentLocale(locale);
  }, [config.cookie, locale]);

  return null;
}
