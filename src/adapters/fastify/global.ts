/* eslint-disable unicorn/require-module-specifiers */
import "fastify";
import type { TranslatorInstance } from "@/core";
import type { InboundContext } from "@/routing";
import type { Locale, LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Fastify request
 */
declare module "fastify" {
  interface FastifyRequest {
    intor: InboundContext;
    locale: Locale;
    hasKey: TranslatorInstance<LocaleMessages>["hasKey"];
    t: TranslatorInstance<LocaleMessages>["t"];
    tRich: TranslatorInstance<LocaleMessages>["tRich"];
  }
}

export {};
