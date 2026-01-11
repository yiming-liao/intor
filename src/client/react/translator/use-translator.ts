import type { TranslatorInstanceReact } from "./translator-instance";
import type {
  GenConfigKeys,
  GenMessages,
  GenLocale,
  GenReplacements,
  GenRich,
} from "@/core";
import type { LocalizedPreKey } from "intor-translator";
import { useIntor } from "../provider";
import { createTRich } from "./create-t-rich";

/**
 * React hook to access the active translator instance.
 */

// Signature: Without preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
>(): TranslatorInstanceReact<
  GenMessages<CK>,
  ReplacementSchema,
  RichSchema,
  undefined
>;

// Signature: With preKey
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementSchema = GenReplacements<CK>,
  RichSchema = GenRich<CK>,
  PK extends string = LocalizedPreKey<GenMessages<CK>>,
>(
  preKey?: PK,
): TranslatorInstanceReact<GenMessages<CK>, ReplacementSchema, RichSchema, PK>;

// Implementation
export function useTranslator<CK extends GenConfigKeys = "__default__">(
  preKey?: string,
) {
  const { translator, setLocale } = useIntor();

  const scoped = translator.scoped(preKey);

  return {
    messages: translator.messages as GenMessages<CK>,
    locale: translator.locale as GenLocale<CK>,
    isLoading: translator.isLoading,
    setLocale,
    hasKey: preKey ? scoped.hasKey : translator.hasKey,
    t: preKey ? scoped.t : translator.t,
    tRich: createTRich(translator, preKey),
  };
}
