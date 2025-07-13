import { Locale } from "intor-translator";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

export type IntorAdapterRuntimeOptions = {
  config: IntorResolvedConfig;
};

export type IntorAdapterRuntime = (options: {
  config: IntorResolvedConfig;
  request?: unknown; // next-server, express, ...
}) => Promise<{ locale: Locale; pathname: string }>;
