import type { IntorResolvedConfig } from "@/config";
import { type GenConfigKeys, type GenLocale, type GenMessages } from "@/core";

export type LocaleResolver<CK extends GenConfigKeys = "__default__"> = (
  config: IntorResolvedConfig,
) => GenLocale<CK> | Promise<GenLocale<CK>>;

export interface IntorResult<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  messages: Readonly<GenMessages<CK>>;
}
