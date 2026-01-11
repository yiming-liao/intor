/* eslint-disable unicorn/require-module-specifiers */
/* eslint-disable @typescript-eslint/no-namespace */
import type { TranslatorInstance, RoutingLocaleSource } from "@/core";
import type { LocaleMessages, Replacement } from "intor-translator";

/**
 * Global type augmentations for Express request
 */
declare global {
  namespace Express {
    interface Request {
      intor: {
        locale: string;
        localeSource: RoutingLocaleSource;
        pathname: string;
      };
      locale: string;
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
