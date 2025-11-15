import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import type {
  GenConfigKeys,
  GenMessages,
  IfGen,
} from "@/shared/types/generated.types";
import type { TranslatorInstance } from "@/shared/types/translator-instance.types";
import type { LocalizedNodeKeys } from "intor-translator";
import { getI18nContext } from "@/adapters/next/server/get-i18n-context";
import { getTranslator as rawGetTranslator } from "@/modules/tools";

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
export function getTranslator<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
): Promise<TranslatorInstance<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(
  config: IntorResolvedConfig,
  preKey: IfGen<PK, string>,
): Promise<TranslatorInstance<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(config: IntorResolvedConfig, preKey?: PK) {
  const { locale, pathname } = await getI18nContext<CK>(config);

  const translatorInstance = rawGetTranslator<CK, PK>({
    config,
    locale,
    pathname,
    preKey,
  });

  return translatorInstance;
}
