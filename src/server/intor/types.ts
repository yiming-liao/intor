import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { GenConfigKeys, GenLocale } from "@/shared/types/generated";
import type { LocaleMessages } from "intor-translator";

export type LocaleResolver<CK extends GenConfigKeys = "__default__"> = (
  config: IntorResolvedConfig,
) => GenLocale<CK> | Promise<GenLocale<CK>>;

// Intor result
export interface IntorResult<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  initialLocale: GenLocale<CK>;
  initialMessages: Readonly<LocaleMessages>;
}
