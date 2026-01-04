import type { RuntimeStateCore } from "../../shared/types";
import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { deepMerge, type GenConfigKeys, type GenMessages } from "@/core";
import { getClientLocale } from "../../shared/helpers";

interface RuntimeState<CK extends GenConfigKeys = "__default__">
  extends RuntimeStateCore<CK> {
  messages: GenMessages<CK>;
  isLoading: boolean;
}

export function useRuntimeState<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  loader: (locale: string) => Promise<LocaleMessages>,
): RuntimeState<CK> {
  // ---------------------------------------------------------------------------
  // Initial locale
  // ---------------------------------------------------------------------------
  const locale = React.useMemo(() => getClientLocale(config), [config]);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [messages, setMessages] = React.useState(config.messages || {});
  const [isLoading, setIsLoading] = React.useState(true);
  const activeLocaleRef = React.useRef(locale);

  // ---------------------------------------------------------------------------
  // Locale change handler
  // ---------------------------------------------------------------------------
  const onLocaleChange = React.useCallback(
    async (newLocale: string) => {
      activeLocaleRef.current = newLocale;
      setIsLoading(true);

      const loaded = await loader(newLocale);

      // Ignore outdated results when locale changes again.
      if (activeLocaleRef.current !== newLocale) return;

      setMessages(deepMerge(config.messages, loaded));
      setIsLoading(false);
    },
    [config.messages, loader],
  );

  // ---------------------------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    onLocaleChange(locale);
  }, [locale, onLocaleChange]);

  return {
    config,
    locale,
    messages,
    isLoading,
    onLocaleChange,
  } as RuntimeState<CK>;
}
