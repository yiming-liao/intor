/* eslint-disable react-hooks/rules-of-hooks */
import type {
  IntorProviderProps,
  IntorContextValue,
  IntorValue,
} from "./types";
import { Translator, type LocaleMessages } from "intor-translator";
import {
  type InjectionKey,
  type ComputedRef,
  defineComponent,
  computed,
  ref,
  provide,
  watch,
} from "vue";
import {
  resolveEffectiveIsLoading,
  resolveEffectiveMessages,
} from "../../shared/provider/effective-state";
import { useLocaleEffects } from "./effects/use-locale-effects";
import { useMessagesEffects } from "./effects/use-messages-effects";

export const IntorContextKey: InjectionKey<ComputedRef<IntorContextValue>> =
  Symbol("IntorContext");

/**
 * Vue provider for Intor.
 *
 * @public
 */
export const IntorProvider = defineComponent<IntorProviderProps>({
  name: "IntorProvider",
  props: { value: { type: Object as () => IntorValue, required: true } },

  setup(props, { slots }) {
    // ---------------------------------------------------------------------------
    // Internal state
    // ---------------------------------------------------------------------------
    const locale = ref<string>(props.value.locale);
    const runtimeMessages = ref<LocaleMessages | null>(null);
    const internalIsLoading = ref<boolean>(false);

    // ---------------------------------------------------------------------------
    // Locale transition
    // ---------------------------------------------------------------------------
    /** Request a locale change. */
    const setLocale = (newLocale: string) => {
      if (newLocale === locale.value) return;
      locale.value = newLocale;
      void props.value.onLocaleChange?.(newLocale); // Notify external listener (fire-and-forget)
    };

    // ---------------------------------------------------------------------------
    // Effective state
    // ---------------------------------------------------------------------------
    const effectiveIsLoading = computed(() =>
      resolveEffectiveIsLoading(
        !!props.value.isLoading?.value,
        internalIsLoading.value,
      ),
    );

    const effectiveMessages = computed(() =>
      resolveEffectiveMessages(
        runtimeMessages.value,
        props.value.messages?.value,
        props.value.config.messages,
      ),
    );

    // ---------------------------------------------------------------------------
    // Translator
    // ---------------------------------------------------------------------------
    const { loadingMessage, missingMessage } =
      props.value.config.translator ?? {};
    const { handlers, plugins } = props.value;

    const translator = computed(() => {
      return new Translator<LocaleMessages>({
        messages: effectiveMessages.value,
        locale: locale.value,
        isLoading: effectiveIsLoading.value,
        fallbackLocales: props.value.config.fallbackLocales,
        ...(loadingMessage !== undefined ? { loadingMessage } : {}),
        ...(missingMessage !== undefined ? { missingMessage } : {}),
        ...(handlers !== undefined ? { handlers } : {}),
        ...(plugins !== undefined ? { plugins } : {}),
      });
    });

    // -------------------------------------------------------------------------
    // Side effects
    // -------------------------------------------------------------------------
    useLocaleEffects(props.value.config, locale);
    useMessagesEffects(
      props.value.config,
      locale,
      runtimeMessages,
      internalIsLoading,
    );

    // Sync internal locale with external prop
    watch(
      () => props.value.locale,
      (newLocale) => {
        if (newLocale !== locale.value) locale.value = newLocale;
      },
    );

    const contextValue = computed(() => ({
      config: props.value.config,
      locale,
      setLocale,
      translator,
    }));
    provide(IntorContextKey, contextValue);
    return () => slots["default"]?.();
  },
});
