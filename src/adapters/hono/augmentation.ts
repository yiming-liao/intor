import "hono";
import type { BaseTranslator } from "../../core";
import type { InboundContext } from "../../routing";
import type { LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Hono context variables
 */
declare module "hono" {
  interface ContextVariableMap {
    intor: InboundContext;
    locale: BaseTranslator<LocaleMessages>["locale"];
    hasKey: BaseTranslator<LocaleMessages>["hasKey"];
    t: BaseTranslator<LocaleMessages>["t"];
    tRich: BaseTranslator<LocaleMessages>["tRich"];
  }
}

export {};
