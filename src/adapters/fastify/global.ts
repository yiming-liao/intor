import "fastify";
import type { TranslatorInstance } from "../../core";
import type { InboundContext } from "../../routing";
import type { LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Fastify request
 */
declare module "fastify" {
  interface FastifyRequest {
    intor: InboundContext;
    locale: TranslatorInstance<LocaleMessages>["locale"];
    hasKey: TranslatorInstance<LocaleMessages>["hasKey"];
    t: TranslatorInstance<LocaleMessages>["t"];
    tRich: TranslatorInstance<LocaleMessages>["tRich"];
  }
}

export {};
