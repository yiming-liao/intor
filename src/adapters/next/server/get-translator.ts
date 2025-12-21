import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { MessagesReader } from "@/server";
import type {
  GenConfigKeys,
  GenMessages,
  IfGen,
} from "@/shared/types/generated.types";
import type { TranslatorInstance } from "@/shared/types/translator-instance.types";
import type {
  LocalizedNodeKeys,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { getI18nContext } from "@/adapters/next/server/get-i18n-context";
import { getTranslator as rawGetTranslator } from "@/server/translator";

/**
 * Create a translator instance ready for the current Next.js SSR environment.
 *
 * - **Automatically resolves the current locale and pathname using the Next.js adapter.**
 * - Loads messages using the provided config, locale, and pathname.
 * - Initializes a translator with `t`, `hasKey`, and optional scoped methods.
 * - Supports optional `preKey` to create a scoped translator for nested keys.
 */

// Signature: Without preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
>(options: {
  config: IntorResolvedConfig;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
}): Promise<TranslatorInstance<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(options: {
  config: IntorResolvedConfig;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
  preKey: IfGen<PK, string>;
}): Promise<TranslatorInstance<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(options: {
  config: IntorResolvedConfig;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  extraOptions?: { exts?: string[]; messagesReader?: MessagesReader };
  preKey?: PK;
}) {
  const { config, preKey, handlers, plugins, extraOptions } = options;
  const { locale } = await getI18nContext<CK>(config);

  const translatorInstance = rawGetTranslator<CK, PK>({
    config,
    locale,
    handlers,
    plugins,
    extraOptions,
    preKey,
  });

  return translatorInstance;
}
