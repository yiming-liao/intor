import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { MessagesReader } from "@/server";
import type {
  GenConfigKeys,
  GenMessages,
  IfGen,
} from "@/shared/types/generated";
import type { TranslatorInstance } from "@/shared/types/translator-instance";
import type {
  LocalizedNodeKeys,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { getLocale } from "@/adapters/next/server/get-locale";
import { getTranslator as rawGetTranslator } from "@/server/translator";

/**
 * Create a translator instance for the current Next.js SSR environment.
 *
 * - Automatically resolves the current locale using the Next.js adapter.
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
  const locale = await getLocale(config);

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
