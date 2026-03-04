import type { IntorConfig } from "../../../config";
import type { MessagesLoader } from "../../../core";
import type { IntorValue } from "../provider";
import * as React from "react";
import { getClientLocale } from "intor";

/**
 * Client-side Intor runtime helper.
 *
 * Manages locale state and dynamic message loading
 * in pure client-side (SPA) environments.
 *
 * @public
 */
export function useIntor(
  config: IntorConfig,
  loader: MessagesLoader,
): Pick<
  IntorValue,
  "config" | "locale" | "messages" | "isLoading" | "onLocaleChange"
> {
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
