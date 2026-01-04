import type { GenConfigKeys, GenLocale } from "@/core";
import { type NavigationResult } from "@/routing";
import { useIntor } from "../provider";

export function useExecuteNavigation<
  CK extends GenConfigKeys = "__default__",
>() {
  const { setLocale, locale: currentLocale } = useIntor<CK>();

  function executeNavigation(
    result: NavigationResult,
    e?: { preventDefault(): void },
  ) {
    const { destination, kind, locale } = result;

    // External navigation: let browser handle it
    if (kind === "external") {
      return;
    }

    // Full reload: do not mutate client state
    if (kind === "reload") {
      e?.preventDefault();
      globalThis.location.href = destination;
      return;
    }

    // Client-side navigation only
    if (locale !== currentLocale) {
      setLocale(locale as GenLocale<CK>);
    }
  }

  return executeNavigation;
}
