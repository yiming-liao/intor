/* eslint-disable unicorn/require-module-specifiers */
/* eslint-disable @typescript-eslint/no-namespace */
import type { TranslatorInstance, RoutingLocaleSource } from "@/core";
import type { LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Express request
 */
declare global {
  namespace Express {
    interface Request {
      intor: {
        locale: string;
        localeSource: RoutingLocaleSource;
      };
      locale: string;
      localeSource: RoutingLocaleSource;
      t: TranslatorInstance<LocaleMessages, undefined, "string">["t"];
      hasKey: TranslatorInstance<LocaleMessages, undefined, "string">["hasKey"];
    }
  }
}

export {};
