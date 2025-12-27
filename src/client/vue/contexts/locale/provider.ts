import type { IntorResolvedConfig } from "@/config";
import { ref, computed, provide, watch } from "vue";
import {
  setLocaleCookieBrowser,
  setDocumentLocale,
} from "@/client/shared/utils/locale";
import { LocaleContextKey } from "./context";

interface ProvideLocaleProps {
  config: IntorResolvedConfig;
  initialLocale: string;
  onLocaleChange?: (newLocale: string) => Promise<void> | void;
}

export function provideLocale({
  config,
  initialLocale,
  onLocaleChange,
}: ProvideLocaleProps) {
  const localeRef = ref(initialLocale);

  // Request a locale change.
  const setLocale = async (newLocale: string) => {
    if (newLocale === localeRef.value) return;
    localeRef.value = newLocale;
    onLocaleChange?.(newLocale); // Notify external listener (fire-and-forget)
  };

  // Sync locale-related browser side effects.
  watch(
    localeRef,
    (newLocale) => {
      setLocaleCookieBrowser(config.cookie, newLocale);
      setDocumentLocale(newLocale);
    },
    { immediate: true },
  );

  const contextValue = computed(() => ({
    locale: localeRef.value,
    setLocale,
  }));

  provide(LocaleContextKey, contextValue);

  return {
    localeRef,
    setLocale,
  };
}
