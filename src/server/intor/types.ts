import type { IntorConfig } from "../../config";
import {
  type GenConfigKeys,
  type GenLocale,
  type GenMessages,
} from "../../core";

export interface IntorValue<CK extends GenConfigKeys = "__default__"> {
  config: IntorConfig;
  locale: GenLocale<CK>;
  messages: Readonly<GenMessages<CK>>;
}
