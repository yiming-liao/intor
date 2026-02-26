import "fastify";
import type { BaseTranslator } from "../../core";
import type { InboundContext } from "../../routing";
import type { LocaleMessages } from "intor-translator";

/**
 * Global type augmentations for Fastify request
 */
declare module "fastify" {
  interface FastifyRequest {
    intor: InboundContext;
    locale: BaseTranslator<LocaleMessages>["locale"];
    hasKey: BaseTranslator<LocaleMessages>["hasKey"];
    t: BaseTranslator<LocaleMessages>["t"];
    tRich: BaseTranslator<LocaleMessages>["tRich"];
  }
}

export {};
