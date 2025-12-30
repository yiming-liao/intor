import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import {
  deepMerge,
  type GenConfigKeys,
  type GenLocale,
  type GenMessages,
} from "@/core";
import { getClientLocale } from "../../shared/helpers";

interface UseLoadMessagesResult<CK extends GenConfigKeys = "__default__"> {
  initialLocale: GenLocale<CK>;
  messages: GenMessages<CK>;
  isLoading: boolean;
  onLocaleChange: (locale: GenLocale<CK>) => Promise<void>;
}

export function useLoadMessages<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  loader: (locale: string) => Promise<LocaleMessages>,
): UseLoadMessagesResult<CK> {
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
  } as UseLoadMessagesResult<CK>;
}
