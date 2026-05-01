import type { ReactTranslator } from "./types";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
  TranslatorKeyMode,
} from "../../../core";
import type { LocalizedPreKey } from "intor-translator";
import { useIntorContext } from "../provider";
import { createTRich } from "./create-t-rich";

/**
 * React hook for accessing the active, scope-aware translator instance.
 *
 * @public
 */
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  KM extends TranslatorKeyMode = "loose",
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  preKey?: PK,
): ReactTranslator<GenMessages<CK>, GenReplacements<CK>, GenRich<CK>, PK, KM> {
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
    format: scoped.format,
  } as ReactTranslator<
    GenMessages<CK>,
    GenReplacements<CK>,
    GenRich<CK>,
    PK,
    KM
  >;
}
