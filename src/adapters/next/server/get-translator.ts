import type { GenConfigKeys, GenMessages } from "@/core";
import type { GetTranslatorParams, TranslatorInstanceServer } from "@/server";
import type { LocalizedNodeKeys } from "intor-translator";
import { getTranslator as getTranslatorCore } from "@/server";
import { getLocale } from "./get-locale";

type GetTranslatorNextParams<CK extends GenConfigKeys = "__default__"> = Omit<
  GetTranslatorParams<CK>,
  "locale"
>;

/**
 * Create a translator instance for the current Next.js SSR environment.
 *
 * - Automatically resolves the current locale using the Next.js adapter.
 */

// Signature: Without preKey
export function getTranslator<CK extends GenConfigKeys = "__default__">(
  params: GetTranslatorNextParams<CK>,
): Promise<TranslatorInstanceServer<GenMessages<CK>>>;

// Signature: With preKey
export function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(
  params: GetTranslatorNextParams<CK> & { preKey?: PK },
): Promise<TranslatorInstanceServer<GenMessages<CK>, PK>>;

// Implementation
export async function getTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string = LocalizedNodeKeys<GenMessages<CK>>,
>(params: GetTranslatorNextParams<CK> & { preKey?: PK }) {
  const { config, preKey, handlers, plugins, extraOptions } = params;

  const locale = await getLocale(config);

  const translatorInstance = getTranslatorCore<CK, PK>({
    config,
    locale,
    handlers,
    plugins,
    extraOptions,
    preKey,
  });

  return translatorInstance;
}
