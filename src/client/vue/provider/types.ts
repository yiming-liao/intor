import type { BootstrapCore } from "../../shared/types";
import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys } from "@/core";
import type { Translator } from "intor-translator";
import { type Locale, type LocaleMessages } from "intor-translator";

export interface VueBootstrap<CK extends GenConfigKeys = "__default__">
  extends BootstrapCore<CK> {
  initialMessages?: Readonly<LocaleMessages>;
  isLoading?: boolean;
}

export type IntorProviderProps<CK extends GenConfigKeys = "__default__"> =
  VueBootstrap<CK>;

export type IntorContextValue = {
  config: IntorResolvedConfig;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Readonly<LocaleMessages>;
  isLoading: boolean;
  translator: Translator<unknown>;
};
