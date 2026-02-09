/* eslint-disable unicorn/require-module-specifiers */
import "hono";
import type { TranslatorInstance } from "@/core";
import type { InboundContext } from "@/routing";
import type { LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Hono context variables
 */
declare module "hono" {
  interface ContextVariableMap {
    intor: InboundContext;
    locale: TranslatorInstance<LocaleMessages>["locale"];
    hasKey: TranslatorInstance<LocaleMessages>["hasKey"];
    t: TranslatorInstance<LocaleMessages>["t"];
    tRich: TranslatorInstance<LocaleMessages>["tRich"];
  }
}

export {};
