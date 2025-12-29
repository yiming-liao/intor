import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { deepMerge } from "@/core";
import { getClientLocale } from "../../shared/helpers";

interface UseLoadMessagesResult {
  initialLocale: string;
  messages: LocaleMessages;
  isLoading: boolean;
  onLocaleChange: (locale: string) => Promise<void>;
}

export function useLoadMessages(
  config: IntorResolvedConfig,
  loader: (locale: string) => Promise<LocaleMessages>,
): UseLoadMessagesResult {
  // ---------------------------------------------------------------------------
  // Initial locale
  // ---------------------------------------------------------------------------
  const initialLocale = React.useMemo(() => getClientLocale(config), [config]);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [messages, setMessages] = React.useState(config.messages || {});
  const [isLoading, setIsLoading] = React.useState(true);
  const activeLocaleRef = React.useRef(initialLocale);

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
    onLocaleChange(initialLocale);
  }, [initialLocale, onLocaleChange]);

  return {
    initialLocale,
    messages,
    isLoading,
    onLocaleChange,
  };
}
