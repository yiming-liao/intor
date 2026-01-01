import type { BootstrapCore } from "../../shared/types";
import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale, GenMessages } from "@/core";
import type { Translator } from "intor-translator";

export interface VueBootstrap<CK extends GenConfigKeys = "__default__">
  extends BootstrapCore<CK> {
  messages?: Readonly<GenMessages<CK>>;
  isLoading?: boolean;
}

export type IntorProviderProps<CK extends GenConfigKeys = "__default__"> =
  VueBootstrap<CK>;

export type IntorContextValue<CK extends GenConfigKeys = "__default__"> = {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  setLocale: (locale: GenLocale<CK>) => void;
  messages: Readonly<GenMessages<CK>>;
  isLoading: boolean;
  translator: Translator<unknown>;
};
