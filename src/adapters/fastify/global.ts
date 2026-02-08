/* eslint-disable unicorn/require-module-specifiers */
import "fastify";
import type { InboundContext } from "@/routing";
import type { TranslatorInstanceServer } from "@/server";
import type { Locale, LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Fastify request
 */
declare module "fastify" {
  interface FastifyRequest {
    intor: InboundContext;
    locale: Locale;
    hasKey: TranslatorInstanceServer<LocaleMessages>["hasKey"];
    t: TranslatorInstanceServer<LocaleMessages>["t"];
    tRich: TranslatorInstanceServer<LocaleMessages>["tRich"];
  }
}

export {};
