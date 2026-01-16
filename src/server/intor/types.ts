import type { IntorResolvedConfig } from "@/config";
import type { Locale } from "intor-translator";
import { type GenConfigKeys, type GenLocale, type GenMessages } from "@/core";

export type LocaleResolver = (
  config: IntorResolvedConfig,
) => Locale | Promise<Locale>;

export interface IntorValue<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  messages: Readonly<GenMessages<CK>>;
}
