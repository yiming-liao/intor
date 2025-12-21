import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { GenConfigKeys, GenLocale } from "@/shared/types/generated";
import type { LocaleMessages } from "intor-translator";

// i18n context
export interface I18nContext<CK extends GenConfigKeys = "__default__"> {
  locale: GenLocale<CK>;
}

// Get i18n context function
export type GetI18nContext = <CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
) => Promise<I18nContext<CK>>;

// Intor result
export interface IntorResult<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  initialLocale: GenLocale<CK>;
  messages: LocaleMessages;
}
