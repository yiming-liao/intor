import type { NextRequest } from "next/server";
import { TranslateHandlers, Translator } from "intor-translator";
import { intor } from "@/modules/intor";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

export const createIntor = <M = unknown>(
  config: IntorResolvedConfig,
  translateHandlers?: TranslateHandlers,
): ((request?: NextRequest) => Promise<Translator<M>>) => {
  return async (request?: NextRequest) => {
    const { initialLocale, messages } = await intor({ config, request });

    const translator = new Translator<unknown>({
      locale: initialLocale,
      messages,
      fallbackLocales: config.fallbackLocales,
      loadingMessage: config.translator?.loadingMessage,
      placeholder: config.translator?.placeholder,
      handlers: translateHandlers,
    });

    return translator as Translator<M>;
  };
};
