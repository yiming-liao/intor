import {
  LocaleKey,
  LocaleNamespaceMessages,
  Translator,
} from "intor-translator";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { loadMessages } from "@/modules/messages";
import { GenConfigKeys, GenMessages } from "@/shared/types/generated.types";
import {
  ScopedTranslatorInstance,
  TranslatorBaseProps,
  TranslatorInstance,
  PreKey,
} from "@/shared/types/translator-instance.types";

/**
 * Create a translator instance for a specific locale and pathname
 *
 * - Loads messages using the provided config, locale, and pathname.
 * - Initializes a translator with `t`, `hasKey`, and optional scoped methods.
 * - Supports optional `preKey` to create a scoped translator for nested keys.
 * - Passes additional options to the underlying `Translator`.
 */

// Signature: Without preKey
export function getTranslator<C extends GenConfigKeys = "__default__">(opts: {
  config: IntorResolvedConfig;
  locale: LocaleKey<GenMessages<C>>;
  pathname?: string;
}): Promise<TranslatorInstance<GenMessages<C>>>;

// Signature: With preKey
export function getTranslator<
  C extends GenConfigKeys = "__default__",
  K extends PreKey<C> = PreKey<C>,
>(opts: {
  config: IntorResolvedConfig;
  locale: LocaleKey<GenMessages<C>>;
  pathname?: string;
  preKey?: K;
}): Promise<ScopedTranslatorInstance<GenMessages<C>, K>>;

// Implementation
export async function getTranslator(opts: {
  config: IntorResolvedConfig;
  locale: string;
  pathname?: string;
  preKey?: string;
}) {
  const { config, locale, pathname = "", preKey } = opts;
  const messages = await loadMessages({ config, locale, pathname });

  const translator = new Translator<LocaleNamespaceMessages>({
    locale,
    messages,
    fallbackLocales: config.fallbackLocales,
    loadingMessage: config.translator?.loadingMessage,
    placeholder: config.translator?.placeholder,
  });

  const props: TranslatorBaseProps<LocaleNamespaceMessages> = {
    messages: messages as LocaleNamespaceMessages,
    locale,
  };

  if (preKey) {
    const scoped = translator.scoped(preKey);
    return { ...props, ...scoped };
  } else {
    return {
      ...props,
      t: translator.t,
      hasKey: translator.hasKey,
    };
  }
}
