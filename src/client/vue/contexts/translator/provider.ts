import type { IntorResolvedConfig } from "@/config";
import type {
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import { Translator } from "intor-translator";
import { computed, provide, ref, watch, type ComputedRef, type Ref } from "vue";
import { TranslatorContextKey } from "./context";

interface ProvideTranslatorProps {
  config: IntorResolvedConfig;
  localeRef: Ref<string>;
  messagesRef: ComputedRef<LocaleMessages>;
  internalIsLoadingRef: Ref<boolean>;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  externalIsLoadingRef?: Ref<boolean | undefined>;
}

export function provideTranslator({
  config,
  localeRef,
  messagesRef,
  internalIsLoadingRef,
  handlers,
  plugins,
  externalIsLoadingRef,
}: ProvideTranslatorProps) {
  // Treat locale changes as a loading boundary to avoid transient missing states.
  // isLoading defaults to false, but is eagerly set to true on locale switches.
  const prevLocale = ref(localeRef.value);
  const localeChanged = computed(() => prevLocale.value !== localeRef.value);
  watch(
    () => localeRef.value,
    (next) => {
      prevLocale.value = next;
    },
  );
  const isLoading = computed(() => {
    return (
      !!externalIsLoadingRef?.value ||
      internalIsLoadingRef.value ||
      localeChanged.value
    );
  });

  const contextValue = computed(() => {
    const translator = new Translator<unknown>({
      messages: messagesRef.value,
      locale: localeRef.value,
      isLoading: isLoading.value,
      fallbackLocales: config.fallbackLocales,
      loadingMessage: config.translator?.loadingMessage,
      placeholder: config.translator?.placeholder,
      handlers,
      plugins,
    });

    return { translator };
  });

  provide(TranslatorContextKey, contextValue);
}
