import type { IntorProviderProps } from "../types";
import { computed, toRefs } from "vue";

export function resolveRuntime(props: IntorProviderProps) {
  const reactiveProps = toRefs(props);
  const runtimeState = computed(() => props.runtimeState);

  return {
    config: computed(() => {
      const value = runtimeState.value?.config ?? reactiveProps.config?.value;
      if (!value) {
        throw new Error(
          "[Intor] Missing `config`. Provide either `runtimeState.config` or `config` prop.",
        );
      }
      return value;
    }),

    locale: computed(() => {
      const value = runtimeState.value?.locale ?? reactiveProps.locale?.value;
      if (!value) {
        throw new Error(
          "[Intor] Missing `locale`. Provide either `runtimeState.locale` or `locale` prop.",
        );
      }
      return value;
    }),

    messages: computed(
      () =>
        runtimeState.value?.messages?.value ?? reactiveProps.messages?.value,
    ),

    isLoading: computed(
      () =>
        runtimeState.value?.isLoading?.value ??
        reactiveProps.isLoading?.value ??
        false,
    ),

    onLocaleChange: computed(
      () =>
        runtimeState.value?.onLocaleChange ??
        reactiveProps.onLocaleChange?.value,
    ),

    handlers: reactiveProps.handlers,

    plugins: reactiveProps.plugins,
  };
}
