import type { VueTranslator } from "./types";
import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
} from "../../../core";
import type { LocalizedPreKey } from "intor-translator";
import { computed } from "vue";
import { injectIntorContext } from "..//provider";
import { createTRich } from "./create-t-rich";

/**
 * Vue composable for accessing the active, scope-aware translator instance.
 *
 * @platform Vue
 */
export function useTranslator<
  CK extends GenConfigKeys = "__default__",
  ReplacementShape = GenReplacements<CK>,
  RichShape = GenRich<CK>,
  PK extends LocalizedPreKey<GenMessages<CK>> | undefined = undefined,
>(
  preKey?: PK,
): VueTranslator<GenMessages<CK>, ReplacementShape, RichShape, PK> {
  const intor = injectIntorContext();
  const translator = intor.value.translator;
  const scoped = computed(() => translator.value.scoped(preKey));

  return {
    messages: computed(() => translator.value.messages),
    locale: computed(() => translator.value.locale),
    isLoading: computed(() => translator.value.isLoading),
    setLocale: intor.value.setLocale,
    hasKey: (...args: Parameters<typeof scoped.value.hasKey>) =>
      scoped.value.hasKey(...args),
    t: (...args: Parameters<typeof scoped.value.t>) => scoped.value.t(...args),
    tRich: (...args: Parameters<ReturnType<typeof createTRich>>) =>
      createTRich(scoped.value.t)(...args),
  } as unknown as VueTranslator<
    GenMessages<CK>,
    ReplacementShape,
    RichShape,
    PK
  >;
}
