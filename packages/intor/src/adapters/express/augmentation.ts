/* eslint-disable @typescript-eslint/no-namespace */
import type { BaseTranslator } from "../../core";
import type { InboundContext } from "../../routing";
import type { LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Express request
 */
declare global {
  namespace Express {
    interface Request {
      intor: InboundContext;
      locale: BaseTranslator<LocaleMessages>["locale"];
      hasKey: BaseTranslator<LocaleMessages>["hasKey"];
      t: BaseTranslator<LocaleMessages>["t"];
      tRich: BaseTranslator<LocaleMessages>["tRich"];
    }
  }
}

export {};
