import type { GenConfigKeys, GenLocale } from "../../core";
import type {
  NavigateOptions,
  PrefetchOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import { executeNavigation } from "../../client";
import { useIntorContext } from "../../client/react";
import { resolveOutbound } from "../../routing";

/**
 * Locale-aware router hook for the current execution context.
 *
 * - Resolves a locale-aware navigation destination.
 * - Commits locale changes only on actual navigation.
 * - Keeps routing logic pure and side-effects explicit.
 *
 * @platform Next.js
 */
export function useRouter() {
  const { config, locale: currentLocale, setLocale } = useIntorContext();
  const currentPathname = usePathname();
  const nextRouter = useNextRouter();

  function resolve(href: string, locale?: string) {
    return resolveOutbound(config, currentLocale, currentPathname, {
      destination: href,
      ...(locale !== undefined ? { locale } : {}),
    });
  }

  function commit(outbound: ReturnType<typeof resolve>) {
    executeNavigation(outbound, { config, currentLocale, setLocale });
  }

  // --------------------------------------------------
  // push
  // --------------------------------------------------
  function push<CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) {
    const outbound = resolve(href, options?.locale);
    commit(outbound);
    if (!options) {
      nextRouter.push(outbound.destination);
      return;
    }
    const { locale: _, ...rest } = options;
    nextRouter.push(outbound.destination, rest);
  }

  // --------------------------------------------------
  // replace
  // --------------------------------------------------
  function replace<CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) {
    const outbound = resolve(href, options?.locale);
    commit(outbound);
    if (!options) {
      nextRouter.replace(outbound.destination);
      return;
    }
    const { locale: _, ...rest } = options;
    nextRouter.replace(outbound.destination, rest);
  }

  // --------------------------------------------------
  // prefetch (NO side effects)
  // --------------------------------------------------
  function prefetch<CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: PrefetchOptions & { locale?: GenLocale<CK> },
  ) {
    const outbound = resolve(href, options?.locale);
    if (outbound.kind !== "client") return;
    if (!options) {
      nextRouter.prefetch(outbound.destination);
      return;
    }
    const { locale: _, ...rest } = options;
    nextRouter.prefetch(outbound.destination, rest);
  }

  return {
    push,
    replace,
    prefetch,
    back: () => nextRouter.back(),
    forward: () => nextRouter.forward(),
    refresh: () => nextRouter.refresh(),
  };
}
