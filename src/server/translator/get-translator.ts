import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type {
  GenConfigKeys,
  GenLocale,
  GenMessages,
} from "@/shared/types/generated.types";
import type {
  TranslatorInstance,
  TranslatorBaseProps,
} from "@/shared/types/translator-instance.types";
import type { LocalizedNodeKeys, TranslateHandlers } from "intor-translator";
import { Translator } from "intor-translator";
import { loadMessages } from "@/server/messages";

/**
 * Create a translator instance for a specific locale and pathname
 *
 * - Loads messages using the provided config, locale, and pathname.
 * - Initializes a translator with `t`, `hasKey`, and optional scoped methods.
 * - Supports optional `preKey` to create a scoped translator for nested keys.
 * - Passes additional options to the underlying `Translator`.
 */

// Signature: Without preKey
export function getTranslator<CK extends GenConfigKeys = "__default__">(opts: {
  config: IntorResolvedConfig;
  locale: GenLocale;
  pathname?: string;
  handlers?: TranslateHandlers;
}): Promise<TranslatorInstance<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(opts: {
  config: IntorResolvedConfig;
  locale: GenLocale;
  pathname?: string;
  handlers?: TranslateHandlers;
  preKey?: PK;
}): Promise<TranslatorInstance<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator(opts: {
  config: IntorResolvedConfig;
  locale: string;
  pathname?: string;
  handlers?: TranslateHandlers;
  preKey?: string;
}) {
  const { config, locale, pathname = "", preKey, handlers } = opts;
  const messages = await loadMessages({ config, locale, pathname });

  // Create a Translator instance
  const translator = new Translator<unknown>({
    locale,
    messages,
    fallbackLocales: config.fallbackLocales,
    loadingMessage: config.translator?.loadingMessage,
    placeholder: config.translator?.placeholder,
    handlers,
  });

  const props: TranslatorBaseProps = { messages, locale };

  const scoped = translator.scoped(preKey);
  return {
    ...props,
    hasKey: preKey ? scoped.hasKey : translator.hasKey,
    t: preKey ? scoped.t : translator.t,
  };
}
