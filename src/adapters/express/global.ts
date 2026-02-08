/* eslint-disable unicorn/require-module-specifiers */
/* eslint-disable @typescript-eslint/no-namespace */
import type { TranslatorInstance } from "@/core";
import type { InboundContext } from "@/routing";
import type { Locale, LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Express request
 */
declare global {
  namespace Express {
    interface Request {
      intor: InboundContext;
      locale: Locale;
      hasKey: TranslatorInstance<LocaleMessages>["hasKey"];
      t: TranslatorInstance<LocaleMessages>["t"];
      tRich: TranslatorInstance<LocaleMessages>["tRich"];
    }
  }
}

export {};
