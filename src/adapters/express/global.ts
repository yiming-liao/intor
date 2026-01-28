/* eslint-disable unicorn/require-module-specifiers */
/* eslint-disable @typescript-eslint/no-namespace */
import type { InboundContext } from "@/routing";
import type { TranslatorInstanceServer } from "@/server";
import type { Locale, LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Express request
 */
declare global {
  namespace Express {
    interface Request {
      intor: InboundContext;
      locale: Locale;
      hasKey: TranslatorInstanceServer<LocaleMessages>["hasKey"];
      t: TranslatorInstanceServer<LocaleMessages>["t"];
      tRich: TranslatorInstanceServer<LocaleMessages>["tRich"];
    }
  }
}

export {};
