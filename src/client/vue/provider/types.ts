import type { RuntimeState } from "../helpers/use-runtime-state";
import type { IntorResolvedConfig } from "@/config";
import type {
  BootstrapCore,
  GenConfigKeys,
  GenLocale,
  GenMessages,
} from "@/core";
import type { Translator } from "intor-translator";
import type {
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";

export interface VueBootstrap<CK extends GenConfigKeys = "__default__">
  extends Partial<Omit<BootstrapCore<CK>, "messages">> {
  messages?: Readonly<GenMessages<CK>>;
  isLoading?: boolean;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  onLocaleChange?: (newLocale: GenLocale<CK>) => Promise<void> | void;
  runtimeState?: RuntimeState<CK>;
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
