import type { IntorValue } from "../provider";
import type { IntorConfig } from "intor";
import type { Locale, LocaleMessages } from "intor-translator";
import * as React from "react";
import { getClientLocale } from "intor";

export function useIntor(
  config: IntorConfig,
  loader: (config: IntorConfig, locale: Locale) => Promise<LocaleMessages>,
): Omit<IntorValue, "handlers" | "plugins"> {
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
    async (newLocale: Locale) => {
      activeLocaleRef.current = newLocale;
      setIsLoading(true);

      const loaded = await loader(config, newLocale);

      // Ignore outdated results when locale changes again.
      if (activeLocaleRef.current !== newLocale) return;

      setMessages(loaded);
      setIsLoading(false);
    },
    [config, loader],
  );

  // ---------------------------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    void onLocaleChange(locale);
  }, [locale, onLocaleChange]);

  return {
    config,
    locale,
    messages,
    isLoading,
    onLocaleChange,
  };
}
