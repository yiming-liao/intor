/* eslint-disable react-hooks/rules-of-hooks */
import type {
  IntorProviderProps,
  IntorContextValue,
  IntorValue,
} from "./types";
import type { LocaleMessages } from "intor-translator";
import { Translator } from "intor-translator";
import {
  defineComponent,
  computed,
  ref,
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
  props: { value: { type: Object as () => IntorValue, required: true } },

  setup(props, { slots }) {
    const {
      config,
      locale: initialLocale,
      messages,
      handlers,
      plugins,
      onLocaleChange,
      isLoading: externalIsLoading,
    } = props.value;

    // ---------------------------------------------------------------------------
    // Internal state
    // ---------------------------------------------------------------------------
    const locale = ref<string>(initialLocale);
    const runtimeMessages = ref<LocaleMessages | null>(null);
    const internalIsLoading = ref<boolean>(false);

    // ---------------------------------------------------------------------------
    // Locale transition
    // ---------------------------------------------------------------------------
    /** Request a locale change. */
    const setLocale = async (newLocale: string) => {
      if (newLocale === locale.value) return;
      locale.value = newLocale;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onLocaleChange?.(newLocale as any); // Notify external listener (fire-and-forget)
    };

    // ---------------------------------------------------------------------------
    // Effective state
    // ---------------------------------------------------------------------------
    // external > internal
    const effectiveIsLoading = computed(
      () => !!externalIsLoading?.value || internalIsLoading.value,
    );
    // runtime (client refetch) > initial > config (static)
    const effectiveMessages = computed(
      () => runtimeMessages.value || messages?.value || config.messages || {},
    );

    // ---------------------------------------------------------------------------
    // Translator
    // ---------------------------------------------------------------------------
    const translator = computed(() => {
      return new Translator<unknown>({
        messages: effectiveMessages.value,
        locale: locale.value,
        isLoading: effectiveIsLoading.value,
        fallbackLocales: config.fallbackLocales,
        loadingMessage: config.translator?.loadingMessage,
        missingMessage: config.translator?.missingMessage,
        handlers: handlers,
        plugins: plugins,
      });
    });

    // -------------------------------------------------------------------------
    // Side effects
    // -------------------------------------------------------------------------
    useLocaleEffects(config, locale);
    useMessagesEffects(config, locale, runtimeMessages, internalIsLoading);

    const contextValue = computed(() => ({
      config,
      locale,
      setLocale,
      translator,
    }));
    provide(IntorContextKey, contextValue);
    return () => slots.default?.();
  },
});
