import type { GenConfigKeys, GenLocale } from "@/core";
import type { NavigationResult } from "@/routing";
import { setLocaleCookieBrowser } from "@/client/shared/utils";
import { shouldPersist, shouldSyncLocale } from "@/policies";
import { useIntor } from "../provider";

export function useExecuteNavigation<
  CK extends GenConfigKeys = "__default__",
>() {
  const { config, setLocale, locale: currentLocale } = useIntor<CK>();

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
        if (shouldPersist(config.cookie)) {
          setLocaleCookieBrowser(config.cookie, locale);
        }
      }
      globalThis.location.href = destination;
      return;
    }

    // Client-side navigation only
    if (shouldSyncLocale(locale, currentLocale)) {
      setLocale(locale as GenLocale<CK>);
    }
  }

  return executeNavigation;
}
