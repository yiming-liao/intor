import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";
import { IntorRuntimeResult } from "@/modules/intor-runtime/intor-runtime-types";

export type IntorOptions = {
  request?: unknown; // NextServer, express, ...
  config: IntorResolvedConfig;
};

// Intor result
export type IntorResult = IntorRuntimeResult;
