import type { TranslatorInstanceReact } from "./translator-instance";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
} from "@/core";
import type { LocalizedPreKey } from "intor-translator";
import { useIntorContext } from "../provider";
import { createTRich } from "./create-t-rich";

/**
 * React hook for accessing the active, scope-aware translator instance.
 *
 * @platform React
 */
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  preKey?: PK,
): TranslatorInstanceReact<GenMessages<CK>, ReplacementSchema, RichSchema, PK> {
  const { translator, setLocale } = useIntorContext();
  const scoped = translator.scoped(preKey);

  return {
    messages: translator.messages,
    locale: translator.locale,
    isLoading: translator.isLoading,
    setLocale,
    hasKey: scoped.hasKey,
    t: scoped.t,
    tRich: createTRich(scoped.t),
  } as unknown as TranslatorInstanceReact<
    GenMessages<CK>,
    ReplacementSchema,
    RichSchema,
    PK
  >;
}
