import type { IntorValue } from "../provider";
import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys } from "@/core";
import type { LocaleMessages } from "intor-translator";
import * as React from "react";
import { getClientLocale } from "../../shared/helpers";

export function useIntor<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
  loader: (
    config: IntorResolvedConfig,
    locale: string,
  ) => Promise<LocaleMessages>,
): Omit<IntorValue<CK>, "handlers" | "plugins"> {
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
    onLocaleChange(locale);
  }, [locale, onLocaleChange]);

  return {
    config,
    locale,
    messages,
    isLoading,
    onLocaleChange,
  };
}
