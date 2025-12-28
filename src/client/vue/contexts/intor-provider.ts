import type { IntorInitialValue } from "@/client/shared/types/contexts";
import type { GenConfigKeys } from "@/core/types";
import type { LocaleMessages } from "intor-translator";
import { defineComponent, toRef } from "vue";
import { provideConfig } from "@/client/vue/contexts/config/provider";
import { provideLocale } from "@/client/vue/contexts/locale";
import { provideMessages } from "@/client/vue/contexts/messages";
import { provideTranslator } from "@/client/vue/contexts/translator";

export type IntorProviderProps<CK extends GenConfigKeys = "__default__"> =
  IntorInitialValue<CK>;

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
    const { config, initialLocale, handlers, plugins, onLocaleChange } = props;
    const initialMessagesRef = toRef(props, "initialMessages");
    const externalIsLoadingRef = toRef(props, "isLoading");

    // config
    provideConfig({ config });

    // locale
    const { localeRef } = provideLocale({
      config,
      initialLocale,
      onLocaleChange,
    });

    // messages
    const { messagesRef, isLoadingRef } = provideMessages({
      config,
      localeRef,
      initialMessagesRef,
    });

    // translator
    provideTranslator({
      config,
      localeRef,
      messagesRef,
      internalIsLoadingRef: isLoadingRef,
      handlers,
      plugins,
      externalIsLoadingRef: externalIsLoadingRef,
    });

    return () => slots.default?.();
  },
});
