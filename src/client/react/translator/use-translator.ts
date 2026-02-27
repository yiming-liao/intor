import type { ReactTranslator } from "./types";
import type {
  TypedConfigKeys,
  TypedMessages,
  TypedReplacements,
  TypedRich,
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
  CK extends TypedConfigKeys = "__default__",
  ReplacementShape = TypedReplacements<CK>,
  RichShape = TypedRich<CK>,
  PK extends LocalizedPreKey<TypedMessages<CK>> | undefined = undefined,
>(
  preKey?: PK,
): ReactTranslator<TypedMessages<CK>, ReplacementShape, RichShape, PK> {
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
  } as ReactTranslator<TypedMessages<CK>, ReplacementShape, RichShape, PK>;
}
