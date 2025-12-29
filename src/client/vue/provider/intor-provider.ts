/* eslint-disable react-hooks/rules-of-hooks */
import type { IntorProviderProps, IntorContextValue } from "./types";
import type { LocaleMessages } from "intor-translator";
import { Translator } from "intor-translator";
import {
  defineComponent,
  computed,
  ref,
  toRefs,
  type ComputedRef,
  type InjectionKey,
  provide,
} from "vue";
import { useLocaleEffects } from "@/client/vue/provider/effects/use-locale-effects";
import { useMessagesEffects } from "@/client/vue/provider/effects/use-messages-effects";

export const IntorContextKey: InjectionKey<ComputedRef<IntorContextValue>> =
  Symbol("IntorContext");

export const IntorProvider = defineComponent<IntorProviderProps>({
  name: "IntorProvider",
  props: {
    config: { type: Object, required: true },
    initialLocale: { type: String, required: true },
    initialMessages: { type: Object as () => LocaleMessages, required: false },
    handlers: { type: Object, required: false },
    plugins: { type: Array, required: false },
    onLocaleChange: { type: Function, required: false },
    isLoading: { type: Boolean, required: false },
  },

  setup(props, { slots }) {
    const {
      config,
      initialLocale,
      initialMessages,
      handlers,
      plugins,
      onLocaleChange,
      isLoading: externalIsLoading,
    } = toRefs(props);

    // ---------------------------------------------------------------------------
    // Internal state
    // ---------------------------------------------------------------------------
    const locale = ref<string>(initialLocale.value);
    const runtimeMessages = ref<LocaleMessages | null>(null);
    const internalIsLoading = ref<boolean>(false);

    // ---------------------------------------------------------------------------
    // Locale transition
    // ---------------------------------------------------------------------------
    /** Request a locale change. */
    const setLocale = async (newLocale: string) => {
      if (newLocale === locale.value) return;
      locale.value = newLocale;
      onLocaleChange?.value?.(newLocale); // Notify external listener (fire-and-forget)
    };

    // ---------------------------------------------------------------------------
    // Effective state
    // ---------------------------------------------------------------------------
    // external > internal
    const effectiveIsLoading = computed(
      () => !!externalIsLoading.value || internalIsLoading.value,
    );
    // runtime (client refetch) > initial > config (static)
    const effectiveMessages = computed<LocaleMessages>(
      () =>
        runtimeMessages.value ||
        initialMessages.value ||
        config.value.messages ||
        {},
    );

    // ---------------------------------------------------------------------------
    // Translator
    // ---------------------------------------------------------------------------
    const translator = computed(() => {
      return new Translator<unknown>({
        messages: effectiveMessages.value,
        locale: locale.value,
        isLoading: effectiveIsLoading.value,
        fallbackLocales: config.value.fallbackLocales,
        loadingMessage: config.value.translator?.loadingMessage,
        missingMessage: config.value.translator?.missingMessage,
        handlers: handlers.value,
        plugins: plugins.value,
      });
    });

    // -------------------------------------------------------------------------
    // Side effects
    // -------------------------------------------------------------------------
    useLocaleEffects(config.value, locale);
    useMessagesEffects(
      config.value,
      locale,
      runtimeMessages,
      internalIsLoading,
    );

    const contextValue = computed(() => ({
      config: config.value,
      locale: locale.value,
      setLocale,
      messages: effectiveMessages.value,
      isLoading: effectiveIsLoading.value,
      translator: translator.value,
    }));
    provide(IntorContextKey, contextValue);
    return () => slots.default?.();
  },
});
