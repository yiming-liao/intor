import type { GenConfigKeys, GenLocale } from "@/core";
import type { NavigationResult } from "@/routing";
import { setLocaleCookie } from "@/client/shared/utils";
import { shouldSyncLocale } from "@/policies";
import { useIntorContext } from "../provider";

export function useExecuteNavigation<
  CK extends GenConfigKeys = "__default__",
>() {
  const { config, setLocale, locale: currentLocale } = useIntorContext<CK>();
  const { cookie } = config;

  function executeNavigation(
    result: NavigationResult,
    e?: { preventDefault(): void },
  ) {
    const { destination, kind, locale } = result;

    // External navigation: let browser handle it
    if (kind === "external") {
      return;
    }

    // Full reload: commit locale side effects, then perform document reload
    if (kind === "reload") {
      e?.preventDefault();
      if (shouldSyncLocale(locale, currentLocale)) {
        if (cookie.persist) {
          setLocaleCookie(cookie, locale);
        }
      }
      globalThis.location.href = destination;
      return;
    }

    // Client-side navigation only
    if (shouldSyncLocale(locale, currentLocale)) {
      // Eagerly persist locale to avoid stale cookie during client-side navigation.
      if (cookie.persist) {
        setLocaleCookie(cookie, locale);
      }
      setLocale(locale as GenLocale<CK>);
    }
  }

  return executeNavigation;
}
