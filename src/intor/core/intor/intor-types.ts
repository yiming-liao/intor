import type { IntorResolvedConfig } from "../intor-config/types/define-intor-config-types";
import type { IntorRuntimeResult } from "../intor-runtime/intor-runtime-types";
import type { Translator } from "../intor-translator/types/intor-translator-types";
import type { TranslatorHandlers } from "../intor-translator/types/translator-handlers-types";

export type IntorOptions = {
  request?: unknown; // NextServer, express, ...
  config: IntorResolvedConfig;
  translatorHandlers?: TranslatorHandlers;
};

// Intor next-client result
export type IntorNextClientClientResult = IntorRuntimeResult;

// Intor next-server result (return a initialized translator)
export type IntorNextServerServerResult = Translator;

// Intor result
export type IntorResult = IntorNextClientClientResult &
  IntorNextServerServerResult;
