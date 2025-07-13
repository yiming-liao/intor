import { Locale } from "intor-translator";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

export type NextServerRuntimeOptions = {
  config: IntorResolvedConfig;
  request: unknown;
};

export type NextServerRuntimeResult = {
  locale: Locale;
  pathname: string;
};
