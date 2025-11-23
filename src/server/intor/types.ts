import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { GenLocale } from "@/shared/types/generated.types";
import type { Locale, LocaleMessages } from "intor-translator";

// i18n context
export interface I18nContext {
  locale: GenLocale;
  pathname: string;
}

// Get i18n context function
export type GetI18nContext = (
  config: IntorResolvedConfig,
) => Promise<I18nContext>;

// Intor result
export interface IntorResult {
  config: IntorResolvedConfig;
  initialLocale: Locale;
  pathname: string;
  messages: LocaleMessages;
}
