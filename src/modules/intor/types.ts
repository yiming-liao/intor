import { Locale, LocaleNamespaceMessages } from "intor-translator";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { GenLocale } from "@/shared/types/generated.types";

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
  messages: LocaleNamespaceMessages;
}
