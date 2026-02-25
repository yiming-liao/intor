import type { IntorResolvedConfig } from "../../config";
import {
  type GenConfigKeys,
  type GenLocale,
  type GenMessages,
} from "../../core";

export interface IntorValue<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  messages: Readonly<GenMessages<CK>>;
}
