import type { BootstrapCore } from "../../shared/types";
import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale, GenMessages } from "@/core";
import type { Translator } from "intor-translator";
import type * as React from "react";

export interface ReactBootstrap<CK extends GenConfigKeys = "__default__">
  extends BootstrapCore<CK> {
  messages?: Readonly<GenMessages<CK>>;
  isLoading?: boolean;
}

export interface IntorProviderProps<CK extends GenConfigKeys = "__default__"> {
  value: ReactBootstrap<CK>;
  children: React.ReactNode;
}

export type IntorContextValue<CK extends GenConfigKeys = "__default__"> = {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  setLocale: (locale: GenLocale<CK>) => void;
  messages: Readonly<GenMessages<CK>>;
  isLoading: boolean;
  translator: Translator<unknown>;
};
