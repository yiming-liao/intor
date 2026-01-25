/* eslint-disable unicorn/require-module-specifiers */
/* eslint-disable @typescript-eslint/no-namespace */
import type { TranslatorInstance } from "@/core";
import type { InboundContext } from "@/routing";
import type { Locale, LocaleMessages, Replacement } from "intor-translator";

/**
 * Global type augmentations for Express request
 */
declare global {
  namespace Express {
    interface Request {
      intor: InboundContext;
      locale: Locale;
      hasKey: TranslatorInstance<
        LocaleMessages,
        Replacement,
        "string"
      >["hasKey"];
      t: TranslatorInstance<LocaleMessages, Replacement, "string">["t"];
    }
  }
}

export {};
