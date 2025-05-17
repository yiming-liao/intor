import type { IntorResolvedConfig } from "../../core/intor-config/types/define-intor-config-types";
import type { Locale } from "../../types/message-structure-types";

export type IntorAdapterRuntimeOptions = {
  config: IntorResolvedConfig;
};

export type IntorAdapterRuntimeResult = (options: {
  config: IntorResolvedConfig;
  request?: unknown; // next-server, express, ...
}) => Promise<{ locale: Locale; pathname: string }>;
