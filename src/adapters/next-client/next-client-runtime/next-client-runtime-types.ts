import { Locale } from "intor-translator";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

export type NextClientRuntimeOptions = {
  config: IntorResolvedConfig;
};

export type NextClientRuntimeResult = {
  locale: Locale;
  pathname: string;
};
