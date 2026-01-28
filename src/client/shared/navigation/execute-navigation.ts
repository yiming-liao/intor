import type { IntorResolvedConfig } from "@/config";
import type { NavigationResult } from "@/routing";
import type { Locale } from "intor-translator";
import { shouldSyncLocale } from "@/policies";
import { setLocaleCookie } from "../utils";

interface NavigationExecutionContext {
  config: IntorResolvedConfig;
  currentLocale: Locale;
  setLocale(locale: Locale): void;
}

/**
 * Executes a resolved navigation result.
 *
 * Applies all imperative side effects required to complete navigation,
 * including locale synchronization, cookie persistence, and full reloads.
 *
 * This function must be called after `resolveNavigation`.
 */
export function executeNavigation(
  navigationResult: NavigationResult,
  context: NavigationExecutionContext,
  e?: { preventDefault(): void },
) {
  const { config, currentLocale, setLocale } = context;
  const { cookie } = config;
  const { destination, kind, locale } = navigationResult;

  // ------------------------------------------------------
  // External navigation: let browser handle it
  // ------------------------------------------------------
  if (kind === "external") {
    return;
  }

  // ------------------------------------------------------
  // Full reload: commit locale side effects, then perform document reload
  // ------------------------------------------------------
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

  // ------------------------------------------------------
  // Client-side navigation only
  // ------------------------------------------------------
  if (shouldSyncLocale(locale, currentLocale)) {
    // Eagerly persist locale to avoid stale cookie during client-side navigation.
    if (cookie.persist) {
      setLocaleCookie(cookie, locale);
    }
    setLocale(locale);
  }
}
