import { TranslateConfig, Translator } from "intor-translator";
import { nextAdapter } from "@/adapters/next/server/next-adapter";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { getMessages as rawGetMessages } from "@/modules/messages";

/**
 * Creates a ready-to-use translation function (`t`) for the current
 * Next.js SSR runtime environment. It automatically resolves the
 * locale and pathname using the Next.js adapter, loads all
 * corresponding messages, and returns a `t` function bound to them.
 */
export const getTranslation = async (
  config: IntorResolvedConfig,
  preKey?: string,
  options?: TranslateConfig<unknown>,
): Promise<Translator["t"]> => {
  const { locale, pathname } = await nextAdapter(config);
  const messages = await rawGetMessages({ config, locale, pathname });
  const translator = new Translator<unknown>({ locale, messages, ...options });
  const scoped = translator.scoped(preKey as never);
  return scoped.t as unknown as Translator["t"];
};
