import { LocaleKey } from "intor-translator";
import { getI18nContext } from "@/adapters/next/server/get-i18n-context";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { getTranslator as rawGetTranslator } from "@/modules/tools";
import { GenConfigKeys, GenMessages } from "@/shared/types/generated.types";
import {
  PreKey,
  ScopedTranslatorInstance,
  TranslatorInstance,
} from "@/shared/types/translator-instance.types";

/**
 * Create a translator instance ready for the current Next.js SSR environment.
 *
 * - Automatically resolves the current locale and pathname using the Next.js adapter.
 * - Loads all corresponding messages for the resolved locale and pathname.
 * - Returns a translator object containing `t`, `hasKey`, `messages`, and other helpers.
 * - Supports optional `preKey` to create a scoped translator for nested translation keys.
 * - Allows passing additional `TranslateConfig` options to the underlying translator.
 */

// Signature: Without preKey
export function getTranslator<C extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
): Promise<TranslatorInstance<GenMessages<C>>>;

// Signature: With preKey
export function getTranslator<
  C extends GenConfigKeys = "__default__",
  K extends PreKey<C> = PreKey<C>,
>(
  config: IntorResolvedConfig,
  preKey?: K,
): Promise<ScopedTranslatorInstance<GenMessages<C>, K>>;

// Implementation
export async function getTranslator<
  C extends GenConfigKeys = "__default__",
  K extends PreKey<C> = PreKey<C>,
>(config: IntorResolvedConfig, preKey?: K) {
  const { locale, pathname } = await getI18nContext(config);

  const translatorInstance = rawGetTranslator<C, K>({
    config,
    locale: locale as LocaleKey<GenMessages<C>>,
    pathname,
    preKey,
  });

  return translatorInstance;
}
